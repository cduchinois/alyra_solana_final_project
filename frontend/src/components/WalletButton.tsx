'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useState } from 'react';

export const WalletButton: FC = () => {
    const { connected, disconnect } = useWallet();
    const [loading, setLoading] = useState(false);

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            await disconnect();
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <WalletMultiButton 
                className="!bg-purple-100 !text-purple-600 hover:!bg-purple-200 !rounded-lg !h-9 !px-4 !py-0 !text-sm !font-medium !border-0"
            />
            {connected && (
                <button
                    onClick={handleDisconnect}
                    className="h-9 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    disabled={loading}
                >
                    {loading ? '...' : 'Disconnect'}
                </button>
            )}
        </div>
    );
}; 