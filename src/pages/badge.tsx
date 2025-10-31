import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

const badges = [
    { id: "founder", label: "ผู้ร่วมก่อตั้ง", date: "2025-10-05" },
    { id: "voter", label: "นักโหวต DAO", date: "2025-10-10" }
];

export default function BadgePage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>เหรียญตราของคุณ 🎖️</h1>
            <MeeBotDailyPrompt />

            <ul style={{ marginTop: "2rem" }}>
                {badges.map((badge) => (
                    <li key={badge.id}>
                        <strong>{badge.label}</strong> – ได้รับเมื่อ {badge.date}
                    </li>
                ))}
            </ul>

            <p style={{ marginTop: "2rem" }}>
                MeeBot ขอแสดงความยินดีครับ! คุณได้รับ {badges.length} badge แล้ว 🎉
            </p>
        </div>
    );
}
