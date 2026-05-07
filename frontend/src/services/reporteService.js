import api from './api';

export function listarReportesActivos() {
  return api.get('/reportes');
}

export function misReportes() {
  return api.get('/reportes/mis-reportes');
}

export function crearReporte(datos) {
  return api.post('/reportes', datos);
}

export function cambiarEstado(id, estado) {
  return api.put(`/reportes/${id}/estado`, { estado });
}
