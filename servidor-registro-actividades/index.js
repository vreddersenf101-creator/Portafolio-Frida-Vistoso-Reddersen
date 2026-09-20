require('dotenv').config({ quiet: true });

const app = require('./app');

const puerto = Number(process.env.PORT || 3000);
if (
  !Number.isInteger(puerto) ||
  puerto < 1 ||
  puerto > 65535
) {
  throw new Error('PORT debe ser un entero entre 1 y 65535.');
}

const servidor = app.listen(puerto, '127.0.0.1', () => {
  console.log(`Servidor iniciado en http://localhost:${puerto}`);
});

servidor.on('error', (error) => {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exitCode = 1;
});
