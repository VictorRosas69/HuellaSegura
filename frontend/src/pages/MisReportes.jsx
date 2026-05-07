import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import * as reporteService from '../services/reporteService';
import ReporteCard from '../components/ReporteCard';
import BottomNav from '../components/ui/BottomNav';

export default function MisReportes() {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => { cargarReportes(); }, []);

  async function cargarReportes() {
    try {
      const { data } = await reporteService.misReportes();
      setReportes(data.reportes);
    } catch {
      setError('No se pudieron cargar tus reportes.');
    } finally {
      setCargando(false);
    }
  }

  async function handleCambiarEstado(id, nuevoEstado) {
    try {
      await reporteService.cambiarEstado(id, nuevoEstado);
      setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
      const labels = { encontrada: '¡Mascota encontrada! 🎉', cerrado: 'Reporte cerrado.', en_busqueda: 'Reporte reactivado.' };
      toast.success(labels[nuevoEstado] || 'Estado actualizado.');
    } catch {
      toast.error('No se pudo cambiar el estado del reporte.');
    }
  }

  const activos  = reportes.filter((r) => r.estado === 'en_busqueda');
  const cerrados = reportes.filter((r) => r.estado !== 'en_busqueda');

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F5' }}>

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-safe pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-extrabold" style={{ color: '#1A1A2E' }}>
            Mis reportes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
            Gestiona tus alertas de mascotas perdidas
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/reportes/nuevo')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
        >
          <Megaphone size={16} />
          Nueva alerta
        </motion.button>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {cargando && (
        <div className="flex justify-center py-16">
          <div
            className="spinner-border h-10 w-10 rounded-full border-2 animate-spin"
            style={{ borderColor: '#F97B62', borderTopColor: 'transparent' }}
          />
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
      {!cargando && !error && reportes.length === 0 && (
        <div
          className="flex flex-col items-center py-16 px-8 text-center"
          data-testid="empty-state"
        >
          <div
            className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl mb-5"
            style={{ background: 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}
          >
            📢
          </div>
          <h3 className="text-lg font-poppins font-bold mb-2" style={{ color: '#1A1A2E' }}>
            No tienes reportes activos
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
            Si tu mascota se ha perdido, publica una alerta para que otros la ayuden a encontrar.
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/reportes/nuevo')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
          >
            <Megaphone size={18} />
            Publicar primera alerta
          </motion.button>
        </div>
      )}

      {/* ── En búsqueda ──────────────────────────────────────────────────── */}
      {!cargando && activos.length > 0 && (
        <section className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: '#EF4444' }}
            />
            <h2 className="text-sm font-poppins font-bold uppercase tracking-wider"
                style={{ color: '#EF4444' }}>
              En búsqueda ({activos.length})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {activos.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <ReporteCard reporte={r} onCambiarEstado={handleCambiarEstado} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Historial ────────────────────────────────────────────────────── */}
      {!cargando && cerrados.length > 0 && (
        <section className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-poppins font-bold uppercase tracking-wider"
                style={{ color: '#9CA3AF' }}>
              Historial ({cerrados.length})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {cerrados.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <ReporteCard reporte={r} onCambiarEstado={handleCambiarEstado} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <BottomNav />
    </div>
  );
}
