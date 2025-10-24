import React from 'react'
export default function UserCard({ name, wallet }: { name: string; wallet: string }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-white space-y-2">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-300">Wallet: {wallet}</p>
    </div>
  )
}
