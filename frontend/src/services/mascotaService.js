import api from './api';

export function listarMascotas() {
  return api.get('/mascotas');
}

export function obtenerMascota(id) {
  return api.get(`/mascotas/${id}`);
}

export function crearMascota(datos) {
  return api.post('/mascotas', datos);
}

export function actualizarMascota(id, datos) {
  return api.put(`/mascotas/${id}`, datos);
}

export function eliminarMascota(id) {
  return api.delete(`/mascotas/${id}`);
}

export function subirFotos(id, archivos) {
  const formData = new FormData();
  archivos.forEach((archivo) => formData.append('fotos', archivo));
  return api.post(`/mascotas/${id}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
