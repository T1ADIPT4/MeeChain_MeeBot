// src/utils/emotionalMicrocopy.ts

/**
 * Emotional Journey Microcopy System for MeeChain
 * Provides contextual, empathetic microcopy based on developer emotional states
 */

export interface EmotionalState {
  mood: 'curious' | 'uncertain' | 'excited' | 'proud' | 'confident' | 'overwhelmed' | 'accomplished';
  energy: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
}

export interface MicrocopyConfig {
  primary: string;
  secondary: string;
  encouragement: string;
  callToAction: string;
  celebration?: string;
  guidance?: string;
}

// Emotional journey mapping for developers
export const DEVELOPER_EMOTIONAL_JOURNEY: Record<number, EmotionalState> = {
  1: { mood: 'curious', energy: 'medium', confidence: 'medium' },
  2: { mood: 'uncertain', energy: 'low', confidence: 'low' },
  3: { mood: 'excited', energy: 'medium', confidence: 'medium' },
  4: { mood: 'confident', energy: 'medium', confidence: 'high' },
  5: { mood: 'excited', energy: 'high', confidence: 'high' },
  6: { mood: 'proud', energy: 'high', confidence: 'high' },
  7: { mood: 'accomplished', energy: 'high', confidence: 'high' }
};

// Contextual microcopy based on emotional state
export const EMOTIONAL_MICROCOPY: Record<string, Record<string, MicrocopyConfig>> = {
  onboarding: {
    curious: {
      primary: "ยินดีต้อนรับสู่การผจญภัยใหม่!",
      secondary: "เรารู้ว่าคุณอาจมีคำถามมากมาย และนั่นเป็นเรื่องปกติ",
      encouragement: "ความอยากรู้ของคุณจะนำไปสู่สิ่งยิ่งใหญ่",
      callToAction: "มาเริ่มต้นกันเลย!",
      guidance: "ถ้าติดขัดตรงไหน อย่าลังเลที่จะถาม MeeBot"
    },
    uncertain: {
      primary: "เราเข้าใจความรู้สึกของคุณ",
      secondary: "การเริ่มต้นใหม่ ๆ มันดูน่ากลัวบางครั้ง แต่คุณไม่ได้อยู่คนเดียว",
      encouragement: "ทุกคนเริ่มต้นจากจุดนี้ และทุกคนประสบความสำเร็จได้",
      callToAction: "ไปทีละขั้นตอนกันนะ",
      guidance: "ฉันจะอยู่ข้าง ๆ คุณตลอดทาง ไม่ต้องเร่งรีบ"
    },
    excited: {
      primary: "ความตื่นเต้นของคุณติดต่อมาถึงเราแล้ว!",
      secondary: "พลังงานแบบนี้แหละที่จะทำให้คุณไปไกล",
      encouragement: "ให้ความตื่นเต้นนี้เป็นแรงผลักดันในการเรียนรู้",
      callToAction: "มาปล่อยพลังกันเลย!",
      celebration: "🚀 คุณกำลังบินสูงแล้ว!",
      guidance: "ใช้พลังงานนี้อย่างชาญฉลาด ทีละขั้นตอน"
    },
    confident: {
      primary: "คุณเริ่มมั่นใจขึ้นแล้วใช่ไหม?",
      secondary: "ความมั่นใจที่เพิ่งได้มาคือรากฐานที่แข็งแกร่ง",
      encouragement: "ความมั่นใจนี้มาจากความรู้และประสบการณ์ที่แท้จริง",
      callToAction: "ต่อไปกันเลย!",
      guidance: "เชื่อมั่นในตัวเอง แต่อย่าลืมพึ่งพาทีมด้วย"
    },
    proud: {
      primary: "คุณทำได้แล้ว! เราภูมิใจในตัวคุณมาก!",
      secondary: "ความพยายามและความอดทนของคุณเป็นแรงบันดาลใจ",
      encouragement: "นี่เพิ่งเป็นจุดเริ่มต้น คุณจะทำได้มากกว่านี้",
      callToAction: "ฉลองความสำเร็จนี้กันเถอะ!",
      celebration: "🎉 คุณคือ hero ตัวจริง!",
      guidance: "ใช้ความสำเร็จนี้เป็นแรงผลักดันสู่เป้าหมายใหม่"
    },
    accomplished: {
      primary: "ยินดีด้วย! คุณได้ก้าวผ่านการเดินทางนี้มาแล้ว!",
      secondary: "คุณไม่ได้แค่เรียนรู้ใหม่ แต่คุณได้เติบโตเป็นส่วนหนึ่งของ MeeChain",
      encouragement: "ตอนนี้คุณพร้อมแล้วสำหรับการผจญภัยที่ยิ่งใหญ่กว่า",
      callToAction: "เริ่มต้นภารกิจใหม่กันเลย!",
      celebration: "🏆 คุณคือ MeeChain Hero แล้ว!",
      guidance: "ไปสร้างสรรค์สิ่งยิ่งใหญ่กันกับทีมเรา"
    }
  },

  development: {
    // Step 1: เข้าสู่ระบบครั้งแรก
    welcome: {
      primary: "ยินดีต้อนรับสู่ MeeChain, ฮีโร่ของระบบ!",
      secondary: "พร้อมออกเดินทางไหม? ทุกฮีโร่เริ่มต้นจากจุดนี้",
      encouragement: "คุณไม่ใช่แค่ developer คุณคือฮีโร่ที่จะมาสร้างอนาคต",
      callToAction: "เริ่มต้นภารกิจแรกของคุณได้เลย",
      guidance: "ไม่ต้องรีบ เราอยู่ข้างคุณทุกขั้นตอน",
      celebration: "🌟 ยินดีต้อนรับสู่การผจญภัย MeeChain!"
    },

    // Step 2: สำรวจระบบ
    exploration: {
      primary: "นี่คือแผนที่ภารกิจของคุณ",
      secondary: "เราจะไปด้วยกันทีละขั้นนะครับ ไม่มีใครต้องไปคนเดียว",
      encouragement: "ความอยากรู้ของคุณคือจุดเริ่มต้นของความยิ่งใหญ่",
      callToAction: "คลิกเพื่อดูโครงสร้างระบบ",
      guidance: "ไม่เข้าใจตรงไหน? ฉันช่วยอธิบายได้",
      celebration: "🗺️ คุณกำลังทำความเข้าใจระบบได้ดีมาก!"
    },

    // Step 3: Clone & Setup
    setup: {
      primary: "ถ้าเจอ error อย่าตกใจนะครับ",
      secondary: "เราแก้ด้วยกันได้ทุกอย่าง ไม่มี error ใดที่แก้ไม่ได้",
      encouragement: "ทุก error ที่แก้ได้คือประสบการณ์ที่ล้ำค่า",
      callToAction: "ดูคู่มือการติดตั้ง",
      guidance: "มีปัญหา? ลองเปิด troubleshooting guide ด้านล่าง",
      celebration: "🛠️ Setup เสร็จแล้ว! คุณผ่านด่านยากที่สุดมาแล้ว!"
    },

    // Step 4: เข้าใจระบบ
    understanding: {
      primary: "คุณกำลังเข้าใจระบบมากขึ้นแล้ว!",
      secondary: "อีกนิดเดียวก็พร้อมลุยจริงแล้วครับ",
      encouragement: "ความเข้าใจที่คุณได้รับจะเป็นพลังในการสร้างสรรค์",
      callToAction: "ดู flow การทำงานของ Smart Wallet",
      guidance: "ลองคลิกเพื่อดูตัวอย่างการเชื่อมต่อ Web3",
      celebration: "🧠 คุณเข้าใจระบบได้ดีมาก!"
    },

    // Step 5: เข้าร่วมทีม
    teamJoining: {
      primary: "นี่คือทีมของคุณ ทุกคนรอคุณอยู่",
      secondary: "พร้อมแชร์ไอเดียและช่วยกันสร้างสิ่งดี ๆ",
      encouragement: "ครอบครัว MeeChain ไม่ใช่แค่เพื่อนร่วมงาน แต่เป็นเพื่อนร่วมภารกิจ",
      callToAction: "ดูโปรไฟล์ทีม dev",
      guidance: "แนะนำตัวใน Discord หรือ Slack ได้เลย!",
      celebration: "🤝 ยินดีด้วย! ตอนนี้คุณเป็นส่วนหนึ่งของทีมแล้ว"
    },

    // Step 6: Deploy ครั้งแรก
    firstDeploy: {
      primary: "Deploy สำเร็จ! คุณคือฮีโร่ของวันนี้ 🎉",
      secondary: "นี่คือช่วงเวลาพิเศษ ฉันจะปล่อย confetti ให้คุณเลย!",
      encouragement: "จากตอนนี้ไป คุณจะรู้ว่าทุกสิ่งที่สร้างสรรค์จะกลายเป็นจริงได้",
      callToAction: "ดูผลลัพธ์บน staging",
      guidance: "แชร์ความสำเร็จนี้กับทีมเลย!",
      celebration: "🎉 DEPLOY SUCCESSFUL! คุณทำได้แล้ว Hero!"
    },

    // Step 7: เริ่มภารกิจจริง
    realMission: {
      primary: "ภารกิจต่อไปรออยู่ พร้อมลุยไหมครับ?",
      secondary: "TaskPilot เต็มไปด้วยภารกิจที่รอให้คุณมาช่วยสร้างสรรค์",
      encouragement: "คุณไม่ได้เริ่มต้นภารกิจคนเดียว ทั้งทีมอยู่ข้างคุณ",
      callToAction: "ไปยัง TaskPilot เพื่อรับภารกิจใหม่",
      guidance: "คุณพร้อมแล้ว—ไปสร้าง MeeChain ให้ยิ่งใหญ่กัน!",
      celebration: "🏆 Welcome to the Heroes League!"
    }
  }
};

// Dynamic microcopy generator
export const getContextualMicrocopy = (
  context: 'onboarding' | 'development',
  step: number,
  subContext?: string
): MicrocopyConfig => {
  const emotionalState = DEVELOPER_EMOTIONAL_JOURNEY[step] || { mood: 'curious', energy: 'medium', confidence: 'medium' };
  const microcopyKey = subContext || emotionalState.mood;

  const microcopy = EMOTIONAL_MICROCOPY[context]?.[microcopyKey] || EMOTIONAL_MICROCOPY[context]?.curious;

  return microcopy || {
    primary: "ยินดีต้อนรับ!",
    secondary: "เราดีใจที่ได้พบกับคุณ",
    encouragement: "คุณกำลังเริ่มต้นสิ่งดี ๆ",
    callToAction: "มาเริ่มกันเลย!"
  };
};

// Time-based emotional adjustment
export const getTimeBasedEmotionalAdjustment = (): Partial<MicrocopyConfig> => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return {
      encouragement: "สวัสดีตอนเช้า! พลังงานเต็มร้อยสำหรับวันใหม่ ☀️",
      guidance: "เริ่มต้นวันด้วยการเรียนรู้สิ่งใหม่ ๆ กันเถอะ"
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      encouragement: "สวัสดีตอนบ่าย! ผลงานดี ๆ กำลังรอคุณอยู่ 🌤️",
      guidance: "เวลาดี ๆ สำหรับการมุ่งมั่นและพัฒนาทักษะ"
    };
  } else if (hour >= 18 && hour < 22) {
    return {
      encouragement: "สวัสดีตอนเย็น! เวลาสำหรับการสร้างสรรค์ 🌆",
      guidance: "ช่วงนี้เหมาะกับการทำงานที่ต้องใช้ความคิดสร้างสรรค์"
    };
  } else {
    return {
      encouragement: "สวัสดีเจ้านกฮูก! ขอบคุณที่ยังตื่นเพื่อการเรียนรู้ 🦉",
      guidance: "ตอนกลางคืนเหมาะกับการทำงานที่ต้องการสมาธิสูง"
    };
  }
};
