import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import App from './App';
import { ThemeProvider } from './providers/ThemeProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-900 md:flex md:items-start md:justify-center">
        <div className="w-full max-w-[430px] min-h-screen relative overflow-hidden
                        md:shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          <App />
          <Toaster
            position="top-center"
            expand={false}
            richColors
            toastOptions={{
              style: {
                fontFamily: "'Inter', sans-serif",
                borderRadius: '1rem',
                fontSize: '0.875rem',
              },
              classNames: {
                toast: 'shadow-card-lg',
              },
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  </StrictMode>
);
