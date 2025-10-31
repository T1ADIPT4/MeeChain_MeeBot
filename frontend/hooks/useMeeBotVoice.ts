import { useEffect } from 'react';
import type { UserState } from '../utils/userState';

// Map context/activity/marketStatus to .mp3 file
const voiceMap: Record<string, string> = {
  welcome: '/assets/meebot-welcome.mp3',
  'market-red': '/assets/meebot-market-red.mp3',
  badge: '/assets/meebot-badge.mp3',
  reminder: '/assets/meebot-reminder.mp3',
};

export function useMeeBotVoice(
  message: string,
  enabled: boolean = true,
  context?: 'welcome' | 'market-red' | 'badge' | 'reminder',
  userState?: UserState
) {
  useEffect(() => {
    if (!enabled) return;
    // Reminder logic
    const hasReminder = userState && (!userState.hasVoted || !userState.claimedBadge || !userState.finishedOnboarding);
    let audio: HTMLAudioElement | null = null;
    if (hasReminder) {
      // Play reminder mp3 if available, fallback to TTS
      if (voiceMap['reminder']) {
        audio = new Audio(voiceMap['reminder']);
        audio.play();
        return () => { audio && audio.pause(); };
      } else if (message) {
        const synth = window.speechSynthesis;
        if (!synth) return;
        const utter = new window.SpeechSynthesisUtterance(message);
        utter.lang = 'th-TH';
        utter.rate = 1.05;
        utter.pitch = 1.1;
        synth.cancel();
        synth.speak(utter);
        return () => synth.cancel();
      }
      return;
    }
    if (context && voiceMap[context]) {
      audio = new Audio(voiceMap[context]);
      audio.play();
      return () => {
        audio && audio.pause();
      };
    }
    if (!message) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new window.SpeechSynthesisUtterance(message);
    utter.lang = 'th-TH';
    utter.rate = 1.05;
    utter.pitch = 1.1;
    synth.cancel();
    synth.speak(utter);
    return () => synth.cancel();
  }, [message, enabled, context, userState]);
}
