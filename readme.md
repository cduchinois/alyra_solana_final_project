
# Solana Web3 Affiliate Platform — Final Project Alyra Bootcamp  

> Alyra Solana Bootcamp Final Project  

## Overview  

This project is a Web3 affiliate marketing platform built on Solana, enabling NFT-based project promotion and revenue sharing through affiliate sales.

Affiliates can promote NFT collections and earn a commission on successful sales, with the entire process automated and secured by smart contracts.

This project showcases a full-stack decentralized application leveraging Solana's ecosystem tools for NFT management, smart contract logic, and a modern frontend.

---

## Architecture  

### Tech Stack  

| Layer | Technology | Purpose |
|-------|------------|---------|
| NFT Creation & Management | [Metaplex](https://www.metaplex.com/) | Minting NFTs and facilitating NFT project setup |
| Smart Contract Layer | [Solana Anchor](https://www.anchor-lang.com/) | Program logic for NFT listing, affiliate sale tracking, and revenue splitting |
| Frontend | [Next.js](https://nextjs.org/) | Web interface for users, affiliates, and project owners |

---

## Key Features  

### For Project Owners
- Create & mint NFTs (via Metaplex for project facilities, the user could just connect wallet and allow us fetch NFT metadata)
- List NFTs for affiliate marketing
- Define affiliate commission rates  

### For Affiliates
- Generate custom referral links
- Promote NFT projects
- Earn revenue share on every sale  

### On-chain Logic (Anchor Smart Contract)
- NFT listing & sale registration
- Affiliate sale tracking & validation
- Automated revenue split (owner / affiliate)

---

## Architecture Diagram  

```
  +----------------+        +---------------------+
  |    Next.js     | <----> |    Solana RPC/API   |
  +----------------+        +---------------------+
         |                           |
         |                           |
         v                           v
+------------------+        +-------------------+
| Metaplex NFT SDK |        |  Anchor Program   |
|  (NFT Minting)   |        |  (Listing,        |
|  Wallet connect  |        |   Revenue Split,  |
|                  |        |   Affiliate Logic)|
+------------------+        +-------------------+
```

---

## Installation  

### Prerequisites  
- Node.js  
- Solana CLI  
- Anchor CLI  
- Metaplex CLI  

### Setup  

```bash
git clone https://github.com/your-repo/web3-affiliate-solana.git
cd web3-affiliate-solana
```

#### Install Frontend  

```bash
cd app
npm install
npm run dev
```

#### Deploy Smart Contract  

```bash
cd programs/affiliate
anchor build
anchor deploy
```

---

## Authors  

@Poupyxi @cduchinois @RAN0606

Final Project for [Alyra Solana Bootcamp](https://www.alyra.fr/formations/devenir-developpeur-solana)
