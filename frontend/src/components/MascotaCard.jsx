import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, QrCode, Printer, Eye } from 'lucide-react';
import CartelImpresion from './CartelImpresion';

const ESPECIE_EMOJIS = { perro:'🐶', gato:'🐱', ave:'🐦', reptil:'🦎', otro:'🐾' };
const ESPECIE_COLORS = {
  perro:  ['#FFD0BF','#F97B62'],
  gato:   ['#C7B2F5','#9B87E8'],
  ave:    ['#A7F0EB','#00C4B4'],
  reptil: ['#A7F5B9','#22C55E'],
  otro:   ['#FFD0BF','#F97B62'],
};
const ESPECIE_LABELS = { perro:'Perro', gato:'Gato', ave:'Ave', reptil:'Reptil', otro:'Otro' };

export default function MascotaCard({ mascota, onEliminar }) {
  const navigate = useNavigate();
  const [mostrarCartel, setMostrarCartel] = useState(false);

  const [c1, c2]   = ESPECIE_COLORS[mascota.especie] || ESPECIE_COLORS.otro;
  const emoji      = ESPECIE_EMOJIS[mascota.especie]  || '🐾';
  const fotoPrincipal = mascota.foto_urls?.[0] || null;

  if (mostrarCartel) {
    return (
      <CartelImpresion
        mascota={{ ...mascota, foto_principal: fotoPrincipal }}
        onCerrar={() => setMostrarCartel(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      data-testid="mascota-card"
      className="rounded-3xl overflow-hidden"
      style={{ background: 'white', boxShadow: '0 4px 20px rgba(26,26,46,0.08)' }}
    >
      {/* Banner gradiente */}
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
        onClick={() => navigate(`/mascotas/${mascota.id}`)}
      >
        {/* Emoji difuminado de fondo */}
        <span className="absolute text-[7rem] opacity-20 select-none filter blur-sm pointer-events-none">
          {emoji}
        </span>

        {/* Foto o emoji */}
        <div
          className="relative z-10 h-24 w-24 rounded-2xl overflow-hidden flex items-center justify-center text-4xl"
          style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}
        >
          {fotoPrincipal
            ? <img src={fotoPrincipal} alt={mascota.nombre} className="w-full h-full object-cover" />
            : emoji}
        </div>

        {/* Badge especie */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.20)', backdropFilter: 'blur(4px)' }}
        >
          {emoji} {ESPECIE_LABELS[mascota.especie] || 'Mascota'}
        </div>

        {/* Botón ver perfil */}
        <div className="absolute top-3 right-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(4px)' }}
          >
            <Eye size={14} color="white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-poppins font-bold text-lg leading-tight" style={{ color: '#1A1A2E' }}>
              {mascota.nombre}
            </h3>
            {mascota.raza && (
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{mascota.raza}</p>
            )}
          </div>
          {mascota.microchip && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: '#E0F9F7', color: '#00A890' }}>
              💉 Chip
            </span>
          )}
        </div>

        {/* Chips de atributos */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mascota.edad && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#FFF0EA', color: '#F97B62' }}>
              🎂 {mascota.edad} {mascota.edad_unidad || 'años'}
            </span>
          )}
          {mascota.sexo && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#F5F3FF', color: '#9B87E8' }}>
              {mascota.sexo === 'macho' ? '♂' : '♀'} {mascota.sexo.charAt(0).toUpperCase() + mascota.sexo.slice(1)}
            </span>
          )}
          {mascota.color && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#FFF8E0', color: '#B45309' }}>
              🎨 {mascota.color}
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/mascotas/${mascota.id}/editar`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background: '#FFF0EA', color: '#F97B62' }}
          >
            <Pencil size={14} /> Editar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/mascotas/${mascota.id}/carnet`)}
            className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#E0F9F7' }}
          >
            <QrCode size={16} style={{ color: '#00C4B4' }} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarCartel(true)}
            data-testid="btn-ver-cartel"
            className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#F5F3FF' }}
          >
            <Printer size={16} style={{ color: '#9B87E8' }} />
          </motion.button>

          {onEliminar && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onEliminar(mascota.id)}
              aria-label={`Eliminar a ${mascota.nombre}`}
              className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#FFF0EE' }}
            >
              <Trash2 size={16} style={{ color: '#EF4444' }} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
