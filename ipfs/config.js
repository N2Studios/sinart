import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Pinata IPFS Configuration (Recommended)
export const ipfs = create({
  host: 'api.pinata.cloud',
  port: 443,
  protocol: 'https',
  apiPath: '/pinning',
  headers: {
    'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Alternative: Web3.Storage (Free tier)
export const web3Storage = {
  endpoint: 'https://api.web3.storage',
  token: process.env.WEB3_STORAGE_TOKEN
};

// Alternative: NFT.Storage (Free tier)
export const nftStorage = {
  endpoint: 'https://api.nft.storage',
  token: process.env.NFT_STORAGE_TOKEN
};

// Alternative: Local IPFS Node (for development)
export const localIPFS = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

// Alternative: Public IPFS Gateways (no API key needed)
export const publicGateways = [
  'https://ipfs.io',
  'https://gateway.pinata.cloud',
  'https://cloudflare-ipfs.com',
  'https://dweb.link'
]; 