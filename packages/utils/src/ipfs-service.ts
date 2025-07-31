import { create } from 'ipfs-http-client';
import { ipfs as pinataIPFS, web3Storage, nftStorage, localIPFS, publicGateways } from '../../../ipfs/config';

export interface IPFSProvider {
  name: string;
  upload: (file: File | Buffer) => Promise<string>;
  get: (cid: string) => Promise<Buffer>;
  pin: (cid: string) => Promise<void>;
}

export class IPFSService {
  private providers: IPFSProvider[] = [];
  private currentProvider: IPFSProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Pinata (Primary)
    if (process.env.PINATA_JWT_TOKEN) {
      this.providers.push(new PinataProvider());
    }

    // Web3.Storage (Free tier)
    if (process.env.WEB3_STORAGE_TOKEN) {
      this.providers.push(new Web3StorageProvider());
    }

    // NFT.Storage (Free tier)
    if (process.env.NFT_STORAGE_TOKEN) {
      this.providers.push(new NFTStorageProvider());
    }

    // Local IPFS (Development)
    if (process.env.NODE_ENV === 'development') {
      this.providers.push(new LocalIPFSProvider());
    }

    this.currentProvider = this.providers[0] || null;
  }

  async upload(file: File | Buffer): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No IPFS providers configured');
    }

    try {
      return await this.currentProvider.upload(file);
    } catch (error) {
      console.warn(`Primary IPFS provider failed, trying fallback...`);
      return await this.tryFallbackUpload(file);
    }
  }

  private async tryFallbackUpload(file: File | Buffer): Promise<string> {
    for (const provider of this.providers) {
      if (provider === this.currentProvider) continue;
      
      try {
        return await provider.upload(file);
      } catch (error) {
        console.warn(`${provider.name} failed:`, error);
      }
    }
    throw new Error('All IPFS providers failed');
  }

  async get(cid: string): Promise<Buffer> {
    // Try public gateways first for retrieval
    for (const gateway of publicGateways) {
      try {
        const response = await fetch(`${gateway}/ipfs/${cid}`);
        if (response.ok) {
          return Buffer.from(await response.arrayBuffer());
        }
      } catch (error) {
        console.warn(`Gateway ${gateway} failed for CID ${cid}`);
      }
    }
    throw new Error(`Failed to retrieve CID: ${cid}`);
  }

  getGatewayURL(cid: string): string {
    return `${publicGateways[0]}/ipfs/${cid}`;
  }
}

// Pinata Provider Implementation
class PinataProvider implements IPFSProvider {
  name = 'Pinata';

  async upload(file: File | Buffer): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  async get(cid: string): Promise<Buffer> {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from Pinata: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid: string): Promise<void> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hashToPin: cid })
    });

    if (!response.ok) {
      throw new Error(`Pinata pin failed: ${response.statusText}`);
    }
  }
}

// Web3.Storage Provider Implementation
class Web3StorageProvider implements IPFSProvider {
  name = 'Web3.Storage';

  async upload(file: File | Buffer): Promise<string> {
    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WEB3_STORAGE_TOKEN}`
      },
      body: file
    });

    if (!response.ok) {
      throw new Error(`Web3.Storage upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.cid;
  }

  async get(cid: string): Promise<Buffer> {
    const response = await fetch(`https://${cid}.ipfs.dweb.link/`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from Web3.Storage: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid: string): Promise<void> {
    // Web3.Storage automatically pins uploaded content
    console.log(`Content ${cid} is automatically pinned by Web3.Storage`);
  }
}

// NFT.Storage Provider Implementation
class NFTStorageProvider implements IPFSProvider {
  name = 'NFT.Storage';

  async upload(file: File | Buffer): Promise<string> {
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NFT_STORAGE_TOKEN}`
      },
      body: file
    });

    if (!response.ok) {
      throw new Error(`NFT.Storage upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.value.cid;
  }

  async get(cid: string): Promise<Buffer> {
    const response = await fetch(`https://${cid}.ipfs.dweb.link/`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from NFT.Storage: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid: string): Promise<void> {
    // NFT.Storage automatically pins uploaded content
    console.log(`Content ${cid} is automatically pinned by NFT.Storage`);
  }
}

// Local IPFS Provider Implementation
class LocalIPFSProvider implements IPFSProvider {
  name = 'Local IPFS';
  private ipfs = localIPFS;

  async upload(file: File | Buffer): Promise<string> {
    const result = await this.ipfs.add(file);
    return result.cid.toString();
  }

  async get(cid: string): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async pin(cid: string): Promise<void> {
    await this.ipfs.pin.add(cid);
  }
}

// Export singleton instance
export const ipfsService = new IPFSService(); 