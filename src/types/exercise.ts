export type ExerciseFilterCategory =
  | 'todos'
  | 'movilidad-inicial'
  | 'movilidad-asistida'
  | 'movilidad-activa'
  | 'progresion-autorizada';

export interface ExerciseDemoFrame {
  stepNumber: number;
  title: string;
  description: string;
  keyCue: string;
}

export interface Exercise {
  id: string;
  title: string;
  section?: 'flexion' | 'complementario';
  isSupervisedOnly?: boolean;
  category: string;
  filterCategory: Exclude<ExerciseFilterCategory, 'todos'>;
  goal: string;
  equipment: string;
  initialPosition: string;
  steps: string[];
  commonMistakes: string[];
  precautions: string[];
  stopConditions: string[];
  specialBadge?: string;
  whenToPerform?: string;
  image: string;
  imageAlt: string;
  startImage: string;
  startImageCaption: string;
  endImage: string;
  endImageCaption: string;
  movementCue: string;
  video: string | null;
  demoSequence?: ExerciseDemoFrame[];
  professionalNotes: string;
  bibliographyIds: string[];
}

export interface ProfessionalIndication {
  exerciseId: string;
  series: string;
  repetitions: string;
  frequency: string;
  authorizedRange: string;
  observations: string;
  indicationDate: string;
}

export type SwellingStatus = 'menor' | 'igual' | 'mayor';
export type ExercisesDoneStatus = 'si' | 'parcialmente' | 'no';
export type GeneralFeelingStatus = 'mejor' | 'igual' | 'peor';

export interface TrackingEntry {
  id: string;
  date: string;
  painBefore: number;
  painAfter: number;
  swelling: SwellingStatus;
  exercisesDone: ExercisesDoneStatus;
  generalFeeling: GeneralFeelingStatus;
  observations: string;
}

export interface CareSectionItem {
  id: string;
  letter: string;
  title: string;
  summary: string;
  iconName: string;
  points: string[];
  highlightNote?: string;
}

export interface RestrictionItem {
  id: string;
  title: string;
  whyImportant: string;
  contextNote: string;
}

export interface DailyActivityItem {
  id: string;
  title: string;
  summary: string;
  iconName: string;
  recommendations: string[];
  surgicalTeamNote: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'movilidad' | 'cuidados' | 'cirugia' | 'evolucion';
}

export interface ScientificSource {
  id: string;
  authors: string;
  title: string;
  publication: string;
  year: string;
  url: string;
  doi?: string;
  role: 'Fuente principal' | 'Fuente complementaria' | 'Recurso educativo para pacientes';
  summary: string;
}
