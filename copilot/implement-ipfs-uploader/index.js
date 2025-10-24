const fs = require('fs');
const path = require('path');
const { uploadToIPFS } = require('./ipfs-client');
const metadata = require('./metadata-generator');

const badgePath = './assets/badge.svg';
const fallbackCID = 'QmFallbackCID123';

async function main() {
  try {
    const cid = await uploadToIPFS(badgePath);
    console.log(`✅ Badge uploaded: ${cid}`);
    metadata.generate(cid);
  } catch (err) {
    console.warn(`⚠️ Upload failed, using fallback CID: ${fallbackCID}`);
    metadata.generate(fallbackCID);
  }
}

main();
