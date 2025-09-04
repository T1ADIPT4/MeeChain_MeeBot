import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import { th } from 'date-fns/locale';
import logoUrl from '@assets/branding/logo.png';

export default function TransactionHistory() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch transaction history
  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['/api/wallet/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/transactions', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    },
  });

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({
        title: "คัดลอกแล้ว",
        description: "Transaction hash ถูกคัดลอกแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอก hash ได้",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        กำลังโหลด...
      </div>
    );
  }

  const transactions = transactionData?.transactions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="MeeChain" className="w-8 h-8" />
          <h1 className="text-xl font-bold">ประวัติธุรกรรม</h1>
        </div>
      </div>

      <div className="px-6 pb-6">
        {transactions.length === 0 ? (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">ยังไม่มีธุรกรรม</h3>
              <p className="text-muted-foreground mb-6">
                เมื่อคุณทำธุรกรรม ประวัติจะแสดงที่นี่
              </p>
              <Button
                onClick={() => navigate('/faucet')}
                className="bg-gradient-to-r from-green-500 to-blue-500"
                data-testid="button-get-tokens"
              >
                รับโทเค็นฟรี
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <Card key={tx.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Transaction Type Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.type === 'receive' ? 
                        <ArrowDownLeft className="w-5 h-5" /> : 
                        <ArrowUpRight className="w-5 h-5" />
                      }
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {tx.type === 'receive' ? 'รับ' : 'ส่ง'} {tx.token}
                            </span>
                            <Badge 
                              variant={tx.status === 'completed' ? 'default' : 'secondary'}
                              className={tx.status === 'completed' ? 'bg-green-500/20 text-green-300' : ''}
                            >
                              {tx.status === 'completed' ? 'สำเร็จ' : 'รอดำเนินการ'}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            <div>จาก: {tx.from}</div>
                            <div>ถึง: {tx.to}</div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {formatDistance(new Date(tx.timestamp), new Date(), { 
                              locale: th,
                              addSuffix: true 
                            })}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Hash */}
                      {tx.hash && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Hash:</span>
                            <code className="text-xs font-mono bg-white/10 px-2 py-1 rounded flex-1">
                              {tx.hash}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyHash(tx.hash)}
                              data-testid={`button-copy-${tx.id}`}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://polygonscan.com/tx/${tx.hash}`, '_blank')}
                              data-testid={`button-view-${tx.id}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}