import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(tokenObject: any) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await axios.post(
      process.env.API_URL + "/api/auth/validate",
      {
        token: tokenObject.refreshToken,
      }
    );

    const returnObject = {
      ...tokenObject,
      accessToken: tokenResponse.data.accessToken,
      accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
      refreshToken: tokenResponse.data.refreshToken,
    };
    return returnObject;
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const providers = [
  CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        // Authenticate user with credentials
        const user = await axios.post(process.env.API_URL + "/api/auth/login", {
          password: credentials?.password,
          email: credentials?.email,
        });

        if (user.data.accessToken) {
          return user.data;
        }
        return null;
      } catch (e) {
        throw new Error("Next Auth - Authorize: Authentication error");
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }: any) => {
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.accessToken;
      token.accessTokenExpiry = user.accessTokenExpiry;
      token.refreshToken = user.refreshToken;
      token.user = {
        id: user.user.id,
        email: user.user.email,
        name: user.user.name,
      };
    }

    // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
    const dateInt = new Date(token.accessTokenExpiry).getTime();
    const shouldRefreshTime = Math.round(dateInt - 60 * 60 * 1000 - Date.now());

    // If the token is still valid, just return it.
    if (shouldRefreshTime > 0) {
      return Promise.resolve(token);
    }

    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    token = refreshAccessToken(token);
    return Promise.resolve(token);
  },
  session: async ({ session, token }: any) => {
    // Here we pass accessToken to the client to be used in authentication with your API
    session.user = {
      id: token.user.id,
      email: token.user.email,
      name: token.user.name,
    };
    session.accessToken = token.accessToken;
    session.accessTokenExpiry = token.accessTokenExpiry;
    session.refreshToken = token.refreshToken;
    session.error = token.error;

    return Promise.resolve(session);
  },
};

export const options = {
  providers,
  callbacks,
  pages: {
    signIn: "/login",
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  api: {
    bodyParser: false,
  },
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);
export default Auth;
