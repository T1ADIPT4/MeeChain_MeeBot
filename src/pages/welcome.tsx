import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeeBotMoodSelector from "../components/MeeBotMoodSelector";
import MeeBotDailyPrompt from "../components/MeeBotDailyPrompt";
import MeeBotWithNotification from "../components/MeeBotWithNotification";


export default function WelcomePage() {
    const [isNewUser, setIsNewUser] = useState(true);
    const [voteCount, setVoteCount] = useState(0);
    const [latestBadge, setLatestBadge] = useState("");
    const [mood, setMood] = useState("supportive");

    const navigate = useNavigate();
    useEffect(() => {
        // ตรวจสอบสถานะผู้ใช้
        const userStatus = localStorage.getItem("userStatus");
        setIsNewUser(userStatus !== "returning");

        // ดึงข้อมูลโหวตและ badge ล่าสุด
        const votes = parseInt(localStorage.getItem("voteCount") || "0");
        const badge = localStorage.getItem("latestBadge") || "";
        setVoteCount(votes);
        setLatestBadge(badge);
        const savedMood = localStorage.getItem("meebotMood") || "supportive";
        setMood(savedMood);
    }, []);

    const handleStart = () => {
        localStorage.setItem("userStatus", "returning");
        navigate(isNewUser ? "/onboarding" : "/dashboard");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>ยินดีต้อนรับสู่ MeeChain 🎉</h1>
            <p>
                แพลตฟอร์มที่ทุกการมีส่วนร่วมของคุณมีคุณค่า โปร่งใส และได้รับการยอมรับ
            </p>

            {/* MeeBot animation + notification */}
            <MeeBotWithNotification mood={mood} />

            {/* ✅ ทักทายตามอารมณ์ */}
            <MeeBotMoodSelector selectedMood={mood} onMoodChange={setMood} />
            <MeeBotDailyPrompt />

            {/* ✅ แสดงสถานะผู้ใช้ */}
            <div style={{ marginTop: "2rem" }}>
                <h3>สถานะของคุณ:</h3>
                <ul>
                    <li>{isNewUser ? "ผู้ใช้ใหม่ 🎉" : "กลับมาอีกครั้ง 😊"}</li>
                    <li>จำนวนโหวต: {voteCount} ครั้ง</li>
                    <li>Badge ล่าสุด: {latestBadge || "ยังไม่มี badge"}</li>
                </ul>
            </div>

            {/* ✅ ปุ่มเริ่มต้น */}
            <button
                onClick={handleStart}
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
                เริ่มต้นใช้งาน
            </button>
        </div>
    );
}
