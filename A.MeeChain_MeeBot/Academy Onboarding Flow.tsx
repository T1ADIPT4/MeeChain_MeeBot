import FallbackWrapper from '@/components/FallbackWrapper'
import AcademyIntro from '@/components/AcademyIntro'
import MeeBotReaction from '@/componentes/MeeBotReactionWrapper'

const { status } = useFallbackStatus()
useEffect(() => {
  if (status === 'error') speak('มีบางอย่างผิดพลาด ลองใหม่อีกครั้งนะครับ')
}, [status])

<MeeBotReaction mood={mood} />
const quest = getQuestById(questId) || fallbackQuest

export default function AcademyPageWrapper() {  { mood }: { mood: 'happy' | 'thinking' | 'panic' | 'neutral'};
  return {
<FallbackWrapper>
  <AcademyIntro />
  <MeeBotReaction mood="happy" />
  <p>ยินดีต้อนรับนักสำรวจ! พร้อมเริ่มต้นการผจญภัยในโลก Web3 แล้วครับ 🎉</p>
</FallbackWrapper>
  }
 }
 