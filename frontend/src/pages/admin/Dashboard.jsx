import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MapPin, CheckCircle, ChevronRight, LogOut, Home, Shield } from 'lucide-react';
import { obtenerEstadisticas } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const MOCK_STATS = {
  total_usuarios: 247, reportes_activos: 12,
  avistamientos_mes: 38, reportes_resueltos: 128,
};

const STAT_CONFIG = [
  { key: 'total_usuarios',    label: 'Usuarios activos',      icon: Users,         color: '#F97B62', bg: '#FFF0EA' },
  { key: 'reportes_activos',  label: 'Reportes activos',      icon: AlertTriangle, color: '#EF4444', bg: '#FFF0EE' },
  { key: 'avistamientos_mes', label: 'Avistamientos del mes', icon: MapPin,        color: '#00C4B4', bg: '#E0F9F7' },
  { key: 'reportes_resueltos',label: 'Mascotas encontradas',  icon: CheckCircle,   color: '#10B981', bg: '#F0FFF4' },
];

const ACCESOS = [
  { to: '/admin/usuarios', icon: Users,         label: 'Gestión de usuarios', desc: 'Activar / desactivar cuentas',  color: '#F97B62', bg: '#FFF0EA' },
  { to: '/admin/reportes', icon: AlertTriangle,  label: 'Moderación',          desc: 'Revisar reportes inapropiados', color: '#EF4444', bg: '#FFF0EE' },
  { to: '/directorio',     icon: MapPin,         label: 'Directorio',          desc: 'Veterinarias y albergues',      color: '#00C4B4', bg: '#E0F9F7' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition: { duration:0.35 } } };

export default function Dashboard() {
  const { logout }  = useAuth();
  const navigate    = useNavigate();
  const [stats, setStats]     = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEstadisticas()
      .then(({ data }) => setStats(data.estadisticas))
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setCargando(false));
  }, []);

  const data = stats || MOCK_STATS;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFF8F5' }}>

      {/* Header */}
      <div
        className="relative overflow-hidden px-5 pt-safe pt-6 pb-8"
        style={{ background: 'linear-gradient(135deg,#1A1A2E 0%,#252540 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(circle at 80% 20%, rgba(249,123,98,0.15) 0%, transparent 60%)' }} />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center"
                 style={{ background: 'rgba(249,123,98,0.20)' }}>
              <Shield size={20} style={{ color: '#F97B62' }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Panel de</p>
              <h1 className="font-poppins font-bold text-white text-lg leading-tight">Administración</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale:0.9 }}
              onClick={() => navigate('/')}
              className="h-9 w-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.10)' }}>
              <Home size={18} color="white" />
            </motion.button>
            <motion.button whileTap={{ scale:0.9 }}
              onClick={() => logout?.()}
              className="h-9 w-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.20)' }}>
              <LogOut size={18} style={{ color: '#FCA5A5' }} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 flex flex-col gap-5">

        {/* Stats grid */}
        <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-2 gap-3">
          {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
            <motion.div key={key} variants={fadeUp}
              className="rounded-3xl p-4"
              style={{ background: 'white', boxShadow: '0 4px 20px rgba(26,26,46,0.07)' }}
              data-testid="stat-card"
            >
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              {cargando
                ? <div className="h-7 w-16 rounded-xl skeleton mb-1" />
                : <p className="font-poppins font-extrabold text-2xl" style={{ color }}>{data[key] ?? '—'}</p>}
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Accesos rápidos */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
            Gestión
          </p>
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-3">
            {ACCESOS.map(({ to, icon: Icon, label, desc, color, bg }) => (
              <motion.button key={to} variants={fadeUp} whileTap={{ scale:0.98 }}
                onClick={() => navigate(to)}
                className="flex items-center gap-4 p-4 rounded-3xl text-left w-full"
                style={{ background:'white', boxShadow:'0 4px 20px rgba(26,26,46,0.07)' }}
              >
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins font-bold text-base" style={{ color:'#1A1A2E' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color:'#9CA3AF' }}>{desc}</p>
                </div>
                <ChevronRight size={18} style={{ color:'#EDE5E1' }} />
              </motion.button>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
