import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Find all test files recursively in src directory cross-platform
const testFiles = (fs.readdirSync('src', { recursive: true }) as string[])
  .map((f) => String(f))
  .filter((f) => f.endsWith('.test.ts'))
  .map((f) => path.join('src', f));

console.log(`🧪 Running ${testFiles.length} test files...`);

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['tsx', '--test', ...testFiles], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
