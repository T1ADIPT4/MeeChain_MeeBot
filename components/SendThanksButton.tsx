import { sendThanks } from '../utils/sendThanks'

export default function SendThanksButton({ wallet, reviewer }) {
  return (
    <button
      className="bg-yellow-500 px-4 py-2 rounded text-black mb-4"
      onClick={() => sendThanks(wallet, reviewer)}
    >
      🙌 ส่งคำขอบคุณ
    </button>
  )
}
