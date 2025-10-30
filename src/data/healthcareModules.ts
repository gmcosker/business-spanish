import type { Module } from '../types';

export const healthcareModules: Module[] = [
  {
    id: 'health-1',
    title: 'Patient Intake & Triage',
    description: 'Collect patient info, symptoms, history, and consent in Spanish.',
    industry: 'healthcare',
    order: 1,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-1-1', moduleId: 'health-1', title: 'Check-in & Forms', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Nurse', text: '¿Cuál es el motivo de su visita hoy?', translation: 'What is the reason for your visit today?' }, { speaker: 'Patient', text: 'Tengo dolor en el pecho desde anoche.', translation: 'I have chest pain since last night.' } ], vocabulary: [ { id: 'h1v1', term: 'antecedentes', translation: 'medical history', context: 'Intake', example: 'Revisamos antecedentes médicos.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-1-2', moduleId: 'health-1', title: 'Vitals & Triage', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Nurse', text: 'Voy a tomar sus signos vitales.', translation: 'I am going to take your vital signs.' } ], vocabulary: [ { id: 'h1v2', term: 'signos vitales', translation: 'vital signs', context: 'Triage', example: 'Tomamos signos vitales al ingreso.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-1-3', moduleId: 'health-1', title: 'Consent & Privacy', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'h1v3', term: 'consentimiento informado', translation: 'informed consent', context: 'Admin', example: 'El paciente firmó consentimiento informado.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-2',
    title: 'Clinical Interview & Examination',
    description: 'History of present illness, ROS, and exam instructions in Spanish.',
    industry: 'healthcare',
    order: 2,
    estimatedMinutes: 65,
    completed: false,
    lessons: [
      { id: 'health-2-1', moduleId: 'health-2', title: 'HPI & ROS', type: 'dialogue', order: 1, completed: false, duration: 25, content: { dialogue: [ { speaker: 'Provider', text: 'Describa el dolor: ¿intensidad, duración, ubicación?', translation: 'Describe the pain: intensity, duration, location?' } ], vocabulary: [ { id: 'h2v1', term: 'puntuación del dolor', translation: 'pain score', context: 'Clinical', example: 'Use escala de 0 a 10.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-2-2', moduleId: 'health-2', title: 'Exam Instructions', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Respire profundo y sostenga el aire, por favor.', translation: 'Take a deep breath and hold it, please.' } ], vocabulary: [ { id: 'h2v2', term: 'auscultar', translation: 'to auscultate/listen', context: 'Exam', example: 'Voy a auscultar sus pulmones.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-2-3', moduleId: 'health-2', title: 'Diagnostic Tests', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'h2v3', term: 'análisis de sangre', translation: 'blood test', context: 'Diagnostics', example: 'Programamos análisis de sangre hoy.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-3',
    title: 'Treatment & Patient Education',
    description: 'Explain medication, side effects, and care plans in Spanish.',
    industry: 'healthcare',
    order: 3,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-3-1', moduleId: 'health-3', title: 'Medications', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Tome este medicamento dos veces al día.', translation: 'Take this medication twice a day.' } ], vocabulary: [ { id: 'h3v1', term: 'efecto secundario', translation: 'side effect', context: 'Pharmacology', example: 'Informe cualquier efecto secundario.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-3-2', moduleId: 'health-3', title: 'Discharge & Care Plan', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Evite esfuerzo y beba agua en abundancia.', translation: 'Avoid exertion and drink plenty of water.' } ], vocabulary: [ { id: 'h3v2', term: 'cita de seguimiento', translation: 'follow-up appointment', context: 'Care plan', example: 'Agende una cita de seguimiento en 1 semana.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-3-3', moduleId: 'health-3', title: 'Interpreter & Family', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'h3v3', term: 'intérprete', translation: 'interpreter', context: 'Communication', example: 'Usamos intérprete profesional cuando es necesario.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-4',
    title: 'Pediatrics & Family Communication',
    description: 'Explain symptoms, vaccines, and instructions for children, with parents present.',
    industry: 'healthcare',
    order: 4,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-4-1', moduleId: 'health-4', title: 'Parent Communication', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: '¿Desde cuándo tiene fiebre su hijo?', translation: 'Since when has your child had a fever?' } ], vocabulary: [ { id: 'h4v1', term: 'vacuna', translation: 'vaccine', context: 'Pediatrics', example: 'La vacuna está al día.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-4-2', moduleId: 'health-4', title: 'Dosing Instructions', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Administre 5 ml cada 6 horas según peso.', translation: 'Give 5 ml every 6 hours by weight.' } ], vocabulary: [ { id: 'h4v2', term: 'dosificación', translation: 'dosing', context: 'Medication', example: 'Confirmamos dosificación por kilogramo.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-5',
    title: 'Emergency & Urgent Care',
    description: 'Triage levels, red-flag symptoms, and stabilization in Spanish.',
    industry: 'healthcare',
    order: 5,
    estimatedMinutes: 65,
    completed: false,
    lessons: [
      { id: 'health-5-1', moduleId: 'health-5', title: 'Red Flags', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Si tiene dificultad para respirar, avíseme de inmediato.', translation: 'If you have trouble breathing, tell me immediately.' } ], vocabulary: [ { id: 'h5v1', term: 'urgencia', translation: 'urgency', context: 'Triage', example: 'Clasificamos urgencia VS emergencia.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-5-2', moduleId: 'health-5', title: 'Stabilization', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Coloque esta mascarilla; vamos a administrar oxígeno.', translation: 'Put on this mask; we are going to administer oxygen.' } ], vocabulary: [ { id: 'h5v2', term: 'saturación', translation: 'oxygen saturation', context: 'Monitoring', example: 'La saturación está en 92%.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-6',
    title: 'Chronic Disease Management',
    description: 'Diabetes, hypertension, and adherence counseling in Spanish.',
    industry: 'healthcare',
    order: 6,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-6-1', moduleId: 'health-6', title: 'Diabetes', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Revise su glucosa diariamente y anote resultados.', translation: 'Check your glucose daily and write down results.' } ], vocabulary: [ { id: 'h6v1', term: 'adherencia', translation: 'adherence', context: 'Chronic care', example: 'Hablamos de adherencia al tratamiento.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-6-2', moduleId: 'health-6', title: 'Hypertension', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Tome su presión en la mañana y la noche.', translation: 'Measure your blood pressure morning and night.' } ], vocabulary: [ { id: 'h6v2', term: 'presión arterial', translation: 'blood pressure', context: 'Vitals', example: 'La presión arterial está controlada.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-7',
    title: 'Women’s Health',
    description: 'OB/GYN visits, prenatal instructions, and follow-up in Spanish.',
    industry: 'healthcare',
    order: 7,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-7-1', moduleId: 'health-7', title: 'Prenatal Visit', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: '¿Siente movimiento del bebé?', translation: 'Do you feel the baby move?' } ], vocabulary: [ { id: 'h7v1', term: 'prenatal', translation: 'prenatal', context: 'OB', example: 'Seguimos controles prenatales mensuales.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'health-7-2', moduleId: 'health-7', title: 'Exam Instructions', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Relájese; el examen tomará pocos minutos.', translation: 'Relax; the exam will take a few minutes.' } ], vocabulary: [ { id: 'h7v2', term: 'citología', translation: 'pap smear', context: 'OB/GYN', example: 'Realizamos citología y cultivo.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-8',
    title: 'Palliative Care & Difficult Conversations',
    description: 'Goals of care, prognosis, and family meetings in Spanish.',
    industry: 'healthcare',
    order: 8,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'health-8-1', moduleId: 'health-8', title: 'Goals of Care', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Queremos respetar sus valores y deseos.', translation: 'We want to respect your values and wishes.' } ], vocabulary: [ { id: 'h8v1', term: 'prognóstico', translation: 'prognosis', context: 'Palliative', example: 'Explicamos pronóstico con claridad.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-9',
    title: 'Clinic & Hospital Admin',
    description: 'Scheduling, referrals, prior auth, and discharge coordination in Spanish.',
    industry: 'healthcare',
    order: 9,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'health-9-1', moduleId: 'health-9', title: 'Scheduling & Referrals', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Admin', text: 'Programaremos una cita con cardiología y enviaremos la referencia.', translation: 'We will schedule cardiology and send the referral.' } ], vocabulary: [ { id: 'h9v1', term: 'autorización previa', translation: 'prior authorization', context: 'Admin', example: 'Tramitamos autorización previa para resonancia.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'health-10',
    title: 'Community & Preventive Care',
    description: 'Health promotion, screening, and education in Spanish.',
    industry: 'healthcare',
    order: 10,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'health-10-1', moduleId: 'health-10', title: 'Prevention & Lifestyle', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Provider', text: 'Camine 30 minutos al día y reduzca sal.', translation: 'Walk 30 minutes a day and reduce salt.' } ], vocabulary: [ { id: 'h10v1', term: 'tamizaje', translation: 'screening', context: 'Preventive', example: 'Programamos tamizaje anual.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  }
];
