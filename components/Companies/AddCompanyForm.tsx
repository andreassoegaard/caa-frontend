import PageButton from "../pageButton";

interface Props {
  onSubmit(event: any): void;
  onCancel(event: any): void;
  setNewName(value: string): void;
  setNewSymbol(value: string): void;
  setNewQaCategoryId(value: number | undefined): void;
  name: string | undefined;
  symbol: string | undefined;
  qaCategoryId: number | string | undefined;
  qaCategories: any;
  loading: boolean;
  submitButton: string;
}

export default function AddCompanyForm(props: Props) {
  const classNames = (...classes: string[]) => {
    return classes.join(" ");
  };
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
            name='name'
            id='name'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='The company name...'
            value={props.name}
            onChange={(event) => props.setNewName(event.target.value)}
            required
          />
        </div>
      </div>
      <div className='mb-3'>
        <label
          htmlFor='symbol'
          className='block text-sm font-medium text-gray-700'
        >
          Symbol
        </label>
        <div className='mt-1'>
          <input
            type='text'
            name='symbol'
            id='symbol'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='The company symbol...'
            value={props.symbol}
            onChange={(event) => props.setNewSymbol(event.target.value)}
            required
          />
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor='qa' className='block text-sm font-medium text-gray-700'>
          QA Scheme
        </label>
        <div className='mt-1'>
          <select
            value={props.qaCategoryId}
            onChange={(event) =>
              props.setNewQaCategoryId(Number(event.target.value))
            }
            className={classNames(
              "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6",
              props.qaCategoryId === "" ? "text-gray-400" : "text-gray-900"
            )}
            required
          >
            <option value='' disabled>
              Select a QA scheme below...
            </option>
            {props.qaCategories.map((qaCategory: any) => (
              <option key={qaCategory.id} value={qaCategory.id}>
                {qaCategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <PageButton
          type='button'
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
