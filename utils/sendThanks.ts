export async function sendThanks(wallet: string, reviewer: string) {
  const message = `🙌 ${wallet} ขอบคุณ ${reviewer} สำหรับการรีวิว task ล่าสุด!`
  await fetch(process.env.MEEBOT_WEBHOOK_URL || 'https://notify.meechain.xyz/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet,
      message,
      type: 'thanks',
      txHash: null
    })
  })
}
