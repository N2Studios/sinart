import { create } from 'ipfs-http-client';

// Mock IPFS implementation for now
// This simulates IPFS functionality until we get proper Infura setup
export const ipfs = {
  add: async (file: Buffer, options?: any) => {
    // Generate a mock CID based on file content
    const content = file.toString();
    const hash = require('crypto').createHash('sha256').update(content).digest('hex');
    const mockCid = `Qm${hash.substring(0, 44)}`;
    
    return {
      cid: { toString: () => mockCid },
      path: mockCid
    };
  }
}; 