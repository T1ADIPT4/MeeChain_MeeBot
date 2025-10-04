
import { Request, Response } from 'express';
import { checkSecrets, getSecretsStatusMessage } from '../utils/secrets-checker';

export async function getSecretsHealth(req: Request, res: Response) {
  try {
    const result = checkSecrets();
    const message = getSecretsStatusMessage(result);
    
    res.json({
      success: true,
      data: {
        ...result,
        message,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Secrets health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check secrets health'
    });
  }
}

export async function getDetailedSecretsReport(req: Request, res: Response) {
  try {
    const result = checkSecrets();
    
    // ไม่แสดงค่าจริงของ secrets เพื่อความปลอดภัย
    const secretsReport = {
      required: result.missing.length === 0 ? 'All set ✅' : `Missing ${result.missing.length} keys`,
      optional: result.warnings.length === 0 ? 'All set ✅' : `Missing ${result.warnings.length} keys`,
      missingRequired: result.missing.map(key => ({ key, status: 'missing' })),
      missingOptional: result.warnings.map(key => ({ key, status: 'missing' }))
    };
    
    res.json({
      success: true,
      data: {
        status: result.status,
        message: getSecretsStatusMessage(result),
        report: secretsReport,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Detailed secrets report failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate secrets report'
    });
  }
}
