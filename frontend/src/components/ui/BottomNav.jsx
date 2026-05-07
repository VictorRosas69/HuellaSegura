import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, Plus, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/',        icon: Home,  label: 'Inicio'  },
  { to: '/mapa',    icon: Map,   label: 'Mapa'    },
  { fab: true },
  { to: '/alertas', icon: Bell,  label: 'Alertas' },
  { to: '/perfil',  icon: User,  label: 'Perfil'  },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-40 pb-safe"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(237,229,225,0.8)',
        boxShadow: '0 -4px 30px rgba(249,123,98,0.08)',
      }}
      aria-label="Navegación principal"
    >
      <div className="flex items-center h-16">
        {NAV_ITEMS.map((item, idx) => {
          if (item.fab) {
            return (
              <div key="fab" className="flex-1 flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => navigate('/reportes/nuevo')}
                  className="h-14 w-14 -mt-6 rounded-full flex items-center justify-center text-white relative"
                  style={{
                    background: 'linear-gradient(135deg,#FF9280,#F97B62)',
                    boxShadow: '0 8px 24px rgba(249,123,98,0.55), 0 0 0 4px rgba(249,123,98,0.15)',
                    animation: 'glow 2.5s ease-in-out infinite',
                  }}
                  aria-label="Crear nuevo reporte"
                >
                  <Plus size={26} strokeWidth={2.5} />
                </motion.button>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-0.5">
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="relative"
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={isActive ? 'text-primary' : 'text-dark-300 dark:text-dark-400'}
                    />
                    {item.to === '/alertas' && (
                      <span
                        id="nav-badge-alertas"
                        className="absolute -top-1 -right-1 hidden h-2.5 w-2.5
                                   rounded-full bg-danger border-2 border-white dark:border-dark-800"
                      />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary' : 'text-dark-300 dark:text-dark-400'}`}>
                    {item.label}
                  </span>
                  {/* Indicador activo */}
                  <motion.div
                    animate={{ width: isActive ? 20 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    style={{ height: 3, borderRadius: 99, background: '#F97B62' }}
                  />
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
