import AppWrapper from "@/components/appWrapper";
import { getSession } from "next-auth/react";

export default function Qa() {
  return <AppWrapper title='Edit QA Scheme'></AppWrapper>;
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  return {
    props: {
      user: session,
      params: ctx.params,
    },
    redirect: {
      destination: `/qa-schemes/${ctx.params.id}/general`,
      permanent: true,
    },
  };
}
