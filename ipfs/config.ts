import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    Authorization: `Bearer ${process.env.INFURA_IPFS_KEY}`
  }
}); 