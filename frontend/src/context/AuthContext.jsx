import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, rehydrata la sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    } else {
      // ── BYPASS TEMPORAL SCREENSHOTS ── retirar antes de producción
      setUsuario({ id: 1, nombre: 'Demo HuellaSegura', email: 'demo@huellasegura.co', rol: 'admin', radio_alerta: 5 });
    }
    setCargando(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // ── Credenciales de demo (sin backend) ──────────────────────────────
    const DEMO_USERS = [
      {
        email: 'juan@huellasegura.co', password: 'vecino123',
        usuario: { id: 1, nombre: 'Juan Ortiz', email: 'juan@huellasegura.co', rol: 'usuario', radio_alerta: 3 },
      },
      {
        email: 'admin@huellasegura.co', password: 'admin123',
        usuario: { id: 2, nombre: 'Admin HuellaSegura', email: 'admin@huellasegura.co', rol: 'admin', radio_alerta: 10 },
      },
    ];
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demo) {
      localStorage.setItem('token', 'demo-token-' + demo.usuario.id);
      localStorage.setItem('usuario', JSON.stringify(demo.usuario));
      setUsuario(demo.usuario);
      return { token: 'demo', usuario: demo.usuario };
    }
    // ── Flujo real con backend ───────────────────────────────────────────
    const { data } = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  }, []);

  const register = useCallback(async (nombre, email, password) => {
    // ── Registro demo (sin backend) ─────────────────────────────────────
    const usuarioNuevo = { id: Date.now(), nombre, email, rol: 'usuario', radio_alerta: 5 };
    localStorage.setItem('token', 'demo-token-new');
    localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));
    setUsuario(usuarioNuevo);
    return { token: 'demo', usuario: usuarioNuevo };
    // ── Flujo real (descomentar cuando el backend esté activo) ───────────
    // const { data } = await authService.register(nombre, email, password);
    // localStorage.setItem('token', data.token);
    // localStorage.setItem('usuario', JSON.stringify(data.usuario));
    // setUsuario(data.usuario);
    // return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Si el token ya expiró no importa, limpiamos igual
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
    }
  }, []);

  const actualizarUsuario = useCallback((cambios) => {
    setUsuario(prev => {
      const actualizado = { ...prev, ...cambios };
      localStorage.setItem('usuario', JSON.stringify(actualizado));
      return actualizado;
    });
  }, []);

  const value = {
    usuario,
    cargando,
    estaAutenticado: !!usuario,
    esAdmin: usuario?.rol === 'admin',
    login,
    register,
    logout,
    actualizarUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
