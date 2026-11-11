import { CareSectionItem, DailyActivityItem } from '../types/exercise';

export const CARE_SECTIONS_DATA: CareSectionItem[] = [
  {
    id: 'cuidado-herida',
    letter: 'A',
    title: 'Cuidado de la herida',
    summary: 'Protección e higiene de las incisiones quirúrgicas y de la zona donante rotuliana.',
    iconName: 'ShieldCheck',
    points: [
      'Seguí las indicaciones recibidas para apósitos.',
      'Mantené la herida limpia y protegida.',
      'No retires puntos ni apósitos especiales por tu cuenta.',
      'No coloques productos sin indicación.',
      'Consultá ante secreción o enrojecimiento progresivo.'
    ],
    highlightNote: 'En la reconstrucción con autoinjerto HTH rotuliano existe una incisión en la cara anterior de la rodilla que requiere los mismos cuidados de higiene y protección.'
  },
  {
    id: 'dolor-hinchazon',
    letter: 'B',
    title: 'Dolor e hinchazón',
    summary: 'Medidas cotidianas para controlar el derrame articular y las molestias posoperatorias.',
    iconName: 'ThermometerSnowflake',
    points: [
      'Respetá la medicación prescripta.',
      'Utilizá frío solamente si está indicado.',
      'Protegé siempre la piel del contacto directo con el hielo.',
      'Descansá y elevá la pierna según indicación.',
      'Observá si los síntomas aumentan después de ejercitarte.'
    ],
    highlightNote: 'Controlar la hinchazón facilita que la rodilla pueda doblarse y estirarse con menor resistencia y mayor comodidad.'
  },
  {
    id: 'posicionamiento',
    letter: 'C',
    title: 'Posicionamiento',
    summary: 'Cómo ubicar la pierna durante el reposo para cuidar tanto la extensión como la flexión.',
    iconName: 'AlignHorizontalSpaceAround',
    points: [
      'Evitá permanecer períodos prolongados con la rodilla doblada.',
      'Respetá las indicaciones para recuperar extensión.',
      'No coloques almohadas directamente bajo la rodilla durante períodos prolongados salvo indicación particular.',
      'Cambiá de posición de forma segura.'
    ],
    highlightNote: 'Si te indicaron elevar la pierna, el apoyo suele ubicarse bajo el talón y la pantorrilla, dejando la rodilla recta.'
  },
  {
    id: 'muletas-rodillera',
    letter: 'D',
    title: 'Muletas y rodillera',
    summary: 'Uso seguro de los elementos de protección y descarga del miembro operado.',
    iconName: 'Accessibility',
    points: [
      'Utilizá las ayudas según indicación.',
      'Respetá el apoyo permitido.',
      'No retires ni modifiques la rodillera por cuenta propia.',
      'Consultá antes de abandonar las muletas.'
    ],
    highlightNote: 'Si hubo una sutura meniscal o procedimiento asociado, el apoyo y los grados permitidos en la rodillera pueden tener restricciones específicas.'
  },
  {
    id: 'descanso',
    letter: 'E',
    title: 'Descanso',
    summary: 'Recomendaciones para dormir y realizar cambios posturales con tranquilidad.',
    iconName: 'Moon',
    points: [
      'Buscá una postura cómoda.',
      'Respetá férulas y restricciones.',
      'Evitá movimientos bruscos durante transferencias.'
    ],
    highlightNote: 'Tomate unos segundos antes de incorporarte de la cama o del sillón para organizar el movimiento con seguridad.'
  },
  {
    id: 'higiene',
    letter: 'F',
    title: 'Higiene',
    summary: 'Prevención de resbalones y protección del vendaje durante el aseo diario.',
    iconName: 'Droplets',
    points: [
      'Respetá las instrucciones de cuidado de la herida.',
      'Utilizá superficies antideslizantes.',
      'Solicitá ayuda cuando sea necesario.'
    ],
    highlightNote: 'Consultá a tu equipo médico cuándo y cómo podés mojar la zona operada o cómo cubrirla de forma impermeable.'
  }
];

export const DAILY_ACTIVITIES_DATA: DailyActivityItem[] = [
  {
    id: 'levantarse-cama',
    title: 'Levantarse de la cama',
    summary: 'Transición controlada desde la posición acostada hacia el borde de la cama.',
    iconName: 'Bed',
    recommendations: [
      'Movimientos lentos.',
      'Ayudarse con las manos cuando corresponda.',
      'Sostener el miembro operado si es necesario.',
      'Respetar indicaciones de rodillera.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  },
  {
    id: 'sentarse',
    title: 'Sentarse',
    summary: 'Elección del asiento y control del descenso para cuidar la zona operada.',
    iconName: 'Armchair',
    recommendations: [
      'Utilizar silla firme.',
      'Controlar el descenso.',
      'Evitar flexión más allá de la autorizada.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  },
  {
    id: 'caminar',
    title: 'Caminar',
    summary: 'Desplazamiento seguro dentro del hogar utilizando las ayudas indicadas.',
    iconName: 'Footprints',
    recommendations: [
      'Utilizar muletas según indicación.',
      'Respetar apoyo prescripto.',
      'No retirar ayudas por cuenta propia.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  },
  {
    id: 'escaleras',
    title: 'Escaleras',
    summary: 'Subida y bajada de escalones únicamente con técnica practicada y autorizada.',
    iconName: 'ArrowUpDown',
    recommendations: [
      'Practicar previamente con el kinesiólogo.',
      'Usar pasamanos si corresponde.',
      'Seguir secuencia enseñada según el lado operado y las restricciones.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  },
  {
    id: 'dormir',
    title: 'Dormir',
    summary: 'Posición nocturna y uso de inmovilizador según prescripción.',
    iconName: 'MoonStar',
    recommendations: [
      'Respetar inmovilizador o rodillera.',
      'Evitar posturas que mantengan flexión prolongada cuando se busca recuperar extensión.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  },
  {
    id: 'banarse',
    title: 'Bañarse',
    summary: 'Seguridad en el cuarto de baño y cuidado de las incisiones.',
    iconName: 'Bath',
    recommendations: [
      'Respetar cuidado de herida.',
      'Evitar superficies resbaladizas.',
      'Solicitar ayuda si hay inestabilidad.'
    ],
    surgicalTeamNote: 'Las instrucciones particulares de tu equipo quirúrgico y kinésico prevalecen siempre sobre cualquier pauta general.'
  }
];
