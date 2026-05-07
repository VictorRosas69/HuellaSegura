import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, UserCheck, UserX, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { listarUsuarios, cambiarEstadoUsuario } from '../../services/adminService';

const MOCK_USUARIOS = [
  { id: 1, nombre: 'Juan Ortiz',       email: 'juan@huellasegura.co',  rol: 'usuario', activo: true  },
  { id: 2, nombre: 'Admin HuellaSegura',email:'admin@huellasegura.co',  rol: 'admin',   activo: true  },
  { id: 3, nombre: 'María García',      email:'maria@gmail.com',         rol: 'usuario', activo: true  },
  { id: 4, nombre: 'Carlos Pérez',      email:'carlos@gmail.com',        rol: 'usuario', activo: false },
  { id: 5, nombre: 'Ana López',         email:'ana@gmail.com',           rol: 'usuario', activo: true  },
];

function Toggle({ on, onChange, testId }) {
  return (
    <button type="button" onClick={onChange} data-testid={testId}
      className="relative h-7 w-12 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: on ? '#10B981' : '#EF4444' }}>
      <div className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-200"
           style={{ left: on ? 'calc(100% - 1.625rem)' : '0.125rem' }} />
    </button>
  );
}

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error,    setError]      = useState('');

  useEffect(() => {
    listarUsuarios()
      .then(({ data }) => setUsuarios(data.usuarios))
      .catch(() => setUsuarios(MOCK_USUARIOS))
      .finally(() => setCargando(false));
  }, []);

  async function handleToggle(id) {
    try { await cambiarEstadoUsuario(id); } catch { /* demo */ }
    setUsuarios(prev => prev.map(u => {
      if (u.id !== id) return u;
      const nuevo = !u.activo;
      toast(nuevo ? `✅ ${u.nombre} activado` : `🚫 ${u.nombre} desactivado`);
      return { ...u, activo: nuevo };
    }));
  }

  const activos   = usuarios.filter(u => u.activo).length;
  const inactivos = usuarios.filter(u => !u.activo).length;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFF8F5' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-safe pt-4 pb-5"
           style={{ background: 'white', borderBottom: '1px solid #EDE5E1' }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate('/admin')}
          className="h-9 w-9 rounded-2xl flex items-center justify-center"
          style={{ background: '#FFF0EA' }}>
          <ChevronLeft size={20} style={{ color:'#F97B62' }} strokeWidth={2.5} />
        </motion.button>
        <div>
          <h1 className="font-poppins font-bold text-lg" style={{ color:'#1A1A2E' }}>
            Gestión de usuarios
          </h1>
          <p className="text-xs" style={{ color:'#9CA3AF' }}>
            {cargando ? 'Cargando…' : `${activos} activos · ${inactivos} inactivos`}
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">

        {/* Error */}
        {error && (
          <div className="rounded-2xl px-4 py-3 text-sm font-medium"
               style={{ background:'#FFF0EE', color:'#E8614A' }}>{error}</div>
        )}

        {/* Skeleton */}
        {cargando && [1,2,3].map(i => (
          <div key={i} className="rounded-3xl h-20 skeleton" />
        ))}

        {/* Lista */}
        <AnimatePresence>
          {!cargando && usuarios.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-3xl"
              style={{
                background: 'white',
                boxShadow: '0 4px 16px rgba(26,26,46,0.07)',
                opacity: u.activo ? 1 : 0.65,
              }}
            >
              {/* Avatar */}
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0"
                   style={{ background: u.rol === 'admin'
                     ? 'linear-gradient(135deg,#C7B2F5,#9B87E8)'
                     : 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}>
                {u.nombre.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-poppins font-semibold text-sm truncate" style={{ color:'#1A1A2E' }}>
                    {u.nombre}
                  </p>
                  {u.rol === 'admin' && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background:'#EDE9FE', color:'#7C3AED' }}>
                      <Shield size={9} /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color:'#9CA3AF' }}>{u.email}</p>
              </div>

              {/* Toggle */}
              <Toggle
                on={u.activo}
                onChange={() => handleToggle(u.id)}
                testId={`btn-toggle-${u.id}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
}
