const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

test('rutas, persistencia y fallo de escritura', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'servidor-http-'));
  process.env.LOG_DIR = path.join(dir, 'logs');
  const app = require('../app');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    for (const ruta of ['/', '/status', '/health']) {
      const res = await fetch(base + ruta);
      assert.equal(res.status, 200);
      if (ruta === '/') assert.match(await res.text(), /Servidor de registro de actividades/);
      else { const body = await res.json(); assert.equal(body.status, 'ok'); assert.equal(typeof body.data.uptimeSeconds, 'number'); }
    }
    const archivo = path.join(process.env.LOG_DIR, 'log.txt');
    const antes = await fs.readFile(archivo, 'utf8');
    assert.equal(antes.trim().split('\n').length, 3);
    assert.match(antes, /\d{4}-\d{2}-\d{2}T.*Z \| GET \| \/status/);
    assert.equal((await fetch(base + '/static/style.css')).status, 200);
    assert.equal((await fetch(base + '/no-existe')).status, 404);
    assert.equal(await fs.readFile(archivo, 'utf8'), antes);
    await fetch(base + '/status');
    assert.ok((await fs.readFile(archivo, 'utf8')).startsWith(antes));
    await fs.rename(process.env.LOG_DIR, path.join(dir, 'guardado'));
    await fs.writeFile(process.env.LOG_DIR, 'bloqueo de prueba');
    const fallo = await fetch(base + '/status');
    assert.equal(fallo.status, 500);
    assert.deepEqual(await fallo.json(), {status: 'error', message: 'No se pudo completar la solicitud', data: null});
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await fs.rm(dir, { recursive: true, force: true });
  }
});
