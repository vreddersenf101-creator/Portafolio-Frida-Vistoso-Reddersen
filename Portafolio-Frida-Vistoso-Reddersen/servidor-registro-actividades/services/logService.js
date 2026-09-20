const fs = require('node:fs');
const path = require('node:path');

const carpetaLogs = process.env.LOG_DIR || path.join(__dirname, '..', 'logs');
const archivoLog = path.join(carpetaLogs, 'log.txt');

async function guardarAcceso(ruta) {
  await fs.promises.mkdir(carpetaLogs, { recursive: true });

  const fechaHora = new Date().toISOString();
  const linea = `${fechaHora} | GET | ${String(ruta).replace(/[\r\n]/g, ' ')}\n`;

  await new Promise((resolve, reject) => {
    fs.appendFile(archivoLog, linea, 'utf8', (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

module.exports = { guardarAcceso };
