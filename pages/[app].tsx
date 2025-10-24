import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const fallbackMap = {
  'notify': 'https://meechain.meebot.app/notify',
  'dashboard': 'https://meechain.app/dashboard',
  'leaderboard': 'https://meechain.app/leaderboard',
  'governance': 'https://meechain.app/governance',
}

function buildUrl(app, version, preview) {
  let url = fallbackMap[app]
  if (!url) return null
  const params = []
  if (version) params.push(`version=${encodeURIComponent(version)}`)
  if (preview) params.push(`preview=${encodeURIComponent(preview)}`)
  if (params.length) {
    url += (url.includes('?') ? '&' : '?') + params.join('&')
  }
  return url
}

async function checkHealth(url) {
  try {
    const res = await fetch(url + '/health', { method: 'GET', mode: 'no-cors' })
    return res.ok || res.type === 'opaque'
  } catch {
    return false
  }
}

export default function MicrofrontendLoader() {
  const { query } = useRouter()
  const app = query.app as string
  const version = query.version as string | undefined
  const preview = query.preview as string | undefined
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const u = buildUrl(app, version, preview)
    setUrl(u)
    if (!u) {
      setHealthy(false)
      return
    }
    setHealthy(null)
    checkHealth(u).then(setHealthy)
  }, [app, version, preview])

  if (!app || !url) {
    return <div>❌ ไม่พบ microfrontend ที่ร้องขอ</div>
  }
  if (healthy === false) {
    return <div>⚠️ Microfrontend ไม่พร้อมใช้งาน (health check fail) <br /> <a href={url} className="underline text-blue-400">ไปยัง fallback</a></div>
  }
  if (healthy === null) {
    return <div>⏳ กำลังตรวจสอบสถานะ microfrontend...</div>
  }
  return (
    <iframe
      src={url}
      className="w-full h-screen border-none"
      title={`Microfrontend: ${app}`}
    />
  )
}
