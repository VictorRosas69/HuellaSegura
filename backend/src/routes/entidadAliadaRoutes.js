const { Router } = require('express');
const { body } = require('express-validator');
const entidadAliadaController = require('../controllers/entidadAliadaController');
const adminAuth = require('../middlewares/adminMiddleware');

const router = Router();

const validators = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('tipo').isIn(['veterinaria', 'albergue', 'otro']).withMessage('Tipo inválido.'),
];

router.get('/', entidadAliadaController.listar);
router.post('/', adminAuth, validators, entidadAliadaController.crear);
router.put('/:id', adminAuth, entidadAliadaController.actualizar);

module.exports = router;
