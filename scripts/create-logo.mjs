import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO0Ww8AAqMBZCB5Gf8AAAAASUVORK5CYII=';
const outputPath = path.resolve('src', 'assets', 'Logo.png');

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, Buffer.from(base64, 'base64'));

console.log(`Logo asset written to ${outputPath}`);
