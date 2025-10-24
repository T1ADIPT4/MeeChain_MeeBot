import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import process from 'process';
import App from '../../pages/index';

const windowWithBuffer = window as typeof window & { Buffer?: typeof Buffer };
if (!windowWithBuffer.Buffer) {
    windowWithBuffer.Buffer = Buffer;
}

const globalWithProcess = globalThis as typeof globalThis & { process?: typeof process & { env?: Record<string, unknown> } };
if (!globalWithProcess.process) {
    globalWithProcess.process = process;
}
if (!globalWithProcess.process.env) {
    globalWithProcess.process.env = {};
}

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element not found. Ensure index.html contains a div with id="root".');
}

const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
