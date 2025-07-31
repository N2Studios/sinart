import { create } from 'ipfs-http-client';
import { readFile } from 'fs/promises';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    Authorization: `Bearer ${process.env.INFURA_IPFS_KEY}`
  }
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