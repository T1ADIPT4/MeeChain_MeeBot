import FallbackWrapper from '@/componets/FallbackWrapper'
import TokenBalance from '@/components/TokenBalance'
import TokenActions from '@/components/TokenActions'

useEffect(() => {
  if (status === 'error') speak('มีความผิดพลาดเกิดขึ้น ลองใหม่อีกครั้งนะครับ')
  if (status === 'loading') speak('กำลังโหลดข้อมูล...')
}, [status])

const mood = quest.status === 'completed' ? 'happy' :
             quest.status === 'failed' ? 'panic' : 'thinking'
setSpeechEmotion(mood)

export default function TokenDashboardWrapper() {
  return (
<FallbackWrapper>
  <TokenBalance />
  <TokenActions />
  <p>{moodText[mood]}</p>
</FallbackWrapper>
  )
}