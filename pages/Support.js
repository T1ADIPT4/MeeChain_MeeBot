// pages/Support.tsx
import React from 'react';
import { useFAQ } from '../hooks/useFAQ';
import { MeeBot } from '../components/MeeBot';
export default function SupportPage() {
    const { faq, loading } = useFAQ();
    if (loading) {
        MeeBot.setSprite('thinking');
        return React.createElement("p", null, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E35\u0E48\u0E1E\u0E1A\u0E1A\u0E48\u0E2D\u0E22...");
    }
    MeeBot.setSprite('helpful');
    MeeBot.speak('มีอะไรให้ช่วยไหมครับ? ลองดูคำถามที่พบบ่อยด้านล่างได้เลย');
    return (React.createElement("div", null,
        React.createElement("h1", null, "Support"),
        faq.map((item, index) => (React.createElement("div", { key: index, className: "faq-item" },
            React.createElement("h3", null, item.question),
            React.createElement("p", null, item.answer))))));
}
//# sourceMappingURL=Support.js.map