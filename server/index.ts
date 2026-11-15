import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import express from 'express';
import { createApp } from './app';

if (existsSync('.env')) loadEnvFile('.env');
const production = process.argv[1]?.replaceAll('\\', '/').includes('/dist/server/') ?? false;
const app = createApp(undefined, {
  production,
  origin: process.env.PUBLIC_ORIGIN,
  trustProxy: process.env.TRUST_PROXY === 'true',
});
if (production) {
  app.use(express.static(resolve('dist/client'), { index: false, maxAge: '1h' }));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/client/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, process.env.HOST || '127.0.0.1', (error?: Error) => {
  if (error) {
    console.error('MysticAtlas could not start: the configured address or port is unavailable.');
    process.exit(1);
  }
  console.log(
    `MysticAtlas ${production ? 'production' : 'development'} · http://localhost:${port}`,
  );
});
server.requestTimeout = 30000;
server.headersTimeout = 15000;
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
