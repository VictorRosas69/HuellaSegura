import api from './api';

export function login(email, password) {
  return api.post('/auth/login', { email, password });
}

export function register(nombre, email, password) {
  return api.post('/auth/register', { nombre, email, password });
}

export function logout() {
  return api.post('/auth/logout');
}

export function getMe() {
  return api.get('/auth/me');
}
