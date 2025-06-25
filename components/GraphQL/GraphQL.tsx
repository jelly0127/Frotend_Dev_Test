'use client'
import React, { useState, useEffect } from 'react';
import { NFTItem, APIResponse, getBackupImageUrls, parseTokenIds } from './help';
import NFTCard from './NFTCard';
import classNames from 'classnames';

const PUDGY_PENGUINS_CONTRACT = process.env.NEXT_PUBLIC_PUDGY_PENGUINS_CONTRACT;
const THE_GRAPH_API_KEY = process.env.NEXT_PUBLIC_THE_GRAPH_TOKEN_API_KEY;

const GraphQL = () => {
  const [nftDataList, setNftDataList] = useState<NFTItem[]>([]);
  const [rawData, setRawData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenIds, setTokenIds] = useState('5712');
  const [queryType, setQueryType] = useState<'single' | 'multiple' | 'range'>('single');
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('10');
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});


  // Image loading function 
  const loadImageWithFallback = async (ipfsUrl: string) => {
    if (!ipfsUrl) return '';

    setImageLoadingStates(prev => ({ ...prev, [ipfsUrl]: true }));
    const urls = getBackupImageUrls(ipfsUrl);

    // Test 3 gateways in parallel for better success rate
    const testUrlsBatch = async (urlBatch: string[]) => {
      return Promise.allSettled(
        urlBatch.map(async (url) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

          try {
            const response = await fetch(url, {
              method: 'HEAD',
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
              return { url, success: true };
            }
            throw new Error(`HTTP ${response.status}`);
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        })
      );
    };

    try {
      // Test gateways in batches
      for (let i = 0; i < urls.length; i += 3) {
        const batch = urls.slice(i, i + 3);
        console.log(`Testing batch ${Math.floor(i / 3) + 1} for ${ipfsUrl}:`, batch);

        const results = await testUrlsBatch(batch);

        // Find first successful URL
        for (const result of results) {
          if (result.status === 'fulfilled' && result.value.success) {
            const successUrl = result.value.url;
            console.log('Successfully loaded image from:', successUrl);
            setImageUrls(prev => ({ ...prev, [ipfsUrl]: successUrl }));
            setImageLoadingStates(prev => ({ ...prev, [ipfsUrl]: false }));
            return successUrl;
          }
        }
      }

      // If all gateways fail, use first URL as fallback
      console.log('All gateways failed, using first URL as fallback');
      setImageUrls(prev => ({ ...prev, [ipfsUrl]: urls[0] || '' }));
      setImageLoadingStates(prev => ({ ...prev, [ipfsUrl]: false }));
      return urls[0] || '';
    } catch (error) {
      console.error('Error in loadImageWithFallback:', error);
      setImageUrls(prev => ({ ...prev, [ipfsUrl]: '' }));
      setImageLoadingStates(prev => ({ ...prev, [ipfsUrl]: false }));
      return '';
    }
  };


  const fetchNFTData = async (input: string) => {
    setLoading(true);
    setError(null);
    setNftDataList([]);
    setRawData(null);
    setImageUrls({});
    setImageLoadingStates({});

    const tokenIdList = parseTokenIds(input, queryType, rangeStart, rangeEnd);

    if (tokenIdList.length === 0) {
      setError('Please enter valid Token IDs');
      setLoading(false);
      return;
    }

    if (tokenIdList.length > 20) {
      setError('Maximum 20 NFTs can be queried at once');
      setLoading(false);
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${THE_GRAPH_API_KEY}`
      }
    };

    try {
      const allNftData: NFTItem[] = [];
      let totalResults = 0;
      let totalDuration = 0;

      // Batch query
      for (const tokenId of tokenIdList) {
        const url = `https://token-api.thegraph.com/nft/items/evm/contract/${PUDGY_PENGUINS_CONTRACT}/token_id/${tokenId}?network_id=mainnet`;

        try {
          console.log(`Fetching Token #${tokenId}:`, url);
          const response = await fetch(url, options);

          if (!response.ok) {
            console.warn(`Failed to fetch Token #${tokenId}: ${response.status}`);
            continue;
          }

          const data: APIResponse = await response.json();

          if (data && data.data && data.data.length > 0) {
            allNftData.push(...data.data);
            totalResults += data.results;
            totalDuration += data.duration_ms;
          }

          // Add small delay to avoid too fast requests
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.warn(`Error fetching Token #${tokenId}:`, err);
          continue;
        }
      }

      if (allNftData.length > 0) {
        setNftDataList(allNftData);

        // Create aggregated statistics
        setRawData({
          data: allNftData,
          statistics: {
            bytes_read: 0,
            rows_read: totalResults,
            elapsed: totalDuration / 1000
          },
          pagination: {
            previous_page: 1,
            current_page: 1,
            next_page: 1,
            total_pages: 1
          },
          results: allNftData.length,
          total_results: allNftData.length,
          request_time: new Date().toISOString(),
          duration_ms: totalDuration
        });

        // Load all images asynchronously
        for (const nftItem of allNftData) {
          if (nftItem.image) {
            loadImageWithFallback(nftItem.image);
          }
        }
      } else {
        throw new Error('No NFT data found');
      }
    } catch (err) {
      console.error('Error fetching NFT data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData(tokenIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenIds(e.target.value);
  };

  const handleFetch = () => {
    if (tokenIds) {
      fetchNFTData(tokenIds);
    }
  };

  // Format address display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className=" h-full  py-8">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Pudgy Penguins NFT Data Display
        </h1>

        {/* Search Area */}
        <div className="mb-8 space-y-4">
          {/* Query Type Selection */}
          <div className="flex justify-center">
            <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-600">
              <button
                onClick={() => setQueryType('single')}
                className={classNames(
                  'md:px-4 md:py-2 px-2 py-1 rounded-md text-sm font-medium transition-all',
                  {
                    'bg-blue-500 text-white shadow-lg': queryType === 'single',
                    'text-gray-400 hover:text-white': queryType !== 'single'
                  }
                )}
              >
                Single
              </button>
              <button
                onClick={() => setQueryType('multiple')}
                className={classNames(`px-4 py-2 rounded-md text-sm font-medium transition-all ${queryType === 'multiple'
                  ? 'bg-[#FCD535] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`)}
              >
                Batch
              </button>
              <button
                onClick={() => setQueryType('range')}
                className={classNames(`px-4 py-2 rounded-md text-sm font-medium transition-all ${queryType === 'range'
                  ? 'bg-[#FCD535] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`)}
              >
                Range
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-4 items-center justify-center">
            {queryType === 'range' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    placeholder="Start"
                    min="1"
                    max="8888"
                    className="w-20 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    placeholder="End"
                    min="1"
                    max="8888"
                    className="w-20 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="md:px-6 md:py-3 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                >
                  {loading ? 'Querying...' : `Query #${rangeStart}-${rangeEnd}`}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={tokenIds}
                  onChange={handleTokenIdsChange}
                  placeholder={queryType === 'multiple' ? "Enter multiple Token IDs (comma separated, e.g: 1,2,3)" : "Enter Token ID"}
                  className="w-80 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="md:px-6 md:py-3 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                >
                  {loading ? 'Querying...' : 'Query'}
                </button>
              </div>
            )}
          </div>

          {/* Query Tips */}
          <div className="text-center text-sm text-gray-500">
            {queryType === 'single' && "Query single Pudgy Penguin NFT"}
            {queryType === 'multiple' && "Query up to 20 NFTs at once, separate Token IDs with commas"}
            {queryType === 'range' && "Query Pudgy Penguins within specified range (1-8888), max 20 at once"}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg backdrop-blur-sm">
            <h3 className="font-bold text-red-200">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* NFT Cards Display */}
        {nftDataList.length > 0 && (
          <div className="space-y-6">
            {/* Query Result Statistics */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Query Results: {nftDataList.length} Pudgy Penguin NFTs
              </h2>
              <p className="text-gray-400">
                {queryType === 'single' && `Token ID: ${tokenIds}`}
                {queryType === 'multiple' && `Token IDs: ${parseTokenIds(tokenIds, queryType, rangeStart, rangeEnd).join(', ')}`}
                {queryType === 'range' && `Range: #${rangeStart} - #${rangeEnd}`}
              </p>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nftDataList.map((nftData) => (
                <div
                  key={`${nftData.contract}-${nftData.token_id}`}
                  className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 hover:border-blue-500/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden hover:shadow-blue-500/20 transition-all duration-300 "
                >
                  {/* NFT Image */}
                  <NFTCard nftData={nftData} imageUrls={imageUrls} imageLoadingStates={imageLoadingStates} loadImageWithFallback={loadImageWithFallback} />

                  {/* NFT Information */}
                  <div className="p-4">
                    {/* Name */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{nftData.name}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {nftData.description}
                      </p>
                    </div>

                    {/* Owner Information */}
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Owner</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-white font-mono text-xs">{formatAddress(nftData.owner)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attributes Preview (show first 4 only) */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Main Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {nftData.attributes.slice(0, 4).map((attr, attrIndex) => (
                          <div
                            key={attrIndex}
                            className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-2 rounded-lg border border-gray-600/30"
                          >
                            <p className="text-xs text-gray-500 uppercase font-medium mb-0.5 truncate">
                              {attr.trait_type}
                            </p>
                            <p className="font-semibold text-white text-xs truncate">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                      {nftData.attributes.length > 4 && (
                        <p className="text-center text-xs text-gray-500 mt-2">
                          +{nftData.attributes.length - 4} more attributes
                        </p>
                      )}
                    </div>

                    {/* Chain Information */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-400 text-xs">Ethereum</span>
                      </div>
                      <span className="text-gray-500 text-xs font-mono">
                        {formatAddress(nftData.contract)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Statistics */}
        {rawData && (
          <div className="mt-8 max-w-4xl mx-auto space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">API Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-blue-400">{rawData.results}</p>
                  <p className="text-xs text-gray-400">Query Results</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-green-400">{rawData.duration_ms}ms</p>
                  <p className="text-xs text-gray-400">Response Time</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-purple-400">{rawData.statistics.rows_read.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Rows Read</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-yellow-400">{(rawData.statistics.elapsed * 1000).toFixed(0)}ms</p>
                  <p className="text-xs text-gray-400">Query Time</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-cyan-400">
                    {Math.round((Object.keys(imageUrls).filter(key => imageUrls[key]).length / Math.max(nftDataList.length, 1)) * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">Image Load Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FCD535] mb-4"></div>
            <p className="text-gray-300 text-lg">Loading Pudgy Penguin data...</p>
            <p className="text-gray-500 text-sm mt-2">Token ID: {tokenIds}</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && nftDataList.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐧</div>
            <p className="text-gray-400 text-lg mb-2">Enter Token ID to query Pudgy Penguin NFT</p>
            <p className="text-gray-600 text-sm">Supports querying Pudgy Penguins #1-8888</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQL;