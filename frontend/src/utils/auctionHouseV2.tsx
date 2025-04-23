import {Connection, PublicKey, LAMPORTS_PER_SOL, Transaction} from '@solana/web3.js';
//import {WalletAdapter, WRAPPED_SOL_MINT } from '@metaplex-foundation/js';
import {Metaplex, walletAdapterIdentity, auctionHouseModule, sol, AuctionHouse, Nft} from '@metaplex-foundation/js';
import {getAssociatedTokenAddress, NATIVE_MINT, createAssociatedTokenAccountInstruction, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID,} from '@solana/spl-token';
import {RPC_ENDPOINT } from '@/config/env';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

let cachedAuctionHouse: AuctionHouse | null = null;

export async function initAuctionHouse(walletAdapter: WalletAdapter,creatorPublicKey: PublicKey): Promise<AuctionHouse> 
{
  if (cachedAuctionHouse) return cachedAuctionHouse;

  const connection = new Connection(RPC_ENDPOINT);
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter))
    .use(auctionHouseModule());

  // recherche d'un auctionhouse deja créer en cache
  try 
  {
    const auctionHouse = await metaplex
      .auctionHouse()
      .findByCreatorAndMint({
        creator:      creatorPublicKey,
        treasuryMint: NATIVE_MINT,
      })
    cachedAuctionHouse = auctionHouse;
    console.log('🔍 Auctionhouse trouvée :', auctionHouse.address.toBase58());
    return auctionHouse;
  } catch {
    console.log('⚠️ Aucune AH trouvée, on la crée…');
  }

  // Création auctionhouse si pas trouvée
    const { auctionHouse } = await metaplex.auctionHouse().create({
      sellerFeeBasisPoints: 500,
      requiresSignOff: false,
      canChangeSalePrice: true,
      treasuryMint: NATIVE_MINT,
    })
  cachedAuctionHouse = auctionHouse;
  return auctionHouse;
}

export async function listNftForSale(walletAdapter: Parameters<typeof walletAdapterIdentity>[0],sellerPublicKey: PublicKey,nft: Nft,priceSol: number): 
Promise<void> 
{
  //connection wallet
  const connection = new Connection(RPC_ENDPOINT);
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter))
    .use(auctionHouseModule());

  // Création/Récupération de l’Auction House
  // // Force sellerPublicKey est le createur de public key
  const creatorPublicKey = sellerPublicKey; 
  const auctionHouse = await initAuctionHouse(walletAdapter, creatorPublicKey);
  console.log('address AH :', auctionHouse.address.toBase58());

  //Récupère le token account du NFT
  const tokenAccount = await getAssociatedTokenAddress(nft.address, sellerPublicKey);
  console.log('address vendeur du NFT :', nft.address, sellerPublicKey.toBase58());
  console.log('address NFT :', nft.address.toBase58());
  
  //
  //Construis l’Associated Token Account (ATA) 
  //
  //Vérifie s’il existe déjà
  
  const info = await connection.getAccountInfo(tokenAccount);
  console.log('ATA existe deja :', connection.getAccountInfo(tokenAccount));

  let tx: Transaction | undefined;

  if (!info) {
    //S’il n’existe pas, on le crée en une tx
    const createAtaIx = createAssociatedTokenAccountInstruction(
      sellerPublicKey,   // payer (et futur owner)
      tokenAccount,      // ATA à créer
      sellerPublicKey,   // owner
      nft.mint.address,        // mint
      TOKEN_PROGRAM_ID,          // SPL Token program
      ASSOCIATED_TOKEN_PROGRAM_ID // Associated Token Account program
    );

    tx = new Transaction().add(createAtaIx);
    tx.feePayer = sellerPublicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
  }

    //On signe la transaction
    if (!tx) {
      throw new Error('Transaction is undefined. Ensure the ATA creation logic is correct.');
    }
    if (!walletAdapter.signTransaction) {
      throw new Error('Wallet adapter does not support signing transactions.');
    }
    //Envoie tx via wallet
    const signed = await walletAdapter.signTransaction(tx);
    //On envoie la tx
    console.log('ATA signer :', walletAdapter.signTransaction);
    console.log('ATA signer :', signed);
    console.log('ATA signer :', signed.serialize());
    console.log('ATA signer :', signed.serializeMessage());
 
    //affiche la tx
    console.log('TX signer :', walletAdapter.signTransaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
    console.log('✅ ATA créé :', tokenAccount.toBase58());

  const ah = await initAuctionHouse(walletAdapter, sellerPublicKey);

  try {
    //Lancement du listing
    const  response  = await metaplex
      .auctionHouse()
      .list({
        auctionHouse,
        seller: walletAdapter,
        mintAccount: nft.mint.address,
        tokenAccount,
        price: sol(priceSol),
        tokenSize: 1,
      })
      .run();

    console.log('✅ Tx signature:', response.signature);
    console.log('✅ Logs:', response.logs);
  } catch (error: any) {
    // Erreur program
    console.error('❌ Erreur listing du NFT :', error);
    // Récupération et affichage des logs d’erreur
    const logs =
      error.logs ??
      error.response?.logs ??
      (error instanceof OperationError ? error.logs : []);
    console.error('💥 Transaction logs:\n', logs.join('\n'));
    throw error;
  }
  
}