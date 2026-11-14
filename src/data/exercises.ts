import { Exercise } from '../types/exercise';

export const EXERCISES_DATA: Exercise[] = [
  // =========================================================================
  // SECCIÓN A: RECUPERACIÓN DE LA FLEXIÓN (5 EJERCICIOS DEL BANNER ACADÉMICO)
  // =========================================================================
  {
    id: 'deslizamiento-del-talon',
    title: 'Deslizamiento del talón',
    section: 'flexion',
    category: 'Movilidad activa',
    filterCategory: 'movilidad-inicial',
    goal: 'Recuperar la flexión activa.',
    initialPosition: 'Decúbito supino.',
    equipment: 'Camilla o superficie firme.',
    steps: [
      'Ubicarse en decúbito supino con ambas piernas extendidas y la pelvis estable sobre la camilla.',
      'Deslizar lentamente el talón hacia los glúteos, flexionando progresivamente la rodilla en el plano sagital.',
      'Mantener el talón en contacto continuo con la superficie sin despegar toda la pierna ni elevar la pelvis.',
      'Retornar de manera controlada a la posición inicial según tolerancia.'
    ],
    commonMistakes: [
      'Realizar movimientos bruscos o rebotes.',
      'Elevar toda la pierna o compensar levantando la pelvis.',
      'Forzar el rango ante dolor intenso.'
    ],
    precautions: [
      'Evitar dolor intenso y compensaciones.',
      'Progresar según tolerancia clínica e indicación profesional.'
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
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-asistida-con-toalla',
    title: 'Flexión autoasistida con toalla o cincha',
    section: 'flexion',
    category: 'Movilidad autoasistida',
    filterCategory: 'movilidad-asistida',
    goal: 'Facilitar la movilidad mediante autoasistencia.',
    initialPosition: 'Decúbito supino.',
    equipment: 'Toalla o cincha terapéutica.',
    steps: [
      'En decúbito supino, colocar una toalla o cincha alrededor del pie de la pierna operada sujetando ambos extremos con las manos.',
      'Deslizar el talón hacia los glúteos acompañando suavemente la flexión de rodilla mediante los brazos.',
      'Mantener la coordinación entre la asistencia manual y el deslizamiento del talón sin realizar tirones.',
      'Regresar suavemente a la posición inicial.'
    ],
    commonMistakes: [
      'Realizar tracciones bruscas con los brazos.',
      'Despegar el talón o elevar la pelvis de la camilla.',
      'Forzar más allá del rango tolerado.'
    ],
    precautions: [
      'No realizar tracciones bruscas.',
      'Acompañar el movimiento de forma progresiva respetando la tolerancia.'
    ],
    stopConditions: [
      'Dolor intenso en la rodilla o zona dadora rotuliana (HTH).',
      'Bloqueo articular.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/flexion-asistida-toalla.svg',
    imageAlt: 'Flexión autoasistida con toalla o cincha en decúbito supino.',
    startImage: '/exercises/flexion-asistida-toalla-inicio.svg',
    startImageCaption: 'Decúbito supino con toalla o cincha colocada en el pie.',
    endImage: '/exercises/flexion-asistida-toalla-final.svg',
    endImageCaption: 'Autoasistencia suave acompañando la flexión de rodilla.',
    movementCue: 'Utilizá una toalla o cincha para acompañar suavemente la flexión de rodilla sin tracciones bruscas.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },
  {
    id: 'flexion-autoasistida-pelota-mani',
    title: 'Flexión autoasistida con pelota maní',
    section: 'flexion',
    category: 'Movilidad autoasistida · Apoyo móvil',
    filterCategory: 'movilidad-asistida',
    goal: 'Facilitar la flexión con un apoyo móvil.',
    initialPosition: 'Decúbito supino.',
    equipment: 'Pelota maní terapéutica grande.',
    steps: [
      'En decúbito supino, apoyar la parte inferior de las piernas sobre una pelota maní terapéutica grande colocada transversalmente respecto al cuerpo.',
      'Flexionar las rodillas acompañando el desplazamiento rodante de la pelota hacia el cuerpo.',
      'Mantener el control de la pelvis y el tronco apoyados sobre la superficie.',
      'Extender lentamente acompañando el retorno de la pelota.'
    ],
    commonMistakes: [
      'Perder el control de la pelvis o despegar la zona lumbar.',
      'Utilizar una pelota inestable o de tamaño inadecuado.',
      'Realizar desplazamientos laterales o sin control.'
    ],
    precautions: [
      'Mantener el control de la pelvis y utilizar una pelota de tamaño adecuado.',
      'Evitar dolor intenso o movimientos rápidos.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Inestabilidad del accesorio.',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/deslizamiento-pie-pared.svg',
    imageAlt: 'Flexión autoasistida en decúbito supino con las piernas apoyadas sobre una pelota maní transversal.',
    startImage: '/exercises/deslizamiento-pie-pared-inicio.svg',
    startImageCaption: 'Piernas apoyadas sobre pelota maní terapéutica colocada transversalmente.',
    endImage: '/exercises/deslizamiento-pie-pared-final.svg',
    endImageCaption: 'Flexión de rodillas acompañando el desplazamiento de la pelota maní.',
    movementCue: 'Apoyá la parte inferior de las piernas sobre la pelota maní transversal y flexioná acompañando su rodamiento.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-activa-en-sedestacion',
    title: 'Flexión autoasistida en sedestación',
    section: 'flexion',
    category: 'Movilidad autoasistida',
    filterCategory: 'movilidad-asistida',
    goal: 'Mejorar la flexión en sedestación.',
    initialPosition: 'Sentado al borde de una camilla o silla alta.',
    equipment: 'Camilla o silla alta estable.',
    steps: [
      'Sentarse al borde de una camilla o silla alta manteniendo ambos glúteos y muslos bien apoyados.',
      'Desplazar hacia atrás el pie de la pierna operada flexionando progresivamente la rodilla.',
      'Utilizar el pie sano por delante del tobillo operado para asistir suavemente el movimiento hacia atrás.',
      'Regresar de forma controlada sin elevar la pelvis ni inclinar el tronco.'
    ],
    commonMistakes: [
      'Elevar la pelvis o despegar los glúteos del asiento.',
      'Empujar bruscamente con el miembro sano.',
      'Compensar inclinando excesivamente el tronco.'
    ],
    precautions: [
      'Mantener ambos glúteos apoyados y evitar elevar la pelvis.',
      'Asistir suavemente con el pie sano sin generar dolor intenso.'
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
    movementCue: 'Desplazá hacia atrás el pie de la pierna operada utilizando el pie sano para asistir el movimiento.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['kotsifaki-2023', 'nhs-acl']
  },
  {
    id: 'flexion-asistida-prono',
    title: 'Flexión asistida en decúbito prono',
    section: 'flexion',
    isSupervisedOnly: true,
    specialBadge: 'Uso profesional supervisado',
    category: 'Movilización profesional asistida',
    filterCategory: 'progresion-autorizada',
    goal: 'Facilitar la ganancia de rango cuando existe un estancamiento alrededor de los 90° en supino.',
    initialPosition: 'Decúbito prono.',
    equipment: 'Camilla clínica y asistencia manual del kinesiólogo.',
    steps: [
      'Fase A (Posición inicial): Paciente en decúbito prono con pelvis apoyada; el kinesiólogo de pie junto a la camilla sostiene el segmento distal de la pierna y lleva suavemente la rodilla hacia un rango de flexión tolerable.',
      'Fase B (Contracción isométrica): El profesional solicita una contracción isométrica del cuádriceps (intentando extender la rodilla) contra resistencia manual durante 8 a 15 segundos, sin movimiento articular amplio.',
      'Fase C (Relajación): El paciente relaja la musculatura mientras el kinesiólogo mantiene un contacto estable sin tirones bruscos.',
      'Fase D (Ganancia de flexión): Después de la relajación, el profesional acompaña suavemente la ganancia de flexión manteniendo la pelvis estable.'
    ],
    commonMistakes: [
      'Intentar realizar esta técnica de forma domiciliaria sin supervisión.',
      'Despegar la pelvis de la camilla o compensar con la columna lumbar.',
      'Forzar la articulación sin respetar la fase de relajación.'
    ],
    precautions: [
      'Requiere supervisión profesional. No es un ejercicio domiciliario independiente.',
      'Indicada por el kinesiólogo cuando existe estancamiento alrededor de los 90° en supino.'
    ],
    stopConditions: [
      'Dolor intenso en la zona dadora rotuliana (HTH).',
      'Compensación pélvica o lumbar.',
      'Molestia articular aguda.'
    ],
    image: '/exercises/bicicleta-estatica.svg',
    imageAlt: 'Técnica supervisada de flexión asistida en decúbito prono con contracción-relajación de cuádriceps.',
    startImage: '/exercises/bicicleta-estatica-inicio.svg',
    startImageCaption: 'Decúbito prono con contacto manual del kinesiólogo en el segmento distal.',
    endImage: '/exercises/bicicleta-estatica-final.svg',
    endImageCaption: 'Contracción isométrica (8–15 s), relajación y posterior ganancia suave de flexión.',
    movementCue: 'El kinesiólogo solicita contracción isométrica (8–15 s) contra resistencia manual y, tras relajar, acompaña la ganancia de flexión.',
    video: null,
    professionalNotes: 'Técnica exclusiva de uso profesional supervisado. No es un ejercicio domiciliario independiente.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },

  // =========================================================================
  // SECCIÓN B: MOVILIDAD Y ACTIVACIÓN COMPLEMENTARIA (SEMANAS 1 A 3)
  // =========================================================================
  {
    id: 'extension-pasiva-apoyo-talon',
    title: 'Extensión pasiva con apoyo bajo el talón',
    section: 'complementario',
    category: 'Movilización pasiva · Extensión 0°',
    filterCategory: 'movilidad-inicial',
    goal: 'Recuperar la extensión completa a 0°.',
    initialPosition: 'Decúbito supino, con un apoyo debajo del talón o tobillo y la rodilla libre.',
    equipment: 'Rollo o apoyo firme bajo el talón o tobillo.',
    steps: [
      'Ubicarse en decúbito supino colocando un apoyo únicamente debajo del talón o tobillo.',
      'Dejar la rodilla completamente libre (sin colocar almohadas debajo del hueco poplíteo).',
      'Relajar la musculatura para favorecer suavemente la extensión completa a 0°.',
      'Mantener la posición según tolerancia e indicación profesional.'
    ],
    commonMistakes: [
      'Colocar una almohada debajo de la rodilla en lugar del talón.',
      'Forzar bruscamente hacia la hiperextensión.',
      'Mantener la postura ante dolor intenso.'
    ],
    precautions: [
      'Mantener la rodilla libre sin soporte bajo el hueco poplíteo y evitar hiperextensión forzada.',
      'La recuperación de la extensión completa a 0° es una prioridad paralela en esta fase.'
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
    endImageCaption: 'Extensión pasiva suave orientada a alcanzar los 0°.',
    movementCue: 'Apoyo debajo del talón o tobillo y rodilla libre, favoreciendo suavemente la extensión a 0°.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  },
  {
    id: 'contraccion-isometrica-cuadriceps',
    title: 'Contracción isométrica de cuádriceps',
    section: 'complementario',
    category: 'Contracción isométrica',
    filterCategory: 'movilidad-activa',
    goal: 'Mejorar la activación muscular.',
    initialPosition: 'Decúbito supino con la pierna extendida.',
    equipment: 'Camilla o superficie firme.',
    steps: [
      'Ubicarse en decúbito supino con la pierna apoyada y extendida.',
      'Contraer el cuádriceps intentando presionar la parte posterior de la rodilla hacia la camilla, sin flexionar la articulación.',
      'Mantener la contracción sin despegar el talón ni simular una elevación completa de pierna.',
      'Relajar suavemente entre repeticiones según tolerancia.'
    ],
    commonMistakes: [
      'Flexionar la rodilla o despegar toda la pierna de la camilla.',
      'Contener la respiración durante la activación.',
      'Contraer generando dolor agudo en el sitio dador rotuliano.'
    ],
    precautions: [
      'Presionar suavemente la parte posterior de la rodilla hacia la camilla sin flexionar la articulación.',
      'Dosificar según tolerancia de la zona dadora rotuliana (HTH).'
    ],
    stopConditions: [
      'Dolor punzante en el tendón rotuliano.',
      'Aumento de derrame o inflamación.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Contracción isométrica de cuádriceps presionando la parte posterior de la rodilla hacia la camilla.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Pierna extendida y apoyada sobre la camilla.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Contracción del cuádriceps presionando el hueco poplíteo hacia la camilla.',
    movementCue: 'Contraé el cuádriceps intentando presionar la parte posterior de la rodilla hacia la camilla, sin flexionar.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },
  {
    id: 'bombeo-activo-tobillo',
    title: 'Bombeo activo de tobillo',
    section: 'complementario',
    category: 'Movilidad activa distal',
    filterCategory: 'movilidad-inicial',
    goal: 'Mantener la movilidad distal y favorecer el retorno venoso.',
    initialPosition: 'Acostado o sentado.',
    equipment: 'Camilla o superficie cómoda.',
    steps: [
      'Ubicarse acostado o sentado con la pierna apoyada y la rodilla estable.',
      'Llevar lentamente el tobillo hacia dorsiflexión (punta del pie hacia el cuerpo).',
      'Alternar lentamente hacia flexión plantar (punta del pie hacia adelante).',
      'Mantener el movimiento centrado en el tobillo sin mover toda la pierna.'
    ],
    commonMistakes: [
      'Mover o rotar toda la pierna en lugar del tobillo.',
      'Realizar sacudidas rápidas e incompletas.'
    ],
    precautions: [
      'Alternar lentamente dorsiflexión y flexión plantar manteniendo la rodilla estable.',
      'Realizar de forma rítmica y sin dolor.'
    ],
    stopConditions: [
      'Dolor agudo en pantorrilla.',
      'Molestia inusual.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Bombeo activo de tobillo alternando dorsiflexión y flexión plantar.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Dorsiflexión lenta del tobillo con rodilla estable.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Flexión plantar lenta del tobillo.',
    movementCue: 'Alterná lentamente dorsiflexión y flexión plantar del tobillo manteniendo la rodilla estable.',
    video: null,
    professionalNotes: 'La selección y progresión dependen de la respuesta clínica y las pautas quirúrgicas.',
    bibliographyIds: ['mgb-protocol', 'nhs-acl']
  },
  {
    id: 'elevacion-pierna-extendida',
    title: 'Elevación de pierna extendida',
    section: 'complementario',
    specialBadge: 'Según autorización y sin déficit extensor',
    category: 'Control muscular · Con autorización',
    filterCategory: 'progresion-autorizada',
    goal: 'Favorecer el control muscular.',
    initialPosition: 'Decúbito supino.',
    equipment: 'Camilla o superficie firme.',
    steps: [
      'Ubicarse en decúbito supino (con la pierna sana flexionada de apoyo para estabilidad pélvica).',
      'Contraer previamente el cuádriceps fijando la rodilla en extensión completa.',
      'Elevar lentamente la pierna mediante flexión de cadera manteniendo la rodilla completamente extendida.',
      'Descender lentamente de manera controlada sin perder la extensión activa.'
    ],
    commonMistakes: [
      'Elevar la pierna con la rodilla flexionada (déficit activo de extensión o lag extensor).',
      'Realizar el ejercicio sin autorización profesional o sin control muscular adecuado.',
      'Subir o bajar de forma brusca.'
    ],
    precautions: [
      'Incluir únicamente cuando esté autorizado y el paciente pueda mantener la extensión sin déficit activo.',
      'Suspender si se observa pérdida de la extensión completa durante la elevación.'
    ],
    stopConditions: [
      'Déficit de extensión activa durante el movimiento.',
      'Dolor intenso en la zona anterior de la rodilla (injerto HTH).',
      'Aumento importante de derrame.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Elevación de pierna extendida en decúbito supino manteniendo la rodilla en extensión.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Contracción del cuádriceps con rodilla mantenida en extensión.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Elevación mediante flexión de cadera sin déficit de extensión activa.',
    movementCue: 'Contraé el cuádriceps y elevá lentamente la pierna manteniendo la rodilla completamente extendida.',
    video: null,
    professionalNotes: 'Incluir únicamente cuando esté autorizado y el paciente pueda mantener la extensión sin déficit activo.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  }
];
