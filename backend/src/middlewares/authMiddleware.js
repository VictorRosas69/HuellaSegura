const { verify } = require('../config/jwt');
const { Usuario } = require('../models');

async function authenticate(req, res, next) {
  // Soportar token en header (normal) o query param (EventSource/SSE)
  const authHeader = req.headers.authorization;
  const tokenQuery = req.query.token;

  if (!authHeader && !tokenQuery) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Se requiere autenticación.',
    });
  }

  const token = tokenQuery || authHeader?.split(' ')[1];

  try {
    const payload = verify(token);

    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido: usuario no encontrado.',
      });
    }

    // Verifica que el token no fue invalidado por un logout previo
    if (payload.tokenVersion !== usuario.token_version) {
      return res.status(401).json({
        success: false,
        message: 'Sesión expirada. Por favor inicia sesión nuevamente.',
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada.',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
}

function requireAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.',
    });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
