import MeeBotMoodSelector from "@/components/MeeBotMoodSelector";

export default function OnboardingPage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>เริ่มต้นใช้งาน MeeChain 🎉</h1>
            <p>ยินดีต้อนรับสู่แพลตฟอร์มที่ทุกการมีส่วนร่วมของคุณมีคุณค่า</p>

            <MeeBotMoodSelector />

            <div style={{ marginTop: "2rem" }}>
                <h3>ขั้นตอนถัดไป:</h3>
                <ol>
                    <li>เลือกอารมณ์ MeeBot ที่คุณชอบ</li>
                    <li>ตั้งค่าโปรไฟล์ผู้ใช้ (ชื่อ, wallet, ความสนใจ)</li>
                    <li>เริ่มสำรวจ Timeline และระบบโหวต</li>
                </ol>
            </div>

            <button
                onClick={() => (window.location.href = "/dashboard")}
                style={{
                    marginTop: "2rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6A00FF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem"
                }}
            >
                ไปที่ Dashboard
            </button>
        </div>
    );
}
