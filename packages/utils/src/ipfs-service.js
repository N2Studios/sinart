import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configurations from the main config file
import { ipfs as pinataIPFS, web3Storage, nftStorage, localIPFS, publicGateways } from '../../../ipfs/config.js';

export class IPFSService {
  constructor() {
    this.providers = [];
    this.currentProvider = null;
    this.initializeProviders();
  }

  initializeProviders() {
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

  async upload(file) {
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

  async tryFallbackUpload(file) {
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

  async get(cid) {
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

  getGatewayURL(cid) {
    return `${publicGateways[0]}/ipfs/${cid}`;
  }
}

// Pinata Provider Implementation
class PinataProvider {
  constructor() {
    this.name = 'Pinata';
  }

  async upload(file) {
    console.log(`🔧 Pinata: Starting upload...`);
    console.log(`🔧 Pinata: Token available: ${process.env.PINATA_JWT_TOKEN ? 'Yes' : 'No'}`);
    console.log(`🔧 Pinata: File type: ${typeof file}`);
    console.log(`🔧 Pinata: File content length: ${file.length}`);
    
    const formData = new FormData();
    
    // Convert Buffer to Blob for proper file upload
    const blob = new Blob([file], { type: 'application/octet-stream' });
    formData.append('file', blob, 'sinart-universe.txt');

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
        },
        body: formData
      });

      console.log(`🔧 Pinata: Response status: ${response.status}`);
      console.log(`🔧 Pinata: Response ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`🔧 Pinata: Error response: ${errorText}`);
        throw new Error(`Pinata upload failed: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`🔧 Pinata: Success response:`, result);
      return result.IpfsHash;
    } catch (error) {
      console.log(`🔧 Pinata: Exception:`, error.message);
      throw error;
    }
  }

  async get(cid) {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from Pinata: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid) {
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
class Web3StorageProvider {
  constructor() {
    this.name = 'Web3.Storage';
  }

  async upload(file) {
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

  async get(cid) {
    const response = await fetch(`https://${cid}.ipfs.dweb.link/`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from Web3.Storage: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid) {
    // Web3.Storage automatically pins uploaded content
    console.log(`Content ${cid} is automatically pinned by Web3.Storage`);
  }
}

// NFT.Storage Provider Implementation
class NFTStorageProvider {
  constructor() {
    this.name = 'NFT.Storage';
  }

  async upload(file) {
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

  async get(cid) {
    const response = await fetch(`https://${cid}.ipfs.dweb.link/`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve from NFT.Storage: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async pin(cid) {
    // NFT.Storage automatically pins uploaded content
    console.log(`Content ${cid} is automatically pinned by NFT.Storage`);
  }
}

// Local IPFS Provider Implementation
class LocalIPFSProvider {
  constructor() {
    this.name = 'Local IPFS';
    this.ipfs = localIPFS;
  }

  async upload(file) {
    const result = await this.ipfs.add(file);
    return result.cid.toString();
  }

  async get(cid) {
    const chunks = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async pin(cid) {
    await this.ipfs.pin.add(cid);
  }
}

// Export singleton instance
export const ipfsService = new IPFSService(); 