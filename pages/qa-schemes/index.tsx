import AppWrapper from "@/components/appWrapper";
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import TableComponent from "@/components/tableComponent";
import PageButton from "@/components/pageButton";
import PageModal from "@/components/pageModal";
import { useFetchWrapper } from "@/hooks/FetchWrapper";
import QaSchemeForm from "@/components/QaSchemes/QaSchemaForm";
import DeleteWarningModal from "@/components/Ui/DeleteWarningModal";

export default function Qa(props: any) {
  const fetchWrapper = useFetchWrapper();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const tableHeaders = [
    {
      id: "name",
      title: "Name",
      classes: "font-semibold",
    },
    {
      id: "delete",
      title: "",
    },
    {
      id: "edit",
      title: "",
    },
  ];

  const router = useRouter();
  const options = {
    deleteClick(item: any) {
      try {
        showDeleteWarningModal(item);
      } catch (e) {
        console.log(e);
      }
    },
    rowClick(item: any) {
      router.replace(router.route + "/" + item.id);
    },
  };

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const cancelDeleteQuestion = () => {
    setDeletingId(null);
    setShowDeleteWarning(false);
  };
  const showDeleteWarningModal = (item: any) => {
    setDeletingId(item.id);
    setShowDeleteWarning(true);
  };
  const deleteQuestion = async () => {
    setDeleteLoading(true);
    try {
      await fetchWrapper.delete(
        `${process.env.API_URL}/api/qaCategories/${deletingId}`
      );
      refreshData();
      setShowDeleteWarning(false);
      setDeleteLoading(false);
    } catch (e) {
      setDeleteLoading(false);
      console.log(e);
    }
  };

  const HeaderRight = () => {
    return (
      <PageButton style='black' onClick={() => setNewQaOpen(true)}>
        Create New
      </PageButton>
    );
  };

  const [newQaOpen, setNewQaOpen] = useState(false);

  /**
   * Add new scheme
   */
  const [newQaName, setNewQaName] = useState<string>("");
  const [newQaDescription, setNewQaDescription] = useState<string>("");
  const [newQaLoading, setNewQaLoading] = useState(false);
  const addNewQaScheme = async (event: any) => {
    event.preventDefault();
    setNewQaLoading(true);
    try {
      const result = await fetchWrapper.post(
        `${process.env.API_URL}/api/qaCategories`,
        {
          body: {
            name: newQaName,
            description: newQaDescription,
          },
        }
      );
      router.replace(router.route + "/" + result.result);
      setNewQaLoading(false);
    } catch (e) {
      setNewQaLoading(false);
      console.log(e);
    }
  };

  return (
    <AppWrapper title='QA Schemes' headerRight={<HeaderRight />}>
      {props.data && props.data.length > 0 && (
        <TableComponent
          headers={tableHeaders}
          data={props.data}
          options={options}
        ></TableComponent>
      )}
      <PageModal
        title='New QA Scheme'
        open={newQaOpen}
        onClose={() => setNewQaOpen(false)}
      >
        <QaSchemeForm
          name={newQaName}
          description={newQaDescription}
          setNewName={setNewQaName}
          setNewDescription={setNewQaDescription}
          onSubmit={addNewQaScheme}
          onCancel={() => setNewQaOpen(false)}
          loading={newQaLoading}
          submitButton='Add New QA Scheme'
        />
      </PageModal>
      <DeleteWarningModal
        title='Delete QA Scheme'
        description='Are you sure you want to delete this QA scheme? All company-answers to this scheme will be deleted. This action cannot be undone.'
        submitButton='Delete QA Scheme'
        open={showDeleteWarning}
        onOk={deleteQuestion}
        onOkLoading={deleteLoading}
        onCancel={cancelDeleteQuestion}
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
