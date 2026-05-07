import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Calendar, EyeOff, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { listarReportesAdmin, moderarReporte } from '../../services/adminService';

const ESPECIE_EMOJIS = { perro:'🐶', gato:'🐱', ave:'🐦', reptil:'🦎', otro:'🐾' };

const MOCK_REPORTES = [
  { id:1, mascota_id:1, mascota:{ nombre:'Max', especie:'perro' }, estado:'en_busqueda', fecha_perdida:'2026-04-30', latitud:1.2136, longitud:-77.2811, moderado:false },
  { id:2, mascota_id:2, mascota:{ nombre:'Luna',especie:'gato'  }, estado:'encontrada',  fecha_perdida:'2026-04-28', latitud:1.2200, longitud:-77.2750, moderado:false },
  { id:3, mascota_id:3, mascota:{ nombre:'Coco',especie:'ave'   }, estado:'cerrado',     fecha_perdida:'2026-04-20', latitud:1.2100, longitud:-77.2900, moderado:true  },
];

const ESTADO_CFG = {
  en_busqueda: { label:'En búsqueda', color:'#EF4444', bg:'#FFF0EE' },
  encontrada:  { label:'Encontrada',  color:'#10B981', bg:'#F0FFF4' },
  cerrado:     { label:'Cerrado',     color:'#9CA3AF', bg:'#F9FAFB' },
};

export default function ModeracionReportes() {
  const navigate = useNavigate();
  const [reportes, setReportes]   = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    listarReportesAdmin()
      .then(({ data }) => setReportes(data.reportes))
      .catch(() => setReportes(MOCK_REPORTES))
      .finally(() => setCargando(false));
  }, []);

  async function handleModerar(id) {
    try { await moderarReporte(id); } catch { /* demo */ }
    setReportes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nuevoModerado = !r.moderado;
      toast(nuevoModerado ? '🚫 Reporte ocultado del mapa' : '✅ Reporte visible nuevamente');
      return { ...r, moderado: nuevoModerado };
    }));
  }

  const visibles = reportes.filter(r => !r.moderado).length;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFF8F5' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-safe pt-4 pb-5"
           style={{ background:'white', borderBottom:'1px solid #EDE5E1' }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate('/admin')}
          className="h-9 w-9 rounded-2xl flex items-center justify-center"
          style={{ background:'#FFF0EA' }}>
          <ChevronLeft size={20} style={{ color:'#F97B62' }} strokeWidth={2.5} />
        </motion.button>
        <div>
          <h1 className="font-poppins font-bold text-lg" style={{ color:'#1A1A2E' }}>
            Moderación de reportes
          </h1>
          <p className="text-xs" style={{ color:'#9CA3AF' }}>
            {cargando ? 'Cargando…' : `${visibles} visibles · ${reportes.length - visibles} ocultos`}
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">

        {/* Skeleton */}
        {cargando && [1,2,3].map(i => <div key={i} className="rounded-3xl h-28 skeleton" />)}

        {/* Lista */}
        <AnimatePresence>
          {!cargando && reportes.map((r, i) => {
            const cfg   = ESTADO_CFG[r.estado] || ESTADO_CFG.cerrado;
            const emoji = ESPECIE_EMOJIS[r.mascota?.especie] || '🐾';

            return (
              <motion.div
                key={r.id}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl p-4"
                style={{
                  background:'white',
                  boxShadow:'0 4px 16px rgba(26,26,46,0.07)',
                  opacity: r.moderado ? 0.6 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                       style={{ background:'linear-gradient(135deg,#FFD0BF,#F97B62)' }}>
                    {emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-poppins font-bold text-sm truncate" style={{ color:'#1A1A2E' }}>
                        {r.mascota?.nombre || `Mascota #${r.mascota_id}`}
                      </p>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                            style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} style={{ color:'#9CA3AF' }} />
                        <span className="text-xs" style={{ color:'#9CA3AF' }}>{r.fecha_perdida}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={11} style={{ color:'#9CA3AF' }} />
                        <span className="text-xs" style={{ color:'#9CA3AF' }}>
                          {parseFloat(r.latitud).toFixed(3)}, {parseFloat(r.longitud).toFixed(3)}
                        </span>
                      </div>
                    </div>

                    {/* Badge moderado */}
                    {r.moderado && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background:'#FFF8E0', color:'#B45309' }}>
                        <EyeOff size={9} /> Oculto del mapa
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón moderar */}
                <div className="mt-3 pt-3 flex justify-end" style={{ borderTop:'1px solid #EDE5E1' }}>
                  <motion.button
                    whileTap={{ scale:0.95 }}
                    onClick={() => handleModerar(r.id)}
                    data-testid={`btn-moderar-${r.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold"
                    style={r.moderado
                      ? { background:'#F0FFF4', color:'#10B981' }
                      : { background:'#FFF8E0', color:'#B45309' }}
                  >
                    {r.moderado ? <><Eye size={13} /> Mostrar</> : <><EyeOff size={13} /> Ocultar</>}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Vacío */}
        {!cargando && reportes.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <span className="text-5xl">✅</span>
            <p className="font-poppins font-bold" style={{ color:'#1A1A2E' }}>Sin reportes pendientes</p>
            <p className="text-sm" style={{ color:'#9CA3AF' }}>No hay contenido para moderar.</p>
          </div>
        )}

      </div>
    </div>
  );
}
