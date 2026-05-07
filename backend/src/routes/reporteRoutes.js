const { Router } = require('express');
const { body, param } = require('express-validator');
const reporteController = require('../controllers/reporteController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();

const ESTADOS_VALIDOS = ['en_busqueda', 'encontrada', 'cerrado'];

const crearValidators = [
  body('mascota_id').isInt({ min: 1 }).withMessage('La mascota es obligatoria.'),
  body('latitud')
    .notEmpty().withMessage('La latitud es obligatoria.')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida.'),
  body('longitud')
    .notEmpty().withMessage('La longitud es obligatoria.')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida.'),
  body('fecha_perdida')
    .notEmpty().withMessage('La fecha de pérdida es obligatoria.')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD).'),
];

const estadoValidator = [
  body('estado')
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`Estado inválido. Valores: ${ESTADOS_VALIDOS.join(', ')}.`),
];

// GET /api/reportes — público, solo reportes activos
router.get('/', reporteController.listarActivos);

// GET /api/reportes/mis-reportes — requiere auth
router.get('/mis-reportes', authenticate, reporteController.misReportes);

// POST /api/reportes — requiere auth
router.post('/', authenticate, crearValidators, reporteController.crear);

// PUT /api/reportes/:id/estado — requiere auth
router.put(
  '/:id/estado',
  authenticate,
  [param('id').isInt({ min: 1 }), ...estadoValidator],
  reporteController.cambiarEstado
);

module.exports = router;
