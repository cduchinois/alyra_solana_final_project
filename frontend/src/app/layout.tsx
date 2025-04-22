import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Navigation } from '@/components/Navigation';
import { WalletButton } from '@/components/WalletButton';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana NFT Marketplace",
  description: "A decentralized NFT marketplace on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} bg-gray-50`}>
        <WalletContextProvider>
          <div className="flex flex-col">
            <div className="flex justify-between items-center h-16 mb-4">
              <div className="flex-shrink-0">
                <WalletButton />
              </div>
              <Navigation />
            </div>
            <div className="pt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </div>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
} 