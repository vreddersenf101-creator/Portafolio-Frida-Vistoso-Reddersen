const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const temporal = fs.mkdtempSync(path.join(os.tmpdir(), 'bootcamp-test-'));
process.env.LOG_DIR = temporal;
const { guardarAcceso } = require('../services/logService');
test.after(() => fs.rmSync(temporal, { recursive: true, force: true }));

test('guardarAcceso crea y escribe una linea en log.txt', async () => {
  const carpetaLogs = temporal;
  const archivoLog = path.join(carpetaLogs, 'log.txt');

  await fs.promises.mkdir(carpetaLogs, { recursive: true });
  await fs.promises.writeFile(archivoLog, '');

  await guardarAcceso('/test');

  const contenido = await fs.promises.readFile(archivoLog, 'utf8');
  assert.match(contenido, /\| GET \| \/test\n/);
});
