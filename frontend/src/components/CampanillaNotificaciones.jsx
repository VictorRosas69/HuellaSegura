import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useTokens } from '../hooks/useTokens';
import { useSSE } from '../hooks/useSSE';
import PanelNotificaciones from './PanelNotificaciones';
import * as notificacionService from '../services/notificacionService';

export default function CampanillaNotificaciones() {
  const t = useTokens();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [noLeidas,     setNoLeidas]     = useState(0);
  const [pulso,        setPulso]        = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    notificacionService.listarNotificaciones()
      .then(({ data }) => setNoLeidas(data.no_leidas || 0))
      .catch(() => {});
  }, []);

  // Manejador de eventos SSE en tiempo real
  const handleEvento = useCallback((tipo, datos) => {
    if (tipo === 'avistamiento') {
      setNoLeidas(prev => prev + 1);
      setPulso(true);
      setTimeout(() => setPulso(false), 3000);
      toast(`🐾 ${datos.mensaje}`, {
        description: 'Toca para ver en el mapa',
        duration: 6000,
        style: { background: t.isDark ? '#1A1A2E' : 'white', color: t.text },
      });
    }
    if (tipo === 'notificacion') {
      setNoLeidas(prev => prev + 1);
      setPulso(true);
      setTimeout(() => setPulso(false), 3000);
    }
  }, [t.isDark, t.text]);

  useSSE(handleEvento);

  // Cerrar al clic fuera
  useEffect(() => {
    function handleClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setPanelAbierto(false);
    }
    if (panelAbierto) document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, [panelAbierto]);

  return (
    <div className="relative" ref={ref} data-testid="campanilla-wrapper">
      <motion.button
        whileTap={{ scale: 0.88 }}
        animate={pulso ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.4 }}
        onClick={() => { setPanelAbierto(p => !p); if (noLeidas > 0) setNoLeidas(0); }}
        aria-label="Ver notificaciones"
        data-testid="btn-campanilla"
        className="relative h-10 w-10 rounded-2xl flex items-center justify-center"
        style={{ background: t.primaryBg, border: `1px solid ${t.primaryBorder}` }}
      >
        <Bell size={18} style={{ color: t.primary }} strokeWidth={pulso ? 2.5 : 1.8} />

        <AnimatePresence>
          {noLeidas > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold
                         text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
              data-testid="badge-notificaciones"
            >
              {noLeidas > 9 ? '9+' : noLeidas}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {panelAbierto && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2"
            style={{ zIndex: 1050, width: '320px' }}
          >
            <PanelNotificaciones onCerrar={() => setPanelAbierto(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
