import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Firestore config
import TimelineEntry from '../components/TimelineEntry';
import MeeBotHint from '../components/MeeBotHint';
import { getUserState, UserState } from '../utils/userState';
import TimelineLoader from '../components/TimelineLoader';
import styles from '../styles/TimelinePage.module.css';

type LogEntry = {
    id: string;
    [key: string]: any;
};

const TimelinePage = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userState, setUserState] = useState<UserState | undefined>(undefined);
    const userId = '0xYourAddress'; // TODO: replace with real user address

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, 'contributorLogs'),
            (snapshot: QuerySnapshot<DocumentData>) => {
                const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
                setLogs(data.reverse()); // ล่าสุดอยู่บน
                setLoading(false);
            }
        );
        getUserState(userId).then(setUserState);
        return () => unsub();
    }, []);

    return (
        <div className={styles.timelineContainer}>
            <h2>📜 Contributor Timeline</h2>
            <MeeBotHint activity="timeline" userState={userState} />
            {loading ? <TimelineLoader /> : logs.map(log => <TimelineEntry key={log.id} log={log} />)}
        </div>
    );
};

export default TimelinePage;
