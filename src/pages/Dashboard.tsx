import React from 'react';

import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

export default function DashboardPage() {
  const voteCount = parseInt(localStorage.getItem("voteCount") || "0");
  const latestBadge = localStorage.getItem("latestBadge") || "";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard ของคุณ 🧠</h1>
      <MeeBotDailyPrompt />

      <div style={{ marginTop: "2rem" }}>
        <h3>สถานะล่าสุดของคุณ:</h3>
        <ul>
          <li>จำนวนโหวต: {voteCount} ครั้ง</li>
          <li>Badge ล่าสุด: {latestBadge || "ยังไม่มี badge"}</li>
        </ul>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>ฟีเจอร์ที่คุณสามารถใช้งาน:</h3>
        <ul>
          <li>📜 Contributor Timeline</li>
          <li>🎖️ Badge & Proof-of-Participation</li>
          <li>🗳️ Governance & Voting</li>
          <li>🤖 MeeBot Assistant</li>
        </ul>
      </div>
    </div>
  );
}
return <h2>Dashboard</h2>;
}
