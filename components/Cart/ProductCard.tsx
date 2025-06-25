import { CartItem, formatPrice } from '@/hooks/useShopSystem';
import { Product } from '@/components/Cart/help';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image';
import classNames from 'classnames';

const ProductCard = ({ product, addItem }: { product: Product, addItem: (item: Omit<CartItem, 'quantity'>) => void }) => {

  return (
    <div

      className="border-2 group hover:border-[#FCD535]/50 rounded-lg p-4 bg-card text-card-foreground hover:cursor-pointer  transition-all duration-300 ease-in-out shadow-lg shadow-[#FCD535]/40">
      <div className="w-full h-[220px] flex items-center justify-center  rounded mb-4">
        <Image src={product.image || ''} alt={product.name || ''} width={200} height={200} className={classNames('object-cover rounded-lg  h-full w-[90%] transition-all duration-300 ease-in-out group-hover:scale-105', {
        })}
        />

      </div>
      <h3 className="font-semibold  md:text-lg mb-2">{product.name}</h3>
      <div className='w-full'>
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-full">
              <p className="text-muted-foreground mb-2 underline cursor-pointer hover:text-foreground transition-colors truncate w-full block">{product.description}</p>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side='top'
            className='bg-black p-1 max-w-xs z-50'>
            <p className="text-muted-foreground mb-2 p-2 rounded-md text-sm break-words">{product.description}</p>
          </PopoverContent>
        </Popover>
      </div>

      <p className="md:text-xl font-bold text-[#FCD535] mb-4">
        {formatPrice(product.price)}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => addItem(product)}
          className="flex-1 bg-[#FCD535] text-black/80 px-4 py-2 font-bold rounded hover:bg-[#FCD535]/80 transition-colors"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;