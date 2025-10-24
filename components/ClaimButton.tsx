import React from 'react'
export default function ClaimButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#00E0CA] text-black px-4 py-2 rounded-lg shadow hover:scale-105 transition-all duration-200"
    >
      เคลมเลย
    </button>
  )
}
