import { describe, it, expect } from 'vitest';
import { 
  sinArtDID, 
  resolveDID, 
  authenticateDID, 
  createNFTMetadata, 
  createEmotionalTokenMetadata, 
  createCulturalTokenMetadata 
} from '../packages/blockchain/did-config';

describe('DID Configuration', () => {
  it('verifies SinArt DID configuration', () => {
    expect(sinArtDID.did).toBe('did:key:z6MkjZPce4RZHU1wUnfCepZFJWYb6GyBuqmnapQHMtWVNEz5');
    expect(sinArtDID.name).toBe('SinArt');
    expect(sinArtDID.services).toBeDefined();
    expect(sinArtDID.verificationMethods).toBeDefined();
  });

  it('verifies DID resolution', async () => {
    const resolved = await resolveDID(sinArtDID.did);
    expect(resolved).toBeDefined();
    expect(resolved?.did).toBe(sinArtDID.did);
  });

  it('verifies DID authentication', async () => {
    const authenticated = await authenticateDID(sinArtDID.did, 'test-challenge');
    expect(authenticated).toBe(true);
  });

  it('creates NFT metadata with DID', () => {
    const metadata = createNFTMetadata(sinArtDID.did, {
      name: 'Test Tattoo Design',
      description: 'A beautiful test design',
      image: 'ipfs://QmTestHash'
    });
    
    expect(metadata.creator).toBe(sinArtDID.did);
    expect(metadata.platform).toBe('Sin Art Universe');
    expect(metadata.name).toBe('Test Tattoo Design');
  });

  it('creates emotional token metadata with DID', () => {
    const emotionalData = {
      mood: 'excited',
      intensity: 0.8,
      context: 'getting first tattoo'
    };
    
    const metadata = createEmotionalTokenMetadata(sinArtDID.did, emotionalData);
    
    expect(metadata.type).toBe('EmotionalToken');
    expect(metadata.user).toBe(sinArtDID.did);
    expect(metadata.data).toEqual(emotionalData);
  });

  it('creates cultural token metadata with DID', () => {
    const culturalData = {
      tradition: 'Maori',
      design: 'Koru',
      significance: 'New beginnings'
    };
    
    const metadata = createCulturalTokenMetadata(sinArtDID.did, culturalData);
    
    expect(metadata.type).toBe('CulturalToken');
    expect(metadata.community).toBe(sinArtDID.did);
    expect(metadata.data).toEqual(culturalData);
  });

  it('verifies DID services configuration', () => {
    const services = sinArtDID.services;
    expect(services).toHaveLength(3);
    
    const sinartService = services?.find(s => s.id === 'sinart-universe');
    expect(sinartService?.type).toBe('SinArtUniverse');
    expect(sinartService?.serviceEndpoint).toBe('https://sinartuniverse.com');
    
    const ipfsService = services?.find(s => s.id === 'ipfs-gateway');
    expect(ipfsService?.type).toBe('IPFSGateway');
    expect(ipfsService?.serviceEndpoint).toBe('https://gateway.pinata.cloud');
  });
}); 