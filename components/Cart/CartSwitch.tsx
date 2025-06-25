'use client'

import { useCart } from '@/hooks/useShopSystem';
import useInitStore from '@/store/useInitStore';
import React from 'react';
import { FaCartPlus } from "react-icons/fa6";

const CartSwitch = () => {
  const { displayCart, updateDisplayCart } = useInitStore();
  const {
    items
  } = useCart();

  return (
    <div className=' fixed top-20 right-5'>
      <button
        className='relative h-10 w-10 bg-gray-600  rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-gray-500'
        onClick={() => updateDisplayCart(!displayCart)}>
        <FaCartPlus className='h-6 w-6' />
        {items?.length > 0 &&
          <p className=' absolute
          transition-all
          duration-300
          ease-in-out
          right-0.5 -top-3 p-1 w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full text-xs'>{items?.length || 0}</p>
        }
      </button>
    </div>

  );
};

export default CartSwitch;