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

interface CreateQuestForm {
  name: string;
  description: string;
  rewardAmount: string;
  rewardType: 'badge' | 'token';
  badgeName: string;
  badgeDescription: string;
  badgeTokenURI: string;
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

  const [questForm, setQuestForm] = useState<CreateQuestForm>({
    name: '',
    description: '',
    rewardAmount: '100',
    rewardType: 'badge',
    badgeName: '',
    badgeDescription: '',
    badgeTokenURI: ''
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

  const createQuestMutation = useMutation({
    mutationFn: async (data: CreateQuestForm) => {
      return apiRequest('POST', '/api/quest/create', data);
    },
    onSuccess: (response: any) => {
      toast({
        title: '✅ Quest Created!',
        description: `Quest "${questForm.name}" created with ID ${response.data?.questId}`
      });
      setQuestForm({
        name: '',
        description: '',
        rewardAmount: '100',
        rewardType: 'badge',
        badgeName: '',
        badgeDescription: '',
        badgeTokenURI: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quest/list'] });
    },
    onError: (error) => {
      toast({
        title: '❌ Quest Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create quest',
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

  const handleCreateQuest = () => {
    if (!questForm.name || !questForm.description || !questForm.rewardAmount) {
      toast({
        title: '⚠️ Missing Information',
        description: 'Please provide quest name, description, and reward amount',
        variant: 'destructive'
      });
      return;
    }
    createQuestMutation.mutate(questForm);
  };

  const authStatus = authData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-300">Manage badges, tokens, and contract authorizations</p>
        </div>

        {authStatus && !authStatus.isReady && (
          <Card className="mb-6 bg-yellow-900/30 border-yellow-500/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-300 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-100 mb-1">⚠️ Authorization Issues Detected</h3>
                  <ul className="text-sm text-yellow-50 space-y-1">
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
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="quest" data-testid="tab-create-quest" className="text-slate-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Quest
            </TabsTrigger>
            <TabsTrigger value="badge" data-testid="tab-mint-badge" className="text-slate-200">
              <Award className="w-4 h-4 mr-2" />
              Mint Badge
            </TabsTrigger>
            <TabsTrigger value="token" data-testid="tab-mint-token" className="text-slate-200">
              <Coins className="w-4 h-4 mr-2" />
              Mint Tokens
            </TabsTrigger>
            <TabsTrigger value="auth" data-testid="tab-authorizations" className="text-slate-200">
              <Shield className="w-4 h-4 mr-2" />
              Authorizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quest">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-purple-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create New Quest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quest-name" className="text-slate-200">Quest Name *</Label>
                  <Input
                    id="quest-name"
                    placeholder="Welcome to MeeChain"
                    value={questForm.name}
                    onChange={(e) => setQuestForm({ ...questForm, name: e.target.value })}
                    className="bg-slate-700 border-slate-500 text-white placeholder:text-slate-400"
                    data-testid="input-quest-name"
                  />
                </div>

                <div>
                  <Label htmlFor="quest-description" className="text-slate-200">Description *</Label>
                  <Input
                    id="quest-description"
                    placeholder="Complete your first quest to earn rewards"
                    value={questForm.description}
                    onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })}
                    className="bg-slate-700 border-slate-500 text-white placeholder:text-slate-400"
                    data-testid="input-quest-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quest-reward-amount" className="text-slate-200">Reward Amount (MEE) *</Label>
                    <Input
                      id="quest-reward-amount"
                      type="number"
                      placeholder="100"
                      value={questForm.rewardAmount}
                      onChange={(e) => setQuestForm({ ...questForm, rewardAmount: e.target.value })}
                      className="bg-slate-700 border-slate-500 text-white placeholder:text-slate-400"
                      data-testid="input-quest-reward-amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quest-reward-type" className="text-slate-200">Reward Type</Label>
                    <Select
                      value={questForm.rewardType}
                      onValueChange={(value: 'badge' | 'token') => setQuestForm({ ...questForm, rewardType: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600" data-testid="select-quest-reward-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="badge">Badge NFT</SelectItem>
                        <SelectItem value="token">Token Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {questForm.rewardType === 'badge' && (
                  <>
                    <div>
                      <Label htmlFor="quest-badge-name">Badge Name</Label>
                      <Input
                        id="quest-badge-name"
                        placeholder="First Steps"
                        value={questForm.badgeName}
                        onChange={(e) => setQuestForm({ ...questForm, badgeName: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        data-testid="input-quest-badge-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quest-badge-description">Badge Description</Label>
                      <Input
                        id="quest-badge-description"
                        placeholder="Completed first quest"
                        value={questForm.badgeDescription}
                        onChange={(e) => setQuestForm({ ...questForm, badgeDescription: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        data-testid="input-quest-badge-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quest-badge-uri">Badge Token URI (optional)</Label>
                      <Input
                        id="quest-badge-uri"
                        placeholder="ipfs://..."
                        value={questForm.badgeTokenURI}
                        onChange={(e) => setQuestForm({ ...questForm, badgeTokenURI: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        data-testid="input-quest-badge-uri"
                      />
                    </div>
                  </>
                )}

                <Button
                  onClick={handleCreateQuest}
                  disabled={createQuestMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  data-testid="button-create-quest"
                >
                  {createQuestMutation.isPending ? 'Creating Quest...' : 'Create Quest'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

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
