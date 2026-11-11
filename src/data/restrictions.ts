import { RestrictionItem } from '../types/exercise';

export const RESTRICTIONS_DATA: RestrictionItem[] = [
  {
    id: 'no-forzar-flexion',
    title: 'No forzar la flexión',
    whyImportant: 'Doblar la rodilla más allá del rango indicado o mediante tirones bruscos puede irritar la articulación, aumentar el derrame y sobrecargar los tejidos en cicatrización.',
    contextNote: 'Precaución de esta etapa: la movilidad se gana de manera gradual y controlada.'
  },
  {
    id: 'no-girar-bruscamente',
    title: 'No girar bruscamente sobre la pierna operada',
    whyImportant: 'Los giros o pivotes con el pie apoyado generan fuerzas de torsión sobre el injerto mientras se encuentra en proceso de integración biológica en los túneles óseos.',
    contextNote: 'Al cambiar de dirección, mové primero los pies dando pequeños pasos acompañados por las muletas.'
  },
  {
    id: 'no-saltar-ni-correr',
    title: 'No saltar ni correr en la fase inicial',
    whyImportant: 'El impacto repetitivo requiere control neuromuscular, fuerza muscular y maduración del injerto que aún no están presentes en el posoperatorio temprano.',
    contextNote: 'Estas actividades pertenecen a fases avanzadas y requieren evaluación funcional previa.'
  },
  {
    id: 'no-sentadillas-profundas',
    title: 'No realizar sentadillas profundas sin autorización',
    whyImportant: 'En la etapa temprana y con autoinjerto HTH rotuliano, la flexión profunda con carga corporal aumenta la tensión sobre el tendón rotuliano y la articulación femororrotuliana.',
    contextNote: 'Todo ejercicio de carga en cadena cerrada se incorpora progresivamente bajo supervisión kinésica.'
  },
  {
    id: 'no-agregar-peso',
    title: 'No agregar peso, bandas o resistencia por tu cuenta',
    whyImportant: 'Colocar tobilleras, bandas elásticas o cargas no prescriptas puede provocar dolor anterior de rodilla, inflamación o tensión excesiva sobre el injerto.',
    contextNote: 'Utilizá únicamente los elementos y variantes indicados por tu profesional.'
  },
  {
    id: 'no-dejar-muletas-antes',
    title: 'No dejar las muletas antes de tiempo',
    whyImportant: 'Caminar sin las ayudas indicadas cuando aún falta extensión completa o control del cuádriceps genera renguera, sobrecarga articular y riesgo de tropiezos.',
    contextNote: 'El retiro de las muletas se realiza cuando el equipo tratante confirma apoyo, control muscular y marcha segura.'
  },
  {
    id: 'no-retirar-rodillera',
    title: 'No retirar la rodillera sin indicación',
    whyImportant: 'La férula o rodillera protege la articulación frente a movimientos involuntarios o límites de rango específicos según tu cirugía.',
    contextNote: 'Respetá los horarios y situaciones de uso indicados para caminar y descansar.'
  },
  {
    id: 'no-ignorar-dolor-derrame',
    title: 'No ignorar aumento de dolor o derrame',
    whyImportant: 'Si la rodilla se hincha más, levanta temperatura o duele de forma persistente tras los ejercicios, es una señal de que la carga debe revisarse.',
    contextNote: 'Informá estos cambios a tu kinesiólogo o traumatólogo para adecuar el plan.'
  },
  {
    id: 'no-mantener-rodilla-flexionada',
    title: 'No mantener la rodilla flexionada durante períodos prolongados',
    whyImportant: 'Permanecer mucho tiempo con la rodilla doblada (por ejemplo, con una almohada debajo de la rodilla) dificulta recuperar la extensión completa necesaria para caminar bien.',
    contextNote: 'Alterná posturas seguras y respetá las pautas para mantener la extensión.'
  },
  {
    id: 'no-conducir-sin-autorizacion',
    title: 'No conducir hasta que exista autorización y capacidad segura para frenar',
    whyImportant: 'Manejar requiere tiempo de reacción rápido, movilidad suficiente y fuerza segura en el miembro inferior sin dolor ni uso de inmovilizador.',
    contextNote: 'Consultá explícitamente con tu médico traumatólogo antes de retomar la conducción.'
  },
  {
    id: 'no-comparar-evolucion',
    title: 'No comparar tu evolución con la de otros pacientes',
    whyImportant: 'Cada cirugía es única: el tipo de injerto (HTH), el estado previo y las lesiones asociadas (como meniscos o cartílago) determinan tiempos y pautas diferentes.',
    contextNote: 'Tu referencia válida es siempre el seguimiento con tu propio equipo tratante.'
  }
];

export const URGENT_ALERTS_DATA: string[] = [
  'Fiebre con empeoramiento de la herida o rodilla.',
  'Secreción purulenta o enrojecimiento progresivo.',
  'Dolor intenso no controlado.',
  'Dolor e hinchazón nueva de una pantorrilla.',
  'Pie frío, muy pálido o alteraciones importantes de sensibilidad.',
  'Pérdida brusca de movilidad o bloqueo significativo.'
];

export const EMERGENCY_ALERTS_DATA: string[] = [
  'Falta de aire repentina.',
  'Dolor en el pecho.',
  'Desmayo o dificultad respiratoria intensa.'
];
