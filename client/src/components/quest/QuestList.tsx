import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Quest {
  questId: number;
  name: string;
  description: string;
  rewardAmount: string;
  rewardType: string;
  badgeName?: string;
  badgeDescription?: string;
  isActive: boolean;
  completions: number;
  userCompleted: boolean;
  userStatus: 'completed' | 'available' | 'inactive';
}

interface QuestListProps {
  userAddress?: string;
  onMoodChange?: (mood: 'confused' | 'excited' | 'celebrate') => void;
}

export default function QuestList({ userAddress, onMoodChange }: QuestListProps) {
  const { toast } = useToast();
  const [selectedQuest, setSelectedQuest] = useState<number | null>(null);

  const { data: questsData, isLoading } = useQuery<{ success: boolean; data: Quest[] }>({
    queryKey: ['/api/quests/all', { userAddress }],
    enabled: !!userAddress
  });

  const quests = questsData?.data || [];

  useEffect(() => {
    updateMeeBotMood(quests);
  }, [quests]);

  const updateMeeBotMood = (quests: Quest[]) => {
    if (!onMoodChange) return;

    const anyCompleted = quests.some(q => q.userCompleted);
    const anyActive = quests.some(q => q.isActive && !q.userCompleted);

    if (quests.length === 0 || !quests.some(q => q.isActive)) {
      onMoodChange('confused');
    } else if (!anyCompleted) {
      onMoodChange('excited');
    } else {
      onMoodChange('celebrate');
    }
  };

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: number) => {
      return apiRequest('POST', `/api/quest/${questId}/complete`, {
        userAddress,
        privateKey: localStorage.getItem('meechain_private_key')
      });
    },
    onSuccess: (response: any, questId) => {
      toast({
        title: '🎉 Quest Completed!',
        description: response.data?.message || 'You earned rewards!'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quests/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quest/list'] });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Quest Failed',
        description: error.message || 'Failed to complete quest',
        variant: 'destructive'
      });
    }
  });

  const handleCompleteQuest = (questId: number) => {
    if (!userAddress) {
      toast({
        title: '⚠️ Wallet Required',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }
    completeQuestMutation.mutate(questId);
  };

  const getMoodIcon = () => {
    const anyCompleted = quests.some(q => q.userCompleted);
    const anyActive = quests.some(q => q.isActive && !q.userCompleted);

    if (quests.length === 0 || !quests.some(q => q.isActive)) {
      return <Sparkles className="w-5 h-5 text-gray-400" />;
    } else if (!anyCompleted) {
      return <Zap className="w-5 h-5 text-yellow-400" />;
    } else {
      return <Trophy className="w-5 h-5 text-green-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-slate-800/50 border-slate-600/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-600/50">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Quests Available</h3>
          <p className="text-sm text-gray-500">Check back soon for new adventures!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        {getMoodIcon()}
        <h2 className="text-2xl font-bold text-white">Available Quests</h2>
      </div>

      {quests.map((quest) => (
        <Card
          key={quest.questId}
          className={`bg-slate-800/50 border-slate-600/50 transition-all hover:border-purple-500/50 ${
            selectedQuest === quest.questId ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => setSelectedQuest(quest.questId)}
          data-testid={`quest-card-${quest.questId}`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white flex items-center gap-2">
                  {quest.name}
                  {quest.userCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" data-testid={`quest-completed-${quest.questId}`} />
                  )}
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">{quest.description}</p>
              </div>
              <Badge
                variant={quest.userCompleted ? 'default' : quest.isActive ? 'secondary' : 'outline'}
                className={
                  quest.userCompleted
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : quest.isActive
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }
                data-testid={`quest-status-${quest.questId}`}
              >
                {quest.userCompleted ? 'Completed' : quest.isActive ? 'Available' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  {quest.rewardAmount} MEE
                  {quest.rewardType === 'badge' && quest.badgeName && ` + ${quest.badgeName} Badge`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">{quest.completions} completions</span>
              </div>
            </div>

            {quest.rewardType === 'badge' && quest.badgeDescription && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-xs text-purple-300">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {quest.badgeDescription}
                </p>
              </div>
            )}

            {quest.isActive && !quest.userCompleted && userAddress && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteQuest(quest.questId);
                }}
                disabled={completeQuestMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                data-testid={`button-complete-quest-${quest.questId}`}
              >
                {completeQuestMutation.isPending && selectedQuest === quest.questId
                  ? 'Completing...'
                  : 'Complete Quest'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
