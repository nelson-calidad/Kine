# Tu rodilla, paso a paso

**Subtítulo:** Guía de recuperación en casa después de una reconstrucción del ligamento cruzado anterior (LCA).  
**Marco académico:** Recurso educativo domiciliario vinculado mediante código QR a un banner académico de **Kinefisiatría Traumatológica y Reumatológica** sobre *"Recuperación de la flexión de rodilla durante el postoperatorio temprano de reconstrucción del LCA mediante autoinjerto hueso–tendón–hueso (HTH) rotuliano"*.

---

## 1. Ejecución local y compilación

### Requisitos previos
- **Node.js** 18+ (probado en Node 22) y **npm** 9+.

### Comandos principales
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Verificar tipos de TypeScript y compilar para producción
npm run build

# 4. Previsualizar la versión compilada localmente
npm run preview
```

---

## 2. Arquitectura del proyecto

```text
src/
  app/
    App.tsx                 # Contenedor general, modo texto grande, barra superior/inferior y PWA
    router.tsx              # Definición de las 11 rutas de la guía y control de scroll
  components/
    layout/
      Header.tsx            # Encabezado con acceso permanente a Alertas, Texto Grande y Menú
      BottomNavigation.tsx  # Barra inferior móvil (Inicio | Ejercicios | Cuidados | Alertas)
      Footer.tsx            # Pie de página con descargo de responsabilidad académica y clínica
    exercises/
      ExerciseCard.tsx      # Tarjeta de ejercicio con estructura estandarizada y vista rápida
      ExerciseDetail.tsx    # Vista completa del ejercicio, lectura sencilla, compartir e imprimir
      ExerciseFilters.tsx   # Filtros interactivos por categoría
      ExerciseInstructions.tsx # Apartado "Mis indicaciones" (guardado opcional en localStorage)
    common/
      ExerciseImage.tsx     # Renderizador de ilustraciones con fallback elegante si falta imagen
      InfoCard.tsx          # Tarjeta desplegable accesible
      SafetyNotice.tsx      # Bloque de advertencia/seguridad clínica
      SectionHeader.tsx     # Encabezado de página con regreso al inicio
      EmptyState.tsx        # Estado vacío reutilizable
      PwaUpdatePrompt.tsx   # Aviso de nueva versión cuando existe actualización PWA
  pages/
    HomePage.tsx            # / (Inicio)
    ExercisesPage.tsx       # /ejercicios (Biblioteca de ejercicios)
    ExerciseDetailPage.tsx  # /ejercicios/:id (Detalle individual de cada ejercicio)
    CarePage.tsx            # /cuidados (Cuidados domiciliarios A-F)
    AvoidPage.tsx           # /que-evitar (Los NO en casa)
    DailyActivitiesPage.tsx # /actividades (Actividades de la vida diaria)
    AlertsPage.tsx          # /alertas (Señales de alarma: Consulta urgente y Emergencia)
    TrackingPage.tsx        # /seguimiento (Registro voluntario local sin datos personales)
    FAQPage.tsx             # /preguntas (Preguntas frecuentes en acordeones)
    SurgeryPage.tsx         # /mi-cirugia (Explicación didáctica de la reconstrucción HTH)
    SourcesPage.tsx         # /fuentes (Bibliografía científica y alcance educativo)
  data/
    exercises.ts            # Datos estructurados de los 8 ejercicios
    care.ts                 # Cuidados domiciliarios y actividades cotidianas
    restrictions.ts         # Qué evitar en casa y señales de alarma
    faq.ts                  # Preguntas frecuentes
    sources.ts              # Fuentes científicas verificadas (Kotsifaki 2023, MGB, NHS)
  hooks/
    useLocalStorage.ts      # Persistencia local en el navegador del paciente
  types/
    exercise.ts             # Interfaces TypeScript de toda la aplicación
  styles/
    globals.css             # Variables CSS de paleta de colores, accesibilidad e impresión
public/
  images/                   # Ilustraciones generales y de cirugía HTH
  exercises/                # Ilustraciones específicas de cada ejercicio
  videos/                   # Carpeta preparada para videos demostrativos opcionales
  icons/                    # Íconos PWA (192x192 y 512x512)
```

---

## 3. Guía para reemplazar imágenes y agregar videos

### Reemplazar ilustraciones de ejercicios (`/public/exercises/`)
1. Copiá tus imágenes clínicas verificadas (en formato `.svg`, `.png`, `.webp` o `.jpg`) dentro de la carpeta `public/exercises/`.
2. Si conservás el mismo nombre de archivo, el cambio es automático. Si cambiás la extensión (por ejemplo, de `.svg` a `.webp`), actualizá la propiedad `image` del ejercicio correspondiente en [`src/data/exercises.ts`](src/data/exercises.ts):
   - `/exercises/deslizamiento-talon.svg`
   - `/exercises/flexion-asistida-toalla.svg`
   - `/exercises/deslizamiento-pie-pared.svg`
   - `/exercises/flexion-activa-sedestacion.svg` *(Verificar que muestre el pie deslizándose **hacia atrás** debajo de la silla durante la flexión, nunca extensión)*.
   - `/exercises/bicicleta-estatica.svg`
   - `/exercises/isometrico-cuadriceps.svg`
   - `/exercises/extension-apoyo-talon.svg`
   - `/exercises/movimientos-tobillo.svg`
3. Si dejás el campo `image: ''` vacío o el archivo no existe, el componente `ExerciseImage` mostrará automáticamente un placeholder clínico limpio con el nombre del ejercicio.

### Reemplazar ilustraciones de cirugía (`/public/images/`)
- `/images/hero-rodilla.svg` (Ilustración de portada)
- `/images/rodilla-sana.svg` (Esquema de rodilla sana)
- `/images/reconstruccion-hth.svg` (Esquema de reconstrucción LCA con injerto HTH)

### Incorporar videos demostrativos opcionales (`/public/videos/`)
1. Guardá el archivo `.mp4` (sin reproducción automática con sonido) en `public/videos/`, por ejemplo `public/videos/deslizamiento-talon.mp4`.
2. En [`src/data/exercises.ts`](src/data/exercises.ts), cambiá `video: null` por `video: '/videos/deslizamiento-talon.mp4'`.
3. El botón **"Ver demostración"** en la pantalla del ejercicio mostrará automáticamente el reproductor de video.

---

## 4. Guía para modificar textos y ejercicios

Todos los textos clínicos están centralizados en la carpeta `src/data/` para que el equipo docente o clínico pueda revisarlos y editarlos sin tocar componentes de interfaz:

- **Ejercicios domiciliarios:** [`src/data/exercises.ts`](src/data/exercises.ts)
- **Cuidados en casa y actividades cotidianas:** [`src/data/care.ts`](src/data/care.ts)
- **Qué evitar (Los NO) y señales de alarma:** [`src/data/restrictions.ts`](src/data/restrictions.ts)
- **Preguntas frecuentes:** [`src/data/faq.ts`](src/data/faq.ts)
- **Bibliografía y alcance editorial:** [`src/data/sources.ts`](src/data/sources.ts)

---

## 5. Instrucciones para publicar en hosting estático con HTTPS

El proyecto genera una carpeta `dist/` 100% estática y ya incluye configuración de rutas SPA (`public/_redirects` para Netlify/Cloudflare Pages, `vercel.json` para Vercel y `public/404.html` de respaldo).

### Opción A: Netlify / Cloudflare Pages
1. Subí el repositorio a GitHub o arrastrá la carpeta `dist/` generada con `npm run build`.
2. Comando de compilación: `npm run build`
3. Directorio de salida: `dist`
4. El certificado HTTPS se activa automáticamente y la URL final (por ejemplo, `https://tu-rodilla-paso-a-paso.netlify.app`) queda lista para generar el código QR del banner académico.

### Opción B: Vercel
1. Importá el proyecto en Vercel.
2. Detectará Vite automáticamente (`npm run build`, salida `dist`) y aplicará `vercel.json` para que todas las rutas (`/ejercicios`, `/alertas`, etc.) funcionen al recargar.

---

## 6. Lista de comprobaciones clínicas pendientes antes de publicar el QR

Antes de imprimir el banner académico definitivo con el código QR, se recomienda que el equipo docente de Kinefisiatría Traumatológica y Reumatológica verifique:

- [ ] **Revisión visual de láminas anatómicas:** Confirmar si se desean mantener los esquemas vectoriales incluidos en `/public/images/` y `/public/exercises/` o sustituirlos por fotografías/ilustraciones propias de la cátedra.
- [ ] **Verificación de terminología local:** Confirmar que todas las expresiones para pacientes coincidan con las pautas entregadas en el servicio o cátedra.
- [ ] **Control del Ejercicio 4 (Flexión activa en sedestación):** Si se reemplaza la ilustración, verificar que represente inequívocamente el pie deslizándose **hacia atrás** debajo de la silla (flexión) y nunca una extensión de rodilla.
- [ ] **Datos institucionales opcionales:** Si la cátedra desea incluir el nombre de la universidad, facultad o autores del póster académico en el pie de página (`src/components/layout/Footer.tsx`) o en `src/data/sources.ts`, agregarlos antes de compilar.
