# Licencias de Recursos 3D y Librerías (Third-Party Notices)

## 1. Modelo Humano 3D (`public/models/rehab-human.glb`)
- **Malla anatómica y esqueleto (rig)**: Exportación base de **MakeHuman Community** (`http://www.makehumancommunity.org/`) distribuida bajo licencia **CC0 1.0 Universal (Public Domain Dedication)** a través del repositorio **OpenGym3D** (`https://github.com/AssiamahS/opengym3d` / `Mesh2Motion`).
- **Colores de indumentaria deportiva y preparación del archivo**: Generados localmente mediante `scripts/prepare-human.mjs` sobre la topología original, eliminando cámaras y animaciones de gimnasio ajenas a la rehabilitación de rodilla.
- **Animaciones clínicas articulares**: Desarrolladas específicamente para *Tu rodilla, paso a paso* en `src/components/exercises/three/RehabExerciseScene.tsx` mediante cinemática inversa de dos eslabones (2-bone IK) siguiendo estrictamente las pautas de `src/data/exercises.ts`. No se reutilizan clips de movimiento externos.

## 2. Motor 3D e Integración en React
- **three** (`0.170.0`): Licencia MIT (`https://github.com/mrdoob/three.js`)
- **@react-three/fiber** (`8.18.0`): Licencia MIT (`https://github.com/pmndrs/react-three-fiber`)
- **@react-three/drei** (`9.122.0`): Licencia MIT (`https://github.com/pmndrs/drei`)
