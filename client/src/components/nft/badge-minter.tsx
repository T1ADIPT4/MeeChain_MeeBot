
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Sparkles, Trophy, Crown, Gem, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface BadgeMinterProps {
  onMinted?: (badgeId: string) => void;
  isOwner?: boolean;
}

const BADGE_TYPES = [
  { value: '0', label: 'PRODUCTIVITY', icon: '⚡', color: 'bg-blue-500' },
  { value: '1', label: 'EXPLORER', icon: '🗺️', color: 'bg-green-500' },
  { value: '2', label: 'SOCIALIZER', icon: '🤝', color: 'bg-pink-500' },
  { value: '3', label: 'ACHIEVER', icon: '🏆', color: 'bg-yellow-500' },
  { value: '4', label: 'SPECIAL', icon: '⭐', color: 'bg-purple-500' }
];

const RARITY_LEVELS = [
  { value: '0', label: 'COMMON', icon: <Star className="w-4 h-4" />, color: 'bg-gray-500' },
  { value: '1', label: 'RARE', icon: <Gem className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: '2', label: 'EPIC', icon: <Trophy className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: '3', label: 'LEGENDARY', icon: <Crown className="w-4 h-4" />, color: 'bg-yellow-500' },
  { value: '4', label: 'MYTHIC', icon: <Sparkles className="w-4 h-4" />, color: 'bg-red-500' }
];

export function BadgeMinter({ onMinted, isOwner = false }: BadgeMinterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    name: '',
    description: '',
    badgeType: '',
    rarity: '',
    tokenURI: '',
    isQuestReward: false,
    questId: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMintBadge = async () => {
    if (!formData.to || !formData.name || !formData.description || !formData.badgeType || !formData.rarity) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // เรียกใช้ smart contract integration
      const response = await fetch('/api/badge/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "🎉 Mint Badge สำเร็จ!",
          description: `Badge "${formData.name}" ถูกสร้างแล้ว`,
        });
        
        // Reset form
        setFormData({
          to: '',
          name: '',
          description: '',
          badgeType: '',
          rarity: '',
          tokenURI: '',
          isQuestReward: false,
          questId: ''
        });

        onMinted?.(result.tokenId);
      } else {
        throw new Error('Failed to mint badge');
      }
    } catch (error) {
      console.error('Error minting badge:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถ mint badge ได้",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          เฉพาะ Owner เท่านั้นที่สามารถ mint badge ได้
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          🔨 Badge Minter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipient Address */}
        <div className="space-y-2">
          <Label htmlFor="to">ที่อยู่ผู้รับ</Label>
          <Input
            id="to"
            placeholder="0x..."
            value={formData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
          />
        </div>

        {/* Badge Name */}
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อ Badge</Label>
          <Input
            id="name"
            placeholder="เช่น Early Adopter"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">คำอธิบาย</Label>
          <Textarea
            id="description"
            placeholder="อธิบายเกี่ยวกับ badge นี้"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        {/* Badge Type */}
        <div className="space-y-2">
          <Label>ประเภท Badge</Label>
          <Select value={formData.badgeType} onValueChange={(value) => handleInputChange('badgeType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภท badge" />
            </SelectTrigger>
            <SelectContent>
              {BADGE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rarity */}
        <div className="space-y-2">
          <Label>ระดับความหายาก</Label>
          <Select value={formData.rarity} onValueChange={(value) => handleInputChange('rarity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกระดับความหายาก" />
            </SelectTrigger>
            <SelectContent>
              {RARITY_LEVELS.map((rarity) => (
                <SelectItem key={rarity.value} value={rarity.value}>
                  <div className="flex items-center gap-2">
                    {rarity.icon}
                    <span>{rarity.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token URI */}
        <div className="space-y-2">
          <Label htmlFor="tokenURI">Token URI (Metadata)</Label>
          <Input
            id="tokenURI"
            placeholder="https://ipfs.io/ipfs/..."
            value={formData.tokenURI}
            onChange={(e) => handleInputChange('tokenURI', e.target.value)}
          />
        </div>

        {/* Quest Options */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isQuestReward"
              checked={formData.isQuestReward}
              onChange={(e) => handleInputChange('isQuestReward', e.target.checked)}
            />
            <Label htmlFor="isQuestReward">Badge นี้เป็นรางวัลจาก Quest</Label>
          </div>
          
          {formData.isQuestReward && (
            <Input
              placeholder="Quest ID"
              value={formData.questId}
              onChange={(e) => handleInputChange('questId', e.target.value)}
            />
          )}
        </div>

        {/* Preview */}
        {formData.name && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold mb-2">🔍 Preview</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {BADGE_TYPES.find(t => t.value === formData.badgeType)?.icon || '🏅'}
              </div>
              <div>
                <div className="font-medium">{formData.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{formData.description}</div>
                <div className="flex gap-2 mt-1">
                  {formData.badgeType && (
                    <Badge variant="secondary" className="text-xs">
                      {BADGE_TYPES.find(t => t.value === formData.badgeType)?.label}
                    </Badge>
                  )}
                  {formData.rarity && (
                    <Badge variant="secondary" className="text-xs">
                      {RARITY_LEVELS.find(r => r.value === formData.rarity)?.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mint Button */}
        <Button
          onClick={handleMintBadge}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              กำลัง Mint...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              🔨 Mint Badge
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
