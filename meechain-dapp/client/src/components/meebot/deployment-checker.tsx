
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Rocket, Settings } from 'lucide-react';

interface DeploymentStatus {
  status: 'ready' | 'not_ready' | 'error';
  message: string;
  readiness: {
    secrets: { ok: boolean; missing: string[]; warnings: string[] };
    smartContracts: { hasAddresses: boolean; tokenContract: boolean; nftContract: boolean; badgeContract: boolean };
    blockchain: { configured: boolean; rpcUrl: boolean; chainId: boolean };
    database: { configured: boolean };
    overall: boolean;
  };
  recommendations: string[];
}

export function DeploymentChecker() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDeploymentStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/deployment-check');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Deployment check failed:', error);
      setStatus({
        status: 'error',
        message: 'ไม่สามารถตรวจสอบสถานะ deployment ได้',
        readiness: {
          secrets: { ok: false, missing: [], warnings: [] },
          smartContracts: { hasAddresses: false, tokenContract: false, nftContract: false, badgeContract: false },
          blockchain: { configured: false, rpcUrl: false, chainId: false },
          database: { configured: false },
          overall: false
        },
        recommendations: ['❌ เกิดข้อผิดพลาดในการตรวจสอบระบบ']
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkDeploymentStatus();
  }, []);

  const getStatusIcon = (isReady: boolean) => {
    return isReady ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500">พร้อม Deploy 🚀</Badge>;
      case 'not_ready':
        return <Badge variant="destructive">ยังไม่พร้อม ⚠️</Badge>;
      default:
        return <Badge variant="secondary">ข้อผิดพลาด ❌</Badge>;
    }
  };

  if (!status) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            กำลังตรวจสอบความพร้อม...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              สถานะความพร้อม Deploy
            </span>
            {getStatusBadge(status.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-lg font-medium">
              {status.message}
            </AlertDescription>
          </Alert>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Secrets Check */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              {getStatusIcon(status.readiness.secrets.ok)}
              <div>
                <h4 className="font-medium">Environment Variables</h4>
                <p className="text-sm text-slate-600">
                  {status.readiness.secrets.ok ? 'ครบถ้วน' : `ขาด ${status.readiness.secrets.missing.length} ตัวแปร`}
                </p>
              </div>
            </div>

            {/* Smart Contracts */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              {getStatusIcon(status.readiness.smartContracts.hasAddresses)}
              <div>
                <h4 className="font-medium">Smart Contracts</h4>
                <p className="text-sm text-slate-600">
                  {status.readiness.smartContracts.hasAddresses ? 'Contract addresses ครบ' : 'ขาด contract addresses'}
                </p>
              </div>
            </div>

            {/* Blockchain Config */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              {getStatusIcon(status.readiness.blockchain.configured)}
              <div>
                <h4 className="font-medium">Blockchain Configuration</h4>
                <p className="text-sm text-slate-600">
                  {status.readiness.blockchain.configured ? 'RPC และ Chain ID ตั้งค่าแล้ว' : 'ขาดการตั้งค่า blockchain'}
                </p>
              </div>
            </div>

            {/* Database */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              {getStatusIcon(status.readiness.database.configured)}
              <div>
                <h4 className="font-medium">Database</h4>
                <p className="text-sm text-slate-600">
                  {status.readiness.database.configured ? 'Database URL ตั้งค่าแล้ว' : 'ขาดการตั้งค่า database'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {status.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 ขั้นตอนที่แนะนำ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {status.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">{index + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={checkDeploymentStatus} disabled={isChecking}>
          {isChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบอีกครั้ง'}
        </Button>
        
        {status.status === 'ready' && (
          <Button className="bg-green-500 hover:bg-green-600" size="lg">
            🚀 พร้อม Deploy แล้ว!
          </Button>
        )}
      </div>
    </div>
  );
}
