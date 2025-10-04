
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SecretsStatus {
  ok: boolean;
  missing: string[];
  warnings: string[];
  status: 'healthy' | 'warning' | 'critical';
  message: string;
}

export function MeeBotSecretsAlert() {
  const [secretsStatus, setSecretsStatus] = useState<SecretsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkSecretsStatus();
  }, []);

  const checkSecretsStatus = async () => {
    try {
      const response = await fetch('/api/secrets/health');
      const result = await response.json();
      
      if (result.success) {
        setSecretsStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to check secrets status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-600 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-blue-300">MeeBot กำลังตรวจสอบระบบ...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!secretsStatus || secretsStatus.status === 'healthy') {
    return (
      <Card className="bg-green-500/10 border-green-500/30 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-green-300 font-medium">🤖 MeeBot: ระบบพร้อมลุย!</p>
              <p className="text-green-200 text-sm">Secrets configuration ครบถ้วนทุกตัวครับ ✨</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    switch (secretsStatus.status) {
      case 'critical': return 'red';
      case 'warning': return 'yellow';
      default: return 'green';
    }
  };

  const color = getStatusColor();

  return (
    <Card className={`bg-${color}-500/10 border-${color}-500/30 mb-4`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-${color}-500/20 rounded-full flex items-center justify-center`}>
              <AlertTriangle className={`w-4 h-4 text-${color}-400`} />
            </div>
            <div className="flex-1">
              <p className={`text-${color}-300 font-medium`}>🤖 MeeBot แจ้งเตือน:</p>
              <p className={`text-${color}-200 text-sm`}>{secretsStatus.message}</p>
            </div>
            <Badge variant="outline" className={`border-${color}-500/50 text-${color}-300`}>
              {secretsStatus.status}
            </Badge>
          </div>

          {(secretsStatus.missing.length > 0 || secretsStatus.warnings.length > 0) && (
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className={`text-${color}-300 hover:bg-${color}-500/20`}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
              </Button>

              {showDetails && (
                <div className="space-y-3 pt-2 border-t border-slate-600">
                  {secretsStatus.missing.length > 0 && (
                    <div>
                      <p className="text-red-300 font-medium text-sm mb-2">🔑 Secrets ที่จำเป็น (ขาดหาย):</p>
                      <ul className="space-y-1">
                        {secretsStatus.missing.map((key) => (
                          <li key={key} className="text-red-200 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            {key}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {secretsStatus.warnings.length > 0 && (
                    <div>
                      <p className="text-yellow-300 font-medium text-sm mb-2">⚠️ Secrets เสริม (แนะนำให้ตั้ง):</p>
                      <ul className="space-y-1">
                        {secretsStatus.warnings.map((key) => (
                          <li key={key} className="text-yellow-200 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            {key}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={`bg-${color}-500/10 rounded-lg p-3 mt-3`}>
                    <p className={`text-${color}-300 text-sm font-medium mb-1`}>💡 MeeBot แนะนำ:</p>
                    <p className={`text-${color}-200 text-sm`}>
                      {secretsStatus.status === 'critical' 
                        ? "รีบไปตั้งค่า Secrets ใน Replit กันเถอะ! ไม่งั้น MeeBot จะงอนนะครับ 😤"
                        : "ตั้ง optional secrets เพิ่มจะทำให้ฟีเจอร์ครบครันขึ้นนะครับ! 🌟"
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
