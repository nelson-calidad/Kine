# Inventario de recursos gráficos (`/public/images/` y `/public/exercises/`)

El proyecto incluye esquemas vectoriales educativos claros y clínicamente coherentes en formato `.svg` para los **5 ejercicios principales de recuperación de la flexión de rodilla**. Si se desea sustituirlos por fotografías o láminas propias de la cátedra, basta con reemplazar los archivos conservando el nombre o actualizando la ruta en `src/data/exercises.ts`.

## 1. Ilustraciones de los 5 ejercicios principales (`/public/exercises/`)

Cada ejercicio cuenta con:
- Una ilustración principal comparativa (`Inicio → Final`) para la tarjeta.
- Dos ilustraciones individuales (`*-inicio.svg` y `*-final.svg`) para el **Componente de demostración**.

1. **Ejercicio 1 — Deslizamiento del talón**
   - Principal: `/exercises/deslizamiento-talon.svg`
   - Inicio: `/exercises/deslizamiento-talon-inicio.svg`
   - Final: `/exercises/deslizamiento-talon-final.svg`
2. **Ejercicio 2 — Flexión asistida con toalla**
   - Principal: `/exercises/flexion-asistida-toalla.svg`
   - Inicio: `/exercises/flexion-asistida-toalla-inicio.svg`
   - Final: `/exercises/flexion-asistida-toalla-final.svg`
3. **Ejercicio 3 — Deslizamiento en pared**
   - Principal: `/exercises/deslizamiento-pie-pared.svg`
   - Inicio: `/exercises/deslizamiento-pie-pared-inicio.svg`
   - Final: `/exercises/deslizamiento-pie-pared-final.svg`
4. **Ejercicio 4 — Flexión activa en sedestación** *(Pie deslizándose HACIA ATRÁS debajo de la silla)*
   - Principal: `/exercises/flexion-activa-sedestacion.svg`
   - Inicio: `/exercises/flexion-activa-sedestacion-inicio.svg`
   - Final: `/exercises/flexion-activa-sedestacion-final.svg`
5. **Ejercicio 5 — Bicicleta estática**
   - Principal: `/exercises/bicicleta-estatica.svg`
   - Inicio: `/exercises/bicicleta-estatica-inicio.svg`
   - Final: `/exercises/bicicleta-estatica-final.svg`

## 2. Videos opcionales (`/public/videos/`)
- Para habilitar el botón **"Ver video"** en cualquiera de los 5 ejercicios, colocá el archivo `.mp4` o `.webm` en `public/videos/` y asigná su ruta en la propiedad `video` dentro de `src/data/exercises.ts`.
