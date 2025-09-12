
import { useState } from 'react';
import { useWeb3 } from '../hooks/use-web3';

interface BadgeMinterProps {
  onMinted?: (tokenId: string) => void;
}

const BADGE_TYPES = [
  { value: '0', label: 'PRODUCTIVITY', icon: '⚡', color: 'bg-blue-500' },
  { value: '1', label: 'EXPLORER', icon: '🗺️', color: 'bg-green-500' },
  { value: '2', label: 'SOCIALIZER', icon: '🤝', color: 'bg-pink-500' },
  { value: '3', label: 'ACHIEVER', icon: '🏆', color: 'bg-yellow-500' },
  { value: '4', label: 'SPECIAL', icon: '⭐', color: 'bg-purple-500' }
];

const RARITY_LEVELS = [
  { value: '0', label: 'COMMON', color: 'bg-gray-500' },
  { value: '1', label: 'RARE', color: 'bg-purple-500' },
  { value: '2', label: 'EPIC', color: 'bg-orange-500' },
  { value: '3', label: 'LEGENDARY', color: 'bg-yellow-500' },
  { value: '4', label: 'MYTHIC', color: 'bg-red-500' }
];

export function BadgeMinter({ onMinted }: BadgeMinterProps) {
  const { account, contract } = useWeb3();
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMintBadge = async () => {
    if (!contract || !account) {
      alert('โปรดเชื่อมต่อกับ wallet ก่อน');
      return;
    }

    if (!formData.to || !formData.name || !formData.description || !formData.badgeType || !formData.rarity) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/badge/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`🎉 Mint Badge สำเร็จ! Badge "${formData.name}" ถูกสร้างแล้ว`);
        
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
      alert('ไม่สามารถ mint badge ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🔨 Badge Minter
      </h2>
      
      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium mb-2">ที่อยู่ผู้รับ</label>
          <input
            type="text"
            placeholder="0x..."
            value={formData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Badge Name */}
        <div>
          <label className="block text-sm font-medium mb-2">ชื่อ Badge</label>
          <input
            type="text"
            placeholder="เช่น Early Adopter"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">คำอธิบาย</label>
          <textarea
            placeholder="อธิบายเกี่ยวกับ badge นี้"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Badge Type */}
        <div>
          <label className="block text-sm font-medium mb-2">ประเภท Badge</label>
          <select
            value={formData.badgeType}
            onChange={(e) => handleInputChange('badgeType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">เลือกประเภท badge</option>
            {BADGE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity */}
        <div>
          <label className="block text-sm font-medium mb-2">ระดับความหายาก</label>
          <select
            value={formData.rarity}
            onChange={(e) => handleInputChange('rarity', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">เลือกระดับความหายาก</option>
            {RARITY_LEVELS.map((rarity) => (
              <option key={rarity.value} value={rarity.value}>
                {rarity.label}
              </option>
            ))}
          </select>
        </div>

        {/* Token URI */}
        <div>
          <label className="block text-sm font-medium mb-2">Token URI (Metadata)</label>
          <input
            type="text"
            placeholder="https://ipfs.io/ipfs/..."
            value={formData.tokenURI}
            onChange={(e) => handleInputChange('tokenURI', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quest Options */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isQuestReward"
            checked={formData.isQuestReward}
            onChange={(e) => handleInputChange('isQuestReward', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isQuestReward" className="text-sm font-medium">
            Badge นี้เป็นรางวัลจาก Quest
          </label>
        </div>
        
        {formData.isQuestReward && (
          <input
            type="text"
            placeholder="Quest ID"
            value={formData.questId}
            onChange={(e) => handleInputChange('questId', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {/* Preview */}
        {formData.name && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-2">🔍 Preview</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {BADGE_TYPES.find(t => t.value === formData.badgeType)?.icon || '🏅'}
              </div>
              <div>
                <div className="font-medium">{formData.name}</div>
                <div className="text-sm text-gray-600">{formData.description}</div>
                <div className="flex gap-2 mt-1">
                  {formData.badgeType && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {BADGE_TYPES.find(t => t.value === formData.badgeType)?.label}
                    </span>
                  )}
                  {formData.rarity && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {RARITY_LEVELS.find(r => r.value === formData.rarity)?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mint Button */}
        <button
          onClick={handleMintBadge}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              กำลัง Mint...
            </>
          ) : (
            <>
              🔨 Mint Badge
            </>
          )}
        </button>
      </div>
    </div>
  );
}
