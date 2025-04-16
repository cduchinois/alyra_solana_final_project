'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useState, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '@/config/env';
import { createNFT } from '@/utils/nft';

export const MintNFT: FC = () => {
    const { wallet, publicKey } = useWallet();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleMint = async () => {
        if (!publicKey || !wallet || !selectedImage) {
            alert("Please select an image first");
            return;
        }

        try {
            setLoading(true);
            const connection = new Connection(RPC_ENDPOINT);
            
            // 这里可以先上传图片到IPFS或其他存储
            const imageUrl = "https://your-metadata-uri.json"; // 替换为实际上传后的URL
            
            const nft = await createNFT(wallet, connection, {
                name: "My NFT",
                symbol: "MNFT",
                description: "My first NFT on Solana",
                image: imageUrl,
            });

            console.log("NFT created:", nft);
            alert("NFT created successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error);
            alert("Error creating NFT");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {publicKey && (
                <>
                    <div className="flex flex-col items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Select Image
                        </button>
                        {selectedImage && (
                            <div className="mt-2 text-sm">
                                Selected: {selectedImage.name}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleMint}
                        disabled={loading || !selectedImage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create NFT"}
                    </button>
                </>
            )}
        </div>
    );
}; 