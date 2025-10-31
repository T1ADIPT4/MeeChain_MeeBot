import { useEffect, useRef } from "react";

interface MeeBotChatBubbleProps {
  message: string;
  voice?: boolean;
  animate?: boolean;
}

export default function MeeBotChatBubble({ message, voice = false, animate = false }: MeeBotChatBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (voice && message) {
      const utter = new window.SpeechSynthesisUtterance(message);
      utter.lang = "th-TH";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
    if (animate && bubbleRef.current) {
      bubbleRef.current.classList.add("meebot-bubble-animate");
      setTimeout(() => {
        bubbleRef.current?.classList.remove("meebot-bubble-animate");
      }, 1200);
    }
  }, [message, voice, animate]);

  return (
    <div
      ref={bubbleRef}
      style={{
        display: "inline-block",
        background: "#fff",
        color: "#222",
        borderRadius: "1.2rem",
        boxShadow: "0 2px 12px #667eea22",
        padding: "0.75rem 1.2rem",
        margin: "0.5rem 0",
        maxWidth: "80%",
        fontSize: "1.05rem",
        position: "relative",
        animation: animate ? "meebot-bubble-pop 0.6s" : undefined,
        transition: "box-shadow 0.2s"
      }}
      className={animate ? "meebot-bubble-animate" : ""}
    >
      <span>{message}</span>
      <style>{`
        @keyframes meebot-bubble-pop {
          0% { transform: scale(0.8); opacity: 0.5; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .meebot-bubble-animate {
          animation: meebot-bubble-pop 0.6s;
        }
      `}</style>
    </div>
  );
}
