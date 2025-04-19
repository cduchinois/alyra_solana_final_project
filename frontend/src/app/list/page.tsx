import { ListNFT } from '@/components/ListNFT';

export default function ListPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Your NFTs</h1>
      <ListNFT/>
    </div>
  );
} 