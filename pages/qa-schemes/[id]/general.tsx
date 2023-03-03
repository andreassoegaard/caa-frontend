import AppWrapper from "@/components/appWrapper";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import PageBox from "@/components/pageBox";

export default function Qa(props: any) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(props.data.name);
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const requestHeaders = new Headers();
      requestHeaders.set("Authorization", `Bearer ${props.user.accessToken}`);
      requestHeaders.set("Content-Type", "application/json");
      const requestOptions = {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify({
          name,
        }),
      };
      const endpoint = await fetch(
        `${process.env.API_URL}/api/qaCategories/${props.params.id}`,
        requestOptions
      );
      if (endpoint && endpoint.ok) {
        router.replace("/qa-schemes");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const tabs = [
    {
      name: "General",
      href: `/qa-schemes/${props.params.id}/general`,
      current: router.route.includes("general"),
    },
    {
      name: "Questions",
      href: `/qa-schemes/${props.params.id}/questions`,
      current: router.route.includes("questions"),
    },
  ];

  const SubmitButton = () => {
    return (
      <button
        type='submit'
        form='submitForm'
        className='group relative disabled:opacity-50 flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
        disabled={loading}
      >
        {loading && (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='inline w-4 h-4 mr-2 text-white animate-spin dark:text-indigo-900 fill-indigo-600 dark:fill-white'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}
        Save
      </button>
    );
  };

  return (
    <AppWrapper title='Edit QA Scheme' tabs={tabs}>
      <PageBox footer={<SubmitButton />}>
        <form id='submitForm' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <div className='mt-1'>
              <input
                type='text'
                name='text'
                id='name'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='The QA scheme name'
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </PageBox>
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
      `${process.env.API_URL}/api/qaCategories/${ctx.params.id}`,
      requestOptions
    );
    const data = await res.json();
    returnData = data.result;
  }
  return {
    props: { user: session, params: ctx.params, data: returnData },
  };
}
