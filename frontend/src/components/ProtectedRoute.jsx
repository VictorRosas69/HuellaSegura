import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ soloAdmin = false }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#FFF8F5' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-14 w-14 rounded-[1.2rem] flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg,#FF9280,#F97B62)',
              boxShadow: '0 8px 24px rgba(249,123,98,0.40)',
              animation: 'glow 2s ease-in-out infinite',
            }}
          >
            🐾
          </div>
          <div
            className="h-1 w-16 rounded-full overflow-hidden"
            style={{ background: '#FFE4D9' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg,#FF9280,#F97B62)',
                animation: 'slideRight 1.2s ease-in-out infinite',
                width: '50%',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) return <Navigate to="/login" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
