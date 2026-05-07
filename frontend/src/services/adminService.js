import api from './api';

export function obtenerEstadisticas()       { return api.get('/admin/estadisticas'); }
export function listarUsuarios()            { return api.get('/admin/usuarios'); }
export function cambiarEstadoUsuario(id)    { return api.put(`/admin/usuarios/${id}/estado`); }
export function listarReportesAdmin()       { return api.get('/admin/reportes'); }
export function moderarReporte(id)          { return api.put(`/admin/reportes/${id}/moderar`); }
export function listarEntidades()           { return api.get('/entidades-aliadas'); }
export function crearEntidad(datos)         { return api.post('/entidades-aliadas', datos); }
