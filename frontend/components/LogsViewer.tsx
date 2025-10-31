import React, { useEffect, useState } from 'react';
// @ts-ignore
import axios from 'axios';
import './LogsViewer.css';

const LogsViewer = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ status: '', userAddress: '' });
    const [role] = useState('auditor'); // mock role, replace with context/auth if needed

    const fetchLogs = async () => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.userAddress) params.append('userAddress', filters.userAddress);

        try {
            const res = await axios.get(`http://localhost:8081/api/logs?${params.toString()}`, {
                headers: { Role: role }
            });
            setLogs(res.data.data);
            setError('');
        } catch {
            setError('ไม่สามารถโหลดข้อมูล logs ได้');
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    return (
        <div>
            <h2>📜 Contributor Logs</h2>
            <div className="logs-viewer-filters">
                <input
                    className="logs-viewer-input"
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                />
                <input
                    className="logs-viewer-input"
                    placeholder="Filter by user address"
                    value={filters.userAddress}
                    onChange={e => setFilters({ ...filters, userAddress: e.target.value })}
                />
                <button onClick={fetchLogs}>Search</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Refund ID</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Executed By</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, i) => (
                        <tr key={i}>
                            <td>{log.refundId}</td>
                            <td>{log.userAddress}</td>
                            <td>{log.status}</td>
                            <td>{log.reason}</td>
                            <td>{log.executedBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogsViewer;
