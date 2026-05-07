import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, SlidersHorizontal, MapPin, Phone, Navigation, Star } from 'lucide-react';
import { listarEntidades } from '../services/adminService';
import BottomNav from '../components/ui/BottomNav';

const GRADIENTS = [
  'linear-gradient(135deg,#00C4B4,#00A890)',
  'linear-gradient(135deg,#FF9280,#F97B62)',
  'linear-gradient(135deg,#4ADE80,#22C55E)',
  'linear-gradient(135deg,#C7B2F5,#9B87E8)',
  'linear-gradient(135deg,#60A5FA,#3B82F6)',
];

const TAG_STYLES = {
  '24 HORAS': { bg: '#FFF7E0', color: '#B45309' },
  'ALIADA':   { bg: '#E0F9F7', color: '#00A890' },
  'URGENCIAS':{ bg: '#FFF0EE', color: '#E8614A' },
};

const MOCK_VETS = [
  { id: 1, nombre: 'Medimax Veterinaria', tipo: 'veterinaria', distancia: '0.6 km', rating: 4.9, tags: ['24 HORAS', 'ALIADA'],    gradIdx: 0, telefono: '3157891234' },
  { id: 2, nombre: 'Centro Animal Pasto', tipo: 'veterinaria', distancia: '1.1 km', rating: 4.7, tags: ['URGENCIAS'],             gradIdx: 1, telefono: '3104561234' },
  { id: 3, nombre: 'Vet Galeras',         tipo: 'veterinaria', distancia: '1.8 km', rating: 4.6, tags: ['ALIADA'],               gradIdx: 2, telefono: '3162341234' },
  { id: 4, nombre: 'Casa Patitas',        tipo: 'albergue',    distancia: '2.3 km', rating: 4.8, tags: ['24 HORAS', 'URGENCIAS'], gradIdx: 3, telefono: '3178901234' },
];

const FILTROS = [
  { id: 'todos',       label: 'Todos'        },
  { id: 'veterinaria', label: 'Veterinarias' },
  { id: 'albergue',    label: 'Albergues'    },
];

export default function Directorio() {
  const navigate = useNavigate();
  const [entidades, setEntidades] = useState([]);
  const [filtro,    setFiltro]    = useState('todos');
  const [busqueda,  setBusqueda]  = useState('');
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    listarEntidades()
      .then(({ data }) => {
        const list = data.entidades || [];
        setEntidades(list.length ? list : MOCK_VETS);
      })
      .catch(() => setEntidades(MOCK_VETS))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = entidades.filter((e) => {
    if (filtro !== 'todos' && e.tipo !== filtro) return false;
    if (busqueda && !e.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F5' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-safe pt-4 pb-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(249,123,98,0.12)' }}
        >
          <ChevronLeft size={20} style={{ color: '#F97B62' }} strokeWidth={2.5} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-poppins font-extrabold leading-tight" style={{ color: '#1A1A2E' }}>
            Veterinarias
          </h1>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>{filtradas.length} cerca · Pasto</p>
        </div>
      </div>

      {/* ── Búsqueda + filtros ───────────────────────────────────────────── */}
      <div className="px-4 mb-3 flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm"
             style={{ background: 'white' }}>
          <Search size={16} style={{ color: '#9CA3AF' }} className="shrink-0" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar nombre o especialidad"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#1A1A2E' }}
          />
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl shrink-0 text-sm font-semibold shadow-sm"
          style={{ background: 'white', color: '#6B7280' }}
        >
          <SlidersHorizontal size={15} />
          Filtros · 2
        </button>
      </div>

      {/* ── Chips de filtro ──────────────────────────────────────────────── */}
      <div className="px-4 flex gap-2 mb-4 overflow-x-auto no-scrollbar" data-testid="filtros-directorio">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            data-testid={`filtro-${f.id}`}
            className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={
              filtro === f.id
                ? { background: '#1A1A2E', color: 'white' }
                : { background: 'white',   color: '#6B7280' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {cargando && (
        <div className="flex justify-center py-12">
          <div
            className="h-10 w-10 rounded-full border-2 animate-spin"
            style={{ borderColor: '#F97B62', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!cargando && filtradas.length === 0 && (
        <div className="flex flex-col items-center py-16 px-8 text-center" data-testid="directorio-vacio">
          <span className="text-5xl mb-4">🏥</span>
          <p className="font-semibold" style={{ color: '#9CA3AF' }}>No hay entidades registradas.</p>
        </div>
      )}

      {/* ── Lista ────────────────────────────────────────────────────────── */}
      <div className="px-4 flex flex-col gap-3" data-testid="lista-entidades">
        {filtradas.map((e, idx) => {
          const gradient = GRADIENTS[e.gradIdx ?? idx % GRADIENTS.length];
          const tags     = e.tags || [];
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-3xl shadow-sm"
              style={{ background: 'white' }}
            >
              {/* Icono cuadrado de color */}
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: gradient }}
              >
                <span className="text-white font-bold text-3xl leading-none select-none">+</span>
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-poppins font-bold text-base leading-snug" style={{ color: '#1A1A2E' }}>
                    {e.nombre}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={13} fill="#FBBF24" style={{ color: '#FBBF24' }} />
                    <span className="text-sm font-bold" style={{ color: '#1A1A2E' }}>
                      {e.rating ?? '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: '#9CA3AF' }} />
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>
                    {e.distancia || e.direccion || '—'}
                  </span>
                </div>

                {tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {tags.map((tag) => {
                      const ts = TAG_STYLES[tag] || { bg: '#F3F4F6', color: '#6B7280' };
                      return (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                          style={{ background: ts.bg, color: ts.color }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => e.telefono && window.open(`tel:${e.telefono}`)}
                  className="h-10 w-10 rounded-full border flex items-center justify-center"
                  style={{ borderColor: '#EDE5E1' }}
                >
                  <Phone size={16} style={{ color: '#6B7280' }} />
                </button>
                <button
                  className="h-10 w-10 rounded-2xl flex items-center justify-center"
                  style={{ background: '#1A1A2E' }}
                >
                  <Navigation size={16} color="white" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
