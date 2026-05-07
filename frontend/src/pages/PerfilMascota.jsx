import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, MoreHorizontal, MapPin, Phone, Navigation, QrCode } from 'lucide-react';
import { obtenerMascota } from '../services/mascotaService';
import { misReportes } from '../services/reporteService';
import Chip   from '../components/ui/Chip';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import BottomNav from '../components/ui/BottomNav';

const ESPECIE_EMOJIS  = { perro: '🐶', gato: '🐱', ave: '🐦', reptil: '🦎', otro: '🐾' };
const ESPECIE_COLORS  = {
  perro:  'linear-gradient(135deg,#FFD0BF,#F97B62)',
  gato:   'linear-gradient(135deg,#C7B2F5,#9B87E8)',
  ave:    'linear-gradient(135deg,#A7F0EB,#00C4B4)',
  reptil: 'linear-gradient(135deg,#A7F5B9,#22C55E)',
  otro:   'linear-gradient(135deg,#FFD0BF,#F97B62)',
};

export default function PerfilMascota() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [mascota,        setMascota]        = useState(null);
  const [reporteActivo,  setReporteActivo]  = useState(null);
  const [cargando,       setCargando]       = useState(true);

  useEffect(() => {
    Promise.all([
      obtenerMascota(id),
      misReportes().catch(() => ({ data: { reportes: [] } })),
    ]).then(([{ data: dm }, { data: dr }]) => {
      setMascota(dm.mascota);
      const activo = (dr.reportes || []).find(
        (r) => String(r.mascota_id) === String(id) && r.estado === 'activo'
      );
      setReporteActivo(activo || null);
    }).catch(() => navigate(-1))
      .finally(() => setCargando(false));
  }, [id, navigate]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#FFF8F5' }}>
        <div className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
             style={{ borderColor: '#F97B62', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!mascota) return null;

  const gradient = ESPECIE_COLORS[mascota.especie] || ESPECIE_COLORS.otro;
  const emoji    = ESPECIE_EMOJIS[mascota.especie]  || '🐾';
  const fotos    = mascota.foto_urls || [];

  const chips = [
    mascota.raza,
    mascota.edad ? `${mascota.edad} ${mascota.edad_unidad || 'años'}` : null,
    mascota.sexo,
    mascota.color,
  ].filter(Boolean);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F5' }}>

      {/* ── Header gradiente con foto ──────────────────────────────────── */}
      <div className="relative h-72 overflow-hidden" style={{ background: gradient }}>

        {/* Decoración fondo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
          <span className="text-[12rem] filter blur-sm">{emoji}</span>
        </div>

        {/* Foto principal o emoji grande */}
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          {fotos[0] ? (
            <img src={fotos[0]} alt={mascota.nombre}
                 className="h-48 w-48 rounded-3xl object-cover shadow-warm-lg" />
          ) : (
            <div
              className="h-48 w-48 rounded-3xl flex items-center justify-center text-7xl shadow-warm-lg"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            >
              {emoji}
            </div>
          )}
        </div>

        {/* Barra superior */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 pt-safe pt-4">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.35)' }}
          >
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(`/mascotas/${id}/carnet`)}
              className="h-9 w-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            >
              <QrCode size={18} color="white" strokeWidth={2} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="h-9 w-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            >
              <MoreHorizontal size={18} color="white" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Badge estado */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap"
            style={{
              background: reporteActivo ? 'rgba(239,68,68,0.88)' : 'rgba(0,196,180,0.88)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {reporteActivo
              ? `Perdido · Hace ${Math.max(1, Math.round((Date.now() - new Date(reporteActivo.created_at)) / 3600000))}h`
              : 'En casa · Registrado'}
          </span>
        </div>
      </div>

      {/* ── Card principal ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-4 -mt-5 rounded-3xl overflow-hidden shadow-card-lg relative z-10"
        style={{ background: 'white' }}
      >
        <div className="p-5">
          {/* Nombre + recompensa */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-3xl font-poppins font-extrabold" style={{ color: '#1A1A2E' }}>
              {mascota.nombre}
            </h1>
            {reporteActivo?.recompensa ? (
              <div className="text-right shrink-0">
                <p className="text-xl font-poppins font-extrabold" style={{ color: '#F97B62' }}>
                  $ {Number(reporteActivo.recompensa).toLocaleString('es-CO')}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                  RECOMPENSA
                </p>
              </div>
            ) : mascota.microchip ? (
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Microchip
                </p>
                <p className="text-sm font-bold" style={{ color: '#F97B62' }}>{mascota.microchip}</p>
              </div>
            ) : null}
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin size={13} style={{ color: '#9CA3AF' }} />
            <span className="text-sm" style={{ color: '#9CA3AF' }}>Pasto, Nariño</span>
          </div>

          {/* Chips de características */}
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((c, i) => (
              <Chip key={i} variant="neutral" size="md">{c}</Chip>
            ))}
          </div>

          {/* Descripción */}
          {mascota.descripcion && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>
              {mascota.descripcion}
            </p>
          )}

          {/* Galería de fotos */}
          {fotos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-5 pb-1">
              {fotos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${mascota.nombre} ${i + 1}`}
                  className="h-24 w-24 rounded-2xl object-cover shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="px-5 pb-5 flex gap-3">
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => navigate(`/mascotas/${id}/editar`)}
          >
            Editar perfil
          </Button>
          <button
            onClick={() => navigate(`/mascotas/${id}/carnet`)}
            className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#E0F9F7' }}
          >
            <QrCode size={20} style={{ color: '#00C4B4' }} />
          </button>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
