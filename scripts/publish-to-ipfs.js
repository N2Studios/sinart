import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

// Mock IPFS implementation
const mockIPFS = {
  add: async (file, options) => {
    const content = file.toString();
    const hash = createHash('sha256').update(content).digest('hex');
    const mockCid = `Qm${hash.substring(0, 44)}`;
    
    return {
      cid: { toString: () => mockCid },
      path: mockCid
    };
  }
};

async function publishToIPFS() {
  try {
    const file = await readFile('docs/specs/phase-001.md');
    const result = await mockIPFS.add(file, { pin: true });
    // eslint-disable-next-line no-console
    console.log(`IPFS CID: ${result.cid.toString()}`);
    console.log(`Mock IPFS URL: https://ipfs.io/ipfs/${result.cid.toString()}`);
    return result.cid.toString();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('IPFS Error:', error);
    throw error;
  }
}

publishToIPFS().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
}); 