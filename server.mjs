// Optional dependency-free local preview. No personal data is collected here.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const allowedFiles = new Set(['index.html', 'styles.css', 'catalogue.js', 'script.js']);

export function createPreviewServer() {
  return createServer(async (req, res) => {
    const headers = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cache-Control': 'no-cache' };
    try {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); res.end(); return; }
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const target = path.resolve(root, relative);
      const isAsset = relative.startsWith('assets/') && !relative.includes('..') && !relative.includes('\\');
      if ((!allowedFiles.has(relative) && !isAsset) || !target.startsWith(root) || !types[path.extname(target)]) { res.writeHead(404, headers); res.end('Not found'); return; }
      const info = await stat(target);
      if (!info.isFile()) throw new Error('Not a file');
      res.writeHead(200, { ...headers, 'Content-Type': types[path.extname(target)], 'Content-Length': info.size });
      res.end(req.method === 'HEAD' ? undefined : await readFile(target));
    } catch { res.writeHead(404, headers); res.end('Not found'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = process.env.HOST || '127.0.0.1';
  const port = Number(process.env.PORT || 8080);
  const server = createPreviewServer();
  server.on('error', (error) => { console.error(`Preview could not start: ${error.message}`); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`Local: http://${host}:${port}`));
}
