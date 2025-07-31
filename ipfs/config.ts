import { create } from 'ipfs-http-client';

// Try using a public IPFS gateway as fallback
// This will work without authentication
export const ipfs = create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https',
  apiPath: '/api/v0'
}); 