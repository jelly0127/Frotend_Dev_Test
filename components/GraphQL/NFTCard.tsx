import React from 'react';
import Image from 'next/image';
import { NFTItem } from './help';


interface NFTCardProps {
  nftData: NFTItem;
  imageUrls: { [key: string]: string };
  imageLoadingStates: { [key: string]: boolean };
  loadImageWithFallback: (ipfsUrl: string) => void;
}
const NFTCard = ({ nftData, imageUrls, imageLoadingStates, loadImageWithFallback }: NFTCardProps) => {
  return (
    <div className="relative border-2 border-gray-700/50 hover:border-blue-500/20 hover:cursor-pointer transition-all duration-300 ">
      {imageLoadingStates[nftData.image] ? (
        <div className="w-full h-60 bg-gray-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCD535]"></div>
            <p className="text-gray-400 text-xs">Testing IPFS gateway...</p>
            <p className="text-gray-600 text-xs">Token #{nftData.token_id}</p>
          </div>
        </div>
      ) : imageUrls[nftData.image] ? (
        <Image
          src={imageUrls[nftData.image]}
          alt={nftData.name}
          width={400}
          height={240}
          className="w-full h-60 object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.querySelector('.fallback-content')?.classList.remove('hidden');
          }}
        />
      ) : (
        <div className="w-full h-60 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-xs mb-3">Image loading failed</p>
            <button
              onClick={() => loadImageWithFallback(nftData.image)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
            >
              Retry loading
            </button>
            <p className="text-xs text-gray-600 mt-2 break-all px-2">
              {nftData.image.replace('ipfs://', '').substring(0, 20)}...
            </p>
          </div>
        </div>
      )}


      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
        <span className="text-xs text-gray-300 font-medium">#{nftData.token_id}</span>
      </div>
      <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-full">
        <span className="text-xs text-white font-medium">{nftData.token_standard}</span>
      </div>
    </div>
  );
};

export default NFTCard;