# AGENTS.md — Caminos de Fogón y Palabra (front web + backend)

> Contexto técnico para retomar el trabajo en opencode sin perder el hilo.
> Actualizado: 2026-10-23. Describe el estado REAL verificado del código.

## 1. Qué es esta app

Web del proyecto comunitario **"Caminos de Fogón y Palabra: Mujeres que Guían el
Territorio"** — Fundación Quiero Desarrollo Humano, Banco de Iniciativas para las
Comunidades 2025 (MinInterior) + FINDETER. 15 mujeres del corredor oriental de
Pasto (Cabrera, San Pedro de la Laguna y veredas): cocina tradicional + turismo
comunitario. UI en español (con tildes: Fogón, Guían).

## 2. Dónde vive cada cosa

| Pieza   | Ruta local                                                        | Git remoto                                        | Deploy                                            |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Front   | `C:\Users\USUARIO\Desktop\mapaturistico\mapasturisticos`          | `https://github.com/CrisAguirre/mapasturisticos.git` (`main`) | Vercel `https://caminosdefogonypalabra.vercel.app` |
| Backend | `C:\Users\USUARIO\Desktop\mapaturistico\mapasturisticosbknd`      | `https://github.com/CrisAguirre/mapasturisticosbknd.git` (`main`) | Render Docker `https://mapasturisticosbknd.onrender.com` |
| Docs fuente | Front: `src/assets/docs/` (`.docx` Punto Dos, propuesta, cuentas) | — | — |

OJO: el front NO tiene `.git` propio visible (está oculto); los comandos git corren
con `workdir` en la carpeta del front. El back sí tiene `.git` propio.

## 3. Stack y comandos (front)

- Node v22, Vite 8, React 19 (+ StrictMode: en dev los efectos corren 2 veces,
  por eso los guards con refs), `react-icons` 5, `leaflet` (mapa, SIN
  `react-leaflet`), `react-router` NO (navegación por hash `#/ruta` con
  `routeFromHash()` en `App.jsx`).
- `npm run dev` / `npm run build` (verificado OK) / `npm run lint` (`oxlint`,
  solo 2 warnings viejos en `bits.jsx`) / `npm run preview`.
- Servicios externos SIN clave: tiles OSM + Esri satelital, Open-Meteo (viento),
  OSRM (solo en build-time para generar `ruta.json`, no en runtime).
- Auditoría diseño: `npx impeccable detect src/` (código) y contra dev en
  `http://127.0.0.1:5173/` (NO `localhost`: el browser del detector no lo
  resuelve). Quedan solo hallazgos de identidad (gradient-text, glows,
  cyan-on-dark): NO "corregir" la paleta ni el easing.
- PowerShell 5.1: encadenar con `; if ($?) { ... }`, no `&&`. No usar bash para
  leer/editar archivos (herramientas `read`/`edit`/`write`). Temp fuera del
  workspace: `C:\Users\USUARIO\AppData\Local\Temp\opencode`.

## 4. Estructura del front

```
src/
  App.jsx / App.css          Nav + tema día/noche + preload + footer + WhatsAppFloat
  index.css / main.jsx       color-scheme por tema + StrictMode
  pages/                     Inicio, Proyecto, Mujeres (+ Mujeres.css: rejilla
                             filtrable de 9 fichas + modal de historia),
                             MapaTuristico, Experiencias, Voces, Entrar, Contacto, Cuenta
  components/
    BannerCarousel.jsx/.css  Home (1 banner real + 6 placeholders + video pendiente)
    GallerySlider.jsx/.css   Slider head Proyecto (Ken Burns, progreso, botón ❚❚/▶)
    TextCarousel.jsx/.css    EN DESUSO (nadie lo importa; no pesa en el bundle)
    ProcesoAnimado.jsx/.css  5 ejes auto + LineaTiempo 9 pasos + estilos proj-*
    PiezasProyecto.jsx/.css  PropositosGrid (3×2 fija) + DueloFogon (sin autoplay)
    bits.jsx/.css            Reveal, SplitText (agrupa letras por palabra para no
                             partir palabras al quebrar línea), Spotlight, useInView
    MapaCorredor.jsx/.css    Mapa real Leaflet (ver §7)
    Preload.jsx/.css         Splash inicial (logo + barra, mín 900 ms + fundido)
    BackendStatus.jsx/.css   Visor GET /api/health (línea/DB/latencia, refresh 30 s)
    WhatsAppFloat.jsx/.css   Botón flotante AZUL (36px, wa.me/573196822133)
    CicloConsolidado.jsx/.css+sim EN DESUSO (simulacro ciclo del agua, no tocar)
  config/api.js              API_URL + api() + fotoUrl() (absolutiza /uploads)
  config/emprendimientos.js  ÚNICA fuente de verdad de los 9 emprendimientos:
                             texto del docx, foto, filtro, colores, `geo`
                             (lat/lng/precision) y `mapsQuery` para Google Maps
  config/recorrido.js        GOOGLE_MAPS_URL + SENDERO_BASE (6 paradas, ~7.4 km)
                             + mapsUrlPunto(); ya NO exporta RECORRIDO
  config/ruta.json           Trazado fiel OSRM foot: 388 pts [lat,lng], ~7.4 km
  assets/logo0.png           Emblema circular (1580×1554): nav + login
  assets/logo2.png           Horizontal (981 KB): solo preload
  assets/logo.png            EN DESUSO (login anterior)
  assets/banner.jpg          Banner nuevo optimizado 1920px (~372 KB)
  assets/banner0.jpg         Backup del banner anterior
  assets/hero.png / landscape-aerial.png (este último, del muerto CicloConsolidado)
  assets/media/2proyecto/    19 fotos ORIGINALES (65 MB, no tocar)
  assets/media/2proyecto-web/19 fotos optimizadas 1600px q78 (~5.6 MB, las que usa la web)
  assets/media/3mujeres-web/ 8 fotos de emprendedoras 1400px q78 (~1.4 MB total);
                             falta la de Tradiciones Nariñenses Marucha
  assets/docs/               Fuentes de contenido (.docx/.pdf)
public/favicon.png           Favicon circular 180px de logo2 (pendiente: pasar a logo0)
.env                         `VITE_API_URL=https://mapasturisticosbknd.onrender.com`
                             (SÍ está commiteado: solo la URL pública, no secretos)
```

## 5. Nav, tema y preload (`App.jsx` / `App.css`)

- Brand = logo0 + 2 líneas (`Caminos de Fogón y Palabra` / dorado
  `Mujeres que Guían el Territorio`, var `--dorado`: `#ffd479` noche, `#8a4a08` día).
- Estructura: `brand | .tabs | .nav-actions(tema + social + hamburguesa, en ese
  orden)`. Subrayado dorado 2px que se desliza (`cubic-bezier(0.22,1,0.36,1)`,
  SIN rebotes: el jelly se retiró). Sesión: pestaña muestra `Cuenta`.
- **Tema día/noche**: `data-theme` en `<html>` (`oscuro` por defecto),
  variables en `App.css` + bloque `html[data-theme="claro"]` consolidado (lo de
  fotos/gradientes/mapa se deja igual); toggle ☀️/🌙 con
  `localStorage['cfp_tema']`; día = blanco metalizado frío (NO beige).
- Breakpoint tablet/móvil 1024px: nav en grid 2 filas (marca-izq con elipsis +
  acciones-der ancladas con `margin-left:auto`, sin wrap ni solapes),
  hamburguesa cerrada por defecto (`matchMedia(min-width:1025px)`), `.tabs` con
  `min-width:0`. La fila del menú es altura fija (una sola línea, sin saltos).
- `.topnav` casi opaco (`rgba(5,10,23,0.96)` + sombra) para no mezclar texto al scroll.
- Preload: mínimo 900 ms + fundido 350 ms (`listo`/`fuera`). `App.jsx` pasa
  `user` a las páginas (`<Page user={user} />`); sesión vía `GET /api/auth/me` +
  evento `cfp-auth` + `localStorage['cfp_token']`.

## 6. Páginas

- **Inicio**: hero + `BannerCarousel` + `BackendStatus` SOLO sin sesión.
- **Proyecto**: galería header (`GallerySlider` con botón pausa/play, progreso
  sincronizado, Ken Burns congelable, arranca pausado con reduced-motion) +
  cifras (15/9/5/1) + cards resumen con `<details>` (NO muros de texto) +
  `PropositosGrid` + cita + chips territorio + `DueloFogon` +
  `ProcesoAnimado` (5 ejes) + `LineaTiempo` (9 pasos con "Ver más") + invitación.
- **Entrar**: sin sesión = card login (`logo0` + título marca, sin la palabra
  "Entrar") + `BackendStatus`; con sesión = `<Cuenta/>` (sección ancha propia).
- **Cuenta** (`Cuenta.jsx/.css`): avatar (foto o inicial), badge de rol
  (admin|mujer|visitante + descripción, SOLO lectura igual que el email),
  form nombre + subida de foto desde el dispositivo (JPG/PNG/WebP 2 MB, preview,
  subir/quitar) + cambio de clave (actual+nueva+confirmar) contra `PATCH /me` y
  `POST /foto`. Admin bloqueado (vive en el servidor).
- **Mujeres** (`Mujeres.jsx/.css` + `config/emprendimientos.js`): hero + cifras
  (9/8/4/1) + chips de filtro por oficio (cocina, naturaleza, campo, arte,
  dulces) + botón "Sorpréndeme" + rejilla de 9 tarjetas con foto, número,
  categoría, lugar, resumen, propietaria, "Leer su historia" → modal con
  relato completo, claves, cierre, navegación ←/→/Esc y enlace al mapa. Cada
  tarjeta tiene además un enlace directo "Mapa" a `#/mapa?p=<id>`; el modal
  enlaza al mismo punto. La ficha 06 (Tradiciones Nariñenses Marucha) queda con
  placeholder "Foto en camino" (no hay foto ni nombre de propietaria en el docx).
  Deep links: `#/mujeres?f=<id>` abre la historia y `#/mapa?p=<id>` abre el
  punto; ambos se sincronizan con `history.replaceState`.
- **Experiencias** (`Experiencias.jsx/.css`, contenido de `punto 5 experiencias.docx`):
  hero + cifras (4/9/4/1) + introducción con `<details>` + accesos rápidos a los
  cuatro ejes + 4 bloques alternados (foto del proceso en `2proyecto-web`, texto
  completo del docx, claves, cita y enlaces a Mujeres/Mapa) + cierre con cita y
  `Spotlight` de invitación. Los botones de acceso hacen scroll suave a cada eje
  (`scroll-margin-top` deja libre el nav fijo).
- Voces / Contacto: contenido real pendiente (placeholders).

## 7. Mapa en detalle (`MapaCorredor.jsx/.css`)

- **Fuente de verdad**: los 9 `EMPRENDIMIENTOS` de `config/emprendimientos.js`
  (no los 6 puntos viejos). Cada ficha tiene `geo: { lat, lng, precision }` y
  `mapsQuery`; el mapa pinta los 9 con sus números 01–09.
- Leaflet real OSM(claro)/Esri(satelital, **POR DEFECTO**), `scrollWheelZoom`
  solo con foco/clic, zoom abajo-der (40px en táctil), escala abajo-izq,
  minZoom 11 / maxZoom 19, límites Nariño con rebote (`maxBoundsViscosity: 0.8`),
  botones ⤢ "ver los 9 puntos" (`flyToBounds`) y 📍 mi ubicación (punto azul +
  precisión, `geoMsg` si falla). Táctil: pellizco + arrastre + toque nativos.
  El encuadre inicial se aplica cuando el contenedor ya tiene tamaño final
  (`ResizeObserver` + timeout de 250 ms); sin eso el mapa quedaba demasiado
  cerca y ocultaba puntos.
- **Clustering sin dependencias**: con zoom < 16, los puntos a ≤70 px del
  centroide del grupo se colapsan en un círculo con el número de fichas
  (p. ej. "7"); al tocarlo, `flyToBounds` acerca y los separa. Con zoom ≥ 16
  se muestran los 9 marcadores individuales. El grupo crece por centroide para
  que ningún punto quede pegado al borde del cluster.
- **Enlaces directos**: `#/mapa?p=<id>` abre ese punto (zoom 16) y su ficha;
  `#/mapa` muestra el encuadre de los 9. La URL se actualiza con
  `history.replaceState` al elegir marcador o lista. La ficha del mapa tiene
  "Ver historia completa" → `#/mujeres?f=<id>` (ida y vuelta con Mujeres).
- **Sendero base**: `ruta.json` (388 pts, ~7.4 km) queda como contexto, línea
  punteada marrón/amarilla; sin flechas ni números de ruta. La prioridad visual
  son los 9 emprendimientos: el botón principal es "Ver los 9 puntos" y el
  sendero queda como enlace secundario (`GOOGLE_MAPS_URL`, 6 paradas de
  `SENDERO_BASE`).
- **Coordenadas**: solo **Al Son de la Cuchara** y **Jardín de Mamá Luz** son
  exactas. Las otras 7 son aproximadas a nivel de vereda (Aguapamba, Cabrera,
  Jongovito, San Luis, Alto San Pedro, Cujacal Bajo); el mapa lo advierte en el
  encabezado y cada ficha muestra "Ubicación exacta" o "Ubicación aproximada ·
  nivel de vereda". El botón Google Maps usa `mapsQuery` para buscar el nombre
  real del emprendimiento.
- **Panel lateral**: ficha activa con foto (Marucha: "Foto en camino"),
  propietaria, resumen, hasta 4 claves, precisión, "Centrar en el mapa",
  Google Maps y "Ver historia completa"; lista de los 9 con miniatura (clic
  vuela al punto). En móvil el panel pasa debajo del mapa (mapa 440 px) y la
  lista se despliega completa.
- **Nubes de adorno ANCLADAS al mapa**: pane Leaflet `nubes` (z450, bajo
  marcadores), 8 fijas con lat/lng y semilla `cielo-cabrera` (4 corredor + 4
  Nariño), 3–5 lóbulos c/u + sombra a sotavento; se recolocan en
  move/zoom/viewreset y escalan `2^(z-14)`; deriva visible ±70px en 20–32 s con
  respiro + viento real Open-Meteo (badge `🌬️ dir · km/h`, fallback E);
  interruptor ☁️ sí/no; `prefers-reduced-motion` = fijas. Nada meteorológico.

## 8. Backend en detalle (`../mapasturisticosbknd/`)

- Express 4 + Mongoose 8 + JWT + multer. `npm run dev` (`node --watch`) /
  `npm start` / `npm run lint` (`eslint .` flat config, limpio).
- Estructura: `src/index.js` (app + CORS + `/api/health` + `/uploads` estático +
  handler global JSON), `src/config/db.js` (`connectDB`), `src/models/User.js`
  (name, email unique, passwordHash, role admin|mujer|visitante, foto URL|null),
  `src/middleware/requireAuth.js` (firma JWT 7 días, exige Bearer),
  `src/routes/auth.js`, más `Dockerfile` (Node 22-alpine, `mkdir uploads`,
  `npm ci --omit=dev`), `.dockerignore` + `.gitignore` (ignoran `uploads`),
  `.env` (gitignored, con secretos) y `.env.example` (placeholders).
- Endpoints: `GET /api/health` → `{ ok, service, db, front, time }`;
  `POST /api/auth/login` (`user|username|email` + `password`) → `{ token, user }`
  (con `foto`); `GET /api/auth/me` → `{ user }` (con `foto`, `createdAt`);
  `PATCH /api/auth/me` (name 2–80, foto https|vacía ≤500, clave con
  currentPassword + mín 6; borra archivo local reemplazado; admin → 403);
  `POST /api/auth/foto` (multer JPG/PNG/WebP 2 MB, guarda
  `uploads/<id>-<ts>.ext`, borra anterior local, errores en 400 español);
  `POST /api/auth/register` → 403 siempre. Email y rol NO editables.
- **Admin único**: `ADMIN_USER` (case-insensitive) + `bcrypt.compare` contra
  `ADMIN_PASSWORD_HASH`; `/me` con `sub==='admin'` responde perfil fijo.
- Env en Render: `PORT=4000`, `MONGODB_URI`, `FRONTEND_URL` (coma-separadas),
  `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH`.
- Reglas CORS ya aplicadas en `src/index.js` (no romper): normalizar orígenes
  sin `/` final; origin no listado → `cb(null, false)`; JAMÁS `cb(Error)`;
  handler global JSON, nunca HTML.
- Deploy Render Docker: health path `/api/health`; push a `main` redespliega
  (~1-2 min); plan free se duerme (cold start). OJO: disco efímero → las fotos
  de `uploads/` se pierden al redesplegar (futuro: Render Disk o S3).
- Incidentes ya resueltos (no repetir): preflight 500 por `cb(Error)`, login 401
  por falta de `ADMIN_*`, login 500 por falta de `JWT_SECRET`/hash, CORS por
  trailing slash, multer 500 → ahora 400 con mensaje.
- Probar sin dejar basura: arrancar con `Start-Process node`, `GET /health`,
  login admin (solo firma JWT), `PATCH` sin token → 401, `Stop-Process` por
  puerto (`Get-NetTCPConnection -LocalPort 4000`). La subida se probó punta a
  punta con usuario temporal (casos 200/400/401/404) y se borró todo.

## 9. Recetas de assets (repetir igual cuando toque)

- Optimizar fotos: PIL `thumbnail((1600,1600))`, `quality=78, optimize, progressive`;
  guardar en carpeta `-web` con mismo nombre en minúsculas y espacios→`-`.
- Banner: 1920px q82 progresivo. Favicon: pendiente regenerar desde `logo0`
  (hoy es de `logo2`: crop cuadrado, resize 180, máscara circular).
- NO commitear `uploads/` (fotos de usuarios).

## 10. Pendientes conocidos

- Voces / Contacto: contenido real.
- Experiencias: contenido del docx ya montado; si llegan fotos propias del
  documento, reemplazar las fotos del proceso que hoy ilustran los cuatro ejes.
- Mujeres: foto (y nombre de la propietaria) de Tradiciones Nariñenses Marucha.
- Mapa: reemplazar las 7 coordenadas aproximadas (nivel de vereda) por exactas
  cuando las entreguen; hoy solo Al Son y Jardín de Mamá Luz están verificadas.
- BannerCarousel: reemplazar 6 placeholders + video de bienvenida.
- `logo2.png` (981 KB, solo preload): optimizar o retirar.
- Favicon desde `logo0`; borrar muertos (`TextCarousel.*`, `CicloConsolidado.*`,
  `logo.png`, `landscape-aerial.png`) cuando se apruebe.
- Persistencia de fotos (Disk/S3). Sin recuperación de clave (no hay endpoint).

## 11. Reglas de trabajo con la usuaria

- Responder en español, corto y directo. Ella escribe rápido e informal.
- Verificar con `npm run build` + `lint` (front) y `eslint` + sintaxis (back)
  antes de dar por hecho; prueba viva del back sin dejar basura.
- Commits/push (front o back) SOLO cuando lo pide explícito.
- NUNCA escribir secretos (claves, URIs con password, hashes, tokens) en el
  chat salvo el valor puntual que ella necesite pegar en Render, ni en archivos
  commiteados. Cuidado PowerShell: `$t` y `$T` son la MISMA variable.
