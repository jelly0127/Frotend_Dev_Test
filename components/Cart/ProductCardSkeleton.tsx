import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="border-2  h-[396px]  rounded-lg p-4 shadow-md bg-card ">
      <div className="w-full h-48 bg-muted rounded mb-4 flex items-center justify-center">
        <span className="text-muted-foreground rounded animate-pulse bg-gray-200 w-full h-full"></span>
      </div>
      <h3 className="font-semibold  md:text-lg mt-2 h-6 mb-2 rounded text-card-foreground animate-pulse bg-gray-200 w-full"></h3>
      <p className="text-muted-foreground mb-2 mt-2 h-6 truncate rounded animate-pulse bg-gray-200 w-full"></p>
      <p className="md:text-xl font-bold mt-2 h-5 mb-4 rounded animate-pulse bg-gray-200 w-full">
      </p>
      <div
        className="flex-1 mt-2 bg-[#FCD535] text-black/80 px-4 py-2 font-bold rounded animate-pulse bg-gray-200 w-full h-10"
      >
      </div>

    </div>
  );
};

export default ProductCardSkeleton;