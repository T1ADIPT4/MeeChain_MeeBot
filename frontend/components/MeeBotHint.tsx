import React from 'react';
import { motion } from 'framer-motion';
// Asset imports and type declarations for MeeBot avatar and sound
// @ts-expect-error: PNG module type is declared elsewhere
import meeBotAvatar from '../assets/meebot.png';
// @ts-expect-error: MP3 module type is declared elsewhere
import pingSound from '../assets/meebot-ping.mp3';
import useSound from 'use-sound';

// (Type declarations for asset modules should be placed in separate .d.ts files in your project root or src folder)

// เสียง MeeBot: The '*.mp3' module declaration should be placed in a separate .d.ts file in your project root or src folder.

import type { UserState } from '../utils/userState';
interface MeeBotHintProps {
    activity: 'swap' | 'new-contributor' | 'vote' | 'default';
    marketStatus?: 'green' | 'red' | 'neutral';
    userState?: UserState;
}

// Allow any motion animation properties for imgAnimation
type ImgAnimation = Record<string, any>;


const MeeBotHint: React.FC<MeeBotHintProps> = ({ activity, marketStatus, userState }) => {
    // Reminder logic
    const hasReminder = userState && (!userState.hasVoted || !userState.claimedBadge || !userState.finishedOnboarding);
    const getReminderMessage = (userState?: UserState) => {
        if (!userState) return '';
        if (!userState.hasVoted) return '🗳️ มีเพื่อน: ยังไม่ได้โหวตข้อเสนอล่าสุดเลยนะ ลองเข้าไปดูสิ!';
        if (!userState.claimedBadge) return '🏅 มีเพื่อน: คุณมี badge ที่ยังไม่ได้รับ อย่าลืมไปกดรับนะ!';
        if (!userState.finishedOnboarding) return '📘 มีเพื่อน: onboarding ยังไม่ครบ ลุยต่ออีกนิดเดียว!';
        return '🧠 มีเพื่อน: ทุกอย่างเรียบร้อยดี! พร้อมลุยแล้ว!';
    };
    const [play] = useSound(pingSound, { volume: 0.5 });

    // Context-aware, playful, warm message + emoji
    const getMessage = (activity: string, marketStatus?: string) => {
        if (activity === 'swap' && marketStatus === 'red') {
            return '📉 มีเพื่อน: ตลาดแดงแสบตา แต่คุณยังกล้าสว็อบ! ใจมันได้จริง ๆ 😎';
        }
        if (activity === 'swap' && marketStatus === 'green') {
            return '🟢 มีเพื่อน: ตลาดเขียวสดใส สว็อบแล้วขอให้โชคดี!';
        }
        if (activity === 'swap') {
            return '🤝 มีเพื่อน: สว็อบเสร็จแล้ว ไปพักสายตาสักหน่อยมั้ย?';
        }
        if (activity === 'vote') {
            return '🗳️ มีเพื่อน: โหวตแล้วนะ อย่าลืมล้างจานด้วยล่ะ!';
        }
        if (activity === 'new-contributor') {
            return '👋 มีเพื่อน: Contributor ใหม่มาแล้ว! อย่าลืมชวนกินข้าวเที่ยงด้วยนะ';
        }
        if (activity === 'badge') {
            return '🎉 มีเพื่อน: ปังมาก! ได้ badge ใหม่แล้ว ไปอวดเพื่อนเร็ว!';
        }
        if (marketStatus === 'red') {
            return '🥲 มีเพื่อน: ตลาดแดงไม่ใช่ปัญหา ถ้ามีเพื่อนอย่างเราอยู่ข้าง ๆ 😉';
        }
        if (marketStatus === 'green') {
            return '🎉 มีเพื่อน: ตลาดเขียวแบบนี้ ขอให้โชคดีทั้งวัน!';
        }
        return '🧠 มีเพื่อน: ยินดีต้อนรับกลับเข้าสู่ระบบ MeeChain!';
    };

    // Emoji by context
    const getEmoji = (activity: string, marketStatus?: string) => {
        if (activity === 'swap' && marketStatus === 'red') return '😎';
        if (activity === 'swap' && marketStatus === 'green') return '🤑';
        if (activity === 'swap') return '🤝';
        if (activity === 'vote') return '🗳️';
        if (activity === 'new-contributor') return '👋';
        if (activity === 'badge') return '🎉';
        if (marketStatus === 'red') return '🥲';
        if (marketStatus === 'green') return '🎉';
        return '🧠';
    };

    React.useEffect(() => {
        play(); // เล่นเสียงเมื่อ MeeBot ปรากฏ
    }, [activity, marketStatus]);
    // Mood Engine: background color by marketStatus or reminder
    const getBackground = () => {
        if (hasReminder) return '#fffbe6'; // yellow highlight for reminder
        if (marketStatus === 'red') return 'linear-gradient(to right, #ffe6e6, #ffd6d6)';
        if (marketStatus === 'green') return 'linear-gradient(to right, #e6fff7, #d6f7ff)';
        return '#fff';
    };

    // Animation: waving for new-contributor/login, heartbeat for badge, bounce for others, shake for reminder
    let imgAnimation: ImgAnimation = { rotate: [0, 10, -10, 0] };
    let imgTransition = { duration: 1.5, repeat: Infinity };
    if (hasReminder) {
        imgAnimation = { x: [0, -8, 8, 0] };
        imgTransition = { duration: 0.5, repeat: Infinity };
    } else if (activity === 'new-contributor' || activity === 'default') {
        imgAnimation = { rotate: [0, 20, -20, 0] };
        imgTransition = { duration: 1.2, repeat: Infinity };
    }
    // If you want to add a special animation for 'badge', you can check for it here
    // else if (activity === 'badge') {
    //     imgAnimation = { scale: [1, 1.15, 1], filter: ['drop-shadow(0 0 0 #ff69b4)', 'drop-shadow(0 0 8px #ff69b4)', 'drop-shadow(0 0 0 #ff69b4)'] };
    //     imgTransition = { duration: 0.8, repeat: Infinity };
    // }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                background: getBackground(),
                padding: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '1rem'
            }}
        >
            <motion.img
                src={meeBotAvatar}
                alt="MeeBot"
                initial={{ rotate: -10 }}
                animate={imgAnimation}
                transition={imgTransition}
                style={{ width: '60px', marginRight: '1rem' }}
            />
            <div style={{ fontSize: '1.1rem' }}>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{hasReminder ? '👀' : getEmoji(activity, marketStatus)}</span>
                {hasReminder ? getReminderMessage(userState) : getMessage(activity, marketStatus)}
            </div>
        </motion.div>
    );
};

export default MeeBotHint;
