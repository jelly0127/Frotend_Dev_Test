'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useShopSystem';
import { sampleProducts, Product } from './help';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import CartSwitch from './CartSwitch';
import OrderSwitch from './OrderSwitch';
import ShopOrders from './ShopOrders';

const CartExample: React.FC = () => {
  const {
    addItem,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(true);

  const LIMIT = 4;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    setProducts(sampleProducts.slice(0, nextPage * LIMIT));
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setProducts(sampleProducts.slice(0, 4))
      setIsLoadingMore(false);
    }, 1000)
  }, [])

  return (
    <div className="max-w-[1440px] h-full  mx-auto p-6  text-foreground">
      <CartSwitch />
      <OrderSwitch />
      <ShopOrders />
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Cart Example</h1>

      {/* product list */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            isLoadingMore ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              products?.map((product) => (
                <ProductCard key={product.id} product={product} addItem={addItem} />
              ))
            )
          }

        </div>
      </div>

      {/* Load more */}
      {
        products.length < sampleProducts.length && (
          <div className="flex justify-center">
            <button
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              className="bg-gray-500 text-white px-4 py-2 font-bold rounded hover:bg-gray-400 transition-colors shadow-lg shadow-[#FCD535]/40">
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )
      }


    </div>
  );
};

export default CartExample; 