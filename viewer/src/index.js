import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/**
 * MeeChain Interactive Viewer Entry Point
 * Renders the React application
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log initialization
console.log('🚀 MeeChain Interactive Viewer initialized');
console.log('🌐 i18n support: Thai (ไทย) and English');
console.log('⌨️ Keyboard shortcuts: Alt+T (Thai) | Alt+E (English)');
