import Head from "next/head";
import { Inter } from "next/font/google";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import AppWrapper from "@/components/appWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  let authenticateText;
  if (status === "authenticated" && session.user) {
    authenticateText = <p>Signed in as {session.user.email}</p>;
  } else {
    authenticateText = <p>Not signed in</p>;
  }

  return (
    <>
      <Head>
        <title>CAA Finance</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AppWrapper title='Dashboard'>{authenticateText}</AppWrapper>
    </>
  );
}
