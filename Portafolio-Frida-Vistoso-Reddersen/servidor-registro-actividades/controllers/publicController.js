const path = require('node:path');

function mostrarInicio(req, res) {
  const pagina = path.join(
    __dirname,
    '..',
    'public',
    'index.html'
  );

  res.sendFile(pagina);
}

function mostrarEstado(req, res) {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    data: {
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }
  });
}

function mostrarHealth(req, res) {
  res.json({
    status: 'ok',
    message: 'healthcheck',
    data: {
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = {
  mostrarInicio,
  mostrarEstado,
  mostrarHealth
};