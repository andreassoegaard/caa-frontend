import { useSession } from "next-auth/react";
import { useLogOut } from "@/hooks/LogOut";

const request = (method: string, session: any, logOutFunc: any) => {
  return (url: string, options?: any) => {
    const headers = new Headers();
    const requestOptions = {
      method,
      headers,
    } as RequestInit;
    if (options && options.body) {
      if (options.body instanceof FormData) {
        requestOptions.body = options.body;
      } else {
        headers.set("Content-Type", "application/json");
        requestOptions.body = JSON.stringify(options.body);
      }
    }
    if (session && session.data && session.data.accessToken) {
      headers.set("Authorization", `Bearer ${session.data.accessToken}`);
    } else if (options && options.session) {
      headers.set("Authorization", `Bearer ${options.session.accessToken}`);
    }
    return fetch(url, requestOptions).then((response) =>
      handleResponse(response, logOutFunc)
    );
  };
};

const handleResponse = async (response: any, logOut: any) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      if ([401, 403].includes(response.status)) {
        logOut();
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    } else {
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const useFetchWrapper = () => {
  const { logOut } = useLogOut();
  const session = useSession();

  return {
    get: request("GET", session, logOut),
    post: request("POST", session, logOut),
    put: request("PUT", session, logOut),
    delete: request("DELETE", session, logOut),
  };
};
