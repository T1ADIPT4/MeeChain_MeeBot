import { useEffect, useState } from "react";

const prompts = [
    "สวัสดีครับ วันนี้ MeeBot พร้อมช่วยทุกอย่างเหมือนเดิมนะครับ 😊",
    "อย่าลืมตรวจสอบ badge ของคุณวันนี้นะครับ 🎖️",
    "ถ้าอยากเริ่มภารกิจใหม่ กดที่ Timeline ได้เลยครับ 🚀",
    "MeeBot ดีใจมากที่คุณกลับมาใช้งานอีกครั้งครับ 💜",
    "วันนี้คุณอยากโหวตเรื่องไหนใน DAO ครับ? MeeBot พร้อมนำทางครับ 🗳️"
];

export default function MeeBotDailyPrompt() {
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem("meebotPromptDate");

        if (saved !== today) {
            const random = prompts[Math.floor(Math.random() * prompts.length)];
            setPrompt(random);
            localStorage.setItem("meebotPromptDate", today);
            localStorage.setItem("meebotPromptText", random);
        } else {
            const savedText = localStorage.getItem("meebotPromptText");
            if (savedText) setPrompt(savedText);
        }
    }, []);

    return (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f5f5ff", borderRadius: "8px" }}>
            <p style={{ fontSize: "1rem" }}>{prompt}</p>
        </div>
    );
}
