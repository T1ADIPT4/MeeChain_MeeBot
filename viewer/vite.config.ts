import { defineConfig } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
      {
        find: /..\/utils\/logger.js/,
        replacement: path.resolve(__dirname, '../src/utils/logger.mock.ts'),
      },
    ],
  },
});
