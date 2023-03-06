import { getSession } from "next-auth/react";
import AppWrapper from "@/components/appWrapper";

export default function Companies(props: any) {
  return (
    <AppWrapper title='Companies'>
      <div className='overflow-hidden bg-white shadow sm:rounded-md'>
        <ul role='list' className='divide-y divide-gray-200'>
          {props.data.map((company: any) => (
            <li key={company.id}>
              <a href='#' className='block hover:bg-gray-50'>
                <div className='px-4 py-4 sm:px-6'>
                  <div className='flex flex-col'>
                    <div className='mb-1 flex flex-shrink-0'>
                      <p className='inline-flex rounded-full bg-black px-2 text-[10px] font-semibold leading-5 text-white'>
                        {company.symbol}
                      </p>
                    </div>
                    <p className='truncate text-sm font-medium text-black'>
                      {company.name}
                    </p>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AppWrapper>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  let returnData;
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const requestHeaders = new Headers();
    requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
    const requestOptions = {
      method: "GET",
      headers: requestHeaders,
    };
    const res = await fetch(
      `${process.env.API_URL}/api/companies`,
      requestOptions
    );
    const data = await res.json();
    returnData = data.results;
  }

  return {
    props: { user: session || null, data: returnData },
  };
}
