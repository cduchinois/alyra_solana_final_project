declare let process: {
    env: {
      NEXT_PUBLIC_SOLANA_NETWORK: string;
      NEXT_PUBLIC_RPC_ENDPOINT: string;
    }
  };
  
  export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com'; 