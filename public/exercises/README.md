# Ilustraciones de ejercicios

Los 15 SVG son originales y se generan con `node scripts/generate-exercise-art.mjs`. No incorporan modelos, imágenes ni código de terceros. Los archivos mantienen las rutas existentes y se incluyen en la caché offline de la aplicación.

La demostración compara dos posiciones mediante un fundido; no representa una simulación biomecánica continua ni prescribe un rango articular. Reproducción manual, pausa, repetición y selección Inicio/Final. Con movimiento reducido se utiliza selección manual sin transición.

## Referencias técnicas evaluadas

- Three.js: https://github.com/mrdoob/three.js — licencia MIT (https://github.com/mrdoob/three.js/blob/dev/LICENSE).
- React Three Fiber: https://github.com/pmndrs/react-three-fiber — licencia MIT. El paquete actual de la rama principal es 9.x; este proyecto utiliza React 18.

Se optó por SVG y React existentes: no se necesitan modelos 3D, WebGL ni nuevas dependencias para comparar las posiciones. Estas bibliotecas no aportan por sí mismas movimientos de rehabilitación clínicamente validados. No se importaron recursos externos.

Se conservaron los datos clínicos, filtros, rutas e indicaciones guardadas. Se retiraron los avisos generales repetidos de inicio, biblioteca, cabecera de ficha y pie de página; las precauciones particulares permanecen en los detalles.
