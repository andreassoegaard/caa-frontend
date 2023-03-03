import AppWrapper from "@/components/appWrapper";
import PageBox from "@/components/pageBox";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import PageModal from "@/components/pageModal";

interface Props {
  params: any;
  data: any;
}

interface Question {
  name: string;
  description?: string;
  importance: number;
  categoryId: number;
}

export default function QuestionsPage(props: PropsWithChildren<Props>) {
  const [questions, setQuestions] = useState(props.data);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();
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

  const addNewQuestion = () => {
    // const newQuestion = {
    //   name: null,
    //   description: null,
    //   importance: 1,
    //   categoryId: props.params.id,
    // };
    // setQuestions((prevQuestions: Question[]) => {
    //   return [newQuestion, ...prevQuestions];
    // });
  };

  return (
    <>
      <PageModal
        title='Add Question'
        open={showAddModal}
        setOpen={setShowAddModal}
      ></PageModal>
      <AppWrapper title='Edit QA Scheme' tabs={tabs}>
        {questions.length === 0 && (
          <PageBox>
            <div className='text-center text-sm'>
              <div className='font-semibold text-slate-600 mb-1'>
                No questions yet
              </div>
              <div className='text-slate-400 mb-4'>
                Add the question by clicking the button below
              </div>
              <div className='mt-2 flex items-center justify-center'>
                <button
                  onClick={() => setShowAddModal(true)}
                  className='group relative disabled:opacity-50 flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                >
                  Add Question
                </button>
              </div>
            </div>
          </PageBox>
        )}
        {questions.length > 0 &&
          questions.map((question: Question, index: number) => (
            <div key={index} className='mb-4'>
              <PageBox>Questions</PageBox>
            </div>
          ))(
            <div className='mt-4 flex items-end justify-end'>
              <button
                onClick={addNewQuestion}
                className='group relative disabled:opacity-50 flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
              >
                Add Question
              </button>
            </div>
          )}
      </AppWrapper>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  let returnData;
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
    const data = await res.json();
    returnData = data.results;
  }
  return {
    props: { user: session, params: ctx.params, data: returnData },
  };
}
