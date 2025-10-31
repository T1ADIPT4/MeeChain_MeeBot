import MeeBotMoodSelector from "@/components/MeeBotMoodSelector";

const mockProfile = {
    name: "ธันวัฒน์",
    wallet: "0x1234...abcd",
    joined: "2025-10-01",
    interests: ["DAO", "Badge Design", "Contributor UX"]
};

export default function ProfilePage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>โปรไฟล์ของคุณ 🧑‍💻</h1>
            <MeeBotMoodSelector />

            <ul style={{ marginTop: "2rem" }}>
                <li><strong>ชื่อ:</strong> {mockProfile.name}</li>
                <li><strong>Wallet:</strong> {mockProfile.wallet}</li>
                <li><strong>เข้าร่วมเมื่อ:</strong> {mockProfile.joined}</li>
                <li><strong>ความสนใจ:</strong> {mockProfile.interests.join(", ")}</li>
            </ul>

            <p style={{ marginTop: "2rem" }}>
                MeeBot ดีใจมากที่ได้ร่วมงานกับคุณครับ 💜 ถ้ามีอะไรให้ช่วยเพิ่มเติม บอกได้เลย!
            </p>
        </div>
    );
}
