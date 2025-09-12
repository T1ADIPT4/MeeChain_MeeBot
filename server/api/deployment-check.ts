
import { Request, Response } from 'express';
import { checkSecrets, getSecretsStatusMessage } from '../utils/secrets-checker';

export async function checkDeploymentReadiness(req: Request, res: Response) {
  try {
    const secretsCheck = checkSecrets();
    
    // Check smart contract requirements
    const hasContractAddresses = !!(
      process.env.VITE_TOKEN_CONTRACT_ADDRESS &&
      process.env.VITE_NFT_CONTRACT_ADDRESS &&
      process.env.VITE_BADGE_CONTRACT_ADDRESS
    );

    // Check blockchain configuration
    const hasBlockchainConfig = !!(
      process.env.VITE_FUSE_RPC_URL &&
      process.env.VITE_CHAIN_ID
    );

    const deploymentReadiness = {
      secrets: secretsCheck,
      smartContracts: {
        hasAddresses: hasContractAddresses,
        tokenContract: !!process.env.VITE_TOKEN_CONTRACT_ADDRESS,
        nftContract: !!process.env.VITE_NFT_CONTRACT_ADDRESS,
        badgeContract: !!process.env.VITE_BADGE_CONTRACT_ADDRESS,
      },
      blockchain: {
        configured: hasBlockchainConfig,
        rpcUrl: !!process.env.VITE_FUSE_RPC_URL,
        chainId: !!process.env.VITE_CHAIN_ID,
      },
      database: {
        configured: !!process.env.DATABASE_URL,
      },
      overall: secretsCheck.ok && hasContractAddresses && hasBlockchainConfig
    };

    const status = deploymentReadiness.overall ? 'ready' : 'not_ready';
    const message = getSecretsStatusMessage(secretsCheck);

    res.json({
      status,
      message,
      readiness: deploymentReadiness,
      recommendations: generateRecommendations(deploymentReadiness)
    });

  } catch (error) {
    console.error('Deployment check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถตรวจสอบสถานะการ deploy ได้',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function generateRecommendations(readiness: any): string[] {
  const recommendations: string[] = [];

  if (!readiness.secrets.ok) {
    recommendations.push('🔑 ตั้งค่า Secrets ที่ขาดหายไปใน Replit Secrets tool');
  }

  if (!readiness.smartContracts.hasAddresses) {
    recommendations.push('📜 Deploy smart contracts และเพิ่ม contract addresses ใน Secrets');
  }

  if (!readiness.blockchain.configured) {
    recommendations.push('🌐 ตั้งค่า RPC URL และ Chain ID สำหรับ Fuse Network');
  }

  if (readiness.overall) {
    recommendations.push('🚀 ระบบพร้อม deploy แล้ว! คลิก Deploy button ได้เลย');
  }

  return recommendations;
}
