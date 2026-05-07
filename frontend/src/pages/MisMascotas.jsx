import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useTokens } from '../hooks/useTokens';
import * as mascotaService from '../services/mascotaService';
import MascotaCard from '../components/MascotaCard';
import BottomNav from '../components/ui/BottomNav';

export default function MisMascotas() {
  const navigate = useNavigate();
  const t        = useTokens();
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => { cargarMascotas(); }, []);

  async function cargarMascotas() {
    try {
      const { data } = await mascotaService.listarMascotas();
      setMascotas(data.mascotas);
    } catch {
      setError('No se pudo cargar la lista de mascotas.');
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    const mascota = mascotas.find(m => m.id === id);
    toast(`¿Eliminar a ${mascota?.nombre}?`, {
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await mascotaService.eliminarMascota(id);
            setMascotas(prev => prev.filter(m => m.id !== id));
            toast.success(`${mascota?.nombre} eliminado correctamente.`);
          } catch { toast.error('No se pudo eliminar la mascota.'); }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: t.bg }}>

      {/* Header */}
      <div className="relative px-5 pt-safe pt-5 pb-6 overflow-hidden" style={{ background: t.bgHeader }}>
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(249,123,98,0.15) 0%,transparent 70%)' }} />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-poppins font-extrabold" style={{ color: t.text }}>Mis mascotas</h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>
              {cargando ? 'Cargando…' : `${mascotas.length} mascota${mascotas.length !== 1 ? 's' : ''} registrada${mascotas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/mascotas/nueva')}
            className="h-11 w-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', boxShadow: '0 6px 18px rgba(249,123,98,0.45)' }}>
            <Plus size={22} color="white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Skeleton */}
      {cargando && (
        <div className="px-4 pt-4 flex flex-col gap-4">
          <div className="spinner-border hidden" />
          {[1,2,3].map(i => (
            <div key={i} className="rounded-3xl overflow-hidden"
                 style={{ background: t.surface, border: `1px solid ${t.border}` }}>
              <div className="h-44 animate-pulse" style={{ background: t.skeletonBg }} />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-5 w-32 rounded-xl animate-pulse" style={{ background: t.skeletonBg }} />
                <div className="h-3.5 w-20 rounded-xl animate-pulse" style={{ background: t.skeletonBg }} />
                <div className="flex gap-2 mt-2">
                  <div className="h-10 flex-1 rounded-2xl animate-pulse" style={{ background: t.skeletonBg }} />
                  <div className="h-10 w-10 rounded-2xl animate-pulse" style={{ background: t.skeletonBg }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="mx-4 mt-4 px-4 py-3 rounded-2xl text-sm font-medium"
             style={{ background: t.dangerBg, color: t.danger, border: `1px solid ${t.danger}40` }}>
          {error}
        </div>
      )}

      {/* Empty */}
      {!cargando && !error && mascotas.length === 0 && (
        <div className="flex flex-col items-center py-16 px-8 text-center" data-testid="empty-state">
          <div className="h-28 w-28 rounded-3xl flex items-center justify-center text-6xl mb-5"
               style={{ background: t.primaryBg, border: `1px solid ${t.primaryBorder}` }}>
            🐾
          </div>
          <h3 className="text-lg font-poppins font-bold mb-2" style={{ color: t.text }}>
            Aún no tienes mascotas registradas
          </h3>
          <p className="text-sm mb-6" style={{ color: t.textMuted }}>
            Registra el perfil digital de tu mascota para empezar.
          </p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate('/mascotas/nueva')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', boxShadow: '0 8px 24px rgba(249,123,98,0.4)' }}>
            <Plus size={18} /> Registrar mi primera mascota
          </motion.button>
        </div>
      )}

      {/* Lista */}
      {!cargando && mascotas.length > 0 && (
        <div className="px-4 pt-4 flex flex-col gap-4">
          {mascotas.map((mascota, idx) => (
            <motion.div key={mascota.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}>
              <MascotaCard mascota={mascota} onEliminar={handleEliminar} />
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
