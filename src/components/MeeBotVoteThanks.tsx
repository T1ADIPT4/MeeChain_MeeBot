import { useEffect } from "react";

// ตัวอย่างฟังก์ชันดึงจำนวนโหวต (ควรเชื่อมต่อ backend จริง)
function getUserVoteCount() {
    // ตัวอย่าง: ดึงจาก localStorage หรือ API จริง
    const count = localStorage.getItem("userVoteCount");
    return count ? parseInt(count, 10) : 0;
}

// ตัวอย่าง triggerNotification (ควรเชื่อมระบบจริง)
function triggerNotification({ title, message, type }: { title: string; message: string; type: string }) {
    // สามารถเชื่อมกับ toast, popup, หรือระบบแจ้งเตือนจริง
    alert(`${title}\n${message}`);
}

export default function MeeBotVoteThanks() {
    useEffect(() => {
        const voteCount = getUserVoteCount();
        const thanked = localStorage.getItem("meebotVoteThanks");

        if (voteCount >= 5 && thanked !== "yes") {
            triggerNotification({
                title: "ขอบคุณจาก MeeBot 🎉",
                message: "คุณโหวตครบ 5 ครั้งแล้วครับ MeeBot ขอขอบคุณที่มีส่วนร่วมกับ MeeChain DAO 💜",
                type: "success"
            });
            localStorage.setItem("meebotVoteThanks", "yes");
        }
    }, []);
    return null;
}