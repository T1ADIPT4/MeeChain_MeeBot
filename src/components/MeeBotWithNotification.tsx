import { useEffect } from "react";
import MeeBotAnimated from "./MeeBotAnimated";
// สมมุติว่ามี triggerNotification ใน utils
// import { triggerNotification } from "@/utils/notification";

function triggerNotification({ title, message, type }: { title: string; message: string; type: string }) {
  // ตัวอย่าง: ใช้ alert แทนระบบจริง
  alert(`${title}\n${message}`);
}

export default function MeeBotWithNotification({ mood }: { mood: string }) {
  useEffect(() => {
    if (mood === "supportive") {
      triggerNotification({
        title: "MeeBot ให้กำลังใจ 💜",
        message: "วันนี้คุณทำได้แน่นอนครับ MeeBot อยู่ข้าง ๆ เสมอ!",
        type: "info"
      });
    }
    if (mood === "playful") {
      triggerNotification({
        title: "MeeBot ขี้เล่น 😄",
        message: "พร้อมลุยภารกิจสนุก ๆ แล้วหรือยังครับ?",
        type: "success"
      });
    }
    if (mood === "serious") {
      triggerNotification({
        title: "MeeBot จริงจัง 💼",
        message: "MeeBot พร้อมช่วยคุณจัดการทุกอย่างอย่างจริงจังครับ!",
        type: "info"
      });
    }
    if (mood === "silent") {
      triggerNotification({
        title: "MeeBot พักก่อน 💤",
        message: "MeeBot จะเงียบชั่วคราว ถ้าอยากให้กลับมา กดเปลี่ยนโหมดได้เลย 😊",
        type: "info"
      });
    }
  }, [mood]);

  return <MeeBotAnimated mood={mood} />;
}
