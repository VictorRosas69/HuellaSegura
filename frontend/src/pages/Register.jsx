import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input  from '../components/ui/Input';

/* ── Logo animado — misma marca, fondo teal ─────────────────────────────── */
function BrandHeader() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg,#A7F0EB 0%,#80E8E2 40%,#4DD9CA 70%,#B2F5EF 100%)',
        minHeight: '30vh',
      }}
    >
      {/* Círculos flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position:'absolute', top:'-12%', right:'-6%',
          width:'160px', height:'160px', borderRadius:'50%',
          background:'rgba(0,196,180,0.20)',
          animation:'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position:'absolute', bottom:'0%', left:'-8%',
          width:'120px', height:'120px', borderRadius:'50%',
          background:'rgba(249,123,98,0.15)',
          animation:'floatSlow 5s ease-in-out infinite 1s',
        }} />
        <div style={{
          position:'absolute', top:'25%', right:'15%',
          width:'50px', height:'50px', borderRadius:'50%',
          background:'rgba(255,255,255,0.30)',
          animation:'float 4s ease-in-out infinite 2s',
        }} />
      </div>

      {/* Logo + wordmark */}
      <div className="relative z-10 flex flex-col items-center gap-3">

        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="relative"
        >
          <div
            className="h-[4.8rem] w-[4.8rem] rounded-[1.4rem] flex items-center justify-center text-3xl select-none"
            style={{
              background: 'linear-gradient(135deg,#FF9280,#F97B62)',
              boxShadow: '0 10px 30px rgba(249,123,98,0.45), 0 0 0 5px rgba(249,123,98,0.12)',
              animation: 'glow 3s ease-in-out infinite',
            }}
          >
            🐾
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.35 }}
            className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#FF9280,#F97B62)',
              boxShadow: '0 4px 10px rgba(249,123,98,0.45)',
            }}
          >
            <MapPin size={13} color="white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.32,0.72,0,1], delay: 0.2 }}
          className="text-center"
        >
          <h1
            className="font-poppins font-extrabold leading-none select-none"
            style={{ fontSize: '1.9rem', letterSpacing: '-0.02em' }}
          >
            <span style={{ color: '#1A1A2E' }}>Huella</span>
            <span style={{
              color: '#F97B62',
              textShadow: '0 2px 14px rgba(249,123,98,0.35)',
            }}>Segura</span>
          </h1>
          <p className="text-[10px] font-semibold mt-0.5 tracking-widest uppercase"
             style={{ color: 'rgba(26,26,46,0.40)' }}>
            Red de vecinos · Pasto
          </p>
        </motion.div>
      </div>

      {/* Fade a blanco */}
      <div
        className="absolute bottom-0 inset-x-0 h-14 pointer-events-none"
        style={{ background: 'linear-gradient(to top,white,transparent)' }}
      />
    </div>
  );
}

/* ── Página Register ─────────────────────────────────────────────────────── */
export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]         = useState({ nombre:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  }

  function validate() {
    const e = {};
    if (!form.nombre.trim())                e.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres.';
    if (!form.email)                        e.email  = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido.';
    if (!form.password)                     e.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 6)      e.password = 'Mínimo 6 caracteres.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.nombre.trim(), form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden"
         style={{ background: '#B2E8E4' }}>

      <BrandHeader />

      {/* Card formulario */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.32,0.72,0,1] }}
        className="flex-1 rounded-t-[2rem] -mt-8 relative z-10 px-6 pt-7 pb-10 flex flex-col gap-5 overflow-y-auto"
        style={{ background: 'white', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)' }}
      >
        <div>
          <h2 className="text-2xl font-poppins font-bold leading-tight" style={{ color: '#1A1A2E' }}>
            Crea tu cuenta ✨
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Únete a la red de vecinos de Pasto.
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
            label="Nombre completo" id="nombre" name="nombre" type="text"
            placeholder="Juan Ortiz"
            value={form.nombre} onChange={handleChange} error={errors.nombre}
            iconLeft={<User size={17} />} autoComplete="name" required
          />
          <Input
            label="Correo electrónico" id="email" name="email" type="email"
            placeholder="juan@gmail.com"
            value={form.email} onChange={handleChange} error={errors.email}
            iconLeft={<Mail size={17} />} autoComplete="email" required
          />
          <Input
            label="Contraseña" id="password" name="password" type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password} onChange={handleChange} error={errors.password}
            autoComplete="new-password" required
          />
          <Input
            label="Confirmar contraseña" id="confirmPassword" name="confirmPassword" type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
            autoComplete="new-password" required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
                  className="mt-2 shadow-warm-lg">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm" style={{ color: '#9CA3AF' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#F97B62' }} className="font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
