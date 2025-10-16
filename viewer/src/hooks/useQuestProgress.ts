
import { useState, useEffect } from 'react';
import { getUserProgress, questDatabase } from '../../../src/verifiers/questVerifier.js';

export interface QuestProgressData {
  questName: string;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
}

export const useQuestProgress = (userId: string, questId: string): QuestProgressData | null => {
  const [progressData, setProgressData] = useState<QuestProgressData | null>(null);

  useEffect(() => {
    if (!userId || !questId) return;

    const quest = questDatabase[questId];
    const userProgress = getUserProgress(userId, questId);

    if (!quest) {
      console.warn(`Quest with ID "${questId}" not found.`);
      setProgressData(null);
      return;
    }

    const completedSteps = Object.values(userProgress).reduce((sum, current) => sum + (current > 0 ? 1 : 0), 0);
    const totalSteps = quest.conditions.length;
    const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    setProgressData({
      questName: quest.name,
      completedSteps,
      totalSteps,
      progressPercentage,
    });

  }, [userId, questId]);

  return progressData;
};
