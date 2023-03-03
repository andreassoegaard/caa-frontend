import AppWrapper from "@/components/appWrapper";
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import TableComponent from "@/components/tableComponent";

export default function Qa(props: any) {
  const tableHeaders = [
    {
      id: "name",
      title: "Name",
      classes: "font-semibold",
    },
    {
      id: "edit",
      title: "",
    },
  ];

  const router = useRouter();
  const options = {
    rowClick(item: any) {
      router.replace(router.route + "/" + item.id);
    },
  };

  return (
    <AppWrapper title='QA Schemes'>
      {props.data && props.data.length > 0 && (
        <TableComponent
          headers={tableHeaders}
          data={props.data}
          options={options}
        ></TableComponent>
      )}
    </AppWrapper>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  let returnData;
  if (session) {
    const requestHeaders = new Headers();
    requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
    const requestOptions = {
      method: "GET",
      headers: requestHeaders,
    };
    const res = await fetch(
      `${process.env.API_URL}/api/qaCategories`,
      requestOptions
    );
    const data = await res.json();
    returnData = data.results;
  }

  return {
    props: { user: session || null, data: returnData },
  };
}
