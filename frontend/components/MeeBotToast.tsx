import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { UserState } from '../utils/userState';
interface MeeBotToastProps {
    message?: string;
    show: boolean;
    onClose: () => void;
    marketStatus?: 'green' | 'red' | 'neutral';
    activity?: 'swap' | 'new-contributor' | 'vote' | 'default';
    userState?: UserState;
}


const getToastMessage = (activity?: string, marketStatus?: string, message?: string, userState?: UserState) => {
    if (userState) {
        if (!userState.hasVoted) return '🗳️ มีเพื่อน: ยังไม่ได้โหวตข้อเสนอล่าสุดเลยนะ ลองเข้าไปดูสิ!';
        if (!userState.claimedBadge) return '🏅 มีเพื่อน: คุณมี badge ที่ยังไม่ได้รับ อย่าลืมไปกดรับนะ!';
        if (!userState.finishedOnboarding) return '📘 มีเพื่อน: onboarding ยังไม่ครบ ลุยต่ออีกนิดเดียว!';
    }
    if (message) return message;
    if (marketStatus === 'red') {
        return '🥲 มีเพื่อน: ตลาดแดงไม่ใช่ปัญหา ถ้ามีเพื่อนอย่างเราอยู่ข้าง ๆ 😉';
    }
    if (marketStatus === 'green') {
        return '🎉 มีเพื่อน: ตลาดเขียวแบบนี้ ขอให้โชคดีทั้งวัน!';
    }
    if (activity === 'vote') {
        return '🗳️ มีเพื่อน: โหวตแล้วนะ อย่าลืมล้างจานด้วยล่ะ!';
    }
    if (activity === 'swap') {
        return '😎 มีเพื่อน: กล้าสว็อบในวันที่ตลาดแดง ใจมันได้!';
    }
    return '🧠 มีเพื่อน: ยินดีต้อนรับกลับเข้าสู่ระบบ MeeChain!';
};

const getBackground = (marketStatus?: string) => {
    if (marketStatus === 'red') return 'linear-gradient(to right, #ffe6e6, #ffd6d6)';
    if (marketStatus === 'green') return 'linear-gradient(to right, #e6fff7, #d6f7ff)';
    return 'linear-gradient(to right, #e0f7fa, #b2ebf2)';
};

const MeeBotToast: React.FC<MeeBotToastProps> = ({ message, show, onClose, marketStatus, activity, userState }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    // Only show if hasReminder or show is true
    const hasReminder = userState && (!userState.hasVoted || !userState.claimedBadge || !userState.finishedOnboarding);
    const shouldShow = hasReminder || show;
    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        background: getBackground(marketStatus),
                        color: '#00796b',
                        borderRadius: 12,
                        padding: '1rem 2rem',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        zIndex: 9999,
                        fontWeight: 500
                    }}
                >
                    <span role="img" aria-label="MeeBot">{hasReminder ? '👀' : '🤖'}</span> {getToastMessage(activity, marketStatus, message, userState)}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MeeBotToast;
