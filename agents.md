# AGENTS.md — Caminos de Fogón y Palabra (front web)

> Contexto técnico para retomar el trabajo en opencode sin perder el hilo.
> Actualizado: 2026-10-09. Repo limpio y sincronizado con `origin/main` a esta fecha.

## 1. Qué es esta app

Web del proyecto comunitario **"Caminos de Fogón y Palabra: Mujeres que Guían el
Territorio"** — Fundación Quiero Desarrollo Humano, Banco de Iniciativas para las
Comunidades 2025 (MinInterior) + FINDETER. 15 mujeres del corredor oriental de
Pasto (Cabrera, San Pedro de la Laguna y veredas): cocina tradicional + turismo
comunitario. UI en español (con tildes: Fogón, Guían). Tema oscuro `#0b132b`.

## 2. Dónde vive cada cosa

| Pieza   | Ruta local                                                        | Git remoto                                        | Deploy                                            |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Front   | `C:\Users\USUARIO\Desktop\mapaturistico\mapasturisticos`          | `https://github.com/CrisAguirre/mapasturisticos.git` (`main`) | Vercel `https://caminosdefogonypalabra.vercel.app` |
| Backend | `C:\Users\USUARIO\Desktop\mapaturistico\mapasturisticosbknd`      | `https://github.com/CrisAguirre/mapasturisticosbknd.git` (`main`) | Render Docker `https://mapasturisticosbknd.onrender.com` |
| Docs fuente | Front: `src/assets/docs/` (`.docx` Punto Dos, propuesta, cuentas) | — | — |

OJO: el front NO tiene `.git` propio visible (está oculto); los comandos git corren
con `workdir` en la carpeta del front. El back sí tiene `.git` propio.

## 3. Stack y comandos (front)

- Node v22, Vite 8, React 19, `react-icons` 5, `react-router` NO (navegación por
  hash `#/ruta` con `routeFromHash()` en `App.jsx`).
- `npm run dev` / `npm run build` (verificado OK) / `npm run lint` (`oxlint`).
- PowerShell 5.1: encadenar con `; if ($?) { ... }`, no `&&`. No usar bash para
  leer/editar archivos (herramientas `read`/`edit`/`write`).

## 4. Estructura del front

```
src/
  App.jsx / App.css          Nav + tabs + footer + WhatsAppFloat
  index.css / main.jsx
  pages/                     Inicio, Proyecto, Mujeres, MapaTuristico,
                             Experiencias, Voces, Entrar, Contacto
  components/
    BannerCarousel.jsx/.css  Home (1 banner real + placeholders + video pendiente)
    TextCarousel.jsx/.css    Carrusel de tarjetas (propósitos, fogón/palabra, historia)
    GallerySlider.jsx/.css   Slider fotográfico con Ken Burns y barra de progreso
    bits.jsx/.css            Efectos propios estilo React Bits (Reveal, SplitText,
                             Spotlight) — sin dependencias
    WhatsAppFloat.jsx/.css   Botón flotante en degradado violeta
    CicloConsolidado.jsx/.css Contenido embebido en la página Mapa
  config/api.js              `API_URL` (de `VITE_API_URL`) + helper `api()`
  assets/logo.png            Logo vertical anterior (aún lo usa el login)
  assets/logo2.png           Logo horizontal actual (3300×1875, ~1MB): nav + favicon
  assets/banner.jpg / hero.png
  assets/media/2proyecto/    19 fotos ORIGINALES (65MB, no tocar)
  assets/media/2proyecto-web/19 fotos optimizadas 1600px q78 (~5.6MB, las que usa la web)
  assets/docs/               Fuentes de contenido (.docx/.pdf)
public/favicon.png           Favicon circular 180px generado de logo2 (sin franjas blancas)
.env                         `VITE_API_URL=https://mapasturisticosbknd.onrender.com`
                             (SÍ está commiteado: solo tiene la URL pública, no secretos)
```

## 5. Detalles de implementación que no son obvios

- **Nav** (`App.jsx`): brand = logo2 + 2 líneas (`Caminos de Fogón y Palabra` /
  `Mujeres que Guían el Territorio`). Estructura: `brand | .tabs-wrap(tabs + social) |
  .nav-actions(toggle)`. El social va pegado a las pestañas en desktop; en móvil
  `.tabs-wrap { display: contents }` y el orden es social-izq, logo-centro, menú-der.
  En móvil `.brand-text` se oculta.
- **Píldora Jelly Radio**: el indicador `.tabs-indicator` se desliza con
  `cubic-bezier(0.34,1.45,0.64,1)` y dentro lleva `.tabs-jelly` con `key={route}`
  que re-monta y hace squash & stretch (`@keyframes jelly`). Respetar
  `prefers-reduced-motion`.
- **SplitText** (`bits.jsx`): los espacios entre palabras van como nodo de texto
  FUERA del span animado (dentro de un `inline-block` el navegador los recorta y
  las palabras se pegan); en modo `chars` los espacios son `\u00A0`. Verificado.
- **Proyecto** (`pages/Proyecto.jsx`): contenido del docx
  `PUNTO DOS WEB CAMINOS DE FOGON Y PALABRA.docx`. Galería del header con
  `import.meta.glob('../assets/media/2proyecto-web/*.jpg', { eager:true,
  query:'?url', import:'default' })` + orden natural `localeCompare(...,{numeric:true})`:
  agregar fotos a esa carpeta las incluye solas. Cifras (15/9/5/1), 3 carruseles,
  tarjeta invitación con borde cónico animado (`@property --ia`), blobs y shimmer.
- **Entrar** (`pages/Entrar.jsx`): login real contra `POST /api/auth/login`
  (acepta `user|username|email` + `password`), guarda JWT en
  `localStorage['cfp_token']`, valida con `GET /api/auth/me` al cargar, vista de
  sesión + cerrar sesión. Sin recuperación de clave (no existe endpoint).
- **Instagram**: `https://www.instagram.com/caminosdefogonypalabra/` solo-icono en
  nav y footer (con `aria-label`).
- **Logo**: `.brand-logo` desktop 64px alto / 320px max (se subió +40% una vez);
  móvil 44px. Si el logo cambia de formato, ajustar por ALTO, nunca forzar cuadrado.

## 6. Recetas de assets (repetir igual cuando toque)

- Optimizar fotos: PIL `thumbnail((1600,1600))`, `quality=78, optimize, progressive`;
  guardar en carpeta `-web` con mismo nombre en minúsculas y espacios→`-`.
- Favicon desde logo2: recortar franjas blancas (detectar filas con >90% píxeles
  blancos en bordes), crop cuadrado centrado, resize 180, máscara circular con alpha.

## 7. Backend en detalle (`../mapasturisticosbknd/`)

- Express 4 + Mongoose 8 + JWT. `npm run dev` (`node --watch`) / `npm start`.
- Estructura: `src/index.js` (app + CORS + `/api/health` + handler global JSON),
  `src/config/db.js` (`connectDB`), `src/models/User.js`
  (name, email unique, passwordHash, role admin|mujer|visitante),
  `src/middleware/requireAuth.js` (firma JWT 7 días, exige Bearer),
  `src/routes/auth.js`, más `Dockerfile` (Node 22-alpine, `npm ci --omit=dev`),
  `.dockerignore`, `.env` (gitignored, con secretos) y `.env.example` (placeholders).
- Endpoints: `GET /api/health` → `{ ok, service, db, front, time }` (`front` =
  origins CORS efectivos, útil para debug); `POST /api/auth/login` con
  `{ user|username|email, password }` → `{ token, user }`;
  `GET /api/auth/me` (Bearer) → `{ user }`; `POST /api/auth/register` → 403 siempre.
- **Admin único**: se compara `ADMIN_USER` (case-insensitive) y
  `bcrypt.compare` contra `ADMIN_PASSWORD_HASH`; si no coincide, busca en Mongo
  por email. `/me` con `sub==='admin'` responde perfil fijo sin tocar DB.
- Env en Render (dashboard → Environment): `PORT=4000`, `MONGODB_URI`,
  `FRONTEND_URL` (coma-separadas; hoy `http://localhost:5173` + vercel),
  `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH`.
- Reglas CORS ya aplicadas en `src/index.js` (no romper): normalizar orígenes
  quitando `/` final en ambos lados; origin no listado → `cb(null, false)`
  (sin cabeceras, el navegador bloquea); JAMÁS `cb(Error)` (Express responde
  500 al preflight OPTIONS); handler global de errores en JSON, nunca HTML.
- Deploy Render Docker: health path `/api/health`; cada push a `main`
  redespliega solo (~1-2 min); cambiar env vars reinicia solo; plan free se
  duerme (cold start lento). Debug: pestaña Logs + campo `front` del health.
- Incidentes ya resueltos (no repetir): preflight 500 por `cb(Error)`, login 401
  por falta de `ADMIN_*` en Render, login 500 por falta de `JWT_SECRET` o hash
  mal copiado, CORS bloqueado por trailing slash en `FRONTEND_URL`.
- Probar login local sin dejar basura: arrancar con
  `Start-Process node -ArgumentList "src/index.js"`, `POST /api/auth/login`
  como admin (solo firma JWT, no escribe nada), `Stop-Process`.

## 8. Pendientes conocidos

- Mujeres / Experiencias / Voces / Contacto: contenido real (hoy placeholders).
- BannerCarousel: reemplazar placeholders por banners y video de bienvenida.
- `logo2.png` (~1MB) y `banner.jpg` (533KB): optimizar peso cuando se pueda.
- Decidir si el login también usa logo2 (hoy usa `logo.png`).

## 9. Reglas de trabajo con la usuaria

- Responder en español, corto y directo. Ella escribe rápido e informal.
- Verificar con `npm run build` (front) y prueba de login (back) antes de dar por hecho.
- Commits/push del back solo cuando lo pide explícito; del front igual.
- NUNCA escribir secretos (claves, URIs con password, hashes) en el chat salvo el
  hash/valor puntual que ella necesite pegar en Render, ni en archivos commiteados.
