#!/usr/bin/env node

/**
 * Sin Art Universe - IPFS Publishing Script (Phase 3)
 * Uses Pinata API for IPFS publishing
 */

import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function publishToIPFS() {
  try {
    console.log('🚀 Sin Art Universe - IPFS Publishing (Phase 3)');
    console.log('📦 Using Pinata IPFS service...\n');

    // Debug environment variables
    console.log('🔍 Environment Variables:');
    console.log(`   PINATA_API_KEY: ${process.env.PINATA_API_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

    const files = [
      { path: 'docs/specs/phase-003.md', content: await readFile('docs/specs/phase-003.md') },
      { path: 'apps/web/public/logo.png', content: await readFile('apps/web/public/logo.png') }
    ];

    const results = [];
    
    for (const file of files) {
      console.log(`📤 Uploading ${file.path} to Pinata IPFS...`);
      
      // Use Pinata API directly
      const formData = new FormData();
      const blob = new Blob([file.content], { type: 'text/markdown' });
      formData.append('file', blob, file.path.split('/').pop());

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
        throw new Error(`Pinata upload failed for ${file.path}: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Upload successful for ${file.path}!`);
      console.log(`🔗 Pinata IPFS CID: ${result.IpfsHash}`);
      console.log(`🌐 Access URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
      
      results.push({ path: file.path, cid: result.IpfsHash });
    }
    
    console.log('\n🎉 Phase 3 IPFS publishing completed!');
    console.log('📝 Pinata IPFS integration working with phase-003.md and logo.png');
    
    return results;
  } catch (error) {
    console.error('❌ Pinata IPFS Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   • Check your PINATA_API_KEY environment variable');
    console.log('   • Ensure phase-003.md exists in docs/specs/');
    console.log('   • Ensure logo.png exists in apps/web/public/');
    console.log('   • Verify Pinata API key is valid');
    throw error;
  }
}

publishToIPFS().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 