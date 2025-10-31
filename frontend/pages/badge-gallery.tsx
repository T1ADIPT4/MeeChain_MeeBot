import React, { useEffect, useState } from 'react';
// @ts-ignore
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MeeBotHint from '../components/MeeBotHint';
import MeeBotToast from '../components/MeeBotToast';
import { motion } from 'framer-motion';
import { useMeeBotVoice } from '../hooks/useMeeBotVoice';

interface Badge {
    id: string;
    name: string;
    icon: string;
}


const BadgeGallery = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [newBadge, setNewBadge] = useState<Badge | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            const snap = await getDocs(collection(db, 'badges'));
            const badgeList = snap.docs.map(
                (doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Badge)
            );
            setBadges(badgeList);
            setLoading(false);
            // Simulate unlocking a new badge for test/demo
            if (badgeList.length > 0) {
                setTimeout(() => {
                    setNewBadge(badgeList[0]);
                    setShowToast(true);
                }, 2000);
            }
        };
        fetchBadges();
    }, []);

    // MeeBot voice assistant: speak when new badge unlocked
    useMeeBotVoice(newBadge ? `ยินดีด้วย คุณได้รับ badge ${newBadge.name}` : '', !!newBadge);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
            <h2>🏅 Contributor Badges</h2>
            <MeeBotHint activity="new-contributor" />
            <MeeBotToast message={newBadge ? `🎉 คุณได้รับ badge ใหม่: ${newBadge.name}!` : ''} show={showToast} onClose={() => setShowToast(false)} />
            {loading ? <div>Loading...</div> : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {badges.map(badge => (
                        <motion.div
                            key={badge.id}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                margin: '1rem',
                                padding: '1rem',
                                background: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                minWidth: 140,
                                textAlign: 'center'
                            }}
                        >
                            <img src={badge.icon} alt={badge.name} style={{ width: '80px' }} />
                            <p>{badge.name}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BadgeGallery;
