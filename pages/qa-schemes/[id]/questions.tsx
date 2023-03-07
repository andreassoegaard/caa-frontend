import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useFetchWrapper } from "@/hooks/FetchWrapper";

// Components
import AppWrapper from "@/components/appWrapper";
import PageBox from "@/components/pageBox";
import TableComponent from "@/components/tableComponent";
import PageModal from "@/components/pageModal";
import PageButton from "@/components/pageButton";
import QuestionForm from "@/components/QaSchemes/QaQuestionForm";
import DeleteWarningModal from "@/components/Ui/DeleteWarningModal";

// Define props
interface Props {
  params: any;
  data: any;
  user: User;
}

export default function QuestionsPage(props: PropsWithChildren<Props>) {
  /**
   * Hooks
   */
  const router = useRouter();
  const fetchWrapper = useFetchWrapper();

  /**
   * Tabs
   */
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

  /**
   * Table related
   */
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
      id: "description",
      title: "Description",
    },
    {
      id: "importance",
      title: "Importance",
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
  const [tableOptions, setTableOptions] = useState({
    editIdFetch: null,
    deleteClick: async (item: any) => {
      try {
        showDeleteWarningModal(item);
      } catch (e) {
        console.log(e);
      }
    },
    rowClick: async (item: any) => {
      try {
        setTableOptions({
          ...tableOptions,
          editIdFetch: item.id,
        });
        setEditingId(item.id);
        const data = await fetchWrapper.get(
          `${process.env.API_URL}/api/qaFactors/${props.params.id}/${item.id}`
        );
        setEditName(data.result.name);
        setEditDescription(data.result.description);
        setEditImportance(data.result.importance);
        setShowEditModal(true);
        setTableOptions({
          ...tableOptions,
          editIdFetch: null,
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

  /**
   * Delete questions
   */
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deleteQuestionLoading, setDeleteQuestionLoading] = useState(false);

  const cancelDeleteQuestion = () => {
    setDeletingId(null);
    setShowDeleteWarning(false);
  };

  const deleteQuestion = async () => {
    setDeleteQuestionLoading(true);
    try {
      const endpoint = await fetchWrapper.delete(
        `${process.env.API_URL}/api/qaFactors/${deletingId}`
      );
      if (endpoint && endpoint.message === "OK") {
        refreshData();
        setShowDeleteWarning(false);
      }
      setDeleteQuestionLoading(false);
    } catch (e) {
      setDeleteQuestionLoading(false);
      console.log(e);
    }
  };

  const showDeleteWarningModal = (item: any) => {
    setDeletingId(item.id);
    setShowDeleteWarning(true);
  };

  /**
   * Add new question
   */

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const closeModal = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setShowAddModal(false);
    resetState();
  };
  const [newQuestionLoading, setNewQuestionLoading] = useState(false);
  const addNewQuestion = async (event: any) => {
    event.preventDefault();
    setNewQuestionLoading(true);
    try {
      await fetchWrapper.post(
        `${process.env.API_URL}/api/qaFactors/${props.params.id}`,
        {
          body: {
            name: newName,
            description: newDescription,
            importance: Number(newImportance),
          },
        }
      );
      refreshData();
      setShowAddModal(false);
      resetState();
      setNewQuestionLoading(false);
    } catch (e) {
      setNewQuestionLoading(false);
      console.log(e);
    }
  };

  // States
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newImportance, setNewImportance] = useState<number | string>(1);
  const resetState = () => {
    setTimeout(() => {
      setNewName("");
      setNewDescription("");
      setNewImportance(1);
    }, 500);
  };

  /**
   * Edit question
   */

  // Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const closeEditModal = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setShowEditModal(false);
    resetEditState();
  };
  const editQuestionHandler = async (event: any) => {
    event.preventDefault();
    setEditQuestionLoading(true);
    try {
      await fetchWrapper.put(
        `${process.env.API_URL}/api/qaFactors/${editingId}`,
        {
          body: {
            name: editName,
            description: editDescription,
            importance: editImportance,
          },
        }
      );
      refreshData();
      setShowEditModal(false);
      resetEditState();
      setEditQuestionLoading(false);
    } catch (e) {
      setEditQuestionLoading(false);
      console.log(e);
    }
  };

  // States
  const [editQuestionLoading, setEditQuestionLoading] = useState(false);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editImportance, setEditImportance] = useState<number | string>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const resetEditState = () => {
    setTimeout(() => {
      setEditName("");
      setEditDescription("");
      setEditImportance("");
    }, 500);
  };

  return (
    <>
      <PageModal title='Add Question' open={showAddModal} onClose={closeModal}>
        <QuestionForm
          name={newName}
          description={newDescription}
          importance={newImportance}
          loading={newQuestionLoading}
          setNewName={setNewName}
          setNewDescription={setNewDescription}
          setNewImportance={setNewImportance}
          submitButton='Add New Question'
          onSubmit={addNewQuestion}
          onCancel={closeModal}
        ></QuestionForm>
      </PageModal>
      <PageModal
        title='Edit Question'
        open={showEditModal}
        onClose={closeEditModal}
      >
        <QuestionForm
          name={editName}
          description={editDescription}
          importance={editImportance}
          loading={editQuestionLoading}
          setNewName={setEditName}
          setNewDescription={setEditDescription}
          setNewImportance={setEditImportance}
          submitButton='Save Question'
          onSubmit={editQuestionHandler}
          onCancel={closeEditModal}
        ></QuestionForm>
      </PageModal>
      <DeleteWarningModal
        title='Are you sure?'
        description='Are you sure you want to delete this question? All company-answers to this question will be deleted. This action cannot be undone.'
        submitButton='Delete Question'
        open={showDeleteWarning}
        onOk={deleteQuestion}
        onOkLoading={deleteQuestionLoading}
        onCancel={cancelDeleteQuestion}
      />
      <AppWrapper
        title={props.data.category.name}
        subtitle='Edit QA Scheme'
        tabs={tabs}
      >
        {props.data.questions && props.data.questions.length === 0 && (
          <PageBox>
            <div className='text-center text-sm'>
              <div className='font-semibold text-slate-600 mb-1'>
                No questions yet
              </div>
              <div className='text-slate-400 mb-4'>
                Add the question by clicking the button below
              </div>
              <div className='mt-2 flex items-center justify-center'>
                <PageButton style='black' onClick={() => setShowAddModal(true)}>
                  Add Question
                </PageButton>
              </div>
            </div>
          </PageBox>
        )}
        {props.data.questions && props.data.questions.length > 0 && (
          <>
            <TableComponent
              headers={tableHeaders}
              data={props.data.questions}
              options={tableOptions}
            ></TableComponent>
            <div className='mt-4 flex items-end justify-end'>
              <PageButton style='black' onClick={() => setShowAddModal(true)}>
                Add Question
              </PageButton>
            </div>
          </>
        )}
      </AppWrapper>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  let questions;
  let category;
  if (session && ctx.params) {
    const requestHeaders = new Headers();
    requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
    const requestOptions = {
      method: "GET",
      headers: requestHeaders,
    };
    const res = await fetch(
      `${process.env.API_URL}/api/qaFactors/${ctx.params.id}`,
      requestOptions
    );
    const resQaCategory = await fetch(
      `${process.env.API_URL}/api/qaCategories/${ctx.params.id}`,
      requestOptions
    );
    const data = await res.json();
    const dataQaCategory = await resQaCategory.json();
    questions = data.results;
    category = dataQaCategory.result;
  }
  return {
    props: { user: session, params: ctx.params, data: { questions, category } },
  };
}
