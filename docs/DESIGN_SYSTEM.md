Necesito que implementes el diseño visual de HuellaSegura de forma 
IDÉNTICA a los mockups de alta fidelidad ya aprobados. Antes de 
escribir cualquier línea de código, sigue este protocolo:

═══════════════════════════════════════════════════════
PASO 1 — LECTURA OBLIGATORIA DEL DESIGN SYSTEM
═══════════════════════════════════════════════════════
Lee COMPLETAMENTE el archivo:
   docs/design/DESIGN_SYSTEM.md

Ese archivo es la fuente de verdad para colores, tipografía, 
espaciado, sombras, componentes y reglas de oro. Cualquier 
decisión visual debe venir de ahí.

═══════════════════════════════════════════════════════
PASO 2 — REVISIÓN VISUAL DE CADA PANTALLA
═══════════════════════════════════════════════════════
Antes de implementar cada pantalla, abre y observa la imagen 
de referencia correspondiente en docs/design/:

   01-splash.png       → Splash & Onboarding
   02-login.png        → Login
   03-home.png         → Home / Dashboard
   04-mapa.png         → Mapa interactivo
   05-perfil-mascota.png → Perfil de mascota
   06-registro.png     → Registro de mascota
   07-carnet-qr.png    → Carnet QR
   08-alertas-dark.png → Alertas (modo oscuro)
   09-veterinarias.png → Directorio veterinarias
   10-perfil-usuario.png → Perfil de usuario

Replica EXACTAMENTE: jerarquía visual, distribución de elementos, 
tamaños relativos, paleta, sombras y tipografía.

═══════════════════════════════════════════════════════
PASO 3 — CONFIGURACIÓN BASE
═══════════════════════════════════════════════════════
1. Configura Tailwind con las CSS variables del DESIGN_SYSTEM.md
   en frontend/tailwind.config.js y frontend/src/index.css.
2. Importa Poppins e Inter de Google Fonts.
3. Instala dependencias necesarias:
      npm install lucide-react react-leaflet leaflet 
      framer-motion react-hook-form zod sonner
4. Configura el modo oscuro con clase 'dark' y persistencia 
   en localStorage.

═══════════════════════════════════════════════════════
PASO 4 — IMPLEMENTACIÓN POR ORDEN DE PRIORIDAD
═══════════════════════════════════════════════════════
Implementa en este orden, una pantalla a la vez. Después de 
cada pantalla detente, muéstrame el resultado y espera mi 
visto bueno antes de pasar a la siguiente:

   1º  Componentes atómicos del Design System
       (Button, Input, Card, Avatar, Chip, BottomNav)
   2º  Splash + Onboarding (01)
   3º  Login (02)
   4º  Home / Dashboard (03)
   5º  Mapa interactivo (04) — usa react-leaflet con tiles 
       de OpenStreetMap y pins personalizados con foto
   6º  Perfil de mascota (05)
   7º  Registro de mascota — wizard de 4 pasos (06)
   8º  Carnet QR (07) — usa qrcode.react para generar el QR real
   9º  Alertas (08) — empieza con la versión modo oscuro
   10º Directorio veterinarias (09)
   11º Perfil de usuario (10)

═══════════════════════════════════════════════════════
PASO 5 — REGLAS NO NEGOCIABLES
═══════════════════════════════════════════════════════
- Mobile first SIEMPRE. Responsive de 320px a 1920px.
- Cada componente con sus tests unitarios (Vitest + Testing Library).
- Nunca romper los 184 tests que ya pasan. Ejecuta:
      cd backend && npm test
      cd frontend && npm test
   antes y después de cada cambio importante.
- Conecta todo al backend ya existente (los 11 requerimientos 
   funcionales R1-R11 ya están implementados).
- Cumple los RNF: bcrypt cost ≥ 10, JWT 24h, HTTPS, 
   responsive 320-1920px, Ley 1581 de 2012.
- Microinteracciones con framer-motion pero SUTILES 
   (200-300ms, easing suave).
- Accesibilidad: contraste AA mínimo, aria-labels, 
   navegación por teclado.

═══════════════════════════════════════════════════════
EMPIEZA YA
═══════════════════════════════════════════════════════
Comienza leyendo el DESIGN_SYSTEM.md y revisando las 10 imágenes 
en docs/design/. Luego propón un plan de implementación detallado 
con estimación de archivos a crear/modificar para los componentes 
atómicos (Paso 4 - punto 1). Solo cuando apruebe el plan, empiezas 
a escribir código.