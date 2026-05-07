import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Calendar, EyeOff, Eye, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { listarReportesAdmin, moderarReporte } from '../../services/adminService';

const ESPECIE_EMOJIS = { perro: '🐶', gato: '🐱', ave: '🐦', reptil: '🦎', otro: '🐾' };

const ESTADO_CFG = {
  en_busqueda: { label: 'En búsqueda', color: '#F87171', bg: 'rgba(248,113,113,0.15)', dot: '#F87171' },
  encontrada:  { label: 'Encontrada',  color: '#34D399', bg: 'rgba(52,211,153,0.15)',  dot: '#34D399' },
  cerrado:     { label: 'Cerrado',     color: '#6B7280', bg: 'rgba(107,114,128,0.15)', dot: '#6B7280' },
};

function TabBtn({ active, onClick, children, count, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
      style={active
        ? { background: `${color}20`, color, border: `1px solid ${color}40` }
        : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }
      }
    >
      {children}
      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold"
            style={active
              ? { background: color, color: '#0F0F1A' }
              : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
        {count}
      </span>
    </button>
  );
}

export default function ModeracionReportes() {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtro,   setFiltro]   = useState('todos');

  useEffect(() => {
    listarReportesAdmin()
      .then(({ data }) => setReportes(data.reportes))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  async function handleModerar(id) {
    try { await moderarReporte(id); } catch { /* optimistic */ }
    setReportes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nuevo = !r.moderado;
      toast(nuevo ? '🚫 Reporte oculto del mapa' : '✅ Reporte visible nuevamente');
      return { ...r, moderado: nuevo };
    }));
  }

  const filtrados = useMemo(() => {
    let list = reportes;
    if (filtro === 'activos')   list = list.filter(r => r.estado === 'en_busqueda' && !r.moderado);
    if (filtro === 'ocultos')   list = list.filter(r => r.moderado);
    if (filtro === 'resueltos') list = list.filter(r => r.estado === 'encontrada');
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(r =>
        r.mascota?.nombre?.toLowerCase().includes(q) ||
        r.estado?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reportes, filtro, busqueda]);

  const activos   = reportes.filter(r => r.estado === 'en_busqueda' && !r.moderado).length;
  const ocultos   = reportes.filter(r => r.moderado).length;
  const resueltos = reportes.filter(r => r.estado === 'encontrada').length;

  return (
    <div className="min-h-screen" style={{ background: '#0F0F1A' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-5 pt-12 pb-5"
           style={{ background: 'linear-gradient(135deg,#1E1B4B 0%,#1A1A2E 100%)' }}>
        <div className="flex items-center gap-3 mb-5">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate('/admin')}
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="font-poppins font-bold text-white text-lg">Moderación</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {cargando ? 'Cargando…' : `${reportes.length} reportes en total`}
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'En búsqueda', value: activos,   color: '#F87171' },
            { label: 'Ocultos',     value: ocultos,   color: '#FBBF24' },
            { label: 'Resueltos',   value: resueltos, color: '#34D399' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-3 text-center"
                 style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}25` }}>
              <p className="font-poppins font-extrabold text-xl" style={{ color }}>{value}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre de mascota…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <TabBtn active={filtro === 'todos'}    onClick={() => setFiltro('todos')}    count={reportes.length} color="#818CF8">
            <Filter size={11} /> Todos
          </TabBtn>
          <TabBtn active={filtro === 'activos'}  onClick={() => setFiltro('activos')}  count={activos}   color="#F87171">
            En búsqueda
          </TabBtn>
          <TabBtn active={filtro === 'ocultos'}  onClick={() => setFiltro('ocultos')}  count={ocultos}   color="#FBBF24">
            Ocultos
          </TabBtn>
          <TabBtn active={filtro === 'resueltos'} onClick={() => setFiltro('resueltos')} count={resueltos} color="#34D399">
            Resueltos
          </TabBtn>
        </div>
      </div>

      {/* ── Lista ──────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 flex flex-col gap-3 pb-12">

        {cargando && [1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-2xl animate-pulse"
               style={{ background: 'rgba(255,255,255,0.05)' }} />
        ))}

        <AnimatePresence mode="popLayout">
          {!cargando && filtrados.map((r, i) => {
            const cfg   = ESTADO_CFG[r.estado] || ESTADO_CFG.cerrado;
            const emoji = ESPECIE_EMOJIS[r.mascota?.especie] || '🐾';

            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-4"
                style={{
                  background: r.moderado ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                  border: r.moderado
                    ? '1px solid rgba(251,191,36,0.2)'
                    : `1px solid ${cfg.color}20`,
                  opacity: r.moderado ? 0.7 : 1,
                }}
              >
                {/* Fila superior */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                       style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-poppins font-bold text-sm text-white truncate">
                        {r.mascota?.nombre || `Mascota #${r.mascota_id}`}
                      </p>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                            style={{ background: cfg.bg, color: cfg.color }}>
                        <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {r.fecha_perdida && (
                        <div className="flex items-center gap-1">
                          <Calendar size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(r.fecha_perdida).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {r.latitud && (
                        <div className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {parseFloat(r.latitud).toFixed(3)}, {parseFloat(r.longitud).toFixed(3)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge moderado */}
                {r.moderado && (
                  <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-xl"
                       style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <EyeOff size={12} style={{ color: '#FBBF24' }} />
                    <span className="text-xs font-semibold" style={{ color: '#FBBF24' }}>
                      Oculto del mapa por incumplir las normas
                    </span>
                  </div>
                )}

                {/* Botón moderar */}
                <div className="flex justify-end pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleModerar(r.id)}
                    data-testid={`btn-moderar-${r.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                    style={r.moderado
                      ? { background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }
                      : { background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' }
                    }
                  >
                    {r.moderado
                      ? <><Eye size={13} /> Mostrar en mapa</>
                      : <><EyeOff size={13} /> Ocultar del mapa</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Vacío */}
        {!cargando && filtrados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 gap-3 text-center"
          >
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl"
                 style={{ background: 'rgba(255,255,255,0.05)' }}>✅</div>
            <p className="font-poppins font-bold text-white">Todo en orden</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No hay reportes que coincidan con el filtro seleccionado.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
