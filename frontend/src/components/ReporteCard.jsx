import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, XCircle, Search } from 'lucide-react';

const ESPECIE_EMOJIS = { perro:'🐶', gato:'🐱', ave:'🐦', reptil:'🦎', otro:'🐾' };

const ESTADO_CONFIG = {
  en_busqueda: { label: 'En búsqueda', color: '#EF4444', bg: '#FFF0EE', dot: '#EF4444' },
  encontrada:  { label: 'Encontrada',  color: '#10B981', bg: '#F0FFF4', dot: '#10B981' },
  cerrado:     { label: 'Cerrado',     color: '#9CA3AF', bg: '#F9FAFB', dot: '#D1D5DB' },
};

const ESTADOS_TRANSICION = [
  { id: 'encontrada', label: '¡La encontré!', icon: CheckCircle, color: '#10B981', bg: '#F0FFF4' },
  { id: 'cerrado',    label: 'Cerrar reporte', icon: XCircle,    color: '#9CA3AF', bg: '#F9FAFB' },
  { id: 'en_busqueda',label: 'Reactivar',      icon: Search,     color: '#F97B62', bg: '#FFF0EA' },
];

export default function ReporteCard({ reporte, onCambiarEstado }) {
  const config      = ESTADO_CONFIG[reporte.estado] || ESTADO_CONFIG.en_busqueda;
  const emoji       = ESPECIE_EMOJIS[reporte.mascota?.especie] || '🐾';
  const fotoPrincipal = reporte.mascota?.foto_principal || reporte.mascota?.foto_urls?.[0];

  const fechaFormateada = reporte.fecha_perdida
    ? new Date(reporte.fecha_perdida + 'T12:00:00').toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="reporte-card"
      className="rounded-3xl overflow-hidden"
      style={{ background: 'white', boxShadow: '0 4px 20px rgba(26,26,46,0.08)' }}
    >
      <div className="p-4">
        <div className="flex gap-3 items-start">

          {/* Foto / avatar mascota */}
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}
          >
            {fotoPrincipal
              ? <img src={fotoPrincipal} alt="" className="w-full h-full object-cover" />
              : emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-poppins font-bold text-base truncate" style={{ color: '#1A1A2E' }}>
                {reporte.mascota?.nombre || `Mascota #${reporte.mascota_id}`}
              </h3>
              {/* Badge estado */}
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                style={{ background: config.bg, color: config.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: config.dot,
                  animation: reporte.estado === 'en_busqueda' ? 'pulse-soft 2s infinite' : 'none' }} />
                {config.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <Calendar size={11} style={{ color: '#9CA3AF' }} />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                Perdida el {fechaFormateada}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: '#9CA3AF' }} />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                {reporte.latitud
                  ? `${parseFloat(reporte.latitud).toFixed(4)}, ${parseFloat(reporte.longitud).toFixed(4)}`
                  : 'Ubicación no registrada'}
              </span>
            </div>

            {reporte.descripcion && (
              <p className="text-xs mt-1.5 line-clamp-2 italic" style={{ color: '#6B7280' }}>
                "{reporte.descripcion}"
              </p>
            )}
          </div>
        </div>

        {/* Botones de transición de estado */}
        {onCambiarEstado && (
          <div className="flex gap-2 mt-3 pt-3 flex-wrap"
               style={{ borderTop: '1px solid #EDE5E1' }}>
            {ESTADOS_TRANSICION
              .filter(e => e.id !== reporte.estado)
              .map(({ id, label, icon: Icon, color, bg }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCambiarEstado(reporte.id, id)}
                  data-testid={`btn-estado-${id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold"
                  style={{ background: bg, color }}
                >
                  <Icon size={13} />
                  {label}
                </motion.button>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
