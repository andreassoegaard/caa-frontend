import AppWrapper from "@/components/appWrapper";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import PageBox from "@/components/pageBox";
import QaAnswers from "@/components/Companies/QaAnswers";
import PageButton from "@/components/pageButton";
import DeleteWarningModal from "@/components/Ui/DeleteWarningModal";
import { useFetchWrapper } from "@/hooks/FetchWrapper";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Qa(props: any) {
  const fetchWrapper = useFetchWrapper();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(props.data.name);
  const [qaCategoryId, setQaCategoryId] = useState(props.data.qaCategoryId);
  const router = useRouter();

  const tabs = [
    {
      name: "QA",
      href: `/companies/${props.params.id}/qa`,
      current:
        router.route.includes("companies") && router.route.includes("qa"),
    },
  ];

  const [deleteCompanyLoading, setDeleteCompanyLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const openDeleteCompanyModal = () => {
    setShowDeleteWarning(true);
  };
  const cancelDeleteCompanyModal = () => {
    setShowDeleteWarning(false);
  };
  const deleteCompany = async () => {
    setDeleteCompanyLoading(true);
    try {
      await fetchWrapper.delete(
        `${process.env.API_URL}/api/companies/${router.query.id}`
      );
      router.replace("/companies");
      setDeleteCompanyLoading(false);
    } catch (e) {
      console.log(e);
      setDeleteCompanyLoading(false);
    }
  };

  const HeaderRight = () => {
    return (
      <PageButton style='white-red' onClick={openDeleteCompanyModal}>
        <div className='flex items-center'>
          <TrashIcon className='h-3.5 w-3.5 mr-1' /> Delete Company
        </div>
      </PageButton>
    );
  };

  return (
    <AppWrapper
      title={name}
      subtitle='Edit Company'
      tabs={tabs}
      headerRight={<HeaderRight />}
    >
      <PageBox title='QA'>
        <QaAnswers categoryId={qaCategoryId} />
      </PageBox>
      <DeleteWarningModal
        title='Delete company'
        description='Are you sure you want to delete this company? All QA answers and all data associated will be deleted. This action cannot be undone.'
        submitButton='Delete Company'
        open={showDeleteWarning}
        onOk={deleteCompany}
        onOkLoading={deleteCompanyLoading}
        onCancel={cancelDeleteCompanyModal}
      />
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
      `${process.env.API_URL}/api/companies/${ctx.params.id}`,
      requestOptions
    );
    console.log(res);
    const data = await res.json();
    returnData = data.result;
  }
  return {
    props: { user: session, params: ctx.params, data: returnData },
  };
}
