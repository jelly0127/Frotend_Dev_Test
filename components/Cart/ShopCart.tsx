'use client'
import React from "react"
import {
  Drawer,
  DrawerContent,

  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import useInitStore from "@/store/useInitStore";
import { formatPrice, useCart } from "@/hooks/useShopSystem";
import { toast } from "sonner";
import classNames from 'classnames';
import { FaCartShopping } from "react-icons/fa6";
import { configResponsive, useResponsive } from 'ahooks';
import Image from "next/image";

configResponsive({
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200,
});

const ShopeCart = () => {
  const { displayCart, updateDisplayCart } = useInitStore();
  const responsive = useResponsive() || {};
  const {
    items,
    totalQuantity,
    totalAmount,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    decreaseQuantity,
    clearCart,
    checkout
  } = useCart();



  const handleCheckout = async () => {
    const result = await checkout();
    if (result.success) {
      toast.success('Settlement successful');
    } else {
      toast.error('Settlement failed');
    }
  };


  return (
    <Drawer open={displayCart || false} onOpenChange={updateDisplayCart}
      direction={!responsive?.md ? 'bottom' : 'right'}
    >

      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle> My Cart </DrawerTitle>
          <div className="flex justify-between items-center">
            <p>({totalQuantity} items)</p>

            <>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="bg-red-500 uppercase text-white px-3 py-1 text-[14px] rounded hover:bg-red-600 transition-colors"
                >
                  clear all
                </button>
              )}
            </>

          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-2 flex-1 h-[280px] md:h-[calc(100%-280px)]  ">
          {/* card items */}
          <div className=" p-2 overflow-y-auto h-full ">

            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400 w-full flex flex-col items-center justify-center gap-2">
                <FaCartShopping className="text-6xl text-gray-400 " />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm text-gray-400">Please select some products!</p>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col ">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg md:p-4 p-2 flex items-center gap-4 hover:cursor-pointer  hover:border-gray-200 transition-all 
                  ease-in-out
                  duration-300
                  ">
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center ">
                      <Image src={item.image || ''} alt={item.name || ''} width={60} height={60} className="object-cover  h-full w-full rounded" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <span className="text-xs text-gray-400"># {index + 1}</span>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-gray-300 text-xs truncate">{item.description}</p>
                    </div>

                    <div className="flex flex-col items-center gap-2">

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full  flex items-center justify-center transition-colors"
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center border rounded px-2 py-1"
                        />

                        <button
                          onClick={() => addItem({ ...item, quantity: 1 })}
                          className="w-8 h-8 rounded-full  flex items-center justify-center transition-colors"
                        >
                          +
                        </button>

                      </div>

                      <div className="text-right flex items-center gap-x-4">
                        <p className="font-semibold text-[14px]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 uppercase border border-red-500 p-1 px-2 hover:bg-red-500 hover:text-white rounded-md text-sm transition-colors"
                        >
                          delete
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>


        </div>

        <div className="flex flex-col bg-background border-t  gap-2 p-2  h-full max-h-[136px] md:h-[160px] sticky bottom-0 w-full ">
          {/* items total*/}
          <>

            {items.length > 0 && (
              <div className="md:pt-0 pt-2">
                <div className="flex justify-between items-center md:mb-4 mb-2">
                  <div>
                    <p className="text-lg">
                      Total: <span className="font-semibold">{totalQuantity}</span>
                    </p>
                    <p className="text-lg font-bold gap-x-2 flex items-center">
                      <span className="">
                        Total Price:
                      </span>
                      <span className="text-[#FCD535]">
                        {formatPrice(totalAmount)}
                      </span>
                    </p>
                  </div>


                </div>
              </div>
            )}
          </>

          {/* orders and cancel */}
          <div className="flex flex-1 justify-between items-center md:pb-4 pb-2 ">
            <button
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              className={classNames('px-3 py-1.5 rounded-md text-black/80 font-bold transition-colors', isLoading || items.length === 0
                ? 'bg-[#FCD535]/50 cursor-not-allowed'
                : 'bg-[#FCD535] hover:bg-[#FCD535]/80')}
            >
              {isLoading ? 'Settling...' : 'Settlement'}
            </button>
            <button
              className="bg-gray-400 text-white font-bold px-3 py-1.5 rounded-md hover:bg-gray-500 transition-colors"
              onClick={() => updateDisplayCart(false)}>Cancel</button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShopeCart;