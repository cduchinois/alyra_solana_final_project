'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity, Nft } from '@metaplex-foundation/js';
import { RPC_ENDPOINT } from '@/config/env';
import { listNftForSale, initAuctionHouse} from '@/utils/auctionHouseV2';

export const ListNFT: FC = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (connected && publicKey) fetchNFTs();
  }, [connected, publicKey]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      const conn = new Connection(RPC_ENDPOINT);
      const mx = Metaplex.make(conn).use(
        walletAdapterIdentity(wallet!.adapter)
      );
      const all = await mx.nfts().findAllByOwner({
        owner: new PublicKey(publicKey!),
      });
      setNfts(all);
    } catch (e) {
      console.error(e);
      alert("Erreur fetch NFTs, check la console");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (nft: Nft) => {
    const priceStr = prompt('Prix de vente (en SOL) ?');
    if (!priceStr) return;
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      return alert('Prix invalide');
    }
    setLoading(true);
    try {
      await listNftForSale(
        wallet!.adapter,
        new PublicKey(publicKey!),
        nft,
        price
      );

      alert(`"${nft.json?.name}" listé à ${price} SOL !`);
      fetchNFTs();
    } catch (err) {
      alert(`Échec création AH : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) return <p>Connecte ton wallet pour voir tes NFTs.</p>;

  return (
    <div className="p-4">
      <button
        disabled={loading}
        onClick={fetchNFTs}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'loading…' : 'Refresh my NFTs'}
      </button>

      {nfts.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">Pas de NFTs trouvés.</p>
      )}

      <ul className="mt-4 space-y-4">
        {nfts.map(nft => (
          <li key={nft.address.toBase58()} className="border p-3 rounded flex-col">
            <strong>{nft.json?.name ?? '<sans nom>'}</strong><br/>
            Mint : {nft.address.toBase58()}<br/>
            {nft.json?.image && (
              <img
                src={nft.json.image}
                alt={nft.json.name}
                className="mt-2 w-24 rounded"
              />
            )}
            <button
              onClick={() => handleSell(nft)}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Vendre
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};