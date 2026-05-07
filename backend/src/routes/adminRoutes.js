const { Router } = require('express');
const { param } = require('express-validator');
const adminController = require('../controllers/adminController');
const { reporteSemanal } = require('../controllers/pdfController');
const adminAuth = require('../middlewares/adminMiddleware');

const router = Router();
router.use(adminAuth);

router.get('/estadisticas',          adminController.estadisticas);
router.get('/usuarios',              adminController.listarUsuarios);
router.put('/usuarios/:id/estado',   param('id').isInt({ min: 1 }), adminController.cambiarEstadoUsuario);
router.get('/reportes',              adminController.listarReportes);
router.put('/reportes/:id/moderar',  param('id').isInt({ min: 1 }), adminController.moderarReporte);
router.get('/reportes/semanal-pdf',  reporteSemanal);

module.exports = router;
