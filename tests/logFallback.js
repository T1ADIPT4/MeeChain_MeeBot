// tests/logFallback.js
const fs = require('fs');
const path = './tests/logs/test-failure.log';

function logFallback(message, error) {
  const log = `[${new Date().toISOString()}] ${message}\n${error.stack}\n\n`;
  fs.appendFileSync(path, log);
}

module.exports = { logFallback };
