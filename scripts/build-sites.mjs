import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
rmSync('site-dist', { recursive: true, force: true });
for (const [cwd, destination] of [['.', 'site-dist'], ['apps/at-the-table', 'site-dist/at-the-table'], ['apps/rosary', 'site-dist/rosary']]) {
  const result = spawnSync('npm', ['run', 'build'], { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  mkdirSync(destination, { recursive: true });
  cpSync(`${cwd}/dist`, destination, { recursive: true });
}
console.log('Built Mass Adventure, At the Table, and Rosary in site-dist.');
