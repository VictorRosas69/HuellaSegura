const { body, validationResult } = require('express-validator');

async function actualizarRadioAlerta(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { radio_alerta } = req.body;
    await req.usuario.update({ radio_alerta });
    return res.status(200).json({
      success: true,
      message: `Radio de alerta actualizado a ${radio_alerta} km.`,
      radio_alerta,
    });
  } catch (error) { next(error); }
}

async function actualizarUbicacion(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { latitud, longitud } = req.body;
    await req.usuario.update({ ubicacion_lat: latitud, ubicacion_lng: longitud });
    return res.status(200).json({ success: true, message: 'Ubicación actualizada.' });
  } catch (error) { next(error); }
}

module.exports = { actualizarRadioAlerta, actualizarUbicacion };
