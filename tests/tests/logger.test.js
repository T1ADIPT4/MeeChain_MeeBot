
const fs = require('fs');
const { logFallback } = require('../tests/logFallback');

test('logFallback writes to file', () => {
  const path = './tests/logs/test-failure.log';
  if (fs.existsSync(path)) fs.unlinkSync(path);

  logFallback('Test error', new Error('Simulated fail'));
  const content = fs.readFileSync(path, 'utf8');

  expect(content).toMatch(/Simulated fail/);
 });