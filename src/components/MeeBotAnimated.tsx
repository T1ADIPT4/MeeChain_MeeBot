import { useEffect, useState } from "react";
import styles from "./MeeBotAnimated.module.css";

export default function MeeBotAnimated({ mood }: { mood: string }) {
  const [animation, setAnimation] = useState("wave");

  useEffect(() => {
    switch (mood) {
      case "playful":
        setAnimation("wink");
        break;
      case "serious":
        setAnimation("nod");
        break;
      case "supportive":
        setAnimation("pulse");
        break;
      case "silent":
        setAnimation("idle");
        break;
      default:
        setAnimation("wave");
    }
  }, [mood]);

  return (
    <div className={`${styles.meeBot} ${styles[animation]}`}>
      🤖 MeeBot
    </div>
  );
}
