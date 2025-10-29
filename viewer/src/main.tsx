import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import TestAuditorDashboard from './TestAuditorDashboard.tsx';
import './index.css';

// Toggle between App and TestAuditorDashboard for testing
// Set to false to use the full App with tabs, or true to show only the Auditor Dashboard
const useTestDashboard = false;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {useTestDashboard ? <TestAuditorDashboard /> : <App />}
  </StrictMode>,
);
