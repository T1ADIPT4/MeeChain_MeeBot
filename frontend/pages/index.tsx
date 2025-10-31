import React, { useEffect, useState } from 'react';
import MeeBotHint from '../components/MeeBotHint';
import MeeBotToast from '../components/MeeBotToast';
import { useMeeBotVoice } from '../hooks/useMeeBotVoice';
import MultichainPortfolio from '../components/MultichainPortfolio';
import NavButton from '../components/NavButton';

const wallet = '0xd39aDc5E0900d54338bAe30958Fb289106202f5b';

const LandingPage = () => {
    const [showToast, setShowToast] = useState(true);
    const [activity, setActivity] = useState('welcome');
    const [userState, setUserState] = useState<any>(null);

    useMeeBotVoice('welcome', showToast, activity);

    useEffect(() => {
        setTimeout(() => setShowToast(false), 4000);
    }, []);

    return (
        <div className="landing-container" style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>ยินดีต้อนรับสู่ มีเชน</h1>
            <p style={{ fontSize: 18, marginBottom: 24 }}>เริ่มต้นการเดินทางของผู้มีส่วนร่วมของคุณ!</p>
            <MeeBotHint activity={activity} userState={userState} />
            <MeeBotToast show={showToast} onClose={() => setShowToast(false)} activity={activity} userState={userState} />
            <MultichainPortfolio wallet={wallet} />
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <NavButton to="/leaderboard">ดูอันดับผู้มีส่วนร่วม</NavButton>
                <NavButton to="/vote">โหวต</NavButton>
                <NavButton to="/timeline">ไทม์ไลน์</NavButton>
                <NavButton to="/badges">เหรียญตรา</NavButton>
            </div>
        </div>
    );
};

export default LandingPage;
