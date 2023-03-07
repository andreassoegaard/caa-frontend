import { PropsWithChildren } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import PageButton from "../pageButton";
import PageModal from "../pageModal";

interface Options {
  open: boolean;
  title: string;
  submitButton: string;
  description: string;
  onOkLoading: boolean;
  onOk(event: any): void;
  onCancel(event: any): void;
}

export default function DeleteWarningModal(props: PropsWithChildren<Options>) {
  return (
    <PageModal open={props.open} onClose={props.onCancel}>
      <div className='sm:flex sm:items-start'>
        <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
          <ExclamationTriangleIcon
            className='h-6 w-6 text-red-600'
            aria-hidden='true'
          />
        </div>
        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
          <h3 className='text-base font-semibold leading-6 text-gray-900'>
            {props.title}
          </h3>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>{props.description}</p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        <PageButton
          onClick={props.onOk}
          loading={props.onOkLoading}
          style='red'
        >
          {props.submitButton}
        </PageButton>
        <PageButton onClick={props.onCancel} style='white' className='mr-2'>
          Cancel
        </PageButton>
      </div>
    </PageModal>
  );
}
