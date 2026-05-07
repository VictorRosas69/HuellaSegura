import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Clock, Radio, Bell, Phone, User,
  Tag, Camera, CheckCircle,
} from 'lucide-react';
import MapaSelector from '../components/MapaSelector';
import * as reporteService from '../services/reporteService';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_DESC = 200;

const ESPECIES = [
  { id: 'perro',  label: 'Perro',   emoji: '🐶' },
  { id: 'gato',   label: 'Gato',    emoji: '🐱' },
  { id: 'ave',    label: 'Ave',     emoji: '🐦' },
  { id: 'reptil', label: 'Reptil',  emoji: '🦎' },
  { id: 'otro',   label: 'Otro',    emoji: '🐾' },
];

const TAMANIOS = [
  { id: 'pequeno', label: 'Pequeño',  emoji: '🐭', desc: 'Menos de 10 kg' },
  { id: 'mediano', label: 'Mediano',  emoji: '🐕',  desc: '10 – 25 kg'   },
  { id: 'grande',  label: 'Grande',   emoji: '🐕‍🦺', desc: 'Más de 25 kg'  },
];

const ESTADOS = [
  { id: 'saludable', label: 'Saludable', emoji: '💚', color: '#16A34A', bg: '#F0FFF4' },
  { id: 'asustado',  label: 'Asustado',  emoji: '😨', color: '#B45309', bg: '#FFF8E0' },
  { id: 'herido',    label: 'Herido',    emoji: '🩹', color: '#DC2626', bg: '#FFF0EE' },
  { id: 'agresivo',  label: 'Agresivo',  emoji: '⚠️', color: '#7C3AED', bg: '#EDE9FE' },
];

const COLORES_PELAJE = ['Negro','Blanco','Café','Amarillo/Miel','Gris','Naranja','Manchado','Atigrado'];
const COLORES_COLLAR = ['Rojo','Azul','Verde','Negro','Amarillo','Rosa','Café','Blanco','Gris','Naranja'];

const OPCIONES_TIEMPO = [
  { label: '15 min',  value: 15  },
  { label: '30 min',  value: 30  },
  { label: '45 min',  value: 45  },
  { label: '1 hora',  value: 60  },
  { label: '2 horas', value: 120 },
  { label: '3 horas', value: 180 },
  { label: '6 horas', value: 360 },
  { label: '+ de 6h', value: 999 },
];

async function geocodificarReversa(lat, lng) {
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      { headers: { 'User-Agent': 'HuellaSegura/1.0' } }
    );
    const data = await res.json();
    const r    = data.address || {};
    const barrio = r.neighbourhood || r.suburb || r.city_district || r.quarter || '';
    const calle  = r.road || r.pedestrian || r.footway || '';
    return {
      direccion: [calle, barrio].filter(Boolean).join(' · ').toUpperCase() || 'UBICACIÓN MARCADA',
      zona:      barrio || calle || '',
    };
  } catch {
    return { direccion: 'UBICACIÓN MARCADA', zona: '' };
  }
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
      {children}
    </p>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="relative h-7 w-12 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: on ? '#F97B62' : '#D1D5DB' }}
    >
      <div
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: on ? 'calc(100% - 1.625rem)' : '0.125rem' }}
      />
    </button>
  );
}

function FieldInput({ icon: Icon, placeholder, value, onChange, type = 'text', ...rest }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
         style={{ background: '#FFF8F5', border: '1.5px solid #EDE5E1' }}>
      {Icon && <Icon size={16} style={{ color: '#9CA3AF' }} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: '#1A1A2E', fontFamily: 'inherit' }}
        {...rest}
      />
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CrearReporte() {
  const navigate = useNavigate();

  // Descripción de la mascota encontrada
  const [especie,      setEspecie]      = useState(null);
  const [tamanio,      setTamanio]      = useState(null);
  const [colorPelaje,  setColorPelaje]  = useState('');
  const [nombreVisto,  setNombreVisto]  = useState('');

  // Estado cuando fue vista
  const [estadoVisto,  setEstadoVisto]  = useState(null);
  const [estaSola,     setEstaSola]     = useState(true);

  // Collar
  const [tieneCollar,  setTieneCollar]  = useState(false);
  const [colorCollar,  setColorCollar]  = useState('');
  const [placaCollar,  setPlacaCollar]  = useState('');

  // Ubicación
  const [coords,       setCoords]       = useState({ lat: null, lng: null });
  const [direccion,    setDireccion]    = useState('');
  const [zona,         setZona]         = useState('');
  const geocodeTimer = useRef(null);

  // Tiempo y radio
  const [minutosAtras, setMinutosAtras] = useState(45);
  const [radioAlerta,  setRadioAlerta]  = useState(2);

  // Señas y contacto
  const [descripcion,  setDescripcion]  = useState('');
  const [nombreTestigo,setNombreTestigo]= useState('');
  const [telefono,     setTelefono]     = useState('');
  const [tieneFoto,    setTieneFoto]    = useState(false);

  // UI
  const [errores,      setErrores]      = useState({});
  const [errorGlobal,  setErrorGlobal]  = useState('');
  const [cargando,     setCargando]     = useState(false);
  const [exito,        setExito]        = useState(false);

  async function handleCoordsChange(lat, lng) {
    setCoords({ lat, lng });
    setErrores((p) => ({ ...p, coords: '' }));
    setDireccion('…');
    setZona('');
    clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      const { direccion: dir, zona: z } = await geocodificarReversa(lat, lng);
      setDireccion(dir);
      setZona(z);
    }, 600);
  }

  function validar() {
    const e = {};
    if (!especie)                       e.especie = 'Selecciona el tipo de animal.';
    if (!coords.lat || !coords.lng)     e.coords  = 'Marca la ubicación en el mapa.';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setCargando(true);
    setErrorGlobal('');

    const ahora        = new Date();
    const fechaPerdida = new Date(ahora.getTime() - minutosAtras * 60000);

    const detalles = [
      especie      && `Especie: ${ESPECIES.find(e => e.id === especie)?.label}`,
      tamanio      && `Tamaño: ${TAMANIOS.find(t => t.id === tamanio)?.label}`,
      colorPelaje  && `Color pelaje: ${colorPelaje}`,
      nombreVisto  && `Nombre (si se sabe): ${nombreVisto}`,
      estadoVisto  && `Estado: ${ESTADOS.find(s => s.id === estadoVisto)?.label}`,
      `¿Estaba sola?: ${estaSola ? 'Sí' : 'No'}`,
      tieneCollar  && `Collar: ${colorCollar || 'Sí'}${placaCollar ? ` (placa: ${placaCollar})` : ''}`,
      zona         && `Zona: ${zona}`,
      nombreTestigo && `Testigo: ${nombreTestigo}`,
      telefono     && `Tel. testigo: ${telefono}`,
    ].filter(Boolean).join(' | ');

    const descFinal = [descripcion, detalles].filter(Boolean).join('\n');

    try {
      await reporteService.crearReporte({
        mascota_id:    null,
        latitud:       coords.lat,
        longitud:      coords.lng,
        fecha_perdida: fechaPerdida.toISOString().split('T')[0],
        descripcion:   descFinal || undefined,
        radio_alerta:  radioAlerta,
      });
      setExito(true);
    } catch (err) {
      setErrorGlobal(err.response?.data?.message || 'Error al publicar el reporte. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  const vecinosEstimados = Math.round(radioAlerta * radioAlerta * 19 + 12);
  const especieActual    = ESPECIES.find(e => e.id === especie);

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (exito) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-6"
           style={{ background: '#FFF8F5' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl shadow-warm-lg"
          style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
        >
          🐾
        </motion.div>
        <div className="text-center">
          <h2 className="font-poppins font-extrabold text-2xl mb-2" style={{ color: '#1A1A2E' }}>
            ¡Gracias por ayudar!
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
            Tu reporte llegará a{' '}
            <strong style={{ color: '#1A1A2E' }}>{vecinosEstimados} vecinos</strong>.
            Juntos encontramos a esta mascota con su familia.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/')}
          className="w-full max-w-xs h-14 rounded-3xl font-poppins font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
        >
          Volver al inicio
        </motion.button>
      </div>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32" style={{ background: '#FFF8F5' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-safe pt-4 pb-3 sticky top-0 z-30"
        style={{ background: 'white', borderBottom: '1px solid #F0E8E4' }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-2xl flex items-center justify-center"
          style={{ background: '#FFF0EA' }}
        >
          <ChevronLeft size={20} style={{ color: '#F97B62' }} strokeWidth={2.5} />
        </motion.button>

        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
             style={{ background: '#FFF0EA' }}>
          <span className="h-2 w-2 rounded-full"
                style={{ background: '#F97B62', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F97B62' }}>
            En vivo
          </span>
        </div>

        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="px-5 pt-5 flex flex-col gap-4">

          {/* Título */}
          <div className="mb-1">
            <h1 className="font-poppins font-extrabold text-3xl leading-tight mb-1">
              <span style={{ color: '#1A1A2E' }}>Vi una mascota </span>
              <span style={{ color: '#F97B62' }}>perdida</span>
              {especieActual && (
                <span> {especieActual.emoji}</span>
              )}
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Tu reporte llegará a{' '}
              <span className="font-bold" style={{ color: '#1A1A2E' }}>{vecinosEstimados} vecinos</span>
              {' '}en un radio de{' '}
              <span className="font-bold" style={{ color: '#1A1A2E' }}>{radioAlerta} km</span>.
            </p>
          </div>

          {/* Error global */}
          <AnimatePresence>
            {errorGlobal && (
              <motion.div role="alert"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl px-4 py-3 text-sm font-medium"
                style={{ background: '#FFF0EE', color: '#E8614A' }}>
                {errorGlobal}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 1 — ¿Qué tipo de mascota es?
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl shadow-sm px-4 py-4" style={{ background: 'white' }}>
            <SectionLabel>¿Qué tipo de mascota es?</SectionLabel>

            {/* Especie */}
            <div className="flex gap-2 flex-wrap mb-4">
              {ESPECIES.map((esp) => {
                const activo = especie === esp.id;
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => { setEspecie(esp.id); setErrores(p => ({ ...p, especie: '' })); }}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-150"
                    style={{
                      background: activo ? 'linear-gradient(135deg,#FF9280,#F97B62)' : '#FFF8F5',
                      border:     `1.5px solid ${activo ? 'transparent' : '#EDE5E1'}`,
                      minWidth: '72px',
                    }}
                  >
                    <span className="text-2xl">{esp.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: activo ? 'white' : '#6B7280' }}>
                      {esp.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errores.especie && (
              <p className="text-xs mb-3 font-medium" style={{ color: '#E8614A' }}>{errores.especie}</p>
            )}

            {/* Tamaño */}
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>Tamaño aproximado</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {TAMANIOS.map((t) => {
                const activo = tamanio === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTamanio(activo ? null : t.id)}
                    className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all"
                    style={{
                      background: activo ? 'linear-gradient(135deg,#FF9280,#F97B62)' : '#FFF8F5',
                      border:     `1.5px solid ${activo ? 'transparent' : '#EDE5E1'}`,
                    }}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: activo ? 'white' : '#1A1A2E' }}>
                      {t.label}
                    </span>
                    <span className="text-[10px]" style={{ color: activo ? 'rgba(255,255,255,0.8)' : '#9CA3AF' }}>
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Color de pelaje */}
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>Color del pelaje</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {COLORES_PELAJE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorPelaje(colorPelaje === c ? '' : c)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: colorPelaje === c ? 'linear-gradient(135deg,#FF9280,#F97B62)' : '#FFF8F5',
                    color:      colorPelaje === c ? 'white' : '#6B7280',
                    border:     `1.5px solid ${colorPelaje === c ? 'transparent' : '#EDE5E1'}`,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Nombre (si se sabe) */}
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>
              Nombre de la mascota
              <span className="font-normal ml-1" style={{ color: '#C9B8B0' }}>(si escuchaste cómo la llamaban)</span>
            </p>
            <FieldInput
              placeholder="Ej: Max, Luna, Toby…"
              value={nombreVisto}
              onChange={(e) => setNombreVisto(e.target.value)}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 2 — ¿Cómo estaba cuando la viste?
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl shadow-sm px-4 py-4" style={{ background: 'white' }}>
            <SectionLabel>¿Cómo estaba cuando la viste?</SectionLabel>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {ESTADOS.map((s) => {
                const activo = estadoVisto === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setEstadoVisto(activo ? null : s.id)}
                    className="flex items-center gap-2 px-3 py-3 rounded-2xl text-sm font-semibold transition-all text-left"
                    style={{
                      background: activo ? s.bg : '#FFF8F5',
                      border:     `1.5px solid ${activo ? s.color + '40' : '#EDE5E1'}`,
                      color:      activo ? s.color : '#6B7280',
                    }}
                  >
                    <span className="text-lg shrink-0">{s.emoji}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* ¿Estaba sola? */}
            <div className="flex items-center justify-between py-3 rounded-2xl px-4"
                 style={{ background: '#FFF8F5', border: '1.5px solid #EDE5E1' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>¿Estaba sola?</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Sin dueño a la vista</p>
              </div>
              <Toggle on={estaSola} onChange={setEstaSola} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 3 — Collar e identificación
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl shadow-sm px-4 py-4" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <SectionLabel>Collar e identificación</SectionLabel>
                <p className="text-sm font-semibold -mt-1" style={{ color: '#1A1A2E' }}>
                  ¿Llevaba collar?
                </p>
              </div>
              <Toggle on={tieneCollar} onChange={setTieneCollar} />
            </div>

            <AnimatePresence>
              {tieneCollar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>Color del collar</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COLORES_COLLAR.map((c) => (
                      <button key={c} type="button"
                        onClick={() => setColorCollar(colorCollar === c ? '' : c)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                        style={{
                          background: colorCollar === c ? 'linear-gradient(135deg,#FF9280,#F97B62)' : '#FFF8F5',
                          color:      colorCollar === c ? 'white' : '#6B7280',
                          border:     `1.5px solid ${colorCollar === c ? 'transparent' : '#EDE5E1'}`,
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>
                    Placa o número visible
                    <span className="font-normal ml-1" style={{ color: '#C9B8B0' }}>(opcional)</span>
                  </p>
                  <FieldInput
                    placeholder="Ej: HS-0234 o sin placa"
                    value={placaCollar}
                    onChange={(e) => setPlacaCollar(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 4 — ¿Dónde y cuándo?
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl overflow-hidden shadow-sm" style={{ background: 'white' }}>

            {/* Cabecera con padding */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
              <SectionLabel>¿Dónde y cuándo la viste?</SectionLabel>
              {coords.lat && (
                <button type="button"
                  onClick={() => { setCoords({ lat: null, lng: null }); setDireccion(''); setZona(''); }}
                  className="text-xs font-bold -mt-2" style={{ color: '#F97B62' }}>
                  Mover pin
                </button>
              )}
            </div>

            {/* Mapa borde a borde — sin px */}
            <MapaSelector coords={coords} onCoordsChange={handleCoordsChange} address={direccion} />

            {/* Mensajes debajo del mapa */}
            {errores.coords && (
              <p className="text-xs px-4 pt-2 font-medium" style={{ color: '#E8614A' }}>{errores.coords}</p>
            )}
            {!coords.lat && !errores.coords && (
              <p className="text-xs pt-2 text-center" style={{ color: '#C9B8B0' }}>
                Toca el mapa para marcar la ubicación
              </p>
            )}

            {/* Barrio / zona — auto-rellenado */}
            <div className="px-4 pb-4 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <SectionLabel>Barrio o zona</SectionLabel>
                {zona && coords.lat && (
                  <span className="text-[10px] font-bold -mt-2" style={{ color: '#00C4B4' }}>
                    ✓ Detectado automáticamente
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-2xl px-4 py-3 transition-all"
                   style={{
                     background: zona && coords.lat ? '#E0F9F7' : '#FFF8F5',
                     border: `1.5px solid ${zona && coords.lat ? '#B3F1ED' : '#EDE5E1'}`,
                   }}>
                {zona === '' && coords.lat && (
                  <div className="h-3.5 w-3.5 rounded-full border-2 animate-spin shrink-0"
                       style={{ borderColor: '#9CA3AF', borderTopColor: 'transparent' }} />
                )}
                <input
                  type="text"
                  placeholder={coords.lat ? 'Detectando…' : 'Marca el mapa para detectarlo'}
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm font-semibold"
                  style={{ color: zona ? '#1A1A2E' : '#9CA3AF', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Hace cuánto */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} style={{ color: '#9CA3AF' }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                  ¿Hace cuánto la viste?
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" data-testid="input-fecha">
                {OPCIONES_TIEMPO.map((o) => {
                  const activo = minutosAtras === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setMinutosAtras(o.value)}
                      className="shrink-0 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-150"
                      style={{
                        background: activo ? 'linear-gradient(135deg,#FF9280,#F97B62)' : '#FFF8F5',
                        color:      activo ? 'white' : '#6B7280',
                        border:     `1.5px solid ${activo ? 'transparent' : '#EDE5E1'}`,
                        boxShadow:  activo ? '0 4px 12px rgba(249,123,98,0.35)' : 'none',
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Radio alerta */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Radio size={12} style={{ color: '#9CA3AF' }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                    Radio de alerta
                  </p>
                </div>
                <span className="font-poppins font-bold text-sm px-2.5 py-0.5 rounded-full"
                      style={{ background: '#FFF0EA', color: '#F97B62' }}>
                  {radioAlerta} km
                </span>
              </div>
              <input type="range" min={1} max={10} step={1}
                value={radioAlerta}
                onChange={(e) => setRadioAlerta(Number(e.target.value))}
                className="w-full" style={{ accentColor: '#F97B62' }} />
              <div className="flex justify-between mt-1">
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <span key={n} className="text-[9px] font-semibold"
                        style={{ color: n === radioAlerta ? '#F97B62' : '#D1D5DB' }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 5 — Señas particulares
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl shadow-sm px-4 py-4" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag size={14} style={{ color: '#F97B62' }} />
                <SectionLabel>Señas particulares</SectionLabel>
              </div>
              <p className="text-[10px] font-semibold -mt-2"
                 style={{ color: descripcion.length > MAX_DESC * 0.85 ? '#F97B62' : '#C9B8B0' }}>
                {descripcion.length}/{MAX_DESC}
              </p>
            </div>
            <textarea
              rows={3}
              placeholder="Describe marcas, manchas, comportamiento, raza aproximada, o cualquier detalle que ayude a identificarla…"
              maxLength={MAX_DESC}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-transparent outline-none text-sm resize-none"
              style={{ color: '#1A1A2E', fontFamily: 'inherit' }}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN 6 — Tus datos (testigo)
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl shadow-sm px-4 py-4" style={{ background: 'white' }}>
            <SectionLabel>Tus datos como testigo</SectionLabel>
            <p className="text-xs mb-3 -mt-1" style={{ color: '#9CA3AF' }}>
              Opcional — el dueño podría necesitar contactarte.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
                   style={{ background: '#FFF8F5', border: '1.5px solid #EDE5E1' }}>
                <User size={16} style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombreTestigo}
                  onChange={(e) => setNombreTestigo(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: '#1A1A2E', fontFamily: 'inherit' }}
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
                   style={{ background: '#FFF8F5', border: '1.5px solid #EDE5E1' }}>
                <Phone size={16} style={{ color: '#9CA3AF' }} />
                <input
                  type="tel"
                  placeholder="Tu teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: '#1A1A2E', fontFamily: 'inherit' }}
                />
              </div>

              {/* Foto disponible */}
              <div className="flex items-center justify-between py-3 px-4 rounded-2xl"
                   style={{ background: '#FFF8F5', border: '1.5px solid #EDE5E1' }}>
                <div className="flex items-center gap-3">
                  <Camera size={16} style={{ color: '#9CA3AF' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                      Tengo una foto
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      El dueño te la pedirá por teléfono
                    </p>
                  </div>
                </div>
                <Toggle on={tieneFoto} onChange={setTieneFoto} />
              </div>
            </div>
          </div>

        </div>

        {/* ── Botón CTA fijo ────────────────────────────────────────────── */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-5 pb-safe pb-6 pt-4 z-50"
          style={{ background: 'linear-gradient(to top, #FFF8F5 75%, transparent)' }}
        >
          <motion.button
            type="submit"
            disabled={cargando}
            whileTap={cargando ? {} : { scale: 0.97 }}
            data-testid="btn-crear-reporte"
            className="w-full h-16 rounded-3xl flex items-center justify-center gap-3
                       font-poppins font-bold text-white text-base uppercase tracking-wide
                       disabled:opacity-50 transition-opacity"
            style={{
              background: 'linear-gradient(135deg,#FF9280,#F97B62)',
              boxShadow:  '0 8px 32px rgba(249,123,98,0.45)',
            }}
          >
            {cargando
              ? <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              : <><Bell size={20} strokeWidth={2.2} /> Enviar alerta ahora</>
            }
          </motion.button>
        </div>
      </form>
    </div>
  );
}
