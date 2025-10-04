import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Award, Coins, Trophy, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface MintBadgeForm {
  recipientAddress: string;
  badgeName: string;
  badgeDescription: string;
  badgeType: 'PRODUCTIVITY' | 'EXPLORER' | 'SOCIALIZER' | 'ACHIEVER' | 'SPECIAL';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  power: string;
  powerBoost: number;
  tokenURI: string;
}

interface MintTokenForm {
  recipientAddress: string;
  amount: number;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('badge');

  const [badgeForm, setBadgeForm] = useState<MintBadgeForm>({
    recipientAddress: '',
    badgeName: '',
    badgeDescription: '',
    badgeType: 'PRODUCTIVITY',
    rarity: 'COMMON',
    power: 'XP Boost',
    powerBoost: 10,
    tokenURI: ''
  });

  const [tokenForm, setTokenForm] = useState<MintTokenForm>({
    recipientAddress: '',
    amount: 100
  });

  const { data: authData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/contracts/authorizations']
  });

  const mintBadgeMutation = useMutation({
    mutationFn: async (data: MintBadgeForm) => {
      return apiRequest('POST', '/api/badge/mint', data);
    },
    onSuccess: () => {
      toast({
        title: '✅ Badge Minted!',
        description: `Badge "${badgeForm.badgeName}" has been minted successfully!`
      });
      setBadgeForm({
        recipientAddress: '',
        badgeName: '',
        badgeDescription: '',
        badgeType: 'PRODUCTIVITY',
        rarity: 'COMMON',
        power: 'XP Boost',
        powerBoost: 10,
        tokenURI: ''
      });
    },
    onError: (error) => {
      toast({
        title: '❌ Minting Failed',
        description: error instanceof Error ? error.message : 'Failed to mint badge',
        variant: 'destructive'
      });
    }
  });

  const mintTokenMutation = useMutation({
    mutationFn: async (data: MintTokenForm) => {
      return apiRequest('POST', '/api/token/mint', data);
    },
    onSuccess: () => {
      toast({
        title: '✅ Tokens Minted!',
        description: `${tokenForm.amount} MEE tokens sent to ${tokenForm.recipientAddress}`
      });
      setTokenForm({
        recipientAddress: '',
        amount: 100
      });
    },
    onError: (error) => {
      toast({
        title: '❌ Minting Failed',
        description: error instanceof Error ? error.message : 'Failed to mint tokens',
        variant: 'destructive'
      });
    }
  });

  const handleMintBadge = () => {
    if (!badgeForm.recipientAddress || !badgeForm.badgeName) {
      toast({
        title: '⚠️ Missing Information',
        description: 'Please provide recipient address and badge name',
        variant: 'destructive'
      });
      return;
    }
    mintBadgeMutation.mutate(badgeForm);
  };

  const handleMintToken = () => {
    if (!tokenForm.recipientAddress || tokenForm.amount <= 0) {
      toast({
        title: '⚠️ Invalid Input',
        description: 'Please provide valid recipient address and amount',
        variant: 'destructive'
      });
      return;
    }
    mintTokenMutation.mutate(tokenForm);
  };

  const authStatus = authData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400">Manage badges, tokens, and contract authorizations</p>
        </div>

        {authStatus && !authStatus.isReady && (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-300 mb-1">⚠️ Authorization Issues Detected</h3>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    {authStatus.issues.map((issue: string, index: number) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="badge" data-testid="tab-mint-badge">
              <Award className="w-4 h-4 mr-2" />
              Mint Badge
            </TabsTrigger>
            <TabsTrigger value="token" data-testid="tab-mint-token">
              <Coins className="w-4 h-4 mr-2" />
              Mint Tokens
            </TabsTrigger>
            <TabsTrigger value="auth" data-testid="tab-authorizations">
              <Shield className="w-4 h-4 mr-2" />
              Authorizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badge">
            <Card className="bg-slate-800/80 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Mint Badge NFT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Address *</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={badgeForm.recipientAddress}
                    onChange={(e) => setBadgeForm({ ...badgeForm, recipientAddress: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    data-testid="input-badge-recipient"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="badgeName">Badge Name *</Label>
                    <Input
                      id="badgeName"
                      placeholder="Early Adopter"
                      value={badgeForm.badgeName}
                      onChange={(e) => setBadgeForm({ ...badgeForm, badgeName: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      data-testid="input-badge-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badgeType">Badge Type</Label>
                    <Select
                      value={badgeForm.badgeType}
                      onValueChange={(value: any) => setBadgeForm({ ...badgeForm, badgeType: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="select-badge-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                        <SelectItem value="EXPLORER">Explorer</SelectItem>
                        <SelectItem value="SOCIALIZER">Socializer</SelectItem>
                        <SelectItem value="ACHIEVER">Achiever</SelectItem>
                        <SelectItem value="SPECIAL">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Awarded to early platform adopters"
                    value={badgeForm.badgeDescription}
                    onChange={(e) => setBadgeForm({ ...badgeForm, badgeDescription: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    data-testid="input-badge-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select
                      value={badgeForm.rarity}
                      onValueChange={(value: any) => setBadgeForm({ ...badgeForm, rarity: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="select-badge-rarity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMMON">Common</SelectItem>
                        <SelectItem value="RARE">Rare</SelectItem>
                        <SelectItem value="EPIC">Epic</SelectItem>
                        <SelectItem value="LEGENDARY">Legendary</SelectItem>
                        <SelectItem value="MYTHIC">Mythic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="powerBoost">Power Boost (%)</Label>
                    <Input
                      id="powerBoost"
                      type="number"
                      value={badgeForm.powerBoost}
                      onChange={(e) => setBadgeForm({ ...badgeForm, powerBoost: parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600"
                      data-testid="input-power-boost"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleMintBadge}
                  disabled={mintBadgeMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  data-testid="button-mint-badge"
                >
                  {mintBadgeMutation.isPending ? (
                    <>Minting...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mint Badge NFT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="token">
            <Card className="bg-slate-800/80 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Mint MEE Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tokenRecipient">Recipient Address *</Label>
                  <Input
                    id="tokenRecipient"
                    placeholder="0x..."
                    value={tokenForm.recipientAddress}
                    onChange={(e) => setTokenForm({ ...tokenForm, recipientAddress: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    data-testid="input-token-recipient"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount (MEE) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={tokenForm.amount}
                    onChange={(e) => setTokenForm({ ...tokenForm, amount: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600"
                    data-testid="input-token-amount"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Current balance will be increased by {tokenForm.amount} MEE
                  </p>
                </div>

                <Button
                  onClick={handleMintToken}
                  disabled={mintTokenMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                  data-testid="button-mint-token"
                >
                  {mintTokenMutation.isPending ? (
                    <>Minting...</>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint MEE Tokens
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth">
            <Card className="bg-slate-800/80 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Contract Authorizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {authStatus ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Contracts Deployed</div>
                        <div className="text-2xl font-bold text-blue-300">
                          {authStatus.contracts.deployed}/{authStatus.contracts.required}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Authorizations Enabled</div>
                        <div className="text-2xl font-bold text-green-300">
                          {authStatus.authorizations.enabled}/{authStatus.authorizations.total}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-white mb-2">Authorization Status</h4>
                      {Object.entries(authStatus.authorizations).map(([key, value]) => {
                        if (key === 'total' || key === 'enabled') return null;
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                            <span className="text-sm text-slate-300">{key}</span>
                            {value ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    Loading authorization status...
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
