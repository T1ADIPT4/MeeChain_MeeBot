// components/SettingToggle.tsx

import React from 'react'

export function SettingToggle({ label, value, onChange }: any) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
    </div>
  )
}
