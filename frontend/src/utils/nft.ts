import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
import type { Wallet } from '@solana/wallet-adapter-react';

interface NFTMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
}

export const createNFT = async (
    wallet: Wallet,
    connection: Connection,
    metadata: NFTMetadata
) => {
    try {
        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet.adapter));

        const { nft } = await metaplex.nfts().create({
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.image,
            sellerFeeBasisPoints: 500,
        });

        return nft;
    } catch (error) {
        console.error('Error creating NFT:', error);
        throw error;
    }
};