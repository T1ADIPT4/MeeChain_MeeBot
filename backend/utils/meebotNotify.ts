// backend/utils/meebotNotify.ts
// Use global fetch (Node.js v18+). If you need to support older Node.js, install 'node-fetch' and import it.

/**
 * ส่งแจ้งเตือนผ่าน MeeBot Webhook
 * @param wallet - wallet address ของผู้ใช้
 * @param amount - จำนวน MEE ที่เคลม
 * @param txHash - hash ธุรกรรม
 */
export async function notifyMeeBot(wallet: string, amount: number, txHash: string) {
  const webhookUrl = process.env.MEEBOT_WEBHOOK_URL || 'https://notify.meechain.xyz/webhook';
  const message = `🎉 คุณได้รับ MEE แล้ว!\nWallet: ${wallet}\nยอดรวม: ${amount} MEE\n[ดูธุรกรรม](https://polygonscan.com/tx/${txHash})`;
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, wallet, amount, txHash })
  });
}
