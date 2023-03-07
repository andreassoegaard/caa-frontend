import { PropsWithChildren } from "react";
import PageButton from "@/components/pageButton";

interface QuestionFormProps {
  onSubmit(event: any): void;
  onCancel(event: any): void;
  setNewName(value: string): void;
  setNewDescription(value: string): void;
  setNewImportance(value: string | number): void;
  name: string | undefined;
  description: string | undefined;
  importance: string | number;
  loading: boolean;
  submitButton: string;
}

export default function QuestionForm(
  props: PropsWithChildren<QuestionFormProps>
) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className='mb-3'>
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
            placeholder='The question itself...'
            value={props.name}
            onChange={(event) => props.setNewName(event.target.value)}
            required
          />
        </div>
      </div>
      <div className='mb-3'>
        <label
          htmlFor='importance'
          className='block text-sm font-medium text-gray-700'
        >
          Importance
        </label>
        <div className='mt-1'>
          <select
            name='importance'
            id='importance'
            className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
            value={props.importance}
            onChange={(event) => props.setNewImportance(event.target.value)}
            required
          >
            <option value={undefined} disabled>
              Select the importance rate...
            </option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-gray-700'
        >
          Description
        </label>
        <div className='mt-1'>
          <textarea
            name='description'
            id='description'
            rows={10}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='Provide a small description of the question (optional)...'
            value={props.description}
            onChange={(event) => props.setNewDescription(event.target.value)}
          />
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <PageButton
          style='white'
          onClick={(event: any) => props.onCancel(event)}
        >
          Cancel
        </PageButton>
        <PageButton type='submit' style='black' loading={props.loading}>
          {props.submitButton}
        </PageButton>
      </div>
    </form>
  );
}
