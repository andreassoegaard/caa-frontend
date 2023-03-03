import AppWrapper from "@/components/appWrapper";
import TableComponent from "@/components/tableComponent";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export default function Users(props: any) {
  const tableHeaders = [
    {
      id: "name",
      title: "Name",
      classes: "font-semibold",
    },
    {
      id: "email",
      title: "Email",
    },
    {
      id: "edit",
      title: "",
    },
  ];
  const options = {
    rowClick(item: any) {
      console.log(item);
    },
  };

  return (
    <AppWrapper title='Users'>
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
      `${process.env.API_URL}/api/auth/users`,
      requestOptions
    );
    const data = await res.json();
    returnData = data.results;
  }

  return {
    props: { user: session || null, data: returnData },
  };
}
