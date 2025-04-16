import { MintNFT } from '@/components/MintNFT';

export default function CreatePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Create Your NFT</h1>
      <MintNFT />
    </div>
  );
} 