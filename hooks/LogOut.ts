import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export const useLogOut = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const logOut = async () => {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        token: session?.refreshToken,
      }),
    };
    const endpoint = await fetch(
      `${process.env.API_URL}/api/auth/logout`,
      requestOptions
    );
    if (endpoint.ok) {
      try {
        signOut({ redirect: false });
        router.replace("/login");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return { logOut };
};
