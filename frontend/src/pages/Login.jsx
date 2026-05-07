import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input  from '../components/ui/Input';

/* ── Logo animado compartido ─────────────────────────────────────────────── */
function BrandHeader() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg,#FFE4D9 0%,#FFD0BF 40%,#FFBBA8 70%,#FFD4C5 100%)',
        minHeight: '38vh',
      }}
    >
      {/* Círculos de fondo flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position:'absolute', top:'-10%', right:'-8%',
          width:'180px', height:'180px', borderRadius:'50%',
          background:'rgba(249,123,98,0.18)',
          animation:'float 7s ease-in-out infinite',
        }} />
        <div style={{
          position:'absolute', bottom:'5%', left:'-10%',
          width:'130px', height:'130px', borderRadius:'50%',
          background:'rgba(0,196,180,0.14)',
          animation:'floatSlow 5s ease-in-out infinite 1.5s',
        }} />
        <div style={{
          position:'absolute', top:'30%', left:'8%',
          width:'60px', height:'60px', borderRadius:'50%',
          background:'rgba(255,255,255,0.25)',
          animation:'floatSlow 6s ease-in-out infinite 0.5s',
        }} />
        <div style={{
          position:'absolute', bottom:'20%', right:'10%',
          width:'40px', height:'40px', borderRadius:'50%',
          background:'rgba(249,123,98,0.20)',
          animation:'float 4s ease-in-out infinite 2s',
        }} />
      </div>

      {/* Logo + texto centrado */}
      <div className="relative z-10 flex flex-col items-center gap-4">

        {/* Ícono de marca */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="relative"
        >
          <div
            className="h-[5.5rem] w-[5.5rem] rounded-[1.6rem] flex items-center justify-center text-4xl select-none"
            style={{
              background: 'linear-gradient(135deg,#FF9280,#F97B62)',
              boxShadow: '0 12px 36px rgba(249,123,98,0.50), 0 0 0 6px rgba(249,123,98,0.15)',
              animation: 'glow 3s ease-in-out infinite',
            }}
          >
            🐾
          </div>
          {/* Badge de ubicación */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.4 }}
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#26D6CD,#00C4B4)',
              boxShadow: '0 4px 12px rgba(0,196,180,0.55)',
            }}
          >
            <MapPin size={14} color="white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        {/* Wordmark HuellaSegura */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32,0.72,0,1], delay: 0.2 }}
          className="text-center"
        >
          <h1
            className="font-poppins font-extrabold leading-none select-none"
            style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}
          >
            <span style={{ color: '#1A1A2E' }}>Huella</span>
            <span style={{
              color: '#F97B62',
              textShadow: '0 2px 16px rgba(249,123,98,0.35)',
            }}>Segura</span>
          </h1>
          <p className="text-xs font-semibold mt-1 tracking-widest uppercase"
             style={{ color: 'rgba(26,26,46,0.45)' }}>
            Pasto · Nariño
          </p>
        </motion.div>
      </div>

      {/* Fade hacia la card blanca */}
      <div
        className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top,white,transparent)' }}
      />
    </div>
  );
}

/* ── Página Login ─────────────────────────────────────────────────────────── */
export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [form,     setForm]     = useState({ email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const destino = location.state?.from?.pathname || '/';

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  }

  function validate() {
    const e = {};
    if (!form.email)    e.email    = 'El correo es obligatorio.';
    if (!form.password) e.password = 'La contraseña es obligatoria.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(destino, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden"
         style={{ background: '#FFD0BF' }}>

      <BrandHeader />

      {/* Card formulario */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.32,0.72,0,1] }}
        className="flex-1 rounded-t-[2rem] -mt-10 relative z-10 px-6 pt-8 pb-10 flex flex-col gap-6"
        style={{ background: 'white', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)' }}
      >
        <div>
          <h2 className="text-[1.75rem] font-poppins font-bold leading-tight" style={{ color: '#1A1A2E' }}>
            Bienvenido 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Ingresa para continuar cuidando a Pasto.
          </p>
        </div>

        <AnimatePresence>
          {apiError && (
            <motion.div role="alert"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{ background: '#FFF0EE', border: '1px solid #FECACA', color: '#EF4444' }}>
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Correo electrónico" id="email" name="email" type="email"
            placeholder="juan.ortiz@gmail.com"
            value={form.email} onChange={handleChange} error={errors.email}
            iconLeft={<Mail size={17} />} autoComplete="email" required
          />
          <Input
            label="Contraseña" id="password" name="password" type="password"
            placeholder="••••••••"
            value={form.password} onChange={handleChange} error={errors.password}
            autoComplete="current-password" required
          />

          <div className="flex justify-end -mt-1">
            <span className="text-sm font-semibold cursor-pointer hover:underline"
                  style={{ color: '#F97B62' }}>
              ¿Olvidaste la clave?
            </span>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
                  className="shadow-warm-lg">
            Iniciar sesión
          </Button>
        </form>

        <div className="flex flex-col items-center gap-4">
          <Link to="/"
            className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: '#9CA3AF' }}>
            Continuar como invitado
          </Link>

          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px" style={{ background: '#EDE5E1' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: '#EDE5E1' }} />
          </div>

          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#F97B62' }} className="font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
