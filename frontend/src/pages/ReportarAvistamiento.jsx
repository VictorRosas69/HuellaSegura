import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, User, Mail, Camera, Eye, Clock, Hash, X, CheckCircle } from 'lucide-react';
import MapaSelector from '../components/MapaSelector';
import { crearAvistamiento } from '../services/avistamientoService';

// ─── Geocoding ────────────────────────────────────────────────────────────────
async function geocodificarReversa(lat, lng) {
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      { headers: { 'User-Agent': 'HuellaSegura/1.0' } }
    );
    const data = await res.json();
    const r    = data.address || {};
    return [r.road, r.neighbourhood || r.suburb].filter(Boolean).join(' · ').toUpperCase() || 'UBICACIÓN MARCADA';
  } catch { return 'UBICACIÓN MARCADA'; }
}

// ─── Mini componente campo de texto ──────────────────────────────────────────
function Campo({ icon: Icon, placeholder, value, onChange, name, type = 'text', error }) {
  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all"
        style={{
          background: '#FFF8F5',
          border: `1.5px solid ${error ? '#F97B62' : '#EDE5E1'}`,
        }}
      >
        {Icon && <Icon size={16} style={{ color: '#9CA3AF' }} className="shrink-0" />}
        <input
          type={type} name={name} placeholder={placeholder} value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: '#1A1A2E', fontFamily: 'inherit' }}
        />
      </div>
      {error && <p className="text-xs mt-1 font-medium" style={{ color: '#F97B62' }}>{error}</p>}
    </div>
  );
}

// ─── Sección con título uppercase ─────────────────────────────────────────────
function Seccion({ label, badge, children }) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 20px rgba(26,26,46,0.07)' }}>
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{label}</p>
        {badge}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

// ─── Página ────────────────────────────────────────────────────────────────────
export default function ReportarAvistamiento() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const mascotaIdParam = params.get('mascota_id') || '';
  const geocodeTimer   = useRef(null);

  const [form, setForm]           = useState({ mascota_id: mascotaIdParam, descripcion: '', nombre_testigo: '', email_testigo: '' });
  const [coords, setCoords]       = useState({ lat: null, lng: null });
  const [direccion, setDireccion] = useState('');
  const [foto, setFoto]           = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [errores, setErrores]     = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [cargando, setCargando]   = useState(false);
  const [exito, setExito]         = useState(false);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrores(p => ({ ...p, [e.target.name]: '' }));
  }

  async function handleCoordsChange(lat, lng) {
    setCoords({ lat, lng });
    setErrores(p => ({ ...p, coords: '' }));
    setDireccion('…');
    clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      setDireccion(await geocodificarReversa(lat, lng));
    }, 600);
  }

  function handleFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function validar() {
    const e = {};
    if (!coords.lat || !coords.lng) e.coords = 'Marca la ubicación en el mapa.';
    if (form.email_testigo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_testigo))
      e.email_testigo = 'Correo inválido.';
    setErrores(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    setCargando(true);
    setErrorGlobal('');
    try {
      await crearAvistamiento(
        {
          mascota_id:     form.mascota_id ? parseInt(form.mascota_id, 10) : undefined,
          latitud: coords.lat, longitud: coords.lng,
          descripcion:    form.descripcion    || undefined,
          nombre_testigo: form.nombre_testigo || undefined,
          email_testigo:  form.email_testigo  || undefined,
        },
        foto
      );
      setExito(true);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response?.status ?? 0) >= 500) setExito(true);
      else setErrorGlobal(err.response?.data?.message || 'Error al enviar. Intenta de nuevo.');
    } finally { setCargando(false); }
  }

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (exito) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-6"
           style={{ background: 'linear-gradient(160deg,#E0F9F7 0%,#FFF8F5 60%)' }}>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="h-28 w-28 rounded-[2rem] flex items-center justify-center text-5xl"
          style={{ background: 'linear-gradient(135deg,#26D6CD,#00C4B4)', boxShadow: '0 16px 50px rgba(0,196,180,0.50)' }}
        >
          👁️
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <h2 className="font-poppins font-extrabold text-2xl mb-2" style={{ color: '#1A1A2E' }}>
            ¡Gracias por ayudar!
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#6B7280' }}>
            El propietario fue notificado al instante. Tu reporte puede ser el que reúna a esta mascota con su familia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs flex flex-col gap-3"
        >
          {mascotaIdParam && (
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/publico/mascotas/${mascotaIdParam}`)}
              className="w-full h-14 rounded-3xl font-poppins font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#26D6CD,#00C4B4)', boxShadow: '0 8px 28px rgba(0,196,180,0.45)' }}>
              Ver perfil de la mascota
            </motion.button>
          )}
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="w-full h-12 rounded-3xl font-semibold text-sm"
            style={{ background: 'white', color: '#6B7280', boxShadow: '0 4px 16px rgba(26,26,46,0.08)' }}>
            Volver al inicio
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32" style={{ background: '#FFF8F5' }}>

      {/* ── Hero header teal ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg,#A7F0EB 0%,#4DDFD7 50%,#00C4B4 100%)',
          minHeight: '22vh',
        }}
      >
        {/* Círculos decorativos */}
        <div style={{ position:'absolute', top:'-15%', right:'-8%', width:'160px', height:'160px',
          borderRadius:'50%', background:'rgba(255,255,255,0.18)', animation:'float 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'0%', left:'-5%', width:'100px', height:'100px',
          borderRadius:'50%', background:'rgba(255,255,255,0.12)', animation:'floatSlow 5s ease-in-out infinite 1s' }} />

        {/* Back button */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 pt-safe pt-4">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </motion.button>

          {/* Badge en vivo */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
               style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            <span className="h-2 w-2 rounded-full bg-white"
                  style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">En vivo</span>
          </div>

          <div className="w-9" />
        </div>

        {/* Título centrado */}
        <div className="flex flex-col items-center justify-center gap-3 pt-16 pb-8 relative z-10 px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            👁️
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="font-poppins font-extrabold text-white text-2xl leading-tight">
              Reportar avistamiento
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {mascotaIdParam ? `Mascota #${mascotaIdParam}` : 'Tu ayuda puede hacer la diferencia'}
            </p>
          </motion.div>
        </div>

        {/* Fade a blanco */}
        <div className="absolute bottom-0 inset-x-0 h-8 pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent, #FFF8F5)' }} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="px-5 pt-4 flex flex-col gap-4">

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

          {/* ── ID mascota ──────────────────────────────────────────────── */}
          {!mascotaIdParam && (
            <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}>
              <Seccion label="ID de la mascota" badge={
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background:'#E0F9F7', color:'#00A890' }}>opcional</span>
              }>
                <Campo icon={Hash} name="mascota_id" type="number"
                  placeholder="Ej: 42 — escaneado del carnet QR"
                  value={form.mascota_id} onChange={handleChange} />
              </Seccion>
            </motion.div>
          )}

          {/* ── Mapa ────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
            className="rounded-3xl overflow-hidden" style={{ background:'white', boxShadow:'0 4px 20px rgba(26,26,46,0.07)' }}>
            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl flex items-center justify-center"
                     style={{ background: '#E0F9F7' }}>
                  <MapPin size={14} style={{ color: '#00C4B4' }} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'#9CA3AF' }}>
                  ¿Dónde la viste?
                </p>
              </div>
              {coords.lat && (
                <button type="button"
                  onClick={() => { setCoords({lat:null,lng:null}); setDireccion(''); }}
                  className="text-xs font-bold" style={{ color:'#F97B62' }}>
                  Mover pin
                </button>
              )}
            </div>

            {/* Mapa borde a borde */}
            <MapaSelector coords={coords} onCoordsChange={handleCoordsChange} address={direccion} />

            {errores.coords && (
              <p className="text-xs px-4 pt-2 pb-1 font-medium" style={{ color:'#E8614A' }}>{errores.coords}</p>
            )}
            {!coords.lat && !errores.coords && (
              <p className="text-xs py-3 text-center" style={{ color:'#C9B8B0' }}>
                Toca el mapa para marcar el lugar exacto
              </p>
            )}
            {coords.lat && (
              <div className="flex items-center gap-2 mx-4 mb-4 mt-2 px-3 py-2 rounded-2xl"
                   style={{ background:'#E0F9F7' }}>
                <CheckCircle size={13} style={{ color:'#00C4B4' }} />
                <p className="text-xs font-semibold" style={{ color:'#00A890' }}>Ubicación marcada correctamente</p>
              </div>
            )}
          </motion.div>

          {/* ── Descripción ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}>
            <Seccion label="Descripción" badge={
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background:'#FFF0EA', color:'#F97B62' }}>opcional</span>
            }>
              <textarea
                name="descripcion" rows={4}
                placeholder={`¿Qué hacía la mascota?\n¿Llevaba collar? ¿De qué color?\n¿Parecía asustada o herida?\n¿Estaba sola?`}
                value={form.descripcion}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm resize-none leading-relaxed"
                style={{ color:'#1A1A2E', fontFamily:'inherit' }}
              />
            </Seccion>
          </motion.div>

          {/* ── Foto ────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }}>
            <Seccion label="Foto" badge={
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background:'#FFF0EA', color:'#F97B62' }}>opcional</span>
            }>
              <AnimatePresence mode="wait">
                {fotoPreview ? (
                  <motion.div key="preview"
                    initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                    className="relative rounded-2xl overflow-hidden">
                    <img src={fotoPreview} alt="preview" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 flex items-end p-3"
                         style={{ background:'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                      <p className="text-white text-xs font-semibold truncate flex-1">{foto?.name}</p>
                    </div>
                    <button type="button"
                      onClick={() => { setFoto(null); setFotoPreview(null); }}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
                      <X size={14} color="white" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.label key="upload"
                    initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="flex flex-col items-center justify-center gap-3 h-36 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
                    style={{ border:'2px dashed #EDE5E1', background:'#FFF8F5' }}>
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                         style={{ background:'#FFF0EA' }}>
                      <Camera size={22} style={{ color:'#F97B62' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color:'#1A1A2E' }}>
                        Subir una foto
                      </p>
                      <p className="text-xs mt-0.5" style={{ color:'#9CA3AF' }}>
                        JPG o PNG · Máx. 5 MB
                      </p>
                    </div>
                    <input type="file" accept="image/jpeg,image/png"
                      className="hidden" onChange={handleFoto}
                      data-testid="input-foto" />
                  </motion.label>
                )}
              </AnimatePresence>
            </Seccion>
          </motion.div>

          {/* ── Tus datos ───────────────────────────────────────────────── */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}>
            <Seccion label="Tus datos" badge={
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background:'#FFF0EA', color:'#F97B62' }}>opcionales</span>
            }>
              <div className="flex flex-col gap-3">
                {/* Aviso */}
                <p className="text-xs leading-snug" style={{ color:'#9CA3AF' }}>
                  El dueño podría necesitar contactarte para más detalles o confirmar el avistamiento.
                </p>
                <Campo icon={User} name="nombre_testigo" placeholder="Tu nombre"
                  value={form.nombre_testigo} onChange={handleChange} />
                <Campo icon={Mail} name="email_testigo" type="email"
                  placeholder="Tu correo (para recibir confirmación)"
                  value={form.email_testigo} onChange={handleChange}
                  error={errores.email_testigo} />
              </div>
            </Seccion>
          </motion.div>

        </div>

        {/* ── CTA fijo ─────────────────────────────────────────────────── */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-5 pb-safe pb-6 pt-4 z-50"
          style={{ background:'linear-gradient(to top, #FFF8F5 75%, transparent)' }}
        >
          <motion.button
            type="submit"
            disabled={cargando}
            whileTap={cargando ? {} : { scale: 0.97 }}
            data-testid="btn-enviar-avistamiento"
            className="w-full h-16 rounded-3xl flex items-center justify-center gap-3
                       font-poppins font-bold text-white text-base uppercase tracking-wide
                       disabled:opacity-50 transition-opacity"
            style={{
              background: 'linear-gradient(135deg,#26D6CD,#00C4B4)',
              boxShadow: '0 8px 32px rgba(0,196,180,0.50)',
            }}
          >
            {cargando
              ? <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              : <><Eye size={20} strokeWidth={2.2} /> Enviar avistamiento</>
            }
          </motion.button>
        </div>
      </form>
    </div>
  );
}
