import { PropsWithChildren } from "react";
import PageButton from "@/components/pageButton";

interface Form {
  onSubmit(event: any): void;
  onCancel(event: any): void;
  setNewName(value: string): void;
  setNewDescription(value: string): void;
  name: string | undefined;
  description: string | undefined;
  loading: boolean;
  submitButton: string;
}

export default function QuestionForm(props: PropsWithChildren<Form>) {
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
