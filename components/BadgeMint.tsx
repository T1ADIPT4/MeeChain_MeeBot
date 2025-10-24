import React from "react"

export default function BadgeMint({ badgeName }: { badgeName: string }) {
  const handleMint = () => {
    // TODO: call mint API
    alert(`Minted badge: ${badgeName}`)
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-white space-y-2">
      <h2 className="text-lg font-bold">{badgeName}</h2>
      <button
        onClick={handleMint}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
      >
        Mint Badge
      </button>
    </div>
  )
}
