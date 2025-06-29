'use client';
import { wagmiAdapter, projectId, networks, testnetNetworks } from '@/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { CartProvider } from '@/hooks/useShopSystem';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Market Bot - EVM Wallet Manager',
  description: 'Comprehensive EVM wallet management with batch operations across all major chains',
  url: 'https://market-bot.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal with all EVM networks
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any, //include all mainnet and testnet
  defaultNetwork: testnetNetworks[2], // default use BSC testnet
  metadata: metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    emailShowWallets: true,
  },
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
