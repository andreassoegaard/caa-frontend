import { useFetchWrapper } from "@/hooks/FetchWrapper";
import { useRouter } from "next/router";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useEffect } from "react";
import PageButton from "../pageButton";

interface Props {
  categoryId: number;
}

export default function QaAnswers(props: Props) {
  const fetchWrapper = useFetchWrapper();
  const router = useRouter();

  const [qaCategoryQuestions, setQaCategoryQuestions] = useState<any[]>([]);
  const fetchCategoryQuestions = async () => {
    const answers = await fetchWrapper.get(
      `${process.env.API_URL}/api/qaAnswers/${router.query.id}`
    );
    const results = await fetchWrapper.get(
      `${process.env.API_URL}/api/qaFactors/${props.categoryId}`
    );
    const categories = [] as any[];
    results.results.forEach((element: any) => {
      const findAnswer = answers.results.find(
        (item: any) => item.qaFactorId === element.id
      );
      console.log(findAnswer);
      categories.push({
        answerId: findAnswer ? findAnswer.id : null,
        id: element.id,
        name: element.name,
        description: element.description,
        qaCategoryId: element.categoryId,
        qaFactorId: element.id,
        companyId: Number(router.query.id),
        answer: findAnswer ? findAnswer.answer : null,
        rating: findAnswer ? findAnswer.rating : null,
      });
    });
    setQaCategoryQuestions(categories);
  };
  useEffect(() => {
    fetchCategoryQuestions();
  }, []);

  const ratingOptions = [1, 2, 3, 4, 5];

  const setRating = (id: number, value: number) => {
    const ratings = qaCategoryQuestions.map((item, index) => {
      if (item.id === id) {
        item.rating = value;
      }
      return item;
    });
    setQaCategoryQuestions(ratings);
  };

  const setAnswer = (id: number, value: string) => {
    const ratings = qaCategoryQuestions.map((item, index) => {
      if (item.id === id) {
        item.answer = value;
      }
      return item;
    });

    setQaCategoryQuestions(ratings);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [submitLoading, setSubmitLoading] = useState(false);
  const submitQa = async (event: any) => {
    event.preventDefault();
    setSubmitLoading(true);
    try {
      await fetchWrapper.put(
        `${process.env.API_URL}/api/qaAnswers/${router.query.id}/${props.categoryId}`,
        {
          body: {
            answers: qaCategoryQuestions,
          },
        }
      );
      setSubmitLoading(false);
    } catch (e) {
      setSubmitLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <form onSubmit={submitQa}>
        {qaCategoryQuestions.length > 0 &&
          qaCategoryQuestions.map((question: any, index: number) => (
            <div
              key={question.id}
              className={classNames(
                index !== qaCategoryQuestions.length - 1
                  ? "border-b border-gray-200 mb-6 pb-6"
                  : "mb-6"
              )}
            >
              <label
                htmlFor={question.id}
                className='block text-sm font-medium text-gray-700'
              >
                {question.name}
              </label>
              <small className='block text-xs text-gray-400'>
                {question.description}
              </small>
              <textarea
                id={question.id}
                name={question.id}
                rows={5}
                className='block mt-2 mb-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                value={question.answer}
                onChange={(event) => setAnswer(question.id, event.target.value)}
              />
              <label
                htmlFor={`rating-${question.id}`}
                className='block text-sm font-medium text-gray-700'
              >
                Rating
              </label>
              <small className='block text-xs text-gray-400'>
                Select a rating from 1-5, where 1 is worst and 5 is best
              </small>
              <RadioGroup
                value={question.rating}
                onChange={(event) =>
                  setRating(question.qaFactorId, Number(event))
                }
                className='mt-2'
              >
                <div className='grid gap-3 grid-cols-5'>
                  {ratingOptions.map((option) => (
                    <RadioGroup.Option
                      key={`${option}-${question.id}`}
                      value={option}
                      className={({ active, checked }) =>
                        classNames(
                          active ? "ring-2 ring-black ring-offset-2" : "",
                          checked
                            ? "bg-black text-white hover:bg-opacity-80"
                            : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                          "flex items-center justify-center rounded-md py-3 px-3 text-xs uppercase sm:flex-1"
                        )
                      }
                    >
                      <RadioGroup.Label as='span'>{option}</RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ))}
        <div className='flex justify-end'>
          <PageButton type='submit' style='black' loading={submitLoading}>
            Save QA
          </PageButton>
        </div>
      </form>
    </>
  );
}
