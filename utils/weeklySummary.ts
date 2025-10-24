import { getFirestore, collection, getDocs } from 'firebase/firestore'

export async function generateWeeklySummary(wallet: string): Promise<string> {
  const db = getFirestore()
  const ref = collection(db, 'contributors', wallet, 'claims')
  const snap = await getDocs(ref)

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = snap.docs
    .map(doc => doc.data())
    .filter(c => new Date(c.timestamp).getTime() > oneWeekAgo)

  const totalMEE = recent.reduce((sum, c) => sum + c.amount, 0)
  const taskCount = recent.length

  return `🧩 สัปดาห์นี้คุณเคลมไปแล้ว ${totalMEE.toFixed(2)} MEE จาก ${taskCount} task 🎯`
}
