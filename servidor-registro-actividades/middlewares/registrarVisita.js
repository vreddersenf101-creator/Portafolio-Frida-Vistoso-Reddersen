const { guardarAcceso } = require('../services/logService');

async function registrarVisita(req, res, next) {
  try {
    const esRutaPublica = ['/', '/status', '/health'].includes(req.path);
    if (req.method === 'GET' && esRutaPublica) {
      await guardarAcceso(req.path);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = registrarVisita;