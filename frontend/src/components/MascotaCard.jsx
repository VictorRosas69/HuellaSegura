import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, QrCode, Printer, Eye } from 'lucide-react';
import CartelImpresion from './CartelImpresion';

const ESPECIE_EMOJIS  = { perro:'🐶', gato:'🐱', ave:'🐦', reptil:'🦎', otro:'🐾' };
const ESPECIE_COLORS  = {
  perro:  ['rgba(255,144,128,0.3)','#FF9280','#F97B62'],
  gato:   ['rgba(199,178,245,0.3)','#C7B2F5','#9B87E8'],
  ave:    ['rgba(38,214,205,0.3)', '#26D6CD','#00C4B4'],
  reptil: ['rgba(74,222,128,0.3)', '#4ADE80','#22C55E'],
  otro:   ['rgba(255,144,128,0.3)','#FF9280','#F97B62'],
};
const ESPECIE_LABELS  = { perro:'Perro', gato:'Gato', ave:'Ave', reptil:'Reptil', otro:'Otro' };

export default function MascotaCard({ mascota, onEliminar }) {
  const navigate = useNavigate();
  const [mostrarCartel, setMostrarCartel] = useState(false);

  const [bgA, c1, c2] = ESPECIE_COLORS[mascota.especie] || ESPECIE_COLORS.otro;
  const emoji         = ESPECIE_EMOJIS[mascota.especie]  || '🐾';
  const fotoPrincipal = mascota.foto_urls?.[0] || null;

  if (mostrarCartel) {
    return <CartelImpresion mascota={{ ...mascota, foto_principal: fotoPrincipal }} onCerrar={() => setMostrarCartel(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.99 }}
      data-testid="mascota-card"
      className="rounded-3xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

      {/* Banner */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
        onClick={() => navigate(`/mascotas/${mascota.id}`)}>
        <span className="absolute text-[8rem] opacity-15 select-none filter blur-sm pointer-events-none">{emoji}</span>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.3) 100%)' }} />

        <div className="relative z-10 h-24 w-24 rounded-2xl overflow-hidden flex items-center justify-center text-4xl"
             style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }}>
          {fotoPrincipal ? <img src={fotoPrincipal} alt={mascota.nombre} className="w-full h-full object-cover" /> : emoji}
        </div>

        {/* Badge especie */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
             style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {emoji} {ESPECIE_LABELS[mascota.especie] || 'Mascota'}
        </div>

        {/* Ver perfil */}
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center"
             style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
          <Eye size={14} color="white" />
        </div>

        {/* Microchip badge */}
        {mascota.microchip && (
          <div className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
               style={{ background: 'rgba(0,196,180,0.8)', color: 'white' }}>
            💉 Chip
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4">
        <div className="mb-3">
          <h3 className="font-poppins font-bold text-lg leading-tight text-white">{mascota.nombre}</h3>
          {mascota.raza && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{mascota.raza}</p>}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mascota.edad && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(249,123,98,0.15)', color: '#F97B62', border: '1px solid rgba(249,123,98,0.25)' }}>
              🎂 {mascota.edad} {mascota.edad_unidad || 'años'}
            </span>
          )}
          {mascota.sexo && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(155,135,232,0.15)', color: '#9B87E8', border: '1px solid rgba(155,135,232,0.25)' }}>
              {mascota.sexo === 'macho' ? '♂' : '♀'} {mascota.sexo.charAt(0).toUpperCase() + mascota.sexo.slice(1)}
            </span>
          )}
          {mascota.color && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>
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
            style={{ background: 'rgba(249,123,98,0.15)', color: '#F97B62', border: '1px solid rgba(249,123,98,0.2)' }}>
            <Pencil size={14} /> Editar
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/mascotas/${mascota.id}/carnet`)}
            className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(0,196,180,0.15)', border: '1px solid rgba(0,196,180,0.2)' }}>
            <QrCode size={16} style={{ color: '#00C4B4' }} />
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarCartel(true)}
            data-testid="btn-ver-cartel"
            className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(155,135,232,0.15)', border: '1px solid rgba(155,135,232,0.2)' }}>
            <Printer size={16} style={{ color: '#9B87E8' }} />
          </motion.button>

          {onEliminar && (
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => onEliminar(mascota.id)}
              aria-label={`Eliminar a ${mascota.nombre}`}
              className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={16} style={{ color: '#EF4444' }} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
