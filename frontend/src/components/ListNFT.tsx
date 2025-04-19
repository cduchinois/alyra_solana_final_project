'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity, Nft } from '@metaplex-foundation/js';
import { RPC_ENDPOINT } from '@/config/env';

export const ListNFT: FC = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs();
    }
  }, [connected, publicKey]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      // 1️⃣ Connexion et Metaplex
      const connection = new Connection(RPC_ENDPOINT);
      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity(wallet?.adapter!)
      );

      // 2️⃣ Récupération de tous les NFTs du wallet
      const allNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: new PublicKey(publicKey) });

      setNfts(allNfts);
    } 
    catch (err) {
      console.error('Erreur fetch NFTs :', err);
      alert('Impossible de récupérer tes NFTs, check la console.');
    } 
    finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return <p>🔌 Connecte ton wallet pour afficher tes NFTs.</p>;
  }

  return (
    <div className="p-4">
      <button
        onClick={fetchNFTs}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Chargement…' : 'Afficher mes NFTs'}
      </button>

      {nfts.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">Tu n’as pas de NFTs sur ce réseau.</p>
      )}

     <ul className="mt-4 space-y-4">
        {nfts.map(nft => (
          <li key={nft.address.toBase58()} className="border p-3 rounded">
            <strong>{nft.json?.name ?? '<sans nom>'}</strong><br/>
            Mint : {nft.address.toBase58() ?? nft.address.toBase58()}<br/>
            {nft.json?.image && (
              <img
                src={nft.json.image}
                alt={nft.json.name}
                className="mt-2 w-24 rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};