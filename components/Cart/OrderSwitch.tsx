import { useCart } from '@/hooks/useShopSystem';
import useInitStore from '@/store/useInitStore';
import React from 'react';
import { FaClipboardList } from "react-icons/fa";
const OrderSwitch = () => {
  const { displayOrders, updateDisplayOrders } = useInitStore();
  const { orders } = useCart();
  return (
    <div className=' fixed top-[140px] right-5'>
      <button
        className='relative h-10 w-10 bg-gray-600  rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-gray-500'
        onClick={() => updateDisplayOrders(!displayOrders)}>
        <FaClipboardList className='h-6 w-6' />
        {orders?.length > 0 &&
          <p className=' absolute
          transition-all
          duration-300
          ease-in-out
          right-0.5 -top-3 p-1 w-5 h-5 flex items-center justify-center bg-green-500 rounded-full text-xs'>{orders?.length || 0}</p>
        }
      </button>
    </div>
  );
};

export default OrderSwitch;