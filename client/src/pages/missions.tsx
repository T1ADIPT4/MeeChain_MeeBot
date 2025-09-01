import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Gift, Coins } from "lucide-react";
import { Link } from "wouter";

interface Mission {
  missionId: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "claimed";
  reward: {
    type: string;
    amount: string;
    token: string | null;
  };
  completedAt?: string;
  claimedAt?: string;
}

interface TokenBalance {
  id: string;
  balance: string;
  totalEarned: string;
  lastFaucetClaim?: string;
  token: {
    symbol: string;
    name: string;
    address: string;
    chainId: string;
    decimals: string;
    logoUri?: string;
  };
}

export default function Missions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user from localStorage (from onboarding)
  const userStr = localStorage.getItem("meechain_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { data: missions = [], isLoading: loadingMissions } = useQuery({
    queryKey: ["/api/missions/list", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/missions/list?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch missions");
      return response.json();
    },
  });

  const { data: balances = [], isLoading: loadingBalances } = useQuery({
    queryKey: ["/api/balances", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/balances/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch balances");
      return response.json();
    },
  });

  const { data: tokens = [] } = useQuery({
    queryKey: ["/api/tokens"],
    queryFn: async () => {
      const response = await fetch("/api/tokens");
      if (!response.ok) throw new Error("Failed to fetch tokens");
      return response.json();
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const response = await apiRequest("POST", "/api/missions/claim", {
        userId: user.id,
        missionId,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "รับรางวัลสำเร็จ!",
        description: `ได้รับ ${data.reward?.amount} ${data.reward?.token}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/missions/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
    },
    onError: (error) => {
      toast({
        title: "ไม่สามารถรับรางวัลได้",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const faucetMutation = useMutation({
    mutationFn: async (token: any) => {
      const response = await apiRequest("POST", "/api/faucet/request", {
        userId: user.id,
        tokenAddress: token.address,
        chainId: token.chainId,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Faucet request failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "รับเหรียญทดลองสำเร็จ!",
        description: `ได้รับ ${parseFloat(data.amount) / Math.pow(10, 18)} ${data.token}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
    },
    onError: (error) => {
      toast({
        title: "ไม่สามารถรับเหรียญทดลองได้",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "claimed":
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "เสร็จสิ้น";
      case "claimed":
        return "รับรางวัลแล้ว";
      default:
        return "รอดำเนินการ";
    }
  };

  const formatBalance = (balance: string, decimals: string) => {
    const divisor = Math.pow(10, parseInt(decimals));
    return (parseFloat(balance) / divisor).toFixed(4);
  };

  const completedMissions = missions.filter((m: Mission) => m.status === "completed" || m.status === "claimed");
  const progressPercentage = (completedMissions.length / Math.max(missions.length, 1)) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-white mb-4">กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
            <Link to="/">
              <Button>กลับหน้าหลัก</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ภารกิจ & รางวัล</h1>
            <p className="text-purple-200">ทำภารกิจเพื่อรับรางวัลและเหรียญฟรี</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20">
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>

        {/* Progress Overview */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              ความคืบหน้าภารกิจ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">
                  เสร็จสิ้น {completedMissions.length} จาก {missions.length} ภารกิจ
                </span>
                <span className="text-purple-200">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Missions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">รายการภารกิจ</h2>
            {loadingMissions ? (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <p className="text-purple-200">กำลังโหลด...</p>
                </CardContent>
              </Card>
            ) : (
              missions.map((mission: Mission) => (
                <Card key={mission.missionId} className="bg-black/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-white text-lg">{mission.title}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {mission.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={mission.status === "completed" ? "default" : mission.status === "claimed" ? "secondary" : "outline"}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(mission.status)}
                        {getStatusText(mission.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-purple-200">
                        <Coins className="h-4 w-4" />
                        รางวัล: {mission.reward.amount} {mission.reward.token}
                      </div>
                      {mission.status === "completed" && !mission.claimedAt && (
                        <Button
                          size="sm"
                          onClick={() => claimMutation.mutate(mission.missionId)}
                          disabled={claimMutation.isPending}
                          data-testid={`button-claim-${mission.missionId}`}
                        >
                          {claimMutation.isPending ? "กำลังรับ..." : "รับรางวัล"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Token Balances & Faucet */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">ยอดคงเหลือ & Faucet</h2>
            
            {/* Token Balances */}
            {loadingBalances ? (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <p className="text-purple-200">กำลังโหลด...</p>
                </CardContent>
              </Card>
            ) : balances.length > 0 ? (
              balances.map((balance: TokenBalance) => (
                <Card key={balance.id} className="bg-black/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{balance.token.symbol}</h3>
                        <p className="text-sm text-purple-200">{balance.token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white" data-testid={`balance-${balance.token.symbol}`}>
                          {formatBalance(balance.balance, balance.token.decimals)}
                        </p>
                        <p className="text-xs text-purple-200">
                          รวมได้รับ: {formatBalance(balance.totalEarned, balance.token.decimals)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-purple-200 mb-4">ยังไม่มียอดคงเหลือ</p>
                  <p className="text-sm text-purple-300">เริ่มทำภารกิจหรือใช้ Faucet เพื่อรับเหรียญฟรี</p>
                </CardContent>
              </Card>
            )}

            {/* Faucet Section */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">รับเหรียญฟรี (Faucet)</CardTitle>
                <CardDescription className="text-purple-200">
                  รับเหรียญทดลองฟรี 5 เหรียญต่อวัน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokens.map((token: any) => (
                  <div key={token.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-sm text-purple-200">{token.name}</p>
                      {token.chainId === "122" && (
                        <Badge variant="outline" className="text-xs mt-1">Fuse Network</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => faucetMutation.mutate(token)}
                      disabled={faucetMutation.isPending}
                      className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
                      data-testid={`button-faucet-${token.symbol}`}
                    >
                      {faucetMutation.isPending ? "กำลังรับ..." : "รับฟรี"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}