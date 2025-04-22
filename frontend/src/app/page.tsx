import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome to Solana NFT Affiliate Platform</h1>
      <p className="text-lg mb-4">Explore the world of NFTs and earn through our affiliate program.</p>
      {/* <Link href="/explore" className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200 transition">
        Explore Now
      </Link> */}
    </div>
  );
}