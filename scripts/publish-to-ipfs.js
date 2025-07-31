#!/usr/bin/env node

/**
 * Sin Art Universe - IPFS Publishing Script (Phase 2)
 * Uses Pinata API for IPFS publishing
 */

import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function publishToIPFS() {
  try {
    console.log('🚀 Sin Art Universe - IPFS Publishing (Phase 2)');
    console.log('📦 Using Pinata IPFS service...\n');

    // Debug environment variables
    console.log('🔍 Environment Variables:');
    console.log(`   PINATA_API_KEY: ${process.env.PINATA_API_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

    // Read and publish phase-002.md
    const file = await readFile('docs/specs/phase-002.md');
    console.log('📤 Uploading phase-002.md to Pinata IPFS...');
    
    // Use Pinata API directly
    const formData = new FormData();
    const blob = new Blob([file], { type: 'text/markdown' });
    formData.append('file', blob, 'phase-002.md');

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`🔧 Pinata: Response status: ${response.status}`);
      console.log(`🔧 Pinata: Error response: ${errorText}`);
      throw new Error(`Pinata upload failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Upload successful!`);
    console.log(`🔗 Pinata IPFS CID: ${result.IpfsHash}`);
    console.log(`🌐 Access URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    
    // Test retrieval
    console.log('\n📥 Testing retrieval...');
    try {
      const retrieveResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
      if (retrieveResponse.ok) {
        const content = await retrieveResponse.text();
        console.log(`✅ Retrieval successful! Content length: ${content.length} characters`);
        console.log(`📄 First 100 chars: ${content.substring(0, 100)}...`);
      } else {
        console.log(`⚠️ Retrieval test failed: ${retrieveResponse.statusText}`);
      }
    } catch (retrievalError) {
      console.log(`⚠️ Retrieval test failed: ${retrievalError.message}`);
    }
    
    console.log('\n🎉 Phase 2 IPFS publishing completed!');
    console.log('📝 Pinata IPFS integration working with phase-002.md');
    
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ Pinata IPFS Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   • Check your PINATA_API_KEY environment variable');
    console.log('   • Ensure phase-002.md exists in docs/specs/');
    console.log('   • Verify Pinata API key is valid');
    throw error;
  }
}

publishToIPFS().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 