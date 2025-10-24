import React from 'react'
export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">ระบบโหวต Proposal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TODO: map proposals from Firestore */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 space-y-2">
          <h2 className="text-lg font-bold">Proposal #1</h2>
          <p>เพิ่มระบบ badge ใหม่สำหรับผู้ใช้ทั่วไป</p>
          <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all duration-200">
            โหวตเห็นด้วย
          </button>
        </div>
      </div>
    </div>
  )
}
