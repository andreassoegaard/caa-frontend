import { PropsWithChildren } from "react";
import { ReactNode } from "react";

interface PageBox {
  title?: string;
  footer?: ReactNode;
}

export default function PageBox(props: PropsWithChildren<PageBox>) {
  return (
    <div className='overflow-hidden shadow sm:rounded-md'>
      <div className='bg-white px-4 py-5 sm:p-6'>{props.children}</div>
      {props.footer && (
        <div className='bg-gray-100 px-4 py-3 sm:px-6 flex items-end justify-end'>
          {props.footer}
        </div>
      )}
    </div>
  );
}
