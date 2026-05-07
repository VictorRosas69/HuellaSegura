const { verify } = require('../config/jwt');
const { Usuario } = require('../models');

async function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Acceso denegado. Se requiere autenticación.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verify(token);
    const usuario = await Usuario.findByPk(payload.id);

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Token inválido: usuario no encontrado.' });
    }
    if (payload.tokenVersion !== usuario.token_version) {
      return res.status(401).json({ success: false, message: 'Sesión expirada.' });
    }
    if (usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
}

module.exports = adminAuth;
