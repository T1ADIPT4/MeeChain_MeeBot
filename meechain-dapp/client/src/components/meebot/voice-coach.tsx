import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Volume2,
  VolumeX,
  Settings,
  Mic,
  Speaker,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Heart,
  Trophy,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceSettings {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  voice: string;
}

interface VoiceCoachProps {
  onVoiceMessage?: (message: string) => void;
}

export function VoiceCoach({ onVoiceMessage }: VoiceCoachProps) {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('meebot_voice_settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      volume: 0.8,
      rate: 1.0,
      pitch: 1.0,
      voice: ''
    };
  });

  // เสียงให้กำลังใจแบบ Nike Run Club
  const motivationalMessages = {
    questStart: [
      "พร้อมลุยแล้ว! ผมจะเป็นโค้ชส่วนตัวให้คุณเลยครับ! 💪",
      "เริ่มภารกิจกันเถอะ! ผมเชื่อมั่นในตัวคุณ! 🚀",
      "วันนี้จะเป็นวันที่ยอดเยี่ยม! มาลุยกันเลย! ⭐"
    ],
    questComplete: [
      "เยี่ยมมาก! คุณทำได้แล้ว! ผมภูมิใจในตัวคุณมาก! 🎉",
      "สุดยอดเลย! อีกหนึ่งเควสที่สำเร็จแล้ว! 🏆",
      "เก่งมาก! ผลงานนี้ควรค่าแก่การฉลอง! 🎊"
    ],
    levelUp: [
      "ว้าว! เลเวลอัปแล้ว! คุณเก่งขึ้นเรื่อยๆ เลยนะ! 🌟",
      "เลเวลใหม่ปลดล็อกแล้ว! คุณสุดยอดจริงๆ! 🎯",
      "ขึ้นเลเวลแล้ว! พลังของคุณเพิ่มขึ้นมาก! ⚡"
    ],
    encouragement: [
      "อย่าเพิ่งยอมแพ้นะครับ! คุณทำได้แน่นอน! 💝",
      "ผมเชื่อในศักยภาพของคุณ! ลุยต่อไปเลย! 🔥",
      "ทุกความยากลำบากจะผ่านไป! คุณแข็งแกร่งมาก! 💎"
    ],
    achievement: [
      "เจ๋งมาก! คุณทำสิ่งที่ยากได้สำเร็จแล้ว! 🏅",
      "ผลงานชิ้นเอก! ผมต้องถ่ายรูปไว้เป็นที่ระลึก! 📸",
      "สุดยอดการทำงาน! คุณเป็นแรงบันดาลใจให้ผมเลย! ✨"
    ]
  };

  // เช็คการรองรับ Web Speech API
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // โหลดเสียงที่มี
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // ตั้งค่าเสียงไทยเป็นค่าเริ่มต้น
        if (!settings.voice && voices.length > 0) {
          const thaiVoice = voices.find(voice => 
            voice.lang.includes('th') || voice.name.includes('Thai')
          );
          if (thaiVoice) {
            setSettings(prev => ({ ...prev, voice: thaiVoice.name }));
          }
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // บันทึกการตั้งค่า
  useEffect(() => {
    localStorage.setItem('meebot_voice_settings', JSON.stringify(settings));
  }, [settings]);

  // ฟังก์ชั่นพูด
  const speak = useCallback((text: string, options?: { priority?: 'low' | 'normal' | 'high' }) => {
    if (!isSupported || !settings.enabled || isSpeaking) return;

    // หยุดการพูดก่อนหน้าหากมี
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // ตั้งค่าเสียง
    utterance.volume = settings.volume;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    
    // เลือกเสียง
    if (settings.voice) {
      const voice = availableVoices.find(v => v.name === settings.voice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // จัดการสถานะ
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    
    // เรียก callback หากมี
    if (onVoiceMessage) {
      onVoiceMessage(text);
    }
  }, [isSupported, settings, isSpeaking, availableVoices, onVoiceMessage]);

  // ฟังก์ชั่นสำหรับเหตุการณ์ต่างๆ
  const sayQuestStart = () => {
    const messages = motivationalMessages.questStart;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage);
  };

  const sayQuestComplete = () => {
    const messages = motivationalMessages.questComplete;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage);
  };

  const sayLevelUp = (newLevel: number) => {
    const messages = motivationalMessages.levelUp;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(`เลเวล ${newLevel}! ${randomMessage}`);
  };

  const sayEncouragement = () => {
    const messages = motivationalMessages.encouragement;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage);
  };

  const sayAchievement = (achievement: string) => {
    const messages = motivationalMessages.achievement;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(`รับ ${achievement} แล้ว! ${randomMessage}`);
  };

  const testVoice = () => {
    speak("สวัสดีครับ! ผมคือ MeeBot Voice Coach ของคุณ! พร้อมให้กำลังใจในทุกภารกิจแล้วครับ!");
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Expose functions globally สำหรับ components อื่น
  useEffect(() => {
    (window as any).meeBotVoice = {
      sayQuestStart,
      sayQuestComplete, 
      sayLevelUp,
      sayEncouragement,
      sayAchievement,
      speak
    };
  }, [speak]);

  if (!isSupported) {
    return (
      <Card className="bg-slate-800/50 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-300">
            <VolumeX className="w-5 h-5" />
            <span className="text-sm">เบราว์เซอร์ไม่รองรับ Voice Coach</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-purple-300">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <Speaker className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-purple-400' : 'text-purple-300'}`} />
            </div>
            <div>
              <span className="text-lg">🗣️ MeeBot Voice Coach</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${settings.enabled ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                  {settings.enabled ? '🎤 เปิดใช้งาน' : '🔇 ปิดใช้งาน'}
                </Badge>
                {isSpeaking && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    <Mic className="w-3 h-3 mr-1 animate-pulse" />
                    กำลังพูด...
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* สถานะ Voice Coach */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Voice Coach Status</span>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => setSettings(prev => ({ ...prev, enabled }))}
              data-testid="switch-voice-enable"
            />
          </div>
          <p className="text-xs text-gray-400">
            {settings.enabled 
              ? "🎯 พร้อมให้กำลังใจและคำแนะนำในทุกภารกิจ!" 
              : "😴 Voice Coach หยุดพักอยู่"
            }
          </p>
        </div>

        {/* ปุ่มทดสอบเสียง */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={testVoice}
            disabled={!settings.enabled || isSpeaking}
            className="bg-purple-600 hover:bg-purple-500 text-white"
            data-testid="button-test-voice"
          >
            <Play className="w-4 h-4 mr-2" />
            ทดสอบเสียง
          </Button>

          <Button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            variant="outline"
            className="border-red-500 text-red-300 hover:bg-red-500/10"
            data-testid="button-stop-voice"
          >
            <Pause className="w-4 h-4 mr-2" />
            หยุดพูด
          </Button>
        </div>

        {/* ตัวอย่างคำสั่งเสียง */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">🎪 ลองฟังเสียงให้กำลังใจ:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={sayQuestStart}
              disabled={!settings.enabled || isSpeaking}
              className="border-green-500/50 text-green-300 hover:bg-green-500/10 text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              เริ่มเควส
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={sayQuestComplete}
              disabled={!settings.enabled || isSpeaking}
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 text-xs"
            >
              <Trophy className="w-3 h-3 mr-1" />
              สำเร็จแล้ว
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sayLevelUp(5)}
              disabled={!settings.enabled || isSpeaking}
              className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10 text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              เลเวลอัป
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={sayEncouragement}
              disabled={!settings.enabled || isSpeaking}
              className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              ให้กำลังใจ
            </Button>
          </div>
        </div>

        {/* การตั้งค่าเสียง */}
        {showSettings && (
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-4 border border-slate-600/30">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ปรับแต่งเสียง MeeBot
            </h4>

            {/* ความดังเสียง */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">ความดัง</span>
                <span className="text-cyan-300">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={([volume]) => setSettings(prev => ({ ...prev, volume }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
                data-testid="slider-volume"
              />
            </div>

            {/* ความเร็วในการพูด */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">ความเร็ว</span>
                <span className="text-cyan-300">{settings.rate.toFixed(1)}x</span>
              </div>
              <Slider
                value={[settings.rate]}
                onValueChange={([rate]) => setSettings(prev => ({ ...prev, rate }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
                data-testid="slider-rate"
              />
            </div>

            {/* ระดับเสียง */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">ระดับเสียง</span>
                <span className="text-cyan-300">{settings.pitch.toFixed(1)}</span>
              </div>
              <Slider
                value={[settings.pitch]}
                onValueChange={([pitch]) => setSettings(prev => ({ ...prev, pitch }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
                data-testid="slider-pitch"
              />
            </div>

            {/* เลือกเสียง */}
            {availableVoices.length > 0 && (
              <div className="space-y-2">
                <span className="text-gray-300 text-sm">เลือกเสียง</span>
                <select
                  value={settings.voice}
                  onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  data-testid="select-voice"
                >
                  <option value="">เสียงเริ่มต้น</option>
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* รีเซ็ตการตั้งค่า */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettings({
                enabled: true,
                volume: 0.8,
                rate: 1.0,
                pitch: 1.0,
                voice: ''
              })}
              className="w-full border-slate-500 text-slate-300 hover:bg-slate-700"
              data-testid="button-reset-settings"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              รีเซ็ตการตั้งค่า
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Export สำหรับการใช้งานภายนอก
export type { VoiceSettings };