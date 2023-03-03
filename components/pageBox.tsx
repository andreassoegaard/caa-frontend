import { PropsWithChildren } from "react";
import { ReactNode } from "react";

interface PageBox {
  title?: string;
  footer?: ReactNode;
}

export default function PageBox(props: PropsWithChildren<PageBox>) {
  return (
    <div className='overflow-hidden shadow-sm rounded-lg border border-gray-200'>
      {props.title && (
        <div className='bg-gray-50 px-6 text-left py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200'>
          {props.title}
        </div>
      )}
      <div className='bg-white px-6 pt-4 pb-6'>{props.children}</div>
      {props.footer && (
        <div className='bg-gray-100 px-4 py-3 sm:px-6 flex items-end justify-end'>
          {props.footer}
        </div>
      )}
    </div>
  );
}
