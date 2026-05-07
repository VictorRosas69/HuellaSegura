import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, MapPin, Phone, Navigation, Star } from 'lucide-react';
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
  '24 HORAS': { bg: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: 'rgba(251,191,36,0.3)' },
  'ALIADA':   { bg: 'rgba(0,196,180,0.15)',  color: '#00C4B4', border: 'rgba(0,196,180,0.3)'  },
  'URGENCIAS':{ bg: 'rgba(249,123,98,0.15)', color: '#F97B62', border: 'rgba(249,123,98,0.3)' },
};
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
  const [entidades, setEntidades] = useState([]);
  const [filtro,    setFiltro]    = useState('todos');
  const [busqueda,  setBusqueda]  = useState('');
  const [cargando,  setCargando]  = useState(true);

  useEffect(() => {
    listarEntidades()
      .then(({ data }) => { const l = data.entidades || []; setEntidades(l.length ? l : MOCK_VETS); })
      .catch(() => setEntidades(MOCK_VETS))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = entidades.filter(e => {
    if (filtro !== 'todos' && e.tipo !== filtro) return false;
    if (busqueda && !e.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0F0F1A' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="relative px-5 pt-safe pt-4 pb-5 overflow-hidden"
           style={{ background: 'linear-gradient(160deg,#1A1A2E 0%,#0F0F1A 100%)' }}>
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(0,196,180,0.15) 0%,transparent 70%)' }} />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-poppins font-extrabold leading-tight text-white">Directorio</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{filtradas.length} cerca · Pasto</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-3 relative z-10"
             style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={16} style={{ color: 'rgba(255,255,255,0.3)' }} className="shrink-0" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar nombre o especialidad"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30" />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar relative z-10" data-testid="filtros-directorio">
          {FILTROS.map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)} data-testid={`filtro-${f.id}`}
              className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={filtro === f.id
                ? { background: 'linear-gradient(135deg,#00C4B4,#00A890)', color: 'white', boxShadow: '0 4px 12px rgba(0,196,180,0.35)' }
                : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {cargando && (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 rounded-full border-2 animate-spin"
               style={{ borderColor: '#00C4B4', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────── */}
      {!cargando && filtradas.length === 0 && (
        <div className="flex flex-col items-center py-16 px-8 text-center" data-testid="directorio-vacio">
          <span className="text-5xl mb-4">🏥</span>
          <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>No hay entidades registradas.</p>
        </div>
      )}

      {/* ── Lista ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 flex flex-col gap-3" data-testid="lista-entidades">
        {filtradas.map((e, idx) => {
          const gradient = GRADIENTS[e.gradIdx ?? idx % GRADIENTS.length];
          const tags     = e.tags || [];
          return (
            <motion.div key={e.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>

              <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: gradient, boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}>
                <span className="text-white font-bold text-3xl leading-none select-none">+</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-poppins font-bold text-base leading-snug text-white">{e.nombre}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={13} fill="#FBBF24" style={{ color: '#FBBF24' }} />
                    <span className="text-sm font-bold text-white">{e.rating ?? '—'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {e.distancia || e.direccion || '—'}
                  </span>
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {tags.map(tag => {
                      const ts = TAG_STYLES[tag] || { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.15)' };
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
                  style={{ background: 'rgba(0,196,180,0.15)', border: '1px solid rgba(0,196,180,0.25)' }}>
                  <Phone size={16} style={{ color: '#00C4B4' }} />
                </button>
                <button className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(249,123,98,0.15)', border: '1px solid rgba(249,123,98,0.25)' }}>
                  <Navigation size={16} style={{ color: '#F97B62' }} />
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
