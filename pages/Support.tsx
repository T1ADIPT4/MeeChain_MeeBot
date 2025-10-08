// pages/Support.tsx

import React from 'react'
import { useFAQ } from '../hooks/useFAQ'
import { MeeBot } from '../components/MeeBot'

export default function SupportPage() {
  const { faq, loading } = useFAQ()

  if (loading) {
    MeeBot.setSprite('thinking')
    return <p>กำลังโหลดคำถามที่พบบ่อย...</p>
  }

  MeeBot.setSprite('helpful')
  MeeBot.speak('มีอะไรให้ช่วยไหมครับ? ลองดูคำถามที่พบบ่อยด้านล่างได้เลย')

  return (
    <div>
      <h1>Support</h1>
      {faq.map((item, index) => (
        <div key={index} className="faq-item">
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  )
}
