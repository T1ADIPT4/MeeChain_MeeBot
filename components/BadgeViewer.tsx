import { useEffect, useState } from 'react'
import axios from 'axios'

export interface BadgeViewerProps {
  tokenUri: string
  txHash: string
}

export function BadgeViewer({ tokenUri, txHash }: BadgeViewerProps) {
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = tokenUri.startsWith('ipfs://')
          ? `https://ipfs.io/ipfs/${tokenUri.replace('ipfs://', '')}`
          : tokenUri
        const res = await axios.get(url)
        setMetadata(res.data)
      } catch (e: any) {
        setError('ไม่สามารถโหลด metadata ได้')
      }
      setLoading(false)
    }
    if (tokenUri) fetchMetadata()
  }, [tokenUri])

  if (loading) return <div>กำลังโหลดข้อมูล badge...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!metadata) return null

  return (
    <div className="badge-viewer border rounded p-4 max-w-xs bg-white shadow">
      <img
        src={metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')}
        alt={metadata.name}
        width={200}
        className="mx-auto mb-2 rounded shadow-lg"
      />
      <h3 className="text-lg font-bold mb-1">{metadata.name}</h3>
      <p className="mb-2 text-gray-700">{metadata.description}</p>
      <ul className="mb-2">
        {metadata.attributes?.map((attr: any, i: number) => (
          <li key={i}>
            <strong>{attr.trait_type}:</strong> {attr.value}
          </li>
        ))}
      </ul>
      <a
        href={`https://polygonscan.com/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        ดูธุรกรรมบน Blockchain
      </a>
    </div>
  )
}
