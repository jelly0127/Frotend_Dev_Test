'use client';
import ShopeCart from '@/components/Cart/ShopCart';
import NavigationBar from '@/components/Navigation/NavigationBar';
import BackTopButton from '@/components/BackTopButton/BackTopButton';
import React from 'react';
import Footer from '@/components/Footer/Footer';

const DomContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full relative bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      <NavigationBar />
      <ShopeCart />
      {children}
      <Footer />

      <BackTopButton />
    </div>
  );
};

const Dom = ({ children }: { children: React.ReactNode }) => {
  return <DomContent>{children}</DomContent>;
};

export default Dom;
