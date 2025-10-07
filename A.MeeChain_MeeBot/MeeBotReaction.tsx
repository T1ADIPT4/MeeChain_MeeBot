export default function MeeBotReaction({ mood }: { mood: 'happy' | 'thinking' | 'panic' | 'neutral' }) {
  const spriteMap = {
    happy: '/sprites/meebot-happy.png',
    thinking: '/sprites/meebot-thinking.png',
    panic: '/sprites/meebot-panic.png',
    neutral: '/sprites/meebot-neutral.png',
  }

  return (
    <div className="meebot-reaction">
      <img src={spriteMap[mood]} alt={`MeeBot ${mood}`} className="w-24 h-24 mx-auto" />
    </div>
  )
}
