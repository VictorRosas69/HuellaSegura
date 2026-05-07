import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, Clock, SlidersHorizontal, X, Check } from 'lucide-react';
import { useThemeContext } from '../providers/ThemeProvider';
import BottomNav from '../components/ui/BottomNav';
import { listarNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notificacionService';

// ─── Demo data ────────────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  { id:1, tipo:'perdida',      mensaje:'Alguien reportó a Max (Labrador) cerca de Cra 27, La Aurora. ¡Hace 2 horas!',   leida:false, created_at: new Date(Date.now()-7200000).toISOString()  },
  { id:2, tipo:'avistamiento', mensaje:'Un vecino vio a un gato similar a Luna en el Parque Bolívar. Hace 45 min.',       leida:false, created_at: new Date(Date.now()-2700000).toISOString()  },
  { id:3, tipo:'perdida',      mensaje:'Nueva mascota perdida en tu zona: Toby, Beagle, collar azul.',                    leida:true,  created_at: new Date(Date.now()-86400000).toISOString() },
  { id:4, tipo:'avistamiento', mensaje:'Avistamiento confirmado: mascota encontrada cerca de tu dirección.',              leida:true,  created_at: new Date(Date.now()-172800000).toISOString()},
];

const TABS = [
  { label: 'Todos',        filter: () => true },
  { label: 'Cercanos',     filter: (n) => n.tipo === 'perdida' },
  { label: 'Mis mascotas', filter: (n) => n.tipo === 'avistamiento' },
];

const FILTRO_TIPO_OPTS   = ['Todos', 'Pérdida', 'Avistamiento'];
const FILTRO_ESTADO_OPTS = ['Todas', 'No leídas', 'Leídas'];

function tiempoRelativo(isoStr) {
  const mins = Math.floor((Date.now() - new Date(isoStr)) / 60000);
  if (mins < 60)   return `Hace ${mins} min`;
  if (mins < 1440) return `Hace ${Math.floor(mins / 60)}h`;
  return `Hace ${Math.floor(mins / 1440)}d`;
}

export default function Alertas() {
  const { isDark } = useThemeContext();

  const [notifs,   setNotifs]   = useState([]);
  const [tab,      setTab]      = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [showFiltro, setShowFiltro] = useState(false);

  // Filtros activos
  const [filtroTipo,   setFiltroTipo]   = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todas');

  useEffect(() => {
    listarNotificaciones()
      .then(({ data }) => setNotifs(data.notificaciones?.length ? data.notificaciones : MOCK_NOTIFS))
      .catch(() => setNotifs(MOCK_NOTIFS))
      .finally(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    try { await marcarLeida(id); } catch { /* demo */ }
    setNotifs(p => p.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const handleReadAll = async () => {
    try { await marcarTodasLeidas(); } catch { /* demo */ }
    setNotifs(p => p.map(n => ({ ...n, leida: true })));
  };

  // Aplicar filtros
  const notifsFiltradas = notifs
    .filter(TABS[tab].filter)
    .filter(n => {
      if (filtroTipo === 'Pérdida')      return n.tipo === 'perdida';
      if (filtroTipo === 'Avistamiento') return n.tipo === 'avistamiento';
      return true;
    })
    .filter(n => {
      if (filtroEstado === 'No leídas') return !n.leida;
      if (filtroEstado === 'Leídas')    return  n.leida;
      return true;
    });

  const noLeidas    = notifs.filter(n => !n.leida).length;
  const filtrosActivos = (filtroTipo !== 'Todos' ? 1 : 0) + (filtroEstado !== 'Todas' ? 1 : 0);

  // ── Tokens de tema ────────────────────────────────────────────────────────
  const bg        = isDark ? '#0F0F1A' : '#FFF8F5';
  const surface   = isDark ? '#1E1E30' : '#FFFFFF';
  const surface2  = isDark ? '#252540' : '#F5F5F5';
  const border    = isDark ? '#323250' : '#EDE5E1';
  const txt       = isDark ? '#F1F0FF' : '#1A1A2E';
  const txtMuted  = isDark ? '#6B6B8A' : '#9CA3AF';

  return (
    <div className="min-h-screen pb-24 transition-colors" style={{ background: bg }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="px-5 pt-safe pt-5 pb-4">
        <div className="flex items-center justify-between mb-0.5">
          <h1 className="font-poppins font-bold text-2xl" style={{ color: txt }}>
            Alertas
          </h1>
          {noLeidas > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReadAll}
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: isDark ? 'rgba(249,123,98,0.15)' : '#FFF0EA', color: '#F97B62' }}
            >
              Marcar todas
            </motion.button>
          )}
        </div>
        <p className="text-sm" style={{ color: txtMuted }}>
          {noLeidas > 0
            ? <><span className="font-bold" style={{ color: '#F97B62' }}>{noLeidas} nuevas</span> · {notifs.length} total</>
            : `${notifs.length} notificaciones`}
        </p>
      </header>

      {/* ── Tabs + Filtro ────────────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2">
          {TABS.map((t, i) => (
            <motion.button
              key={t.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={tab === i
                ? { background: 'linear-gradient(135deg,#FF9280,#F97B62)', color: 'white', boxShadow: '0 4px 12px rgba(249,123,98,0.35)' }
                : { background: surface2, color: txtMuted }}
            >
              {t.label}
            </motion.button>
          ))}

          {/* Botón filtro */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFiltro(true)}
            className="ml-auto relative h-9 w-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: filtrosActivos > 0 ? 'linear-gradient(135deg,#FF9280,#F97B62)' : surface2 }}
          >
            <SlidersHorizontal size={16} color={filtrosActivos > 0 ? 'white' : txtMuted} />
            {filtrosActivos > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#1A1A2E' }}>
                {filtrosActivos}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Lista ────────────────────────────────────────────────────────── */}
      <div className="px-5 flex flex-col gap-3">

        {/* Skeleton */}
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-3xl skeleton" />
        ))}

        {/* Vacío */}
        {!loading && notifsFiltradas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            <div
              className="h-20 w-20 rounded-3xl flex items-center justify-center"
              style={{ background: isDark ? '#252540' : '#FFF0EA' }}
            >
              <Bell size={32} style={{ color: isDark ? '#4A4A6A' : '#FFB09E' }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-poppins font-bold text-base" style={{ color: txt }}>Sin alertas</p>
              <p className="text-sm mt-1 max-w-xs" style={{ color: txtMuted }}>
                {filtrosActivos > 0
                  ? 'Ninguna notificación coincide con los filtros activos.'
                  : 'Cuando haya mascotas perdidas cerca de ti, las verás aquí.'}
              </p>
            </div>
            {filtrosActivos > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setFiltroTipo('Todos'); setFiltroEstado('Todas'); }}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold"
                style={{ background: isDark ? '#252540' : '#FFF0EA', color: '#F97B62' }}
              >
                Limpiar filtros
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Notificaciones */}
        <AnimatePresence>
          {!loading && notifsFiltradas.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !notif.leida && handleRead(notif.id)}
              data-testid={`notif-item-${notif.id}`}
              className="rounded-3xl p-4 cursor-pointer transition-all duration-150"
              style={{
                background: surface,
                boxShadow: notif.leida
                  ? 'none'
                  : isDark
                    ? '0 0 0 1px rgba(249,123,98,0.25)'
                    : '0 4px 20px rgba(249,123,98,0.12)',
                opacity: notif.leida ? 0.65 : 1,
                border: `1px solid ${notif.leida ? border : 'transparent'}`,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Ícono */}
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: notif.tipo === 'avistamiento'
                      ? (isDark ? 'rgba(0,196,180,0.15)' : '#E0F9F7')
                      : (isDark ? 'rgba(249,123,98,0.15)' : '#FFF0EA'),
                  }}
                >
                  {notif.tipo === 'avistamiento'
                    ? <MapPin  size={18} style={{ color: '#00C4B4' }} strokeWidth={2} />
                    : <Bell    size={18} style={{ color: '#F97B62' }} strokeWidth={2} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug line-clamp-3" style={{ color: txt, fontWeight: notif.leida ? 400 : 600 }}>
                    {notif.mensaje}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: txtMuted }} />
                      <span className="text-xs" style={{ color: txtMuted }}>
                        {tiempoRelativo(notif.created_at)}
                      </span>
                    </div>
                    {!notif.leida && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', color: 'white' }}
                      >
                        Nueva
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Panel de filtros ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFiltro && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowFiltro(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed bottom-0 inset-x-0 z-50 rounded-t-[2rem] px-5 pt-4 pb-10 max-w-mobile mx-auto"
              style={{ background: isDark ? '#1E1E30' : 'white', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
            >
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <div className="h-1 w-10 rounded-full" style={{ background: border }} />
              </div>

              <div className="flex items-center justify-between mb-5">
                <h2 className="font-poppins font-bold text-lg" style={{ color: txt }}>Filtrar alertas</h2>
                <button onClick={() => setShowFiltro(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                  style={{ background: surface2 }}>
                  <X size={16} style={{ color: txtMuted }} />
                </button>
              </div>

              {/* Tipo */}
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: txtMuted }}>Tipo</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {FILTRO_TIPO_OPTS.map(opt => (
                  <motion.button key={opt} whileTap={{ scale: 0.95 }}
                    onClick={() => setFiltroTipo(opt)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={filtroTipo === opt
                      ? { background: 'linear-gradient(135deg,#FF9280,#F97B62)', color: 'white' }
                      : { background: surface2, color: txtMuted }}>
                    {filtroTipo === opt && <Check size={13} />}
                    {opt}
                  </motion.button>
                ))}
              </div>

              {/* Estado */}
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: txtMuted }}>Estado</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {FILTRO_ESTADO_OPTS.map(opt => (
                  <motion.button key={opt} whileTap={{ scale: 0.95 }}
                    onClick={() => setFiltroEstado(opt)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={filtroEstado === opt
                      ? { background: 'linear-gradient(135deg,#FF9280,#F97B62)', color: 'white' }
                      : { background: surface2, color: txtMuted }}>
                    {filtroEstado === opt && <Check size={13} />}
                    {opt}
                  </motion.button>
                ))}
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setFiltroTipo('Todos'); setFiltroEstado('Todas'); }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                  style={{ background: surface2, color: txtMuted }}>
                  Limpiar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFiltro(false)}
                  className="flex-[2] py-3.5 rounded-2xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', boxShadow: '0 6px 20px rgba(249,123,98,0.40)' }}>
                  Aplicar filtros {filtrosActivos > 0 && `(${filtrosActivos})`}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
