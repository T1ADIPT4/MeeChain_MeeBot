import { useState, useEffect } from "react";

const moods = {
    silent: [],
    playful: [
        "เฮ้! พร้อมลุยภารกิจสนุก ๆ กับ MeeBot แล้วหรือยังครับ? 😄",
        "วันนี้ MeeBot ขี้เล่นนิดนึงนะครับ ถ้าอยากให้ช่วยก็แค่สะกิดเลย!"
    ],
    serious: [
        "สวัสดีครับ วันนี้ MeeBotจะช่วยคุณจัดการทุกอย่างอย่างจริงจังครับ 💼",
        "พร้อมเริ่มงานแล้วครับ ถ้ามีอะไรให้ช่วย บอกได้เลยครับ"
    ],
    supportive: [
        "MeeBot อยู่ตรงนี้เสมอครับ ไม่ว่าคุณจะต้องการกำลังใจหรือคำแนะนำ 💜",
        "วันนี้คุณทำได้แน่นอนครับ MeeBotเชื่อมั่นในตัวคุณ!"
    ]
};

interface MeeBotMoodSelectorProps {
    selectedMood?: string;
    onMoodChange?: (mood: string) => void;
}

export default function MeeBotMoodSelector({ selectedMood: controlledMood, onMoodChange }: MeeBotMoodSelectorProps) {
    const [selectedMood, setSelectedMood] = useState(controlledMood || "supportive");
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        const mood = controlledMood !== undefined ? controlledMood : localStorage.getItem("meebotMood") || "supportive";
        setSelectedMood(mood);
        if (moods[mood] && moods[mood].length > 0) {
            const random = moods[mood][Math.floor(Math.random() * moods[mood].length)];
            setPrompt(random);
        } else if (mood === "silent") {
            setPrompt("MeeBot จะพักก่อนนะครับ ถ้าอยากให้กลับมา กดเปลี่ยนโหมดได้เลย 😊");
        } else {
            setPrompt(moods.supportive[0]);
        }
    }, [controlledMood]);

    const handleMoodChange = (mood: string) => {
        if (onMoodChange) onMoodChange(mood);
        setSelectedMood(mood);
        localStorage.setItem("meebotMood", mood);
        if (mood === "silent") {
            setPrompt("MeeBot จะพักก่อนนะครับ ถ้าอยากให้กลับมา กดเปลี่ยนโหมดได้เลย 😊");
        } else {
            const random = moods[mood][Math.floor(Math.random() * moods[mood].length)];
            // ถ้าเพิ่งออกจาก silent mode ให้ MeeBot ทักกลับแบบคิดถึง
            if (selectedMood === "silent") {
                setPrompt("ดีใจจังครับที่คุณเปิด MeeBot อีกครั้ง 💜 พร้อมช่วยทุกอย่างเหมือนเดิมครับ!");
                setTimeout(() => setPrompt(random), 2500);
            } else {
                setPrompt(random);
            }
        }
    };

    return (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0ff", borderRadius: "8px" }}>
            <h3>เลือกอารมณ์ MeeBot วันนี้:</h3>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={() => handleMoodChange("playful")} style={{ background: selectedMood === "playful" ? "#e0d4ff" : undefined }}>ขี้เล่น 😄</button>
                <button onClick={() => handleMoodChange("serious")} style={{ background: selectedMood === "serious" ? "#e0d4ff" : undefined }}>จริงจัง 💼</button>
                <button onClick={() => handleMoodChange("supportive")} style={{ background: selectedMood === "supportive" ? "#e0d4ff" : undefined }}>ให้กำลังใจ 💜</button>
                <button onClick={() => handleMoodChange("silent")} style={{ background: selectedMood === "silent" ? "#e0d4ff" : undefined }}>เงียบ 💤</button>
            </div>
            <p style={{ fontSize: "1rem" }}>{prompt}</p>
        </div>
    );
}
