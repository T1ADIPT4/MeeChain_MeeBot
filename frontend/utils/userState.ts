import { db } from '../lib/firebase';

export interface UserState {
  hasVoted: boolean;
  claimedBadge: boolean;
  finishedOnboarding: boolean;
}

export const getUserState = async (userId: string): Promise<UserState> => {
  const doc = await db.collection('users').doc(userId).get();
  const data = doc.data();
  return {
    hasVoted: data?.hasVoted ?? false,
    claimedBadge: data?.claimedBadge ?? false,
    finishedOnboarding: data?.finishedOnboarding ?? false,
  };
};
