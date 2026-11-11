# Carpeta de videos demostrativos (`/public/videos/`)

Colocá en esta carpeta los videos demostrativos validados por el equipo docente/clínico en formato `.mp4` o `.webm` (sin sonido por defecto o con pistas subtituladas).

## Nombres sugeridos para vincular en `src/data/exercises.ts`

- `/videos/deslizamiento-talon.mp4`
- `/videos/flexion-asistida-toalla.mp4`
- `/videos/deslizamiento-pie-pared.mp4`
- `/videos/flexion-activa-sedestacion.mp4`
- `/videos/bicicleta-estatica.mp4`
- `/videos/isometrico-cuadriceps.mp4`
- `/videos/extension-apoyo-talon.mp4`
- `/videos/movimientos-tobillo.mp4`

> **Importante:** El botón **"Ver demostración"** en la pantalla de detalle de cada ejercicio **solo se muestra automáticamente** cuando el campo `video` del ejercicio en `src/data/exercises.ts` tiene una ruta válida asignada o cuando existe una secuencia paso a paso (`demoSequence`) verificada. Nunca se muestra un botón sin acción.
