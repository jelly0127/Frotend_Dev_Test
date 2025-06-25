export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTItem {
  token_standard: string;
  contract: string;
  token_id: string;
  owner: string;
  uri: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  network_id: string;
}

export interface APIResponse {
  data: NFTItem[];
  statistics: {
    bytes_read: number;
    rows_read: number;
    elapsed: number;
  };
  pagination: {
    previous_page: number;
    current_page: number;
    next_page: number;
    total_pages: number;
  };
  results: number;
  total_results: number;
  request_time: string;
  duration_ms: number;
}


   
  //backup IPFS gateway list
  export const getBackupImageUrls = (ipfsUrl: string) => {
    if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) return [];

    const hash = ipfsUrl.replace('ipfs://', '');
    return [
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://ipfs.io/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`,
      `https://dweb.link/ipfs/${hash}`,
      `https://gateway.ipfs.io/ipfs/${hash}`,
      `https://nftstorage.link/ipfs/${hash}`,
      `https://4everland.io/ipfs/${hash}`,
      `https://w3s.link/ipfs/${hash}`,
      `https://infura-ipfs.io/ipfs/${hash}`,
      `https://fleek.ipfs.io/ipfs/${hash}`
    ];
  };

    //parse Token ID input
  export const parseTokenIds = (input: string, type: string,rangeStart: string,rangeEnd: string): string[] => {
    if (type === 'range') {
      const start = parseInt(rangeStart);
      const end = parseInt(rangeEnd);
      if (start > end || start < 1 || end > 8888) return [];
      return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
    } else if (type === 'multiple') {
      return input.split(',').map(id => id.trim()).filter(id => id && !isNaN(parseInt(id)));
    } else {
      return [input.trim()];
    }
  };