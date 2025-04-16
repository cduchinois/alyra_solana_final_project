'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { WalletButton } from './WalletButton';

export const Navigation: FC = () => {
    const pathname = usePathname();

    const navItems = [
        { path: '/create', label: 'Create NFT' },
        { path: '/list', label: 'List NFTs' },
        { path: '/affiliate', label: 'Affiliate' },
        { path: '/buy', label: 'Buy NFT' },
    ];

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-white text-xl font-bold hover:opacity-90 transition-opacity">
                            Solana NFT
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex flex-1 justify-center space-x-4"> {/* Adjusted space-x-8 to space-x-4 for a simpler design */}
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-2 py-1 rounded text-sm font-medium transition-all duration-200 ${
                                    pathname === item.path
                                        ? 'bg-gray-200 text-blue-600' // Changed to a simpler background color
                                        : 'text-gray-800 hover:bg-gray-300' // Changed text and hover styles for simplicity
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-shrink-0">
                        <WalletButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}; 