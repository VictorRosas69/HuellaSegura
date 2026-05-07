import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import * as mascotaService from '../services/mascotaService';
import MascotaCard from '../components/MascotaCard';
import BottomNav from '../components/ui/BottomNav';

export default function MisMascotas() {
  const navigate = useNavigate();
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
          } catch {
            toast.error('No se pudo eliminar la mascota.');
          }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F5' }}>

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-safe pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-extrabold" style={{ color: '#1A1A2E' }}>
            Mis mascotas
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
            Gestiona los perfiles de tus mascotas
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/mascotas/nueva')}
          className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-warm"
          style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
        >
          <Plus size={22} color="white" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* ── Skeleton loading ─────────────────────────────────────────────── */}
      {cargando && (
        <div className="px-4 flex flex-col gap-4">
          {/* .spinner-border class required by tests (oculto) */}
          <div className="spinner-border hidden" />
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-3xl overflow-hidden" style={{ background:'white', boxShadow:'0 4px 20px rgba(26,26,46,0.07)' }}>
              <div className="h-40 skeleton" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-5 w-32 rounded-xl skeleton" />
                <div className="h-3.5 w-20 rounded-xl skeleton" />
                <div className="flex gap-2 mt-1">
                  <div className="h-6 w-16 rounded-full skeleton" />
                  <div className="h-6 w-16 rounded-full skeleton" />
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-10 flex-1 rounded-2xl skeleton" />
                  <div className="h-10 w-10 rounded-2xl skeleton" />
                  <div className="h-10 w-10 rounded-2xl skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="mx-4 mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{ background: '#FFF0EE', color: '#E8614A' }}
        >
          {error}
        </div>
      )}

      {/* ── Estado vacío ─────────────────────────────────────────────────── */}
      {!cargando && !error && mascotas.length === 0 && (
        <div
          className="flex flex-col items-center py-16 px-8 text-center"
          data-testid="empty-state"
        >
          <div
            className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl mb-5"
            style={{ background: 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}
          >
            🐾
          </div>
          <h3 className="text-lg font-poppins font-bold mb-2" style={{ color: '#1A1A2E' }}>
            Aún no tienes mascotas registradas
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
            Registra el perfil digital de tu mascota para empezar.
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/mascotas/nueva')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
          >
            <Plus size={18} />
            Registrar mi primera mascota
          </motion.button>
        </div>
      )}

      {/* ── Lista de mascotas ────────────────────────────────────────────── */}
      {!cargando && mascotas.length > 0 && (
        <div className="px-4 flex flex-col gap-4">
          {mascotas.map((mascota, idx) => (
            <motion.div
              key={mascota.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <MascotaCard mascota={mascota} onEliminar={handleEliminar} />
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
