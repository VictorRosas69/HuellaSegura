/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary coral/salmon ───────────────────────────────────────
        primary: {
          50:  '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFCFC2',
          300: '#FFB09E',
          400: '#FF9280',
          500: '#F97B62',
          600: '#E8614A',
          700: '#CC4A34',
          800: '#A83B28',
          900: '#7A2B1C',
          DEFAULT: '#F97B62',
        },
        // ── Teal accent ────────────────────────────────────────────────
        teal: {
          50:  '#E0F9F7',
          100: '#B3F1ED',
          200: '#80E8E2',
          300: '#4DDFD7',
          400: '#26D6CD',
          500: '#00C4B4',
          600: '#00A89A',
          700: '#008C82',
          DEFAULT: '#00C4B4',
        },
        // ── Warm neutrals (light mode) ─────────────────────────────────
        warm: {
          50:  '#FFF8F5',
          100: '#FFF0EA',
          200: '#FFE4D9',
          300: '#FFD4C2',
          400: '#F0E8E4',
          border: '#EDE5E1',
        },
        // ── Dark surfaces (dark mode) ─────────────────────────────────
        dark: {
          900: '#0F0F1A',
          800: '#161622',
          700: '#1E1E30',
          600: '#252540',
          500: '#323250',
          400: '#4A4A6A',
          300: '#6B6B8A',
          border: '#323250',
        },
        // ── Semantic ───────────────────────────────────────────────────
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        'warm-xs':   '0 1px 4px rgba(249,123,98,0.08)',
        'warm-sm':   '0 2px 8px rgba(249,123,98,0.12)',
        'warm':      '0 4px 20px rgba(249,123,98,0.16)',
        'warm-lg':   '0 8px 40px rgba(249,123,98,0.22)',
        'card':      '0 2px 16px rgba(26,26,46,0.08)',
        'card-md':   '0 4px 24px rgba(26,26,46,0.10)',
        'card-lg':   '0 8px 40px rgba(26,26,46,0.14)',
        'teal':      '0 4px 16px rgba(0,196,180,0.25)',
        'dark-sm':   '0 2px 8px rgba(0,0,0,0.30)',
        'dark':      '0 4px 20px rgba(0,0,0,0.40)',
        'warm-xl':   '0 16px 60px rgba(249,123,98,0.30)',
        'glow-sm':   '0 0 20px rgba(249,123,98,0.40)',
        'glow':      '0 0 40px rgba(249,123,98,0.55)',
        'glow-teal': '0 0 30px rgba(0,196,180,0.45)',
        'inner-warm':'inset 0 1px 0 rgba(255,255,255,0.15)',
      },

      backgroundImage: {
        'primary-gradient':      'linear-gradient(135deg, #FF9280 0%, #F97B62 60%, #E8614A 100%)',
        'primary-gradient-soft': 'linear-gradient(135deg, #FFCFC2 0%, #FFB09E 100%)',
        'warm-gradient':         'linear-gradient(135deg, #FFF8F5 0%, #FFE8E0 100%)',
        'teal-gradient':         'linear-gradient(135deg, #4DDFD7 0%, #00C4B4 100%)',
        'dark-gradient':         'linear-gradient(135deg, #1E1E30 0%, #161622 100%)',
        'hero-gradient':         'linear-gradient(135deg, #FF9280 0%, #F97B62 100%)',
        'card-mesh':             'radial-gradient(circle at 80% 20%, rgba(255,176,158,0.35) 0%, transparent 60%)',
        'shimmer-gradient':      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        'mesh-warm':             'radial-gradient(circle at 20% 50%, rgba(255,176,158,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,210,190,0.25) 0%, transparent 50%)',
        'mesh-dark':             'radial-gradient(circle at 20% 50%, rgba(120,80,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,123,98,0.1) 0%, transparent 50%)',
      },

      animation: {
        'fade-up':    'fadeUp 0.25s ease-out both',
        'fade-in':    'fadeIn 0.2s ease-out both',
        'scale-in':   'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 2s linear infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'float':       'float 3s ease-in-out infinite',
        'float-slow':  'floatSlow 4s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite',
        'slide-right': 'slideRight 1.5s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,123,98,0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(249,123,98,0.7)' },
        },
        slideRight: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)'  },
        },
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'safe-bottom': 'env(safe-area-inset-bottom, 1rem)',
      },

      maxWidth: {
        'mobile': '430px',
      },
    },
  },
  plugins: [],
};