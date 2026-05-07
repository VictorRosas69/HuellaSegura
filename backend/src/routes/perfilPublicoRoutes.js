const { Router } = require('express');
const perfilPublicoController = require('../controllers/perfilPublicoController');

const router = Router();

// GET /api/publico/mascotas/:id — sin autenticación
router.get('/mascotas/:id', perfilPublicoController.obtenerPerfil);

module.exports = router;
