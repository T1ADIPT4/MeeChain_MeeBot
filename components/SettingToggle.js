// components/SettingToggle.tsx
import React from 'react';
export function SettingToggle({ label, value, onChange }) {
    return (React.createElement("div", { className: "setting-row" },
        React.createElement("span", null, label),
        React.createElement("input", { type: "checkbox", checked: value, onChange: e => onChange(e.target.checked) })));
}
//# sourceMappingURL=SettingToggle.js.map