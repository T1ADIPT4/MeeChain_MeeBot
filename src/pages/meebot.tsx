import { useState, useEffect } from "react";
import MeeBotMoodSelector from "@/components/MeeBotMoodSelector";

const responses = {
  playful: [
    "เฮ้! พร้อมลุยภารกิจสนุก ๆ แล้วหรือยังครับ? 😄",
    "MeeBot ขี้เล่นนิดนึงวันนี้ ถ้าอยากให้ช่วยก็สะกิดได้เลย!"
  ],
  serious: [
    "MeeBot พร้อมช่วยคุณจัดการทุกอย่างอย่างจริงจังครับ 💼",
    "ถ้ามีคำถามเกี่ยวกับ DAO หรือ badge บอกได้เลยครับ"
  ],
  supportive: [
    "MeeBot อยู่ตรงนี้เสมอครับ ไม่ว่าคุณจะต้องการกำลังใจหรือคำแนะนำ 💜",
    "วันนี้คุณทำได้แน่นอนครับ MeeBot เชื่อมั่นในตัวคุณ!"
  ]
};

export default function MeeBotPage() {
  const [mood, setMood] = useState("supportive");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const savedMood = localStorage.getItem("meebotMood") || "supportive";
    setMood(savedMood);
    const welcome = responses[savedMood][0];
    setChatLog([welcome]);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const reply = responses[mood][1] || "MeeBot พร้อมช่วยครับ!";
    setChatLog([...chatLog, `คุณ: ${input}`, `MeeBot: ${reply}`]);
    setInput("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>คุยกับ MeeBot 🤖</h1>
      <MeeBotMoodSelector />

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#f5f5ff",
          borderRadius: "8px",
          height: "300px",
          overflowY: "auto"
        }}
      >
        {chatLog.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามของคุณ..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend}>ส่ง</button>
      </div>
    </div>
  );
}
