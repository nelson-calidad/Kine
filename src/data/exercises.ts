import { Exercise } from '../types/exercise';

export const EXERCISES_DATA: Exercise[] = [
  // =========================================================================
  // SECCIÓN A: RECUPERACIÓN DE LA FLEXIÓN (5 EJERCICIOS DEL BANNER ACADÉMICO)
  // =========================================================================
  {
    id: 'deslizamiento-del-talon',
    title: 'Deslizamiento del talón',
    section: 'flexion',
    category: 'Banner · Flexión activa',
    filterCategory: 'movilidad-inicial',
    goal: 'Recuperar la flexión activa.',
    initialPosition: 'Decúbito supino (acostado boca arriba sobre una superficie firme).',
    equipment: 'Camilla o cama firme.',
    steps: [
      'Acostate en decúbito supino con las piernas extendidas y apoyadas.',
      'Deslizá lentamente el talón hacia los glúteos, flexionando progresivamente la rodilla.',
      'Mantené el talón en contacto con la superficie sin levantar la cadera.',
      'Regresá despacio a la posición inicial según tu tolerancia.'
    ],
    commonMistakes: [
      'Hacer rebotes o movimientos bruscos.',
      'Levantar la pelvis o compensar con la cadera.',
      'Forzar el rango si aparece dolor intenso.'
    ],
    precautions: [
      'Evitar dolor intenso y compensaciones.',
      'Realizar según tolerancia, evolución clínica y pautas de tu kinesiólogo.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo articular.',
      'Aumento importante de derrame o inflamación.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Deslizamiento del talón en decúbito supino flexionando progresivamente la rodilla.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Decúbito supino con rodilla extendida y talón apoyado.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Flexión progresiva de rodilla deslizando el talón hacia los glúteos.',
    movementCue: 'Deslizá lentamente el talón hacia los glúteos, flexionando progresivamente la rodilla.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-asistida-con-toalla',
    title: 'Flexión autoasistida con toalla o cincha',
    section: 'flexion',
    category: 'Banner · Flexión autoasistida',
    filterCategory: 'movilidad-asistida',
    goal: 'Facilitar la movilidad mediante autoasistencia.',
    initialPosition: 'Decúbito supino, con una toalla o cincha alrededor del pie.',
    equipment: 'Toalla o cincha no elástica.',
    steps: [
      'Colocá una toalla o cincha alrededor del pie de la pierna operada.',
      'Deslizá el talón hacia los glúteos acompañando suavemente la flexión de rodilla con las manos.',
      'Evitá realizar tracciones bruscas o levantar el talón de la camilla.',
      'Regresá lentamente a la extensión.'
    ],
    commonMistakes: [
      'Realizar tracciones bruscas con los brazos.',
      'Despegar toda la pierna de la superficie.',
      'Forzar más allá del límite tolerado.'
    ],
    precautions: [
      'No realizar tracciones bruscas.',
      'Acompañar el movimiento de forma suave y progresiva según tolerancia.'
    ],
    stopConditions: [
      'Dolor intenso en la rodilla o zona anterior del injerto HTH.',
      'Bloqueo articular.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/flexion-asistida-toalla.svg',
    imageAlt: 'Flexión autoasistida con toalla o cincha en decúbito supino.',
    startImage: '/exercises/flexion-asistida-toalla-inicio.svg',
    startImageCaption: 'Decúbito supino con toalla o cincha colocada en el pie.',
    endImage: '/exercises/flexion-asistida-toalla-final.svg',
    endImageCaption: 'Autoasistencia suave acompañando la flexión de rodilla.',
    movementCue: 'Utilizá una toalla o cincha para acompañar suavemente la flexión sin tracciones bruscas.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },
  {
    id: 'flexion-autoasistida-pelota-mani',
    title: 'Flexión autoasistida con pelota maní',
    section: 'flexion',
    category: 'Banner · Apoyo móvil',
    filterCategory: 'movilidad-asistida',
    goal: 'Facilitar la flexión con un apoyo móvil.',
    initialPosition: 'Decúbito supino, con la parte inferior de las piernas sobre una pelota maní transversal.',
    equipment: 'Pelota maní terapéutica grande.',
    steps: [
      'En decúbito supino, apoyá la parte inferior de las piernas sobre una pelota maní grande colocada transversalmente.',
      'Flexioná las rodillas acompañando suavemente el desplazamiento rodante de la pelota hacia vos.',
      'Mantené el control de la pelvis y la espalda apoyada.',
      'Extendé lentamente haciendo rodar la pelota hacia la posición inicial.'
    ],
    commonMistakes: [
      'Perder el control de la pelvis o arquear la zona lumbar.',
      'Usar una pelota inestable o de tamaño inadecuado.',
      'Dejar rodar la pelota sin control muscular.'
    ],
    precautions: [
      'Mantener el control de la pelvis y utilizar una pelota de tamaño adecuado.',
      'Evitar movimientos rápidos o dolor intenso.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Pérdida de estabilidad de la pelota.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/deslizamiento-pie-pared.svg',
    imageAlt: 'Flexión autoasistida en decúbito supino con las piernas apoyadas sobre una pelota maní transversal.',
    startImage: '/exercises/deslizamiento-pie-pared-inicio.svg',
    startImageCaption: 'Piernas apoyadas sobre pelota maní terapéutica colocada transversalmente.',
    endImage: '/exercises/deslizamiento-pie-pared-final.svg',
    endImageCaption: 'Flexión de rodillas acompañando el desplazamiento de la pelota maní.',
    movementCue: 'Flexioná las rodillas acompañando el desplazamiento de la pelota maní con control pélvico.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-activa-en-sedestacion',
    title: 'Flexión autoasistida en sedestación',
    section: 'flexion',
    category: 'Banner · Sedestación',
    filterCategory: 'movilidad-activa',
    goal: 'Mejorar la flexión en sedestación.',
    initialPosition: 'Sentado al borde de una camilla o silla alta.',
    equipment: 'Camilla o silla alta estable.',
    steps: [
      'Sentate al borde de una camilla o silla alta manteniendo ambos glúteos bien apoyados.',
      'Desplazá hacia atrás el pie de la pierna operada flexionando la rodilla.',
      'Utilizá el pie sano por delante del tobillo operado para asistir suavemente el movimiento.',
      'Regresá de forma controlada sin elevar la pelvis.'
    ],
    commonMistakes: [
      'Elevar la pelvis o despegar los glúteos del asiento.',
      'Empujar bruscamente con la pierna sana.',
      'Inclinarse excesivamente para compensar.'
    ],
    precautions: [
      'Mantener ambos glúteos apoyados y evitar elevar la pelvis.',
      'Asistir con el pie sano de forma progresiva y sin dolor intenso.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo articular.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/flexion-activa-sedestacion.svg',
    imageAlt: 'Flexión autoasistida en sedestación utilizando el pie sano para asistir el desplazamiento hacia atrás.',
    startImage: '/exercises/flexion-activa-sedestacion-inicio.svg',
    startImageCaption: 'Sentado al borde de la camilla o silla alta con glúteos apoyados.',
    endImage: '/exercises/flexion-activa-sedestacion-final.svg',
    endImageCaption: 'El pie sano asiste suavemente hacia atrás al pie de la pierna operada.',
    movementCue: 'Desplazá hacia atrás el pie operado utilizando el pie sano para asistir, sin elevar la pelvis.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['kotsifaki-2023', 'nhs-acl']
  },
  {
    id: 'flexion-asistida-prono',
    title: 'Flexión asistida en decúbito prono',
    section: 'flexion',
    isSupervisedOnly: true,
    specialBadge: 'Uso profesional supervisado',
    category: 'Banner · Técnica kinesiológica',
    filterCategory: 'progresion-autorizada',
    goal: 'Facilitar la ganancia de rango cuando existe un estancamiento alrededor de los 90° en supino.',
    initialPosition: 'Decúbito prono (boca abajo en camilla, bajo supervisión del kinesiólogo).',
    equipment: 'Camilla clínica y asistencia manual del kinesiólogo.',
    steps: [
      'En decúbito prono, el kinesiólogo sostiene la pierna y lleva suavemente la rodilla hacia flexión.',
      'Solicita una contracción isométrica del cuádriceps contra resistencia manual durante 8 a 15 segundos.',
      'Tras la relajación muscular, el profesional acompaña suavemente la ganancia de flexión.',
      'Técnica exclusiva de consultorio: no realizar de forma domiciliaria independiente.'
    ],
    commonMistakes: [
      'Intentar realizar esta técnica solo en casa sin supervisión.',
      'Arquear la columna lumbar o despegar la pelvis de la camilla.',
      'Aplicar fuerza brusca sin fase de relajación.'
    ],
    precautions: [
      'Requiere supervisión profesional. No es un ejercicio domiciliario independiente.',
      'Indicada específicamente por el kinesiólogo ante estancamiento cercano a los 90° en supino.'
    ],
    stopConditions: [
      'Dolor anterior intenso en zona donante rotuliana (HTH).',
      'Compensación pélvica o lumbar.',
      'Molestia articular aguda.'
    ],
    image: '/exercises/bicicleta-estatica.svg',
    imageAlt: 'Técnica supervisada de flexión asistida en decúbito prono con contracción-relajación de cuádriceps.',
    startImage: '/exercises/bicicleta-estatica-inicio.svg',
    startImageCaption: 'Decúbito prono con asistencia manual del kinesiólogo cercano a 90°.',
    endImage: '/exercises/bicicleta-estatica-final.svg',
    endImageCaption: 'Contracción isométrica (8–15 s) y posterior ganancia suave de flexión.',
    movementCue: 'Técnica supervisada: contracción isométrica (8–15 s) contra resistencia manual y ganancia suave tras relajar.',
    video: null,
    professionalNotes: 'Técnica de uso profesional supervisado. No realizar sin el kinesiólogo.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },

  // =========================================================================
  // SECCIÓN B: MOVILIDAD Y ACTIVACIÓN COMPLEMENTARIA (SEMANAS 1 A 3)
  // =========================================================================
  {
    id: 'extension-pasiva-apoyo-talon',
    title: 'Extensión pasiva con apoyo bajo el talón',
    section: 'complementario',
    category: 'Complementario · Extensión 0°',
    filterCategory: 'movilidad-inicial',
    goal: 'Recuperar la extensión completa a 0°.',
    initialPosition: 'Decúbito supino, con un apoyo debajo del talón o tobillo y la rodilla libre.',
    equipment: 'Rollo de toalla o almohadilla firme bajo el talón.',
    steps: [
      'Acostate en decúbito supino y colocá un rollo o apoyo únicamente debajo del talón o tobillo.',
      'Dejá la parte posterior de la rodilla completamente libre en el aire (sin almohadas debajo).',
      'Relajá la musculatura para que la gravedad favorezca suavemente la extensión completa a 0°.',
      'Mantené la posición según tu tolerancia y la indicación de tu kinesiólogo.'
    ],
    commonMistakes: [
      'Colocar el apoyo o almohada debajo de la rodilla en lugar del talón.',
      'Hacer fuerza brusca o rebotes hacia abajo sobre la rodilla.',
      'Mantener la postura si genera dolor agudo.'
    ],
    precautions: [
      'La rodilla debe quedar libre sin soporte debajo del hueco poplíteo.',
      'Realizar de manera progresiva respetando la tolerancia clínica.'
    ],
    stopConditions: [
      'Dolor intenso posterior o anterior.',
      'Entumecimiento distal.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Extensión pasiva en decúbito supino con apoyo bajo el talón y rodilla libre.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Apoyo colocado bajo el talón dejando la rodilla libre.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Descenso pasivo suave favoreciendo la extensión completa a 0°.',
    movementCue: 'Apoyá solo el talón dejando la rodilla libre para favorecer suavemente la extensión a 0°.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  },
  {
    id: 'contraccion-isometrica-cuadriceps',
    title: 'Contracción isométrica de cuádriceps',
    section: 'complementario',
    category: 'Complementario · Activación',
    filterCategory: 'movilidad-activa',
    goal: 'Mejorar la activación muscular.',
    initialPosition: 'Decúbito supino con la pierna extendida.',
    equipment: 'Camilla o superficie firme (opcional toalla fina bajo hueco poplíteo).',
    steps: [
      'En decúbito supino con la pierna extendida, activá suavemente el muslo (cuádriceps).',
      'Intentá presionar la parte posterior de la rodilla hacia la camilla sin flexionar la articulación.',
      'Sostené la contracción unos segundos manteniendo la respiración normal.',
      'Relajá por completo antes de la siguiente repetición.'
    ],
    commonMistakes: [
      'Flexionar la rodilla o levantar el talón de la camilla.',
      'Contener la respiración (maniobra de Valsalva).',
      'Contraer con dolor rotuliano intenso.'
    ],
    precautions: [
      'Presionar suavemente hacia la camilla sin flexionar la articulación.',
      'Dosificar según tolerancia de la zona donante rotuliana (HTH).'
    ],
    stopConditions: [
      'Dolor punzante en el tendón rotuliano.',
      'Calambre agudo o aumento de inflamación.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Contracción isométrica de cuádriceps presionando la parte posterior de la rodilla hacia la camilla.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Pierna extendida en reposo sobre la camilla.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Activación del cuádriceps presionando la rodilla hacia la camilla.',
    movementCue: 'Contraé el cuádriceps presionando la parte posterior de la rodilla hacia la camilla.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },
  {
    id: 'bombeo-activo-tobillo',
    title: 'Bombeo activo de tobillo',
    section: 'complementario',
    category: 'Complementario · Circulación',
    filterCategory: 'movilidad-inicial',
    goal: 'Mantener la movilidad distal y favorecer el retorno venoso.',
    initialPosition: 'Acostado o sentado con la pierna apoyada.',
    equipment: 'Ninguno (puede combinarse con pierna elevada).',
    steps: [
      'Acostado o sentado con la rodilla cómoda y apoyada.',
      'Llevá lentamente la punta del pie hacia vos (dorsiflexión).',
      'Luego llevá lentamente la punta del pie hacia adelante (flexión plantar).',
      'Alterná el movimiento de forma rítmica y controlada.'
    ],
    commonMistakes: [
      'Mover toda la pierna o rotar la rodilla.',
      'Hacer movimientos rápidos e incompletos.'
    ],
    precautions: [
      'Alternar lentamente dorsiflexión y flexión plantar manteniendo la rodilla estable.',
      'Excelente complemento durante el reposo en las primeras semanas.'
    ],
    stopConditions: [
      'Dolor agudo en pantorrilla.',
      'Molestia inusual.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Bombeo activo de tobillo alternando dorsiflexión y flexión plantar.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Dorsiflexión: punta del pie hacia el cuerpo.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Flexión plantar: punta del pie hacia adelante.',
    movementCue: 'Alterná lentamente dorsiflexión y flexión plantar del tobillo.',
    video: null,
    professionalNotes: 'Realizar según tolerancia, evolución clínica e indicación individualizada.',
    bibliographyIds: ['mgb-protocol', 'nhs-acl']
  },
  {
    id: 'elevacion-pierna-extendida',
    title: 'Elevación de pierna extendida',
    section: 'complementario',
    specialBadge: 'Con autorización y sin déficit extensor',
    category: 'Complementario · Control motor',
    filterCategory: 'progresion-autorizada',
    goal: 'Favorecer el control muscular.',
    initialPosition: 'Decúbito supino (pierna sana flexionada de apoyo, pierna operada extendida).',
    equipment: 'Camilla o colchoneta firme.',
    steps: [
      'En decúbito supino, contraé primero el cuádriceps fijando la rodilla en extensión completa (0°).',
      'Elevá lentamente la pierna unos 25–30 cm manteniendo la rodilla completamente extendida.',
      'Sostené un instante arriba sin que la rodilla se doble.',
      'Descendé lentamente con total control y relajá.'
    ],
    commonMistakes: [
      'Elevar la pierna con la rodilla semi-flexionada (déficit activo o lag extensor).',
      'Subir de un tirón o dejar caer la pierna al bajar.',
      'Realizarlo sin autorización previa del equipo tratante.'
    ],
    precautions: [
      'Incluir únicamente cuando esté autorizado y el paciente pueda mantener la extensión sin déficit activo.',
      'Si la rodilla se flexiona al despegar el talón, suspender y consultar al kinesiólogo.'
    ],
    stopConditions: [
      'Incapacidad de mantener la rodilla trabada en extensión (lag extensor).',
      'Dolor anterior intenso en el tendón rotuliano (injerto HTH).',
      'Aumento de derrame.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Elevación de pierna extendida en decúbito supino manteniendo extensión completa de rodilla.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Contracción previa del cuádriceps con rodilla en extensión completa.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Elevación lenta manteniendo la rodilla completamente extendida.',
    movementCue: 'Contraé el cuádriceps y elevá lentamente la pierna manteniendo la rodilla 100% extendida.',
    video: null,
    professionalNotes: 'Incluir únicamente cuando esté autorizado y sin déficit activo de extensión.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  }
];
