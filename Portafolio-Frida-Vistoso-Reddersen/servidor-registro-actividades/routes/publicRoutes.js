const express = require('express');

const {
  mostrarInicio,
  mostrarEstado,
  mostrarHealth
} = require('../controllers/publicController');

const router = express.Router();

router.get('/', mostrarInicio);
router.get('/status', mostrarEstado);
router.get('/health', mostrarHealth);

module.exports = router;
