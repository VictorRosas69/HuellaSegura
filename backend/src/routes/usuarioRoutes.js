const { Router } = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();
router.use(authenticate);

router.put(
  '/radio-alerta',
  [body('radio_alerta').isInt({ min: 1, max: 10 }).withMessage('El radio debe estar entre 1 y 10 km.')],
  usuarioController.actualizarRadioAlerta
);

router.put(
  '/ubicacion',
  [
    body('latitud').isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida.'),
    body('longitud').isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida.'),
  ],
  usuarioController.actualizarUbicacion
);

module.exports = router;
