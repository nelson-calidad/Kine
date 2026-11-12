import { Exercise } from '../types/exercise';

export const EXERCISES_DATA: Exercise[] = [
  {
    id: 'deslizamiento-del-talon',
    title: 'Deslizamiento del talón',
    category: 'Movilidad inicial',
    filterCategory: 'movilidad-inicial',
    goal: 'Recuperar progresivamente la flexión de rodilla mediante un movimiento controlado.',
    initialPosition: 'Acostado boca arriba sobre una superficie firme, con las piernas apoyadas.',
    equipment: 'Colchoneta o cama firme.',
    steps: [
      'Deslizá lentamente el talón operado hacia los glúteos.',
      'Permití que la rodilla se flexione de manera gradual.',
      'Llegá solamente hasta el rango indicado por el kinesiólogo.',
      'Volvé despacio a la posición inicial.'
    ],
    commonMistakes: [
      'Hacer rebotes.',
      'Levantar la cadera para compensar.',
      'Tirar con fuerza de la pierna.',
      'Forzar el movimiento si aparece dolor intenso.'
    ],
    precautions: [
      'Conservá siempre el talón apoyado sobre la superficie durante todo el recorrido.',
      'Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo articular.',
      'Aumento importante de derrame o hinchazón.',
      'Aparición de síntomas nuevos.'
    ],
    image: '/exercises/deslizamiento-talon.svg',
    imageAlt: 'Deslizamiento del talón mostrando posición Inicio con rodilla extendida y posición Final con rodilla flexionada conservando el talón apoyado.',
    startImage: '/exercises/deslizamiento-talon-inicio.svg',
    startImageCaption: 'Posición inicial con rodilla extendida y talón apoyado.',
    endImage: '/exercises/deslizamiento-talon-final.svg',
    endImageCaption: 'Posición final con rodilla flexionada conservando el talón apoyado.',
    movementCue: 'Deslizá lentamente el talón hacia los glúteos sin despegarlo de la superficie.',
    video: null,
    professionalNotes: 'Realizá únicamente los ejercicios autorizados por tu kinesiólogo. Las restricciones del cirujano prevalecen sobre cualquier orientación general.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-asistida-con-toalla',
    title: 'Flexión asistida con toalla',
    category: 'Movilidad asistida',
    filterCategory: 'movilidad-asistida',
    goal: 'Facilitar la flexión con asistencia suave.',
    initialPosition: 'Acostado boca arriba, con una toalla o correa no elástica alrededor del pie.',
    equipment: 'Toalla o correa.',
    steps: [
      'Deslizá el talón hacia el cuerpo.',
      'Acompañá suavemente la flexión utilizando la toalla.',
      'No tires con fuerza.',
      'Regresá lentamente.'
    ],
    commonMistakes: [
      'Tracciones bruscas.',
      'Flexión forzada.',
      'Continuar con dolor intenso.',
      'Exceder el rango autorizado.'
    ],
    precautions: [
      'La toalla acompaña suavemente mientras el talón se desliza hacia el cuerpo; no tracciones toda la pierna hacia el pecho.',
      'Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá.'
    ],
    stopConditions: [
      'Dolor intenso en la rodilla o zona anterior del injerto HTH.',
      'Bloqueo articular.',
      'Aumento importante de derrame.',
      'Aparición de síntomas nuevos.'
    ],
    image: '/exercises/flexion-asistida-toalla.svg',
    imageAlt: 'Flexión asistida con toalla mostrando asistencia suave mientras el talón se desliza apoyado hacia el cuerpo.',
    startImage: '/exercises/flexion-asistida-toalla-inicio.svg',
    startImageCaption: 'Acostado boca arriba con toalla o correa no elástica en el pie.',
    endImage: '/exercises/flexion-asistida-toalla-final.svg',
    endImageCaption: 'Asistencia suave mientras el talón se desliza hacia el cuerpo.',
    movementCue: 'Acompañá suavemente con la toalla sin hacer tracciones bruscas.',
    video: null,
    professionalNotes: 'Realizá únicamente los ejercicios autorizados por tu kinesiólogo. Las restricciones del cirujano prevalecen sobre cualquier orientación general.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  },
  {
    id: 'deslizamiento-del-pie-en-pared',
    title: 'Deslizamiento en pared',
    category: 'Progresión autorizada',
    filterCategory: 'progresion-autorizada',
    goal: 'Favorecer la flexión controlada mediante el deslizamiento del pie en una pared.',
    initialPosition: 'Acostado boca arriba, con el pie apoyado en la pared.',
    equipment: 'Colchoneta y pared.',
    steps: [
      'Dejá descender lentamente el pie por la pared.',
      'Permití que la rodilla se flexione gradualmente.',
      'Controlá el descenso con ayuda del otro miembro si es necesario.',
      'Regresá suavemente.'
    ],
    commonMistakes: [
      'Dejar caer la pierna.',
      'Forzar el rango.',
      'Perder el control.',
      'Realizarlo sin autorización.'
    ],
    precautions: [
      'Controlá en todo momento la velocidad del descenso con ayuda de la otra pierna si lo necesitás.',
      'Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo o pérdida de control del movimiento.',
      'Aumento importante de derrame.',
      'Aparición de síntomas nuevos.'
    ],
    image: '/exercises/deslizamiento-pie-pared.svg',
    imageAlt: 'Deslizamiento en pared mostrando flexión gradual de la rodilla mientras el pie se desliza lentamente hacia abajo por la pared.',
    startImage: '/exercises/deslizamiento-pie-pared-inicio.svg',
    startImageCaption: 'Acostado boca arriba con el pie apoyado en la pared.',
    endImage: '/exercises/deslizamiento-pie-pared-final.svg',
    endImageCaption: 'Flexión gradual de rodilla mientras el pie desciende lentamente.',
    movementCue: 'Dejá descender el pie muy despacio por la pared controlando el rango.',
    video: null,
    professionalNotes: 'Realizá únicamente los ejercicios autorizados por tu kinesiólogo. Las restricciones del cirujano prevalecen sobre cualquier orientación general.',
    bibliographyIds: ['mgb-protocol', 'nhs-acl']
  },
  {
    id: 'flexion-activa-en-sedestacion',
    title: 'Flexión activa en sedestación',
    category: 'Movilidad activa',
    filterCategory: 'movilidad-activa',
    goal: 'Mejorar la flexión en posición sentada.',
    initialPosition: 'Sentado en una silla firme, con los pies apoyados.',
    equipment: 'Silla estable.',
    steps: [
      'Deslizá el pie operado hacia atrás, debajo de la silla.',
      'Flexioná lentamente la rodilla.',
      'Mantenete dentro del rango indicado.',
      'Llevá el pie nuevamente hacia adelante.'
    ],
    commonMistakes: [
      'Movimientos bruscos.',
      'Utilizar una silla inestable.',
      'Forzar el movimiento.'
    ],
    precautions: [
      'Recordá que para flexionar la rodilla el pie se desplaza HACIA ATRÁS por debajo de la silla (no hacia arriba en extensión).',
      'Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo articular.',
      'Aumento importante de derrame.',
      'Aparición de síntomas nuevos.'
    ],
    image: '/exercises/flexion-activa-sedestacion.svg',
    imageAlt: 'Flexión activa en sedestación mostrando el pie desplazándose HACIA ATRÁS por debajo de la silla para flexionar la rodilla.',
    startImage: '/exercises/flexion-activa-sedestacion-inicio.svg',
    startImageCaption: 'Sentado en una silla firme con los pies apoyados.',
    endImage: '/exercises/flexion-activa-sedestacion-final.svg',
    endImageCaption: 'El pie operado se desplaza HACIA ATRÁS debajo de la silla flexionando la rodilla.',
    movementCue: 'Deslizá el pie operado HACIA ATRÁS por debajo de la silla.',
    video: null,
    professionalNotes: 'Realizá únicamente los ejercicios autorizados por tu kinesiólogo. Las restricciones del cirujano prevalecen sobre cualquier orientación general.',
    bibliographyIds: ['kotsifaki-2023', 'nhs-acl']
  },
  {
    id: 'bicicleta-estatica-sin-resistencia',
    title: 'Bicicleta estática',
    category: 'Progresión autorizada',
    filterCategory: 'progresion-autorizada',
    goal: 'Favorecer la movilidad cíclica y controlada de la rodilla.',
    initialPosition: 'Sentado sobre la bicicleta fija con una posición corporal correcta y los pies sobre los pedales.',
    equipment: 'Bicicleta fija.',
    steps: [
      'Ajustá correctamente el asiento.',
      'Colocá los pies sobre los pedales.',
      'Comenzá con balanceos parciales si corresponde.',
      'Progresá a vueltas completas cuando puedas realizarlas sin forzar.',
      'No agregues resistencia sin autorización.'
    ],
    commonMistakes: [
      'Pedaleo forzado.',
      'Resistencia elevada.',
      'Dolor intenso.',
      'Iniciar este ejercicio sin indicación.'
    ],
    precautions: [
      'Realizar solamente si fue autorizado por el kinesiólogo y existe suficiente movilidad.',
      'Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá.'
    ],
    stopConditions: [
      'Dolor intenso.',
      'Bloqueo al intentar completar el giro.',
      'Aumento importante de derrame.',
      'Aparición de síntomas nuevos.'
    ],
    image: '/exercises/bicicleta-estatica.svg',
    imageAlt: 'Paciente sobre bicicleta fija con una posición corporal correcta realizando movilidad cíclica controlada sin resistencia.',
    startImage: '/exercises/bicicleta-estatica-inicio.svg',
    startImageCaption: 'Posición inicial correcta sobre bicicleta fija con balanceos suaves.',
    endImage: '/exercises/bicicleta-estatica-final.svg',
    endImageCaption: 'Movilidad cíclica y controlada sin resistencia.',
    movementCue: 'Iniciá con balanceos suaves y progresá a giros sin resistencia solo si podés hacerlo sin forzar.',
    video: null,
    professionalNotes: 'Realizá únicamente los ejercicios autorizados por tu kinesiólogo. Las restricciones del cirujano prevalecen sobre cualquier orientación general.',
    bibliographyIds: ['kotsifaki-2023', 'mgb-protocol']
  }
];
