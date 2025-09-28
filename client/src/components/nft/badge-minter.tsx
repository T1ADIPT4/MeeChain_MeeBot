import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Wand2,
  Star,
  Crown,
  Gem,
  Sparkles,
  Upload,
  Bot,
  Trophy,
  Target,
  Zap,
  Eye, // This import was missing and is now added
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import deploy registry functions
import { 
  getContractAddress, 
  getNetwork, 
  isFallbackEnabled 
} from '@/services/deploy-registry';

// Mock ethers and FOOTBALLNFT_ABI for demonstration purposes
const ethers = {
  Contract: class {
    constructor(address: string, abi: any, signer: any) {
      this.address = address;
      this.abi = abi;
      this.signer = signer;
    }
  }
};
const FOOTBALLNFT_ABI = []; // Placeholder ABI

interface BadgeMintForm {
  name: string;
  description: string;
  badgeType: 'PRODUCTIVITY' | 'EXPLORER' | 'SOCIALIZER' | 'ACHIEVER' | 'SPECIAL';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  imageUrl: string;
  isQuestReward: boolean;
  questId: string;
}

export function BadgeMinter() {
  const [form, setForm] = useState<BadgeMintForm>({
    name: '',
    description: '',
    badgeType: 'PRODUCTIVITY',
    rarity: 'COMMON',
    imageUrl: '',
    isQuestReward: false,
    questId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // --- Deploy Registry Integration ---
  // Example of using the deployed contract address
  const footballNFT = new ethers.Contract(
    getContractAddress("FootballNFT"),
    FOOTBALLNFT_ABI,
    null // In a real app, this would be your signer
  );
  // --- End Deploy Registry Integration ---

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'MYTHIC': return 'from-pink-500 to-red-500';
      case 'LEGENDARY': return 'from-yellow-500 to-orange-500';
      case 'EPIC': return 'from-purple-500 to-indigo-500';
      case 'RARE': return 'from-blue-500 to-cyan-500';
      case 'COMMON': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'MYTHIC': return <Sparkles className="w-4 h-4" />;
      case 'LEGENDARY': return <Crown className="w-4 h-4" />;
      case 'EPIC': return <Gem className="w-4 h-4" />;
      case 'RARE': return <Star className="w-4 h-4" />;
      case 'COMMON': return <Trophy className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const handleMintBadge = async () => {
    if (!form.name || !form.description) {
      toast({
        title: "🤖 MeeBot",
        description: "กรุณาใส่ชื่อและคำอธิบาย Badge ครับ! 📝",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock minting process - would integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "🎉 Badge Minted สำเร็จ!",
        description: `${form.name} ถูกสร้างขึ้นแล้ว! MeeBot ภูมิใจในผลงานของคุณ! 🏆`,
      });

      // Reset form
      setForm({
        name: '',
        description: '',
        badgeType: 'PRODUCTIVITY',
        rarity: 'COMMON',
        imageUrl: '',
        isQuestReward: false,
        questId: ''
      });

    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถ mint badge ได้ กรุณาลองใหม่ครับ",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const estimateCost = () => {
    const baseCost = 100;
    const rarityMultiplier = {
      'COMMON': 1,
      'RARE': 2,
      'EPIC': 4,
      'LEGENDARY': 8,
      'MYTHIC': 15
    };
    return baseCost * (rarityMultiplier[form.rarity] || 1);
  };

  return (
    <div className="space-y-6">
      {/* Fallback Banner for Dynamic Chain Switching */}
      {isFallbackEnabled() && (
        <div className="fallback-banner bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg text-yellow-300 text-center text-sm">
          ⚠️ คุณกำลังเชื่อมต่อกับ Fallback Chain คุณสมบัติบางอย่างอาจถูกจำกัด
        </div>
      )}

      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
              <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🏭 Badge NFT Factory</h2>
              <p className="text-sm text-slate-400">สร้าง Badge NFT ของคุณเอง</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minting Form */}
        <Card className="bg-slate-800/80 border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-purple-400" />
              ข้อมูล Badge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Badge Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">ชื่อ Badge</label>
              <Input
                placeholder="เช่น Productivity Master"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">คำอธิบาย</label>
              <Textarea
                placeholder="อธิบายความพิเศษของ Badge นี้..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white resize-none"
                rows={3}
              />
            </div>

            {/* Badge Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">ประเภท Badge</label>
              <Select value={form.badgeType} onValueChange={(value: any) => setForm(prev => ({ ...prev, badgeType: value }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCTIVITY">🚀 Productivity</SelectItem>
                  <SelectItem value="EXPLORER">🗺️ Explorer</SelectItem>
                  <SelectItem value="SOCIALIZER">👥 Socializer</SelectItem>
                  <SelectItem value="ACHIEVER">🏆 Achiever</SelectItem>
                  <SelectItem value="SPECIAL">⭐ Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rarity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">ระดับความหายาก</label>
              <Select value={form.rarity} onValueChange={(value: any) => setForm(prev => ({ ...prev, rarity: value }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMMON">Common (ธรรมดา)</SelectItem>
                  <SelectItem value="RARE">Rare (หายาก)</SelectItem>
                  <SelectItem value="EPIC">Epic (มหากาพย์)</SelectItem>
                  <SelectItem value="LEGENDARY">Legendary (ตำนาน)</SelectItem>
                  <SelectItem value="MYTHIC">Mythic (เทพนิยาย)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">URL รูปภาพ</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button variant="outline" size="icon" className="border-slate-600">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Cost Display */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-300">ค่า Mint</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-400">{estimateCost()}</span>
                  <span className="text-sm text-yellow-300">MEE</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Badge Preview */}
          <Card className="bg-slate-800/80 border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-cyan-400" />
                ตัวอย่าง Badge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`relative p-6 rounded-xl bg-gradient-to-br ${getRarityColor(form.rarity)} text-white text-center`}>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/20 text-white border-0">
                    {getRarityIcon(form.rarity)}
                    <span className="ml-1 text-xs">{form.rarity}</span>
                  </Badge>
                </div>

                <div className="text-4xl mb-3">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Badge" className="w-16 h-16 mx-auto rounded-full" />
                  ) : (
                    "🏆"
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2">
                  {form.name || "Badge Name"}
                </h3>

                <p className="text-sm opacity-90 mb-4">
                  {form.description || "Badge description will appear here..."}
                </p>

                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-white/20 rounded">
                    {form.badgeType}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MeeBot Tips */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-300/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-300 mb-1">💡 MeeBot Tips</h3>
                  <p className="text-sm text-gray-300">
                    Badge ที่มี rarity สูงกว่าจะให้ผลตอบแทนมากกว่า! MYTHIC badges สามารถขายได้ในราคาสูงใน marketplace! 🚀
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mint Button */}
          <Button
            onClick={handleMintBadge}
            disabled={isLoading || !form.name || !form.description}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                กำลัง Mint Badge...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Mint Badge NFT
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}