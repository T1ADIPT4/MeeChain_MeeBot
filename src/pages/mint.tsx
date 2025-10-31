import { useState } from "react";
import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

export default function MintBadgePage() {
    const [minted, setMinted] = useState(false);

    const handleMint = () => {
        setMinted(true);
        localStorage.setItem("latestBadge", "ผู้ร่วมภารกิจ MeeChain");
        alert("🎉 คุณได้รับ badge ใหม่แล้วครับ! MeeBot ขอแสดงความยินดี 💜");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Mint เหรียญตราใหม่ 🎖️</h1>
            <MeeBotDailyPrompt />

            {!minted ? (
                <div style={{ marginTop: "2rem" }}>
                    <p>พร้อมรับ badge สำหรับการมีส่วนร่วมใน MeeChain แล้วหรือยังครับ?</p>
                    <button onClick={handleMint}>Mint badge เลย</button>
                </div>
            ) : (
                <p style={{ marginTop: "2rem" }}>
                    คุณได้รับ badge “ผู้ร่วมภารกิจ MeeChain” แล้วครับ 🎉
                </p>
            )}
        </div>
    );
}
