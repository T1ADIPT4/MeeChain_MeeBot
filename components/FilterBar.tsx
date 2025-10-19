/**
 * FilterBar Component
 * Search and filter controls for refund logs
 */

import React from 'react'
import type { RefundLog } from '../src/types/auditor'

interface FilterBarProps {
  filters: {
    search: string
    status?: RefundLog['status']
    startDate?: Date
    endDate?: Date
  }
  onFilterChange: (filters: any) => void
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <style>{`
        .filter-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .filter-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .filter-input, .filter-select {
          padding: 0.625rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          min-width: 200px;
          transition: all 0.2s;
        }
        .filter-input:focus, .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .filter-input::placeholder {
          color: #94a3b8;
        }
        .date-inputs {
          display: flex;
          gap: 0.5rem;
        }
        .date-input {
          padding: 0.625rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          width: 150px;
        }
      `}</style>

      <div className="filter-group">
        <label className="filter-label">Search</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Address / TxHash"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({
            ...filters,
            status: e.target.value || undefined
          })}
        >
          <option value="">All</option>
          <option value="success">✅ Success</option>
          <option value="failed">❌ Failed</option>
          <option value="flagged">🚩 Flagged</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            className="date-input"
            value={filters.startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              startDate: e.target.value ? new Date(e.target.value) : undefined
            })}
          />
          <input
            type="date"
            className="date-input"
            value={filters.endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              endDate: e.target.value ? new Date(e.target.value) : undefined
            })}
          />
        </div>
      </div>
    </div>
  )
}
