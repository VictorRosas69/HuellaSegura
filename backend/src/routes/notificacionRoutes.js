const { Router } = require('express');
const notificacionController = require('../controllers/notificacionController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();
router.use(authenticate);

router.get('/',                   notificacionController.listar);
router.put('/leer-todas',         notificacionController.marcarTodasLeidas);
router.put('/:id/leer',           notificacionController.marcarLeida);

module.exports = router;
