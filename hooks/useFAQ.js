// hooks/useFAQ.ts
import { useState, useEffect } from 'react';
import { loadFAQ } from '../utils/fallbackFAQ';
export function useFAQ() {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchFAQ() {
            const data = await loadFAQ();
            setFaq(data);
            setLoading(false);
        }
        fetchFAQ();
    }, []);
    return { faq, loading };
}
//# sourceMappingURL=useFAQ.js.map