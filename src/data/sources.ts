import { ScientificSource } from '../types/exercise';

export const SCIENTIFIC_SOURCES_DATA: ScientificSource[] = [
  {
    id: 'kotsifaki-2023',
    authors: 'Kotsifaki R, Korakakis V, King E, Barbosa O, Maree D, Panteli C, et al.',
    title: 'Aspetar clinical practice guideline on rehabilitation after anterior cruciate ligament reconstruction',
    publication: 'British Journal of Sports Medicine. 2023;57(9):500-514.',
    year: '2023',
    url: 'https://doi.org/10.1136/bjsports-2022-106158',
    doi: '10.1136/bjsports-2022-106158',
    role: 'Fuente principal',
    summary: 'Guía de práctica clínica internacional basada en la evidencia para la rehabilitación posterior a la reconstrucción del ligamento cruzado anterior, incluyendo progresión por criterios clínicos, control de derrame, recuperación de movilidad y activación muscular.'
  },
  {
    id: 'mgb-protocol',
    authors: 'Mass General Brigham — Sports Medicine Rehabilitation',
    title: 'Rehabilitation Protocol for Anterior Cruciate Ligament Reconstruction',
    publication: 'Massachusetts General Hospital / Mass General Brigham Sports Medicine.',
    year: 'Protocolo clínico',
    url: 'https://www.massgeneral.org/assets/MGH/pdf/orthopaedics/sports-medicine/physical-therapy/rehabilitation-protocol-for-ACL.pdf',
    role: 'Fuente complementaria',
    summary: 'Protocolo clínico de rehabilitación posoperatoria tras reconstrucción del LCA, con pautas para el cuidado domiciliario, protección articular, recuperación gradual de la extensión y flexión, y precauciones según lesiones asociadas.'
  },
  {
    id: 'nhs-acl',
    authors: 'National Health Service (NHS, Reino Unido)',
    title: 'ACL surgery: Recovering',
    publication: 'NHS Health A to Z — Anterior cruciate ligament (ACL) surgery.',
    year: 'Guía para pacientes',
    url: 'https://www.nhs.uk/tests-and-treatments/acl-anterior-cruciate-ligament-surgery/recovering/',
    role: 'Recurso educativo para pacientes',
    summary: 'Información educativa orientada al paciente sobre cuidados posoperatorios en el hogar, manejo de la hinchazón, uso de muletas, higiene de la herida y signos de consulta médica.'
  }
];

export const EDITORIAL_SCOPE_INFO = {
  academicContext: 'Recurso educativo domiciliario vinculado mediante código QR a un banner académico de Kinefisiatría Traumatológica y Reumatológica.',
  academicTopic: 'Recuperación de la flexión de rodilla durante el postoperatorio temprano de reconstrucción del LCA mediante autoinjerto hueso–tendón–hueso (HTH) rotuliano.',
  lastEditorialCheck: 'Noviembre de 2026 (versión académica preparada para revisión docente y clínica previa a publicación).',
  clinicalVsDesignNote: 'Esta aplicación distingue estrictamente entre pautas clínicas basadas en las fuentes citadas (movilidad gradual, respeto del dolor anterior en injerto HTH, control del derrame y señales de alarma) y herramientas interactivas de diseño (filtros, modo de lectura grande, notas de indicaciones personales y registro voluntario local).'
};
