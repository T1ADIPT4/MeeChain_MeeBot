import { useEffect } form 'react'
import FallbackWrapper from '@/components/FallbackWrapper'
import AuthorizationStatus from '@/components/AuthorizationStatus'
import { speak } from '@/modules/speech'
import BadgeMintFormWrapper from '@/components/BadgeMintFormWrapper'

const { status } = useFallbackStatus()
useEffect(() => {
  if (status === 'error') speak('มีบางอย่างผิดพลาด ลองใหม่อีกครั้งนะครับง'),

export default function adminPanelFallback(){
    return {
  <FallbackWrapper>
   <AuthorizationStatus />
   <MintBadgeForm />
  </FallbackWrapper>
 }
}