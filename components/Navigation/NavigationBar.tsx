'use client'
import React, { Suspense, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CgDetailsMore } from "react-icons/cg";
import classNames from 'classnames';
import MobileNavbarDrawer from './MobileNavbarDrawer';

const NavigationBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openMobileDrawer, setOpenMobileDrawer] = useState<boolean>(false);
  const renderRouter = () => {
    const routes = [
      { path: '/', label: 'Shop' },
      { path: '/from', label: 'From' },
      { path: '/blog', label: 'Blog' },
      { path: '/graph', label: 'The Graph' },
      { path: '/theory', label: 'Theory' },
    ];

    return (
      <>
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => {
              router.push(route.path);
            }}
            className={classNames('col-span-1 cursor-pointer flex items-center gap-x-2 text-nowrap pb-2 lg:border-none lg:border-transparent lg:pb-0', {
              'text-[#EEEEEE]': pathname === route.path,
              'text-[#B1B1B1]': pathname !== route.path,
            })}
          >
            {route.path === pathname ? <div className="h-2 w-2 rounded-full bg-[#FCD535]" /> :
              <div className='h-2 w-2' />}
            <p className="font-medium">{route.label}</p>
          </button>
        ))}
      </>
    );
  };

  return (
    <Suspense fallback={<></>}>
      <div className="sticky top-0 z-50 w-full border-b border-white/10">
        <div className="flex md:h-16 h-14 w-full items-center gap-x-2   px-4 backdrop-blur-md sm:px-5 lg:px-6 xl:px-8">
          <Link
            href={'/'}
            className="flex items-center text-nowrap font-title text-[16px] font-bold uppercase leading-5 tracking-wide text-white lg:text-[28px]"
          >
            frontend test
          </Link>

          <div className="hidden lg:flex items-center gap-x-5">{renderRouter()}</div>

          <div className='w-full flex flex-row justify-end '>
            <appkit-button />
          </div>
          <button onClick={() => setOpenMobileDrawer(true)} className='flex lg:hidden items-center'>
            <CgDetailsMore className='text-white text-2xl' />
          </button>
        </div>
      </div>
      <MobileNavbarDrawer open={openMobileDrawer} onOpenChange={setOpenMobileDrawer}>
        {renderRouter()}
      </MobileNavbarDrawer>
    </Suspense>
  );
};

export default NavigationBar;
