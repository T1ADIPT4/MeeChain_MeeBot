import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: [
      // Mock the logger to use a browser-safe version
      {
        find: /..\/utils\/logger.js/,
        replacement: path.resolve(__dirname, '../src/utils/logger.mock.ts'),
      },
    ],
  },
});
