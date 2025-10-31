import { useEffect, useState } from "react";

export default function MeeBotToggle() {
    const [isMeeBotActive, setMeeBotActive] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("meebotStatus");
        if (saved !== null) setMeeBotActive(saved === "on");
    }, []);

    const toggleMeeBot = () => {
        const newStatus = !isMeeBotActive;
        setMeeBotActive(newStatus);
        localStorage.setItem("meebotStatus", newStatus ? "on" : "off");

        // 🛎️ เชื่อมระบบแจ้งเตือน
        if (newStatus) {
            console.log("MeeBot activated: sending welcome notification...");
            // triggerNotification("MeeBot กลับมาแล้วครับ 🎉");
        } else {
            console.log("MeeBot deactivated: suppressing emotional prompts...");
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <button onClick={toggleMeeBot} style={{ padding: "0.5rem 1rem" }}>
                {isMeeBotActive ? "ปิด MeeBot" : "เปิด MeeBot"}
            </button>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                {isMeeBotActive
                    ? "MeeBot กำลังทำงานอยู่ครับ 😊"
                    : "MeeBot พักก่อนนะครับ ถ้าอยากให้กลับมา กดเปิดได้เลย"}
            </p>
        </div>
    );
}
