import api from './api';

export function listarNotificaciones() {
  return api.get('/notificaciones');
}

export function marcarLeida(id) {
  return api.put(`/notificaciones/${id}/leer`);
}

export function marcarTodasLeidas() {
  return api.put('/notificaciones/leer-todas');
}

export function actualizarRadioAlerta(radio_alerta) {
  return api.put('/usuarios/radio-alerta', { radio_alerta });
}

export function actualizarUbicacion(latitud, longitud) {
  return api.put('/usuarios/ubicacion', { latitud, longitud });
}
