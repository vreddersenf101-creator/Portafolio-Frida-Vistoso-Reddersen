const express = require('express');
const path = require('node:path');

const rutasPublicas = require('./routes/publicRoutes');
const registrarVisita = require('./middlewares/registrarVisita');

const app = express();

app.disable('x-powered-by');
app.use(
  '/static',
  express.static(path.join(__dirname, 'public'))
);
app.use(registrarVisita);
app.use('/', rutasPublicas);
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    data: null
  });
});
app.use((error, req, res, next) => {
  console.error(error.message);

  res.status(500).json({
    status: 'error',
    message: 'No se pudo completar la solicitud',
    data: null
  });
});

module.exports = app;
