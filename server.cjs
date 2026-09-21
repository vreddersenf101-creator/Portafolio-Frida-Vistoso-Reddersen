const express = require('express');
const path = require('node:path');
const app = express();
const servidor = require('./servidor-registro-actividades/app');
app.disable('x-powered-by');
app.enable('strict routing');
app.get('/servidor', (req, res) => res.redirect(301, '/servidor/'));
app.use('/servidor/', servidor);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const carpeta of ['css', 'proyectos', 'descargas', 'documentos']) {
  app.use('/' + carpeta, express.static(path.join(__dirname, carpeta)));
}
app.use((req, res) => res.status(404).send('PÃ¡gina no encontrada'));
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto invÃ¡lido');
const listener = app.listen(port, '127.0.0.1', () => console.log('Portafolio disponible en http://127.0.0.1:' + port));
listener.on('error', () => { console.error('No se pudo iniciar el portafolio. Comprueba el puerto.'); process.exitCode = 1; });
