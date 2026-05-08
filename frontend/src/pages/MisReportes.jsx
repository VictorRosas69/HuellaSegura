import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { useTokens } from '../hooks/useTokens';
import * as reporteService from '../services/reporteService';
import ReporteCard from '../components/ReporteCard';
import BottomNav from '../components/ui/BottomNav';

export default function MisReportes() {
  const navigate = useNavigate();
  const t        = useTokens();
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

  const activos  = reportes.filter(r => r.estado === 'en_busqueda');
  const cerrados = reportes.filter(r => r.estado !== 'en_busqueda');

  return (
    <div className="min-h-screen pb-24" style={{ background: t.bg }}>

      {/* Header */}
      <div className="relative px-5 pt-safe pt-5 pb-6 overflow-hidden" style={{ background: t.bgHeader }}>
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(249,123,98,0.15) 0%,transparent 70%)' }} />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-poppins font-extrabold" style={{ color: t.text }}>Mis reportes</h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>
              {cargando ? 'Cargando…' : `${reportes.length} reporte${reportes.length !== 1 ? 's' : ''} en total`}
            </p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/reportes/nuevo')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', boxShadow: '0 6px 18px rgba(249,123,98,0.4)' }}>
            <Megaphone size={16} /> Nueva alerta
          </motion.button>
        </div>
      </div>

      {/* Loading */}
      {cargando && (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 rounded-full border-2 animate-spin"
               style={{ borderColor: t.primary, borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="mx-4 mt-4 px-4 py-3 rounded-2xl text-sm font-medium"
             style={{ background: t.dangerBg, color: t.danger, border: `1px solid ${t.danger}30` }}>
          {error}
        </div>
      )}

      {/* Empty */}
      {!cargando && !error && reportes.length === 0 && (
        <div className="flex flex-col items-center py-16 px-8 text-center" data-testid="empty-state">
          <div className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl mb-5"
               style={{ background: t.primaryBg, border: `1px solid ${t.primaryBorder}` }}>
            📢
          </div>
          <h3 className="text-lg font-poppins font-bold mb-2" style={{ color: t.text }}>No tienes reportes activos</h3>
          <p className="text-sm mb-6" style={{ color: t.textMuted }}>
            Si tu mascota se ha perdido, publica una alerta para que otros la ayuden a encontrar.
          </p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate('/reportes/nuevo')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)', boxShadow: '0 8px 24px rgba(249,123,98,0.4)' }}>
            <Megaphone size={18} /> Publicar primera alerta
          </motion.button>
        </div>
      )}

      {/* En búsqueda */}
      {!cargando && activos.length > 0 && (
        <section className="px-4 pt-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: t.danger }} />
            <h2 className="text-xs font-poppins font-bold uppercase tracking-wider" style={{ color: t.danger }}>
              En búsqueda ({activos.length})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {activos.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}>
                <ReporteCard reporte={r} onCambiarEstado={handleCambiarEstado} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Historial */}
      {!cargando && cerrados.length > 0 && (
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-poppins font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>
              Historial ({cerrados.length})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {cerrados.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}>
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
