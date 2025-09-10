
import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Send, 
  ArrowLeft, 
  Coins,
  Trophy,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface EarningActivity {
  date: string;
  activity: string;
  amount: string;
  token: string;
  status: string;
}

interface EarningSummary {
  total: Record<string, string>;
  today: Record<string, string>;
}

export default function Earnings() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user from localStorage
  const userStr = localStorage.getItem("meechain_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { data: summary } = useQuery<EarningSummary>({
    queryKey: ['/api/earnings/summary'],
    queryFn: async () => {
      const response = await fetch('/api/earnings/summary', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch earnings summary');
      return response.json();
    },
  });

  const { data: history = [] } = useQuery<EarningActivity[]>({
    queryKey: ['/api/earnings/history'],
    queryFn: async () => {
      const response = await fetch('/api/earnings/history', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch earnings history');
      return response.json();
    },
  });

  const { data: tierStatus } = useQuery({
    queryKey: ['/api/user-tier/status'],
    queryFn: async () => {
      const response = await fetch('/api/user-tier/status', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch tier status');
      return response.json();
    },
  });

  const transferMutation = useMutation({
    mutationFn: async ({ token, amount }: { token: string; amount: string }) => {
      const response = await fetch('/api/earnings/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          walletAddress: '0x123...', // This should come from user's wallet
          token,
          amount,
        }),
      });
      if (!response.ok) throw new Error('Transfer failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "โอนสำเร็จ!",
        description: `รายได้ถูกโอนเข้ากระเป๋าหลักแล้ว`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/earnings/summary'] });
    },
    onError: (error) => {
      toast({
        title: "ไม่สามารถโอนได้",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-300"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-blue-300">รายได้และรางวัล</h1>
        <div className="w-8"></div>
      </nav>

      <div className="px-6 pb-6 space-y-6">
        {/* User Tier Status */}
        {tierStatus && (
          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Trophy className="w-5 h-5" />
                ระดับผู้ใช้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {tierStatus.tier}
                  </Badge>
                  <p className="text-sm text-slate-400 mt-1">
                    ถัดไป: {tierStatus.nextTier}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {tierStatus.progress.missionsCompleted}/{tierStatus.progress.required}
                  </div>
                  <p className="text-xs text-slate-400">ภารกิจ</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-300">สิทธิพิเศษปัจจุบัน:</p>
                <div className="flex flex-wrap gap-2">
                  {tierStatus.rewardsUnlocked.map((reward: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-green-500/30 text-green-300">
                      <Gift className="w-3 h-3 mr-1" />
                      {reward}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Earnings Summary */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-300">
              <TrendingUp className="w-5 h-5" />
              สรุปรายได้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2">รายได้รวม</h3>
                <div className="space-y-1">
                  {summary?.total && Object.entries(summary.total).map(([token, amount]) => (
                    <div key={token} className="flex justify-between">
                      <span className="text-slate-300">{token}</span>
                      <span className="font-mono text-blue-300">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2">วันนี้</h3>
                <div className="space-y-1">
                  {summary?.today && Object.entries(summary.today).map(([token, amount]) => (
                    <div key={token} className="flex justify-between">
                      <span className="text-slate-300">{token}</span>
                      <span className="font-mono text-green-300">+{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-600/50">
              <div className="grid grid-cols-2 gap-2">
                {summary?.total && Object.entries(summary.total).map(([token, amount]) => (
                  <Button
                    key={token}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => transferMutation.mutate({ token, amount })}
                    disabled={transferMutation.isPending || parseFloat(amount) <= 0}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    โอน {token}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings History */}
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-300">
              <Calendar className="w-5 h-5" />
              ประวัติรายได้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.length > 0 ? (
                history.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{activity.activity}</div>
                        <div className="text-sm text-slate-400">{activity.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono text-green-300">
                        +{activity.amount} {activity.token}
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status === 'completed' ? 'เสร็จแล้ว' : activity.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>ยังไม่มีประวัติรายได้</p>
                  <p className="text-sm">เริ่มทำภารกิจเพื่อรับรางวัล</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-16 text-slate-300"
            onClick={() => navigate('/missions')}
          >
            <div className="text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">ภารกิจ</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 h-16 text-slate-300"
            onClick={() => navigate('/faucet')}
          >
            <div className="text-center">
              <Gift className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Faucet</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
