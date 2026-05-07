import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, MapPin, Eye, ChevronRight, Search, AlertTriangle, Zap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar      from '../components/ui/Avatar';
import Card        from '../components/ui/Card';
import Chip        from '../components/ui/Chip';
import BottomNav   from '../components/ui/BottomNav';
import { listarReportesActivos } from '../services/reporteService';

const EMOJIS_ESPECIES = { perro: '🐶', gato: '🐱', ave: '🐦', reptil: '🦎', otro: '🐾' };

const QUICK_ACTIONS = [
  {
    id: 'reportar',
    emoji: '📍',
    gradientFrom: '#FF9280',
    gradientTo:   '#F97B62',
    shadowColor:  'rgba(249,123,98,0.45)',
    title: 'Reportar',
    subtitle: 'Mascota perdida',
    to: '/reportes/nuevo',
  },
  {
    id: 'avistar',
    emoji: '👁️',
    gradientFrom: '#26D6CD',
    gradientTo:   '#00C4B4',
    shadowColor:  'rgba(0,196,180,0.40)',
    title: 'Vi una',
    subtitle: 'Avistamiento',
    to: '/avistamientos/nuevo',
  },
  {
    id: 'mis-mascotas',
    emoji: '🐾',
    gradientFrom: '#FFD770',
    gradientTo:   '#F59E0B',
    shadowColor:  'rgba(245,158,11,0.40)',
    title: 'Mis mascotas',
    subtitle: 'Perfiles',
    to: '/mascotas',
  },
  {
    id: 'directorio',
    emoji: '🏥',
    gradientFrom: '#C7B2F5',
    gradientTo:   '#9B87E8',
    shadowColor:  'rgba(155,135,232,0.40)',
    title: 'Veterinarias',
    subtitle: 'Directorio',
    to: '/directorio',
  },
];

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.32,0.72,0,1] } },
};

export default function Home() {
  const { usuario } = useAuth();
  const navigate    = useNavigate();

  const [reportes,  setReportes]  = useState([]);
  const [noLeidas,  setNoLeidas]  = useState(0);
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    listarReportesActivos()
      .then(({ data }) => setReportes(data.reportes || []))
      .catch(() => setReportes([]))
      .finally(() => setCargando(false));
  }, []);

  const recientes = reportes.slice(0, 3);
  const nombre    = usuario?.nombre?.split(' ')[0] ?? 'vecino';
  const hora      = new Date().getHours();
  const saludo    = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen w-full pb-24" style={{ background: '#FFF8F5' }}>

      {/* ── Hero header con gradiente ─────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-5 pt-safe pt-5 pb-8"
        style={{
          background: 'linear-gradient(160deg, #FFF0EA 0%, #FFF8F5 60%, #E0F9F7 100%)',
        }}
      >
        {/* Círculos decorativos flotantes */}
        <div
          className="absolute -top-8 -right-8 h-40 w-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(249,123,98,0.12)', animation: 'float 6s ease-in-out infinite' }}
        />
        <div
          className="absolute top-16 -left-6 h-24 w-24 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,196,180,0.10)', animation: 'floatSlow 5s ease-in-out infinite 1s' }}
        />

        {/* Header fila */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div whileTap={{ scale: 0.95 }} onClick={() => navigate('/perfil')}>
              <Avatar name={usuario?.nombre ?? ''} size="lg" />
            </motion.div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{saludo},</p>
              <h2 className="font-poppins font-bold text-lg leading-tight" style={{ color: '#1A1A2E' }}>
                {nombre} 👋
              </h2>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/alertas')}
            className="relative h-11 w-11 rounded-2xl flex items-center justify-center"
            style={{
              background: 'white',
              boxShadow: '0 4px 16px rgba(249,123,98,0.15)',
            }}
          >
            <Bell size={20} style={{ color: '#F97B62' }} strokeWidth={1.8} />
            {noLeidas > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-danger border-2 border-white" />
            )}
          </motion.button>
        </div>

        {/* Búsqueda */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('/mapa')}
          className="mt-4 w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 relative z-10"
          style={{
            background: 'white',
            boxShadow: '0 4px 20px rgba(249,123,98,0.10)',
            border: '1.5px solid rgba(237,229,225,0.8)',
          }}
        >
          <Search size={17} style={{ color: '#F97B62' }} />
          <span className="text-sm" style={{ color: '#C9B8B0' }}>Buscar mascota o barrio…</span>
          <span
            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#FFF0EA', color: '#F97B62' }}
          >
            Mapa
          </span>
        </motion.button>
      </div>

      <div className="px-5 -mt-4 flex flex-col gap-5">

        {/* ── Hero card SOS ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.32,0.72,0,1] }}
        >
          <div
            className="relative rounded-3xl overflow-hidden p-5 cursor-pointer"
            onClick={() => navigate('/mapa')}
            style={{
              background: 'linear-gradient(135deg,#FF9280 0%,#F97B62 55%,#E8614A 100%)',
              boxShadow: '0 12px 40px rgba(249,123,98,0.45)',
            }}
          >
            {/* Mesh overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)',
              }}
            />
            {/* Círculo decorativo */}
            <div
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            />
            <div
              className="absolute -right-2 bottom-4 h-16 w-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />

            {/* Badge */}
            <div className="flex items-center gap-1.5 mb-3 relative">
              <span className="h-2 w-2 rounded-full bg-white" style={{ animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)' }} />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                Alerta activa · Cerca de ti
              </span>
            </div>

            {/* Conteo */}
            <h3 className="font-poppins font-extrabold text-white leading-tight mb-3 relative" style={{ fontSize: '1.6rem' }}>
              {cargando ? '…' : reportes.length}{' '}
              mascota{reportes.length !== 1 ? 's' : ''}<br />
              reportada{reportes.length !== 1 ? 's' : ''}<br />
              en los últimos 60 min
            </h3>

            {/* Bottom row */}
            <div className="flex items-center justify-between relative">
              <div className="flex -space-x-2.5">
                {recientes.length > 0
                  ? recientes.map((r) => (
                      <div key={r.id}
                           className="h-10 w-10 rounded-full border-2 border-white/60 flex items-center justify-center text-lg"
                           style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                        {EMOJIS_ESPECIES[r.mascota?.especie] ?? '🐾'}
                      </div>
                    ))
                  : [0,1,2].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white/40"
                           style={{ background: 'rgba(255,255,255,0.15)' }} />
                    ))}
              </div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
              >
                Ver mapa <ChevronRight size={14} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick actions 2×2 ─────────────────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <motion.button
                key={action.id}
                variants={fadeUp}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.to)}
                className="flex flex-col items-start gap-3 rounded-3xl p-4 text-left"
                style={{
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(26,26,46,0.07)',
                  border: '1px solid rgba(237,229,225,0.7)',
                }}
              >
                {/* Icono */}
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg,${action.gradientFrom},${action.gradientTo})`,
                    boxShadow: `0 6px 16px ${action.shadowColor}`,
                  }}
                >
                  {action.emoji}
                </div>
                <div>
                  <p className="font-poppins font-bold text-sm leading-tight" style={{ color: '#1A1A2E' }}>
                    {action.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                    {action.subtitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Stats rápidas ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: '🐾', value: reportes.length, label: 'Activos', color: '#F97B62' },
            { icon: '👥', value: '500+', label: 'Vecinos', color: '#00C4B4' },
            { icon: '✅', value: '128', label: 'Reunidos', color: '#10B981' },
          ].map(({ icon, value, label, color }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}
            >
              <span className="text-xl block mb-0.5">{icon}</span>
              <p className="font-poppins font-extrabold text-lg leading-none" style={{ color }}>
                {cargando && label === 'Activos' ? '…' : value}
              </p>
              <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Reportes recientes ────────────────────────────────────────── */}
        {!cargando && reportes.length > 0 && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-poppins font-bold text-base" style={{ color: '#1A1A2E' }}>
                🆘 Cerca de ti
              </h3>
              <button
                onClick={() => navigate('/mapa')}
                className="text-xs font-bold flex items-center gap-1"
                style={{ color: '#F97B62' }}
              >
                Ver todos <ChevronRight size={13} />
              </button>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-3">
              {reportes.slice(0,3).map((r) => (
                <motion.div
                  key={r.id}
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/mapa')}
                  className="flex items-center gap-3 rounded-3xl p-3.5 cursor-pointer"
                  style={{
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(26,26,46,0.07)',
                    border: '1px solid rgba(237,229,225,0.7)',
                  }}
                >
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}
                  >
                    {EMOJIS_ESPECIES[r.mascota?.especie] ?? '🐾'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-bold text-sm" style={{ color: '#1A1A2E' }}>
                      {r.mascota?.nombre ?? `Mascota #${r.mascota_id}`}
                    </p>
                    <p className="text-xs mt-0.5 capitalize" style={{ color: '#9CA3AF' }}>
                      {r.mascota?.especie}{r.mascota?.raza ? ` · ${r.mascota.raza}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
                    >
                      SOS
                    </span>
                    <ChevronRight size={14} style={{ color: '#EDE5E1' }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!cargando && reportes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-6 flex flex-col items-center gap-3 text-center"
            style={{ background: 'white', boxShadow: '0 4px 20px rgba(26,26,46,0.07)' }}
          >
            <span className="text-5xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🎉</span>
            <div>
              <p className="font-poppins font-bold" style={{ color: '#1A1A2E' }}>
                ¡Todo tranquilo por aquí!
              </p>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                No hay mascotas perdidas cerca ahora mismo.
              </p>
            </div>
          </motion.div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
