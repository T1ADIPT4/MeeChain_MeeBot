import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import TestAuditorDashboard from './TestAuditorDashboard.tsx';
import './index.css';

// Toggle between App and TestAuditorDashboard for testing
// เปลี่ยนเป็น true เพื่อแสดงเฉพาะ Auditor Dashboard (dev/test)
const useTestDashboard = false;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* เปลี่ยน useTestDashboard เป็น true เพื่อ dev เฉพาะ Auditor Dashboard */}
    {useTestDashboard ? <TestAuditorDashboard /> : <App />}
  </StrictMode>
);
