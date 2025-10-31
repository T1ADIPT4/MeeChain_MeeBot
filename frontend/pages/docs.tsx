import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MeeBotHint from '../components/MeeBotHint';
import MeeBotToast from '../components/MeeBotToast';
import { useMeeBotVoice } from '../hooks/useMeeBotVoice';

const DocsOnboarding = () => {

    const [steps, setSteps] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const snap = await getDocs(collection(db, 'onboardingSteps'));
                if (snap.empty) {
                    setSteps([
                        'สมัคร wallet และเชื่อมต่อกับ MeeChain',
                        'อ่านคู่มือ contributor และ governance',
                        'ทดลองสว็อบหรือโหวตข้อเสนอแรก',
                        'รับ badge แรกจาก MeeBot!'
                    ]);
                } else {
                    setSteps(snap.docs.map(doc => doc.data().text));
                }
            } catch {
                setSteps([
                    'สมัคร wallet และเชื่อมต่อกับ MeeChain',
                    'อ่านคู่มือ contributor และ governance',
                    'ทดลองสว็อบหรือโหวตข้อเสนอแรก',
                    'รับ badge แรกจาก MeeBot!'
                ]);
            }
            setLoading(false);
            // Simulate onboarding complete for test/demo
            setTimeout(() => {
                setOnboardingComplete(true);
                setShowToast(true);
            }, 2000);
        };
        fetchSteps();
    }, []);

    // MeeBot voice assistant: speak when onboarding is complete
    useMeeBotVoice(onboardingComplete ? 'คุณเรียนรู้ครบทุกขั้นตอนแล้ว ยินดีต้อนรับสู่ MeeChain!' : '', onboardingComplete);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h2>📚 MeeChain Onboarding</h2>
            <MeeBotHint activity="onboarding" />
            <MeeBotToast message="📘 MeeBot: คุณเรียนรู้ครบทุกขั้นตอนแล้ว ยินดีต้อนรับสู่ MeeChain!" show={showToast} onClose={() => setShowToast(false)} />
            {loading ? <div>Loading...</div> : (
                <ol style={{ paddingLeft: 24 }}>
                    {steps.map((s, i) => (
                        <li key={i} style={{ marginBottom: 12, fontSize: 18 }}>{s}</li>
                    ))}
                </ol>
            )}
            <div style={{ marginTop: 24, color: '#00796b', fontWeight: 500 }}>
                MeeBot: ยินดีต้อนรับสู่ MeeChain! ถ้ามีคำถาม MeeBot พร้อมช่วยเหลือเสมอ
            </div>
        </div>
    );
};

export default DocsOnboarding;
