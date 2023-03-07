import { getSession } from "next-auth/react";
import AppWrapper from "@/components/appWrapper";
import PageButton from "@/components/pageButton";
import PageModal from "@/components/pageModal";
import { useState } from "react";
import { useFetchWrapper } from "@/hooks/FetchWrapper";
import AddCompanyForm from "@/components/Companies/AddCompanyForm";
import { useRouter } from "next/router";

export default function Companies(props: any) {
  const router = useRouter();
  const fetchWrapper = useFetchWrapper();
  const HeaderRight = () => {
    return (
      <PageButton
        style='black'
        loading={qaCategoriesLoading}
        onClick={openAddCompanyModal}
      >
        Create Company
      </PageButton>
    );
  };

  const [qaCategoriesLoading, setQaCategoriesLoading] = useState(false);
  const openAddCompanyModal = async () => {
    setQaCategoriesLoading(true);
    const ratingCategories = await fetchWrapper.get(
      `${process.env.API_URL}/api/qaCategories`
    );
    if (ratingCategories && ratingCategories.results) {
      setQaCategories(ratingCategories.results);
    }
    setQaCategoriesLoading(false);
    setNewCompanyOpen(true);
  };

  const addNewCompany = async (event: any) => {
    event.preventDefault();
    setNewCompanyLoading(true);
    try {
      const result = await fetchWrapper.post(
        `${process.env.API_URL}/api/companies`,
        {
          body: {
            name: newName,
            symbol: newSymbol,
            qaCategoryId: newQaCategoryId,
          },
        }
      );
      if (result && result.message === "OK") {
        router.replace(router.route + "/" + result.result);
      }
      setNewCompanyLoading(false);
    } catch (e) {
      console.log(e);
      setNewCompanyLoading(false);
    }
  };

  const [newCompanyOpen, setNewCompanyOpen] = useState(false);
  const [newCompanyLoading, setNewCompanyLoading] = useState(false);
  const [qaCategories, setQaCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newQaCategoryId, setNewQaCategoryId] = useState<
    number | undefined | string
  >("");

  const closeNewCompanyModal = () => {
    setNewCompanyOpen(false);
    setNewName("");
    setNewSymbol("");
    setNewQaCategoryId("");
  };

  return (
    <AppWrapper title='Companies' headerRight={<HeaderRight />}>
      <div className='overflow-hidden bg-white shadow sm:rounded-md'>
        <ul role='list' className='divide-y divide-gray-200'>
          {props.data.map((company: any) => (
            <li key={company.id}>
              <a
                href={`/companies/${company.id}`}
                className='block hover:bg-gray-50'
              >
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
      <PageModal
        title='Add New Company'
        open={newCompanyOpen}
        onClose={closeNewCompanyModal}
      >
        <AddCompanyForm
          name={newName}
          symbol={newSymbol}
          qaCategoryId={newQaCategoryId}
          setNewName={setNewName}
          setNewSymbol={setNewSymbol}
          setNewQaCategoryId={setNewQaCategoryId}
          onSubmit={addNewCompany}
          onCancel={() => setNewCompanyOpen(false)}
          qaCategories={qaCategories}
          loading={newCompanyLoading}
          submitButton='Add New Company'
        ></AddCompanyForm>
      </PageModal>
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
    if (res.ok) {
      const data = await res.json();
      returnData = data.results;
    } else {
      returnData = [];
    }
  }

  return {
    props: { user: session || null, data: returnData },
  };
}
