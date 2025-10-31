import MeeBotDailyPrompt from "@/components/MeeBotDailyPrompt";

const contributors = [
  { name: "ธันวัฒน์", votes: 12, badges: 3 },
  { name: "น้องเม", votes: 9, badges: 2 },
  { name: "คุณบอส", votes: 7, badges: 1 }
];

export default function LeaderboardPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>อันดับผู้มีส่วนร่วม 🏆</h1>
      <MeeBotDailyPrompt />

      <table style={{ marginTop: "2rem", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>จำนวนโหวต</th>
            <th>Badge ที่ได้รับ</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((c, index) => (
            <tr key={index}>
              <td>{c.name}</td>
              <td>{c.votes}</td>
              <td>{c.badges}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "2rem" }}>
        MeeBot ขอขอบคุณทุกคนที่มีส่วนร่วมกับ MeeChain ครับ 💜
      </p>
    </div>
  );
}
