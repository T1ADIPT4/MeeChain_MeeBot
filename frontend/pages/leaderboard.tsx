import MultichainPortfolio from '../components/MultichainPortfolio';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MeeBotHint from '../components/MeeBotHint';
import MeeBotToast from '../components/MeeBotToast';
import { getUserState, UserState } from '../utils/userState';
import { motion } from 'framer-motion';

interface Contributor {
    id: string;
    name: string;
    icon: string;
    score: number;
}

const Leaderboard: React.FC = () => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [userState, setUserState] = useState<UserState | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [rankUp, setRankUp] = useState(false);

    useEffect(() => {
        // Fetch contributors from Firestore
        const fetchContributors = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'contributors'));
                const data: Contributor[] = [];
                querySnapshot.forEach((doc) => {
                    const d = doc.data();
                    data.push({
                        id: doc.id,
                        name: d.name || 'Unknown',
                        icon: d.icon || '👤',
                        score: d.score || 0,
                    });
                });
                // Sort by score descending
                data.sort((a, b) => b.score - a.score);
                setContributors(data);
            } catch (e) {
                // fallback: show empty
                setContributors([]);
            }
            setLoading(false);
        };
        fetchContributors();
    }, []);

    useEffect(() => {
        // Fetch user state
        const fetchUserState = async () => {
            const state = await getUserState('currentUser'); // <-- provide required argument
            setUserState(state);
            // Example: show toast if user just ranked up
            if (state && 'justRankedUp' in state && (state as any).justRankedUp) {
                setShowToast(true);
                setRankUp(true);
            }
        };
        fetchUserState();
    }, []);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const top = contributors[0]?.name;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h2>🏆 Leaderboard</h2>
            <MeeBotHint activity={top ? 'default' : 'vote'} userState={userState ?? undefined} />
            <MeeBotToast show={showToast} onClose={() => setShowToast(false)} activity="default" userState={userState ?? undefined} />
            <MultichainPortfolio wallet="0xd39aDc5E0900d54338bAe30958Fb289106202f5b" />
            {loading ? <div>Loading...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {contributors.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                background: i === 0 ? '#e6ffe6' : '#f9f9f9',
                                borderRadius: 12,
                                padding: 16,
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 2px 8px #e0e0e0'
                            }}
                        >
                            <span style={{ fontSize: 32, marginRight: 16 }}>{c.icon}</span>
                            <div>
                                <strong>{c.name}</strong> <span style={{ color: '#888' }}>คะแนน {c.score}</span>
                                {i === 0 && <div style={{ color: '#388e3c', fontWeight: 500 }}>MeeBot: ยินดีด้วย! คุณขึ้นอันดับ 1 แล้ว!</div>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;

