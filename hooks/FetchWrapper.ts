import { useSession } from "next-auth/react";
import { useLogOut } from "@/hooks/LogOut";

const useRequest = (method: string) => {
  const session = useSession();

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
        requestOptions.body = JSON.stringify(options.body);
      }
    }
    if (session && session.data && session.data.accessToken) {
      headers.set("Authorization", `Bearer ${session.data.accessToken}`);
    } else if (options && options.session) {
      headers.set("Authorization", `Bearer ${options.session.accessToken}`);
    }
    return fetch(url, requestOptions).then(useHandleResponse);
  };
};

const useHandleResponse = async (response: any) => {
  const { logOut } = useLogOut();

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
  return {
    get: useRequest("GET"),
    post: useRequest("POST"),
    put: useRequest("PUT"),
    delete: useRequest("DELETE"),
  };
};
