import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Removed direct import
import MeeBotHint from '../components/MeeBotHint';
import MeeBotToast from '../components/MeeBotToast';
import { useMeeBotVoice } from '../hooks/useMeeBotVoice';
import { getUserState, UserState } from '../utils/userState';
import styles from './vote.module.css'; // Import the CSS module

// Add Proposal type
type Proposal = {
    id: string;
    title: string;
    description: string;
    options: string[];
};

const VotePage = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [userState, setUserState] = useState<UserState | undefined>(undefined);
    const [showToast, setShowToast] = useState(false);
    const userId = '0xYourAddress'; // TODO: replace with real user address

    useEffect(() => {
        // Use fetch instead of axios
        fetch('/api/vote/proposals')
            .then(res => res.json())
            .then(data => setProposals(data));
        getUserState(userId).then(setUserState);
    }, []);

    // MeeBot Voice: play reminder if needed
    useMeeBotVoice(
        userState && (!userState.hasVoted) ? '🗳️ มีเพื่อน: ยังไม่ได้โหวตข้อเสนอล่าสุดเลยนะ ลองเข้าไปดูสิ!' : '',
        !!userState,
        userState && (!userState.hasVoted) ? 'reminder' : undefined,
        userState
    );

    const submitVote = async (proposalId: string, option: string) => {
        // Use fetch instead of axios
        await fetch('/api/vote/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                proposalId,
                voter: userId,
                option
            })
        });
        // After voting, update userState
        getUserState(userId).then(setUserState);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h2>🗳️ Governance Vote</h2>
            <MeeBotHint activity="vote" userState={userState} />
            <MeeBotToast show={showToast} onClose={() => setShowToast(false)} activity="vote" userState={userState} />
            {proposals.map(p => (
                <div key={p.id} className={styles.proposalContainer}>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    {p.options.map(opt => (
                        <button key={opt} className={styles.voteButton} onClick={() => submitVote(p.id, opt)}>{opt}</button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default VotePage;
