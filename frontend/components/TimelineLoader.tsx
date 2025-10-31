import React from 'react';
import { motion } from 'framer-motion';

const TimelineLoader = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ textAlign: 'center', margin: '2rem 0', color: '#aaa' }}
    >
        <span role="img" aria-label="loading">⏳</span> กำลังโหลดกิจกรรม...
    </motion.div>
);

export default TimelineLoader;
