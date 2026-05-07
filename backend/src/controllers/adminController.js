const { Op } = require('sequelize');
const { Usuario, Reporte, Avistamiento } = require('../models');

async function estadisticas(req, res, next) {
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [totalUsuarios, reportesActivos, avistamientosMes, totalReportes, reportesResueltos] =
      await Promise.all([
        Usuario.count({ where: { activo: true } }),
        Reporte.count({ where: { estado: 'en_busqueda', moderado: false } }),
        Avistamiento.count({ where: { created_at: { [Op.gte]: inicioMes } } }),
        Reporte.count(),
        Reporte.count({ where: { estado: 'encontrada' } }),
      ]);

    return res.status(200).json({
      success: true,
      estadisticas: {
        total_usuarios: totalUsuarios,
        reportes_activos: reportesActivos,
        avistamientos_mes: avistamientosMes,
        total_reportes: totalReportes,
        reportes_resueltos: reportesResueltos,
      },
    });
  } catch (error) { next(error); }
}

async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'radio_alerta', 'created_at'],
      order: [['created_at', 'DESC']],
    });
    return res.status(200).json({ success: true, usuarios });
  } catch (error) { next(error); }
}

async function cambiarEstadoUsuario(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    if (usuario.id === req.usuario.id) {
      return res.status(400).json({ success: false, message: 'No puedes desactivar tu propia cuenta.' });
    }
    await usuario.update({ activo: !usuario.activo });
    return res.status(200).json({
      success: true,
      message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente.`,
      activo: usuario.activo,
    });
  } catch (error) { next(error); }
}

async function moderarReporte(req, res, next) {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (!reporte) return res.status(404).json({ success: false, message: 'Reporte no encontrado.' });
    await reporte.update({ moderado: true });
    return res.status(200).json({ success: true, message: 'Reporte marcado como contenido inapropiado.' });
  } catch (error) { next(error); }
}

async function listarReportes(req, res, next) {
  try {
    const reportes = await Reporte.findAll({ order: [['created_at', 'DESC']] });
    return res.status(200).json({ success: true, reportes });
  } catch (error) { next(error); }
}

module.exports = { estadisticas, listarUsuarios, cambiarEstadoUsuario, moderarReporte, listarReportes };
