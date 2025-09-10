
export interface SecretCheckResult {
  ok: boolean;
  missing: string[];
  warnings: string[];
  status: 'healthy' | 'warning' | 'critical';
}

export const REQUIRED_SECRETS = [
  'VITE_TOKEN_CONTRACT_ADDRESS',
  'VITE_NFT_CONTRACT_ADDRESS', 
  'VITE_FUSE_RPC_URL',
  'VITE_CHAIN_ID',
  'DATABASE_URL',
  'NODE_ENV'
];

export const OPTIONAL_SECRETS = [
  'VITE_CUSTOM_TOKEN_ADDRESS',
  'PINATA_API_KEY',
  'PINATA_SECRET_KEY',
  'SESSION_SECRET'
];

export function checkSecrets(): SecretCheckResult {
  const missing = REQUIRED_SECRETS.filter(key => !process.env[key]);
  const warnings = OPTIONAL_SECRETS.filter(key => !process.env[key]);
  
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (missing.length > 0) {
    status = 'critical';
  } else if (warnings.length > 0) {
    status = 'warning';
  }
  
  return {
    ok: missing.length === 0,
    missing,
    warnings,
    status
  };
}

export function getSecretsStatusMessage(result: SecretCheckResult): string {
  if (result.status === 'healthy') {
    return "🎉 ระบบพร้อมลุย! Secrets ครบถ้วนทุกตัว";
  } else if (result.status === 'warning') {
    return `⚠️ พบ ${result.warnings.length} optional secrets ที่ยังไม่ได้ตั้งค่า`;
  } else {
    return `🚨 พบปัญหาเร่งด่วน! ขาด ${result.missing.length} secrets สำคัญ`;
  }
}
