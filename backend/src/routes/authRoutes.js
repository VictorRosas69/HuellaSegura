const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();

const registerValidators = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').isEmail().normalizeEmail().withMessage('Ingresa un correo válido.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
];

const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Ingresa un correo válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];

// POST /api/auth/register
router.post('/register', registerValidators, authController.register);

// POST /api/auth/login
router.post('/login', loginValidators, authController.login);

// POST /api/auth/logout  (requiere token válido)
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me  (requiere token válido)
router.get('/me', authenticate, authController.me);

module.exports = router;
