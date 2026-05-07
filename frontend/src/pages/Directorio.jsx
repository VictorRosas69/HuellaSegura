import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, MapPin, Phone, Navigation, Star } from 'lucide-react';
import { useTokens } from '../hooks/useTokens';
import { listarEntidades } from '../services/adminService';
import BottomNav from '../components/ui/BottomNav';

const GRADIENTS = [
  'linear-gradient(135deg,#00C4B4,#00A890)',
  'linear-gradient(135deg,#FF9280,#F97B62)',
  'linear-gradient(135deg,#4ADE80,#22C55E)',
  'linear-gradient(135deg,#C7B2F5,#9B87E8)',
  'linear-gradient(135deg,#60A5FA,#3B82F6)',
];

const MOCK_VETS = [
  { id:1, nombre:'Medimax Veterinaria', tipo:'veterinaria', distancia:'0.6 km', rating:4.9, tags:['24 HORAS','ALIADA'],    gradIdx:0, telefono:'3157891234' },
  { id:2, nombre:'Centro Animal Pasto', tipo:'veterinaria', distancia:'1.1 km', rating:4.7, tags:['URGENCIAS'],             gradIdx:1, telefono:'3104561234' },
  { id:3, nombre:'Vet Galeras',         tipo:'veterinaria', distancia:'1.8 km', rating:4.6, tags:['ALIADA'],               gradIdx:2, telefono:'3162341234' },
  { id:4, nombre:'Casa Patitas',        tipo:'albergue',    distancia:'2.3 km', rating:4.8, tags:['24 HORAS','URGENCIAS'], gradIdx:3, telefono:'3178901234' },
];
const FILTROS = [
  { id:'todos',       label:'Todos'        },
  { id:'veterinaria', label:'Veterinarias' },
  { id:'albergue',    label:'Albergues'    },
];

export default function Directorio() {
  const navigate = useNavigate();
  const t        = useTokens();
  const [entidades, setEntidades] = useState([]);
  const [filtro,    setFiltro]    = useState('todos');
  const [busqueda,  setBusqueda]  = useState('');
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    listarEntidades()
      .then(({ data }) => { const l = data.entidades||[]; setEntidades(l.length ? l : MOCK_VETS); })
      .catch(() => setEntidades(MOCK_VETS))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = entidades.filter(e => {
    if (filtro !== 'todos' && e.tipo !== filtro) return false;
    if (busqueda && !e.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  // Tags con colores dinámicos
  const tagStyle = (tag) => {
    const map = {
      '24 HORAS': { color: t.warning,   bg: t.isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
      'ALIADA':   { color: t.secondary, bg: t.secondaryBg, border: t.secondaryBorder },
      'URGENCIAS':{ color: t.primary,   bg: t.primaryBg,   border: t.primaryBorder   },
    };
    return map[tag] || { color: t.textMuted, bg: t.surface2, border: t.border };
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: t.bg }}>

      {/* Header */}
      <div className="relative px-5 pt-safe pt-4 pb-5 overflow-hidden" style={{ background: t.bgHeader }}>
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(0,196,180,0.15) 0%,transparent 70%)' }} />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: t.surface, border: `1px solid ${t.border}` }}>
            <ChevronLeft size={20} style={{ color: t.primary }} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-poppins font-extrabold leading-tight" style={{ color: t.text }}>Directorio</h1>
            <p className="text-sm" style={{ color: t.textMuted }}>{filtradas.length} cerca · Pasto</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-3 relative z-10"
             style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}` }}>
          <Search size={16} style={{ color: t.textMuted }} className="shrink-0" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar nombre o especialidad"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: t.text }}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar relative z-10" data-testid="filtros-directorio">
          {FILTROS.map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)} data-testid={`filtro-${f.id}`}
              className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={filtro === f.id
                ? { background: 'linear-gradient(135deg,#00C4B4,#00A890)', color: 'white', boxShadow: '0 4px 12px rgba(0,196,180,0.35)' }
                : { background: t.surface, color: t.textMuted, border: `1px solid ${t.border}` }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {cargando && (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 rounded-full border-2 animate-spin"
               style={{ borderColor: t.secondary, borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Empty */}
      {!cargando && filtradas.length === 0 && (
        <div className="flex flex-col items-center py-16 px-8 text-center" data-testid="directorio-vacio">
          <span className="text-5xl mb-4">🏥</span>
          <p className="font-semibold" style={{ color: t.textMuted }}>No hay entidades registradas.</p>
        </div>
      )}

      {/* Lista */}
      <div className="px-4 pt-4 flex flex-col gap-3" data-testid="lista-entidades">
        {filtradas.map((e, idx) => {
          const gradient = GRADIENTS[e.gradIdx ?? idx % GRADIENTS.length];
          const tags     = e.tags || [];
          return (
            <motion.div key={e.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadowSm }}>

              <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: gradient, boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                <span className="text-white font-bold text-3xl leading-none select-none">+</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-poppins font-bold text-base leading-snug" style={{ color: t.text }}>{e.nombre}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={13} fill="#FBBF24" style={{ color: '#FBBF24' }} />
                    <span className="text-sm font-bold" style={{ color: t.text }}>{e.rating ?? '—'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: t.textMuted }} />
                  <span className="text-xs" style={{ color: t.textMuted }}>{e.distancia || e.direccion || '—'}</span>
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {tags.map(tag => {
                      const ts = tagStyle(tag);
                      return (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                              style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => e.telefono && window.open(`tel:${e.telefono}`)}
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: t.secondaryBg, border: `1px solid ${t.secondaryBorder}` }}>
                  <Phone size={16} style={{ color: t.secondary }} />
                </button>
                <button className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: t.primaryBg, border: `1px solid ${t.primaryBorder}` }}>
                  <Navigation size={16} style={{ color: t.primary }} />
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
