import { useMemo } from "react";

export default function TableComponent(props) {
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <>
      <div className='mt-8 flow-root'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    {props.headers.map((header, index) => (
                      <th
                        key={index}
                        scope='col'
                        className={classNames(
                          index === 0 ? "sm:pl-6 pl-4 pr-3" : "px-3",
                          index === props.data.length
                            ? "text-right"
                            : "text-left",
                          "py-3.5 text-left text-sm font-semibold text-gray-900"
                        )}
                      >
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {props.data.map((dataItem, index) => {
                    return (
                      <tr key={`trItem-${index}`}>
                        {props.headers.map((header, headerIndex) => {
                          return (
                            <td
                              key={`tdItem-${headerIndex}`}
                              className={classNames(
                                headerIndex === 0
                                  ? "sm:pl-6 pl-4 pr-3"
                                  : "px-3",
                                "whitespace-nowrap py-4 text-sm text-gray-900",
                                header.classes
                              )}
                            >
                              {dataItem[header.id]}
                            </td>
                          );
                        })}
                        {props.headers.filter((item) => item.id === "edit")
                          .length === 1 && (
                          <td className='whitespace-nowrap py-4 pr-4 pl-3 text-sm text-indigo-600 text-right font-medium'>
                            <div
                              onClick={() => props.options.rowClick(dataItem)}
                              className='cursor-pointer'
                            >
                              Rediger
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
