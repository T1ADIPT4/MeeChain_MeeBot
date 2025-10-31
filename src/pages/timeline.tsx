import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

const mockTimeline = [
    { date: "2025-10-01", action: "โหวตใน MeeChain DAO" },
    { date: "2025-10-05", action: "รับ badge 'ผู้ร่วมก่อตั้ง'" },
    { date: "2025-10-10", action: "แสดงความคิดเห็นใน governance" }
];

export default function TimelinePage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>ประวัติการมีส่วนร่วมของคุณ 📜</h1>
            <MeeBotDailyPrompt />

            <ul style={{ marginTop: "2rem" }}>
                {mockTimeline.map((item, index) => (
                    <li key={index}>
                        <strong>{item.date}</strong>: {item.action}
                    </li>
                ))}
            </ul>
        </div>
    );
}
