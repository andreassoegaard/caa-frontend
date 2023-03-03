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
                  {/* <div className='mt-2 sm:flex sm:justify-between'>
                    <div className='sm:flex'>
                      <p className='flex items-center text-sm text-gray-500'>
                        <UsersIcon
                          className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                          aria-hidden='true'
                        />
                        {position.department}
                      </p>
                      <p className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6'>
                        <MapPinIcon
                          className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                          aria-hidden='true'
                        />
                        {position.location}
                      </p>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
                      <CalendarIcon
                        className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                        aria-hidden='true'
                      />
                      <p>
                        Closing on{" "}
                        <time dateTime={position.closeDate}>
                          {position.closeDateFull}
                        </time>
                      </p>
                    </div>
                  </div> */}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
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
