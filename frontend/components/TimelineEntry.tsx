import React from 'react';
import { motion } from 'framer-motion';

interface TimelineLog {
    action: string;
    userAddress: string;
    timestamp: string | number | Date;
    tierUsed?: string;
}

interface TimelineEntryProps {
    log: TimelineLog;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ log }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}
        >
            <strong>{log.action}</strong> โดย <code>{log.userAddress}</code>
            <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
            {log.tierUsed && <p>🧠 มีเพื่อน: ใช้ Tier <strong>{log.tierUsed}</strong> ในการสว็อบ</p>}
        </motion.div>
    );
};

export default TimelineEntry;
