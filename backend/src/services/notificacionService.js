const { Usuario, Notificacion } = require('../models');
const { calcularDistancia } = require('./distanciaHelper');

/**
 * Al crear un reporte, notifica a los usuarios que:
 *  1. No son el propietario del reporte
 *  2. Tienen ubicacion_lat/lng configurada
 *  3. Están dentro de su radio_alerta respecto al reporte
 */
async function generarNotificacionesProximidad(reporte, mascotaNombre) {
  const usuarios = await Usuario.findAll({
    where: { activo: true },
    attributes: ['id', 'radio_alerta', 'ubicacion_lat', 'ubicacion_lng'],
  });

  const notificaciones = [];

  for (const usuario of usuarios) {
    if (usuario.id === reporte.usuario_id) continue;
    if (!usuario.ubicacion_lat || !usuario.ubicacion_lng) continue;

    const distancia = calcularDistancia(
      parseFloat(reporte.latitud),
      parseFloat(reporte.longitud),
      parseFloat(usuario.ubicacion_lat),
      parseFloat(usuario.ubicacion_lng)
    );

    if (distancia <= usuario.radio_alerta) {
      notificaciones.push({
        usuario_id: usuario.id,
        reporte_id: reporte.id,
        mensaje: `¡Alerta! Se reportó una mascota perdida a ${distancia.toFixed(1)} km de tu ubicación: ${mascotaNombre}.`,
        tipo: 'proximidad',
        leida: false,
      });
    }
  }

  if (notificaciones.length > 0) {
    await Notificacion.bulkCreate(notificaciones);
  }

  return notificaciones.length;
}

module.exports = { generarNotificacionesProximidad };
