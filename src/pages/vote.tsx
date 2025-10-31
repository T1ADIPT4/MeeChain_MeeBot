import { useState } from "react";
import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

const proposals = [
    { id: 1, title: "เพิ่ม badge สำหรับผู้แนะนำเพื่อน", votes: 12 },
    { id: 2, title: "ปรับสีธีม MeeChain ให้เลือกได้", votes: 8 }
];

export default function VotePage() {
    const [voteCount, setVoteCount] = useState(
        parseInt(localStorage.getItem("voteCount") || "0")
    );

    const handleVote = (id: number) => {
        setVoteCount(voteCount + 1);
        localStorage.setItem("voteCount", (voteCount + 1).toString());

        // ✅ MeeBot ขอบคุณเมื่อโหวตครบ
        if (voteCount + 1 === 5) {
            alert("🎉 คุณโหวตครบ 5 ครั้งแล้ว! MeeBot ขอขอบคุณที่มีส่วนร่วมครับ 💜");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>ร่วมโหวตใน MeeChain DAO 🗳️</h1>
            <MeeBotDailyPrompt />

            <ul style={{ marginTop: "2rem" }}>
                {proposals.map((proposal) => (
                    <li key={proposal.id} style={{ marginBottom: "1rem" }}>
                        <strong>{proposal.title}</strong> ({proposal.votes} โหวต)
                        <br />
                        <button onClick={() => handleVote(proposal.id)}>โหวตเลย</button>
                    </li>
                ))}
            </ul>

            <p style={{ marginTop: "2rem" }}>
                คุณโหวตไปแล้วทั้งหมด: <strong>{voteCount}</strong> ครั้ง
            </p>
        </div>
    );
}
