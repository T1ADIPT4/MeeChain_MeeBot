/**
 * Tests for IPFS Uploader
 * Validates uploader structure and milestone completion
 */

import * as fs from 'fs'
import * as path from 'path'

describe('IPFS Uploader - Structure', () => {
  const basePath = path.join(process.cwd(), 'copilot')
  
  test('should have ipfs-uploader directory', () => {
    const uploaderPath = path.join(basePath, 'ipfs-uploader')
    expect(fs.existsSync(uploaderPath)).toBe(true)
  })

  test('should have index.js main uploader file', () => {
    const indexPath = path.join(basePath, 'ipfs-uploader', 'index.js')
    expect(fs.existsSync(indexPath)).toBe(true)
    
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('uploadToIPFS')
    expect(content).toContain('uploadBatch')
    expect(content).toContain('MeeBot')
  })

  test('should have config.js with fallback-aware settings', () => {
    const configPath = path.join(basePath, 'ipfs-uploader', 'config.js')
    expect(fs.existsSync(configPath)).toBe(true)
    
    const content = fs.readFileSync(configPath, 'utf-8')
    expect(content).toContain('getConfig')
    expect(content).toContain('updateConfig')
    expect(content).toContain('useFallback')
    expect(content).toContain('ipfsEndpoint')
    expect(content).toContain('fallbackStorage')
  })

  test('should have metadata-generator.js for NFT metadata', () => {
    const metadataPath = path.join(basePath, 'ipfs-uploader', 'metadata-generator.js')
    expect(fs.existsSync(metadataPath)).toBe(true)
    
    const content = fs.readFileSync(metadataPath, 'utf-8')
    expect(content).toContain('generateMetadata')
    expect(content).toContain('validateMetadata')
    expect(content).toContain('ERC721')
  })

  test('should have fallback-viewer.js', () => {
    const viewerPath = path.join(basePath, 'ipfs-uploader', 'fallback-viewer.js')
    expect(fs.existsSync(viewerPath)).toBe(true)
    
    const content = fs.readFileSync(viewerPath, 'utf-8')
    expect(content).toContain('getViewerURL')
    expect(content).toContain('getAssetWithFallback')
    expect(content).toContain('generateHTMLViewer')
  })

  test('should have utils/validate.js for file validation', () => {
    const validatePath = path.join(basePath, 'ipfs-uploader', 'utils', 'validate.js')
    expect(fs.existsSync(validatePath)).toBe(true)
    
    const content = fs.readFileSync(validatePath, 'utf-8')
    expect(content).toContain('validateFile')
    expect(content).toContain('validateBatch')
  })
})

describe('IPFS Uploader - Assets Directories', () => {
  const assetsPath = path.join(process.cwd(), 'copilot', 'assets')
  
  test('should have assets directory', () => {
    expect(fs.existsSync(assetsPath)).toBe(true)
  })

  test('should have badges directory', () => {
    const badgesPath = path.join(assetsPath, 'badges')
    expect(fs.existsSync(badgesPath)).toBe(true)
  })

  test('should have fallback directory', () => {
    const fallbackPath = path.join(assetsPath, 'fallback')
    expect(fs.existsSync(fallbackPath)).toBe(true)
  })

  test('should have README in badges directory', () => {
    const readmePath = path.join(assetsPath, 'badges', 'README.md')
    expect(fs.existsSync(readmePath)).toBe(true)
  })

  test('should have README in fallback directory', () => {
    const readmePath = path.join(assetsPath, 'fallback', 'README.md')
    expect(fs.existsSync(readmePath)).toBe(true)
  })
})

describe('IPFS Uploader - Documentation', () => {
  const uploaderPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader')
  
  test('should have README.md', () => {
    const readmePath = path.join(uploaderPath, 'README.md')
    expect(fs.existsSync(readmePath)).toBe(true)
    
    const content = fs.readFileSync(readmePath, 'utf-8')
    expect(content).toContain('IPFS Uploader')
    expect(content).toContain('Fallback')
    expect(content).toContain('MeeBot')
  })
})

describe('IPFS Uploader - Milestone Tracking', () => {
  const milestonePath = path.join(process.cwd(), 'copilot', 'MILESTONES.md')
  
  test('should have MILESTONES.md file', () => {
    expect(fs.existsSync(milestonePath)).toBe(true)
  })

  test('should track M1: Init IPFS Uploader milestone', () => {
    const content = fs.readFileSync(milestonePath, 'utf-8')
    expect(content).toContain('M1: Init IPFS Uploader')
    expect(content).toContain('Uploader scaffolded')
  })

  test('should mention MeeBot sprite feedback', () => {
    const content = fs.readFileSync(milestonePath, 'utf-8')
    expect(content).toContain('MeeBot')
    expect(content).toContain('Sprite Feedback')
  })

  test('should list all 5 milestones', () => {
    const content = fs.readFileSync(milestonePath, 'utf-8')
    expect(content).toContain('M1:')
    expect(content).toContain('M2:')
    expect(content).toContain('M3:')
    expect(content).toContain('M4:')
    expect(content).toContain('M5:')
  })

  test('should have safety checklist', () => {
    const content = fs.readFileSync(milestonePath, 'utf-8')
    expect(content).toContain('Safety Checklist')
  })
})

describe('IPFS Uploader - Integration with MeeBot', () => {
  const indexPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader', 'index.js')
  
  test('should integrate MeeBot for sprite feedback', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('MeeBot.setSprite')
    expect(content).toContain('MeeBot.speak')
  })

  test('should use loading sprite during upload', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain("setSprite('loading')")
  })

  test('should use happy sprite on success', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain("setSprite('happy')")
  })

  test('should use confused sprite for fallback', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain("setSprite('confused')")
  })

  test('should have Thai language TTS messages', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('กำลังอัปโหลด')
    expect(content).toContain('สำเร็จ')
  })
})

describe('IPFS Uploader - Metadata Standards', () => {
  const metadataPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader', 'metadata-generator.js')
  
  test('should follow ERC721 standard', () => {
    const content = fs.readFileSync(metadataPath, 'utf-8')
    expect(content).toContain('ERC721')
    expect(content).toContain('name')
    expect(content).toContain('description')
    expect(content).toContain('image')
    expect(content).toContain('attributes')
  })

  test('should include NFT marketplace fields', () => {
    const content = fs.readFileSync(metadataPath, 'utf-8')
    expect(content).toContain('external_url')
    expect(content).toContain('trait_type')
  })

  test('should support fallback metadata flag', () => {
    const content = fs.readFileSync(metadataPath, 'utf-8')
    expect(content).toContain('isFallback')
  })
})

describe('IPFS Uploader - Fallback Support', () => {
  const configPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader', 'config.js')
  const indexPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader', 'index.js')
  const viewerPath = path.join(process.cwd(), 'copilot', 'ipfs-uploader', 'fallback-viewer.js')
  
  test('should have fallback configuration options', () => {
    const content = fs.readFileSync(configPath, 'utf-8')
    expect(content).toContain('useFallback')
    expect(content).toContain('fallbackStorage')
    expect(content).toContain('fallbackGateway')
  })

  test('should implement fallback upload logic', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('uploadToFallback')
    expect(content).toContain('simulateFallbackUpload')
  })

  test('should provide redundant gateway support', () => {
    const content = fs.readFileSync(viewerPath, 'utf-8')
    expect(content).toContain('getRedundantGateways')
    expect(content).toContain('cloudflare-ipfs')
    expect(content).toContain('pinata')
  })
})

describe('IPFS Uploader - Example Demo', () => {
  const demoPath = path.join(process.cwd(), 'examples', 'ipfs-uploader-demo.js')
  
  test('should have example demo file', () => {
    expect(fs.existsSync(demoPath)).toBe(true)
  })

  test('should demonstrate all key features', () => {
    const content = fs.readFileSync(demoPath, 'utf-8')
    expect(content).toContain('Configuration')
    expect(content).toContain('Metadata Generation')
    expect(content).toContain('Fallback')
    expect(content).toContain('MeeBot')
  })
})

