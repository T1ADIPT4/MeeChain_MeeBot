/**
 * Badge UI Demo
 * 
 * Example demonstrating how to integrate badge components into your app
 */

import React, { useState } from 'react';
import BadgeRegistry from '../viewer/components/BadgeRegistry';
import BadgeGallery from '../viewer/components/BadgeGallery';
import BadgeUnlockNotification from '../viewer/components/BadgeUnlockNotification';
import { getAllBadges } from '../src/config/badgeCatalog';

/**
 * Example 1: Simple Badge Display
 * Show user's badges in a registry view
 */
function Example1_SimpleBadgeDisplay() {
  const userAddress = "0x1234567890abcdef1234567890abcdef12345678";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Badge Collection</h1>
      <BadgeRegistry userAddress={userAddress} />
    </div>
  );
}

/**
 * Example 2: Badge Gallery with Unlock Notification
 * Show all badges and notify when new ones are unlocked
 */
function Example2_BadgeGalleryWithNotification() {
  const [ownedBadges, setOwnedBadges] = useState<number[]>([1, 2, 5]);
  const [newBadges, setNewBadges] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const handleUnlockBadge = (badgeId: number) => {
    // Simulate unlocking a new badge
    if (!ownedBadges.includes(badgeId)) {
      setOwnedBadges([...ownedBadges, badgeId]);
      setNewBadges([badgeId]);
      setShowNotification(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Badge Gallery</h1>
      
      {/* Test button to unlock a badge */}
      <button
        onClick={() => handleUnlockBadge(3)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Unlock Badge #3 (Test)
      </button>

      <BadgeGallery
        ownedBadgeIds={ownedBadges}
        newlyMintedBadges={newBadges}
        onBadgeClick={(badge) => console.log('Clicked:', badge)}
      />

      {showNotification && newBadges.length > 0 && (
        <BadgeUnlockNotification
          badgeIds={newBadges}
          onClose={() => {
            setShowNotification(false);
            setNewBadges([]);
          }}
        />
      )}
    </div>
  );
}

/**
 * Example 3: Quest Completion Flow
 * Integrate badges with quest completion
 */
function Example3_QuestCompletionFlow() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<number[]>([1]);
  const [newBadges, setNewBadges] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const quests = [
    { id: 'quest-1', name: 'First Quest', badgeReward: 1 },
    { id: 'quest-2', name: 'Trading Quest', badgeReward: 2 },
    { id: 'quest-3', name: 'Community Quest', badgeReward: 4 },
  ];

  const completeQuest = async (questId: string, badgeId: number) => {
    // Simulate quest completion
    console.log(`Completing quest: ${questId}`);
    
    // Mark quest as completed
    setCompletedQuests([...completedQuests, questId]);
    
    // Simulate backend API call that mints badge
    // In real app: const response = await api.completeQuest(questId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Award badge
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges([...earnedBadges, badgeId]);
      setNewBadges([badgeId]);
      setShowNotification(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quest System with Badges</h1>

      {/* Quest List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Available Quests</h2>
        <div className="space-y-2">
          {quests.map(quest => (
            <div key={quest.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <h3 className="font-bold">{quest.name}</h3>
                <p className="text-sm text-gray-600">Reward: Badge #{quest.badgeReward}</p>
              </div>
              <button
                onClick={() => completeQuest(quest.id, quest.badgeReward)}
                disabled={completedQuests.includes(quest.id)}
                className={`
                  px-4 py-2 rounded
                  ${completedQuests.includes(quest.id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                {completedQuests.includes(quest.id) ? '✓ Completed' : 'Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Gallery */}
      <BadgeGallery
        ownedBadgeIds={earnedBadges}
        newlyMintedBadges={newBadges}
      />

      {/* Unlock Notification */}
      {showNotification && newBadges.length > 0 && (
        <BadgeUnlockNotification
          badgeIds={newBadges}
          onClose={() => {
            setShowNotification(false);
            setNewBadges([]);
          }}
        />
      )}
    </div>
  );
}

/**
 * Example 4: Badge Statistics Dashboard
 * Show badge collection statistics
 */
function Example4_BadgeStatistics() {
  const ownedBadges = [1, 2, 3, 5, 6]; // Example owned badges
  const allBadges = getAllBadges();

  const stats = {
    total: allBadges.length,
    owned: ownedBadges.length,
    percentage: Math.round((ownedBadges.length / allBadges.length) * 100),
    byRarity: {
      common: ownedBadges.filter(id => allBadges.find(b => b.id === id)?.rarity === 'common').length,
      rare: ownedBadges.filter(id => allBadges.find(b => b.id === id)?.rarity === 'rare').length,
      epic: ownedBadges.filter(id => allBadges.find(b => b.id === id)?.rarity === 'epic').length,
      legendary: ownedBadges.filter(id => allBadges.find(b => b.id === id)?.rarity === 'legendary').length,
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Badge Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-sm text-gray-600 mb-1">Total Badges</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.owned} / {stats.total}</p>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-sm text-gray-600 mb-1">Completion</h3>
          <p className="text-3xl font-bold text-green-600">{stats.percentage}%</p>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <h3 className="text-sm text-gray-600 mb-1">Epic Badges</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.byRarity.epic}</p>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="text-sm text-gray-600 mb-1">Legendary</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.byRarity.legendary}</p>
        </div>
      </div>

      <BadgeGallery ownedBadgeIds={ownedBadges} />
    </div>
  );
}

/**
 * Main Demo Component
 * Toggle between different examples
 */
export default function BadgeUIDemo() {
  const [activeExample, setActiveExample] = useState(1);

  const examples = [
    { id: 1, name: 'Simple Display', component: <Example1_SimpleBadgeDisplay /> },
    { id: 2, name: 'Gallery + Notification', component: <Example2_BadgeGalleryWithNotification /> },
    { id: 3, name: 'Quest Integration', component: <Example3_QuestCompletionFlow /> },
    { id: 4, name: 'Statistics', component: <Example4_BadgeStatistics /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Badge UI Examples</h1>
          <div className="flex gap-2">
            {examples.map(example => (
              <button
                key={example.id}
                onClick={() => setActiveExample(example.id)}
                className={`
                  px-4 py-2 rounded transition-colors
                  ${activeExample === example.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Active Example */}
      <div>
        {examples.find(e => e.id === activeExample)?.component}
      </div>
    </div>
  );
}
