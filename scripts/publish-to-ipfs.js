import { create } from 'ipfs-http-client';
import { readFile } from 'fs/promises';

// Try using a public IPFS gateway as fallback
// This will work without authentication
const ipfs = create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https',
  apiPath: '/api/v0'
});

async function publishToIPFS() {
  try {
    const file = await readFile('docs/specs/phase-001.md');
    const result = await ipfs.add(file, { pin: true });
    // eslint-disable-next-line no-console
    console.log(`IPFS CID: ${result.cid.toString()}`);
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