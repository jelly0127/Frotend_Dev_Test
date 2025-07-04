import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import Dom from '../content/Dom';
import { headers } from 'next/headers';
import ContextProvider from '@/content/ContextProvider';
import { Toaster } from 'sonner';


const URL = process.env.NEXT_PUBLIC_AUTH_URL;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '',
  description: '',
  keywords: '',
  robots: 'index,follow',
  openGraph: {
    type: 'website',
    title: '',
    description: '',
    url: URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: '',
    description: '',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList?.get('cookie');
  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <body className="dark">
        <ContextProvider cookies={cookies}>
          <Dom>{children}</Dom>
          <Toaster richColors position="top-right" />
        </ContextProvider>
      </body>
    </html>
  );
}
