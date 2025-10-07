import FallbackWrapper from '@/components/FallbackWrapper'
import QuestCard from '@/components/QuestCard'
import { currentQuest } from '@/modules/quests'
import { speak } from '@/modules/speech'

useEffect(() => {
  if (status === 'error') speak('เควสนี้มีปัญหา ลองใหม่อีกครั้งนะครับ')
  if (status === 'loading') speak('กำลังโหลดข้อมูลเควส...')
}, [status])

const mood = quest.status === 'completed' ? 'happy' : quest.status === 'failed' ? 'panic' : 'thinking'
<MeeBotReaction mood={mood} />


export default function QuestCardWrapper() {
  return (
<FallbackWrapper>
  <QuestCard quest={currentQuest} />
</FallbackWrapper>
  )
}
