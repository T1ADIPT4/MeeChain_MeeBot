/**
 * Refund Audit Page
 * UI for viewing and auditing refund logs with filtering and export capabilities
 */

import React, { useState, useEffect } from 'react'

interface RefundLogEntry {
  refundId: string
  userAddress: string
  txHash: string
  amount: string
  status: 'pending' | 'success' | 'failed'
  signature: string
  messageSigned: string
  verifiedBy: string
  verifiedAt: string
  executedBy: string
  refundTxHash: string
  contractAddress: string
  reason: string
  ip: string
  userAgent: string
  notes: string
}

export const RefundAudit: React.FC = () => {
  const [logs, setLogs] = useState<RefundLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<RefundLogEntry[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchAddress, setSearchAddress] = useState<string>('')

  useEffect(() => {
    // TODO: Fetch logs from backend API
    // For now, using mock data
    const mockLogs: RefundLogEntry[] = [
      {
        refundId: 'ref_0x19cea8e8',
        userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
        txHash: '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3',
        amount: '0.0083595',
        status: 'success',
        signature: '0x...',
        messageSigned: 'MeeChain Refund Request for tx 0x19cea8...',
        verifiedBy: 'MeeBot',
        verifiedAt: '2025-10-18T13:35:00Z',
        executedBy: '0xMeeBotAddress',
        refundTxHash: '0xrefund123...',
        contractAddress: '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F',
        reason: 'Replay failed',
        ip: '203.0.113.42',
        userAgent: 'MetaMask/Chrome',
        notes: 'Auto-refund triggered after 3 failed replay attempts'
      }
    ]
    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [])

  useEffect(() => {
    let filtered = [...logs]

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus)
    }

    // Filter by address
    if (searchAddress) {
      filtered = filtered.filter(log =>
        log.userAddress.toLowerCase().includes(searchAddress.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, filterStatus, searchAddress])

  const handleExportJSON = () => {
    const json = JSON.stringify(filteredLogs, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `refund-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleExportCSV = () => {
    const headers = [
      'Refund ID',
      'User Address',
      'Tx Hash',
      'Amount',
      'Status',
      'Reason',
      'Verified At',
      'Refund Tx Hash'
    ]

    const rows = filteredLogs.map(log => [
      log.refundId,
      log.userAddress,
      log.txHash,
      log.amount,
      log.status,
      log.reason,
      log.verifiedAt,
      log.refundTxHash
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `refund-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'failed':
        return '❌'
      case 'pending':
        return '⏳'
      default:
        return '❓'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Refund Audit Trail</h1>
        <p className="text-gray-600">
          ตรวจสอบประวัติการ refund ทั้งหมด พร้อมรายละเอียดและลายเซ็นดิจิทัล
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="success">สำเร็จ</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="failed">ล้มเหลว</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ค้นหาด้วย Address
          </label>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📥 Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">ทั้งหมด</div>
          <div className="text-2xl font-bold">{logs.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">สำเร็จ</div>
          <div className="text-2xl font-bold text-green-700">
            {logs.filter(l => l.status === 'success').length}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">รอดำเนินการ</div>
          <div className="text-2xl font-bold text-yellow-700">
            {logs.filter(l => l.status === 'pending').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="text-sm text-red-600">ล้มเหลว</div>
          <div className="text-2xl font-bold text-red-700">
            {logs.filter(l => l.status === 'failed').length}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ขอ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จำนวน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เหตุผล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รายละเอียด
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.refundId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.refundId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-mono">
                      {log.userAddress.slice(0, 6)}...{log.userAddress.slice(-4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {getStatusEmoji(log.status)} {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.verifiedAt).toLocaleString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        // TODO: Show modal with full details
                        alert(`รายละเอียดเต็ม:\n${JSON.stringify(log, null, 2)}`)
                      }}
                    >
                      ดูเพิ่มเติม →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            ไม่พบข้อมูล refund ที่ตรงกับเงื่อนไข
          </div>
        )}
      </div>

      {/* Detail View Example */}
      {filteredLogs.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📋 ตัวอย่างรายละเอียด</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">รายการ</td>
                  <td className="py-2 px-4">คำอธิบาย</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">ผู้ขอ</td>
                  <td className="py-2 px-4 font-mono">{filteredLogs[0].userAddress}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">เหตุผล</td>
                  <td className="py-2 px-4">{filteredLogs[0].reason}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">เวลายืนยัน</td>
                  <td className="py-2 px-4">
                    {new Date(filteredLogs[0].verifiedAt).toLocaleString('th-TH')}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">ลายเซ็น</td>
                  <td className="py-2 px-4">✅ ตรวจสอบแล้ว</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">ธุรกรรม refund</td>
                  <td className="py-2 px-4">
                    <a
                      href={`https://bscscan.com/tx/${filteredLogs[0].refundTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ดูบน BscScan →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-semibold">หมายเหตุ</td>
                  <td className="py-2 px-4">{filteredLogs[0].notes}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RefundAudit
