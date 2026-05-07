import { useThemeContext } from '../providers/ThemeProvider';

export function useTokens() {
  const { isDark } = useThemeContext();

  return {
    isDark,

    // Fondos
    bg:        isDark ? '#0F0F1A'                    : '#F8F4F2',
    bgHeader:  isDark ? 'linear-gradient(160deg,#1A1A2E 0%,#0F0F1A 100%)' : 'linear-gradient(160deg,#FFF0EA 0%,#FFF8F5 100%)',

    // Superficies (cards, inputs)
    surface:   isDark ? 'rgba(255,255,255,0.06)'     : '#FFFFFF',
    surface2:  isDark ? 'rgba(255,255,255,0.10)'     : '#F5F0EE',

    // Bordes
    border:    isDark ? 'rgba(255,255,255,0.10)'     : 'rgba(237,229,225,0.9)',
    borderHover: isDark ? 'rgba(255,255,255,0.18)'   : 'rgba(249,123,98,0.35)',

    // Texto
    text:      isDark ? '#FFFFFF'                    : '#1A1A2E',
    textMuted: isDark ? 'rgba(255,255,255,0.45)'     : '#9CA3AF',
    textSoft:  isDark ? 'rgba(255,255,255,0.25)'     : '#C4B4AE',

    // Sombras
    shadow:    isDark ? '0 8px 32px rgba(0,0,0,0.4)'       : '0 4px 20px rgba(26,26,46,0.08)',
    shadowSm:  isDark ? '0 4px 16px rgba(0,0,0,0.3)'       : '0 2px 10px rgba(26,26,46,0.06)',

    // Colores de marca (iguales en ambos temas)
    primary:   '#F97B62',
    secondary: '#00C4B4',
    accent:    '#9B87E8',
    success:   '#34D399',
    danger:    '#F87171',
    warning:   '#FBBF24',

    // Fondos de acento semitransparentes
    primaryBg:   isDark ? 'rgba(249,123,98,0.15)'   : 'rgba(249,123,98,0.10)',
    secondaryBg: isDark ? 'rgba(0,196,180,0.15)'    : 'rgba(0,196,180,0.10)',
    accentBg:    isDark ? 'rgba(155,135,232,0.15)'  : 'rgba(155,135,232,0.10)',
    successBg:   isDark ? 'rgba(52,211,153,0.15)'   : 'rgba(52,211,153,0.10)',
    dangerBg:    isDark ? 'rgba(248,113,113,0.15)'  : 'rgba(248,113,113,0.10)',

    // Bordes de acento
    primaryBorder:   isDark ? 'rgba(249,123,98,0.25)'  : 'rgba(249,123,98,0.2)',
    secondaryBorder: isDark ? 'rgba(0,196,180,0.25)'   : 'rgba(0,196,180,0.2)',
    accentBorder:    isDark ? 'rgba(155,135,232,0.25)' : 'rgba(155,135,232,0.2)',

    // Input
    inputBg:     isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(26,26,46,0.04)',
    inputBorder: isDark ? 'rgba(255,255,255,0.10)'  : 'rgba(26,26,46,0.12)',
    inputFocus:  isDark ? 'rgba(249,123,98,0.08)'   : 'rgba(249,123,98,0.06)',
    inputBorderFocus: isDark ? 'rgba(249,123,98,0.7)' : 'rgba(249,123,98,0.6)',
    placeholder: isDark ? 'rgba(255,255,255,0.25)'  : 'rgba(26,26,46,0.3)',

    // Nav
    navBg: isDark
      ? 'rgba(15,15,26,0.88)'
      : 'rgba(255,255,255,0.90)',
    navBorder: isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(237,229,225,0.9)',

    // Skeleton / pulse
    skeletonBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.06)',
  };
}
