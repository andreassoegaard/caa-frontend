import "@/styles/globals.scss";
import "@/styles/buttons.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import RefreshTokenHandler from "../components/refreshTokenHandler";

export default function App({ Component, pageProps }: AppProps) {
  const [interval, setInterval] = useState(1000);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <Component {...pageProps} />
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}
