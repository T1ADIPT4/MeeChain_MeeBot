
import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/use-web3';

interface Quest {
  id: number;
  name: string;
  description: string;
  rewardAmount: string;
  badgeName: string;
  badgeDescription: string;
  isActive: boolean;
  completions: number;
  isCompleted: boolean;
}

interface QuestProgress {
  questId: number;
  completed: number;
  total: number;
  isCompleted: boolean;
}

export function QuestTracker() {
  const { account, contract } = useWeb3();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<Record<number, QuestProgress>>({});
  const [isLoading, setIsLoading] = useState(false);

  const mockQuests: Quest[] = [
    {
      id: 0,
      name: "First Steps",
      description: "Complete your first wallet transaction",
      rewardAmount: "10",
      badgeName: "First Steps Badge",
      badgeDescription: "Your first achievement in MeeChain",
      isActive: true,
      completions: 42,
      isCompleted: false
    },
    {
      id: 1,
      name: "Explorer",
      description: "Visit 5 different pages in the app",
      rewardAmount: "25",
      badgeName: "Explorer Badge",
      badgeDescription: "For the curious minds",
      isActive: true,
      completions: 18,
      isCompleted: false
    },
    {
      id: 2,
      name: "Socializer",
      description: "Connect with other users",
      rewardAmount: "50",
      badgeName: "Socializer Badge",
      badgeDescription: "Building connections in MeeChain",
      isActive: true,
      completions: 7,
      isCompleted: true
    }
  ];

  useEffect(() => {
    setQuests(mockQuests);
  }, []);

  const handleCompleteQuest = async (questId: number) => {
    if (!contract || !account) {
      alert('โปรดเชื่อมต่อกับ wallet ก่อน');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/quest/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId, account })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`🎉 Quest สำเร็จ! ได้รับ ${result.rewardAmount} MEE และ Badge!`);
        
        // Update quest status
        setQuests(prev => prev.map(quest => 
          quest.id === questId 
            ? { ...quest, isCompleted: true, completions: quest.completions + 1 }
            : quest
        ));
      } else {
        throw new Error('Failed to complete quest');
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('ไม่สามารถทำ quest ให้สำเร็จได้');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestStatusColor = (quest: Quest) => {
    if (quest.isCompleted) return 'bg-green-100 border-green-300';
    if (!quest.isActive) return 'bg-gray-100 border-gray-300';
    return 'bg-blue-50 border-blue-300';
  };

  const getQuestStatusIcon = (quest: Quest) => {
    if (quest.isCompleted) return '✅';
    if (!quest.isActive) return '⏸️';
    return '🎯';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🎮 Quest Tracker
        </h1>
        <p className="text-gray-600">ทำ quest เพื่อรับ MEE tokens และ exclusive badges!</p>
      </div>

      {/* Quest Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-800">
            {quests.filter(q => q.isActive).length}
          </div>
          <div className="text-blue-600">Active Quests</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-800">
            {quests.filter(q => q.isCompleted).length}
          </div>
          <div className="text-green-600">Completed</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-800">
            {quests.reduce((acc, q) => acc + parseInt(q.rewardAmount), 0)}
          </div>
          <div className="text-purple-600">Total MEE Rewards</div>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`border-2 rounded-lg p-6 transition-all duration-200 ${getQuestStatusColor(quest)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getQuestStatusIcon(quest)}</span>
                  <h3 className="text-xl font-bold">{quest.name}</h3>
                  <span className="text-sm px-2 py-1 bg-gray-200 rounded">
                    Quest #{quest.id}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{quest.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-600">💰</span>
                    <span className="font-medium">{quest.rewardAmount} MEE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-600">🏅</span>
                    <span className="font-medium">{quest.badgeName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">👥</span>
                    <span>{quest.completions} completions</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                {quest.isCompleted ? (
                  <div className="bg-green-600 text-white px-4 py-2 rounded-md font-medium">
                    ✅ Completed
                  </div>
                ) : quest.isActive ? (
                  <button
                    onClick={() => handleCompleteQuest(quest.id)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        🚀 Complete Quest
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-gray-400 text-white px-4 py-2 rounded-md font-medium">
                    ⏸️ Inactive
                  </div>
                )}
              </div>
            </div>

            {/* Quest Progress Bar (if applicable) */}
            {quest.isActive && !quest.isCompleted && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>75% (example)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}
            
            {/* Badge Preview */}
            <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
              <div className="text-sm font-medium mb-1">🎁 Reward Badge:</div>
              <div className="text-sm text-gray-600">{quest.badgeDescription}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quest Creation Section (Admin only) */}
      {account && (
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            ⚙️ Admin Panel
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            เฉพาะ owner เท่านั้นที่สามารถสร้าง quest ใหม่ได้
          </p>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-2 rounded-md transition-colors duration-200"
            onClick={() => alert('Quest creation feature coming soon!')}
          >
            ➕ Create New Quest
          </button>
        </div>
      )}
    </div>
  );
}
