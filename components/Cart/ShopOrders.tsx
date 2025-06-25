import { useCart } from '@/hooks/useShopSystem';
import useInitStore from '@/store/useInitStore';
import Image from 'next/image';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatOrderTime, getOrderStatusText } from '@/hooks/useShopSystem';
import classNames from 'classnames';

const ShopOrders = () => {
  const { displayOrders, updateDisplayOrders } = useInitStore();
  const { orders } = useCart();
  return (
    <Dialog open={displayOrders || false} onOpenChange={updateDisplayOrders}>
      <DialogContent className='w-full max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>My Orders</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 w-full '>
          {
            orders.length === 0 ? (
              <div className='flex flex-col gap-4 justify-center w-full '>

                <p className='text-center text-lg font-bold text-muted-foreground'>No orders found...</p>
              </div>
            ) : (
              orders.map((order, index) => (
                <div key={order.orderId} className='flex flex-col gap-2'>
                  <div className='flex flex-row items-center gap-2'>
                    <div className='w-[60px] h-[60px] bg-gray-200 rounded-md'>
                      <Image src={order.items[0].image || ''} alt={order.items[0].name || ''} width={60} height={60} className='w-full h-full object-cover rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-sm text-muted-foreground'>#{index + 1}</p>
                      <h2 className='text-sm font-bold'>
                        <span className='text-muted-foreground'>Order ID:</span> {order.orderId}
                      </h2>
                      <p className='text-sm '>
                        <span className='text-muted-foreground'>Order Time:</span> {formatOrderTime(order.orderTime)}
                      </p>
                      <p className={classNames('text-sm', {
                        'text-green-500': order.status === 'completed',
                        'text-red-500': order.status === 'cancelled',
                        'text-yellow-500': order.status === 'pending',
                      })}>
                        <span className='text-muted-foreground'>Status:</span> {getOrderStatusText(order.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )
          }

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopOrders;