import { Fragment, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";
import { ReactNode } from "react";
import useAuth from "../hooks/Auth";
import Image from "next/image";
import { useLogOut } from "@/hooks/LogOut";

interface Tab {
  current: boolean;
  name: string;
  href: string;
}
interface Props {
  title: string;
  subtitle?: string;
  tabs?: Tab[];
  headerRight?: ReactNode;
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function AppWrapper({
  title,
  subtitle,
  children,
  tabs,
  headerRight,
}: PropsWithChildren<Props>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuth(true);
  const router = useRouter();

  const { data: session } = useSession();
  const { logOut } = useLogOut();

  const navigation = useMemo(() => {
    return [
      {
        name: "Dashboard",
        href: "/",
        icon: HomeIcon,
        current: router.route === "/",
      },
      {
        name: "Companies",
        href: "/companies",
        icon: FolderIcon,
        current: router.route.includes("companies"),
      },
      {
        name: "QA Schemes",
        href: "/qa-schemes",
        icon: InboxIcon,
        current: router.route.includes("qa-schemes"),
      },
      {
        name: "Users",
        href: "/users",
        icon: UsersIcon,
        current: router.route.includes("users"),
      },
    ];
  }, [router.route]);

  let component = <></>;
  if (isAuthenticated && session) {
    component = (
      <>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as='div'
              className='relative z-40 lg:hidden'
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter='transition-opacity ease-linear duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition-opacity ease-linear duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
              </Transition.Child>

              <div className='fixed inset-0 z-40 flex'>
                <Transition.Child
                  as={Fragment}
                  enter='transition ease-in-out duration-300 transform'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transition ease-in-out duration-300 transform'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'
                >
                  <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-gray-800'>
                    <Transition.Child
                      as={Fragment}
                      enter='ease-in-out duration-300'
                      enterFrom='opacity-0'
                      enterTo='opacity-100'
                      leave='ease-in-out duration-300'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <div className='absolute top-0 right-0 -mr-12 pt-2'>
                        <button
                          type='button'
                          className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className='sr-only'>Close sidebar</span>
                          <XMarkIcon
                            className='h-6 w-6 text-white'
                            aria-hidden='true'
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
                      <div className='flex flex-shrink-0 items-center px-4'>
                        <Image
                          src='/caafinance.svg'
                          alt='CAA Finance'
                          width={200}
                          height={50}
                          className='mx-auto'
                        />
                      </div>
                      <nav className='mt-5 space-y-1 px-2'>
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-gray-300"
                                  : "text-gray-400 group-hover:text-gray-300",
                                "mr-4 h-6 w-6 flex-shrink-0"
                              )}
                              aria-hidden='true'
                            />
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className='flex flex-shrink-0 bg-gray-700 p-4'>
                      <a href='#' className='group block flex-shrink-0'>
                        <div className='flex items-center'>
                          <div>
                            <img
                              className='inline-block h-10 w-10 rounded-full'
                              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                              alt=''
                            />
                          </div>
                          <div className='ml-3'>
                            <p className='text-base font-medium text-white'>
                              Tom Cook
                            </p>
                            <p className='text-sm font-medium text-gray-400 group-hover:text-gray-300'>
                              View profile
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                <div className='w-14 flex-shrink-0'>
                  {/* Force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className='flex min-h-0 flex-1 flex-col bg-black'>
              <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
                <div className='flex flex-shrink-0 items-center px-4'>
                  <Image
                    src='/caafinance-white.svg'
                    alt='CAA Finance'
                    width={99}
                    height={52}
                    className='mx-auto'
                  />
                </div>
                <nav className='mt-5 flex-1 space-y-1 px-2'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-white text-black"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-black"
                            : "text-gray-400 group-hover:text-gray-300",
                          "mr-3 h-6 w-6 flex-shrink-0"
                        )}
                        aria-hidden='true'
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className='flex flex-shrink-0 bg-neutral-900 p-4'>
                <div className='block w-full flex-shrink-0'>
                  <div className='flex items-center'>
                    <div>
                      <img
                        className='inline-block h-9 w-9 rounded-full'
                        src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        alt=''
                      />
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-white'>
                        {session.user?.name}
                      </p>
                      <div
                        className='text-xs font-medium text-gray-300 hover:text-gray-200 cursor-pointer'
                        onClick={logOut}
                      >
                        Log ud
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-1 flex-col lg:pl-64'>
            <div className='sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden'>
              <button
                type='button'
                className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                onClick={() => setSidebarOpen(true)}
              >
                <span className='sr-only'>Open sidebar</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <main className='flex-1'>
              <div className='py-6'>
                <div className='flex justify-between items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4'>
                  <div className='flex flex-col'>
                    <div className='text-slate-500 text-sm font-medium mb-1'>
                      {subtitle}
                    </div>
                    <h1 className='text-2xl font-semibold text-gray-900'>
                      {title}
                    </h1>
                  </div>
                  {headerRight}
                </div>
                {tabs && tabs.length > 0 && (
                  <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4'>
                    <div className='sm:hidden'>
                      <label htmlFor='tabs' className='sr-only'>
                        Select a tab
                      </label>
                      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                      <select
                        id='tabs'
                        name='tabs'
                        className='block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        defaultValue={
                          tabs.find((tab: any) => tab.current)?.name
                        }
                      >
                        {tabs.map((tab: any) => (
                          <option key={tab.name}>{tab.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className='hidden sm:block'>
                      <nav className='flex space-x-2.5' aria-label='Tabs'>
                        {tabs.map((tab: any) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                              tab.current
                                ? "bg-black text-white"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={tab.current ? "page" : undefined}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
  return component;
}
