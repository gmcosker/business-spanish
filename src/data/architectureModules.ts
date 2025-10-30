import type { Module } from '../types';

export const architectureModules: Module[] = [
  {
    id: 'arch-1',
    title: 'Project Kickoff & Scope',
    description: 'Discuss scope, stakeholders, deliverables, and schedules in Spanish.',
    industry: 'architecture',
    order: 1,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      {
        id: 'arch-1-1',
        moduleId: 'arch-1',
        title: 'Kickoff Meeting',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'PM', text: 'Definamos alcance, entregables y hitos.', translation: 'Let’s define scope, deliverables, and milestones.' },
            { speaker: 'Client', text: 'El objetivo es entregar el edificio a fin de año.', translation: 'The goal is to deliver the building by year end.' }
          ],
          vocabulary: [
            { id: 'a1v1', term: 'alcance', translation: 'scope', context: 'Project', example: 'El alcance incluye áreas comunes.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'a1v2', term: 'entregable', translation: 'deliverable', context: 'Project', example: 'El plano MEP es un entregable clave.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'arch-1-2',
        moduleId: 'arch-1',
        title: 'Schedule & Risks',
        type: 'dialogue',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'PM', text: 'Revisemos cronograma y riesgos del sitio.', translation: 'Let’s review schedule and site risks.' }
          ],
          vocabulary: [
            { id: 'a1v3', term: 'cronograma', translation: 'schedule', context: 'Project', example: 'El cronograma tiene ruta crítica.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'arch-1-3',
        moduleId: 'arch-1',
        title: 'Stakeholders & RACI',
        type: 'vocabulary',
        order: 3,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'a1v4', term: 'interesados', translation: 'stakeholders', context: 'Project', example: 'Listamos interesados clave.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'a1v5', term: 'RFI', translation: 'RFI (request for information)', context: 'Construction admin', example: 'El contratista envió un RFI sobre la altura del plafón.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'arch-2',
    title: 'Construction Drawings & RFIs',
    description: 'Discuss sets, revisions, and manage RFIs/submittals in Spanish.',
    industry: 'architecture',
    order: 2,
    estimatedMinutes: 65,
    completed: false,
    lessons: [
      { id: 'arch-2-1', moduleId: 'arch-2', title: 'Drawing Set Review', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Architect', text: 'Revisemos planos estructurales y MEP.', translation: 'Let’s review structural and MEP drawings.' } ], vocabulary: [ { id: 'a2v1', term: 'plano', translation: 'drawing/plan', context: 'Design', example: 'Actualizamos el plano arquitectónico.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-2-2', moduleId: 'arch-2', title: 'RFIs & Submittals', type: 'vocabulary', order: 2, completed: false, duration: 20, content: { vocabulary: [ { id: 'a2v2', term: 'submittal', translation: 'submittal', context: 'Construction admin', example: 'Aprobamos el submittal de luminarias.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-2-3', moduleId: 'arch-2', title: 'Revision Log', type: 'vocabulary', order: 3, completed: false, duration: 25, content: { vocabulary: [ { id: 'a2v3', term: 'revisión', translation: 'revision', context: 'Drawings', example: 'La revisión B corrige detalles de fachada.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-3',
    title: 'Field Coordination & Site Safety',
    description: 'Coordinate trades, site walks, and safety in Spanish.',
    industry: 'architecture',
    order: 3,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'arch-3-1', moduleId: 'arch-3', title: 'Site Walk & Punchlist', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Superintendent', text: 'Hagamos recorrido y generemos punchlist.', translation: 'Let’s do a walkthrough and create the punchlist.' } ], vocabulary: [ { id: 'a3v1', term: 'punchlist', translation: 'punchlist', context: 'Construction', example: 'La punchlist incluye acabados y limpieza.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-3-2', moduleId: 'arch-3', title: 'Trade Coordination', type: 'dialogue', order: 2, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Foreman', text: 'Coordinamos HVAC con eléctricos para evitar interferencias.', translation: 'We coordinate HVAC with electrical to avoid clashes.' } ], vocabulary: [ { id: 'a3v2', term: 'interferencia', translation: 'clash/interference', context: 'Coordination', example: 'Detectamos interferencia en cielos.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-3-3', moduleId: 'arch-3', title: 'Safety Briefing', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'a3v3', term: 'equipo de protección personal (EPP)', translation: 'PPE', context: 'Safety', example: 'El EPP es obligatorio en obra.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-4',
    title: 'Estimating & Procurement',
    description: 'Estimates, bids, purchase orders, and lead times in Spanish.',
    industry: 'architecture',
    order: 4,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'arch-4-1', moduleId: 'arch-4', title: 'Estimating', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Estimator', text: 'Actualizamos el presupuesto y cantidades.', translation: 'We updated budget and quantities.' } ], vocabulary: [ { id: 'a4v1', term: 'metrados', translation: 'takeoffs/quantities', context: 'Estimating', example: 'Revisamos metrados por disciplina.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-4-2', moduleId: 'arch-4', title: 'Purchase Orders', type: 'vocabulary', order: 2, completed: false, duration: 20, content: { vocabulary: [ { id: 'a4v2', term: 'orden de compra', translation: 'purchase order', context: 'Procurement', example: 'Emitimos orden de compra de concreto.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-4-3', moduleId: 'arch-4', title: 'Lead Times', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'a4v3', term: 'tiempo de entrega', translation: 'lead time', context: 'Procurement', example: 'El tiempo de entrega es 6 semanas.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-5',
    title: 'Client Presentations & Approvals',
    description: 'Present design options, value engineering, and obtain approvals in Spanish.',
    industry: 'architecture',
    order: 5,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'arch-5-1', moduleId: 'arch-5', title: 'Design Options', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Architect', text: 'Mostramos variantes de fachada y costos.', translation: 'We show facade variants and costs.' } ], vocabulary: [ { id: 'a5v1', term: 'optimización de valor', translation: 'value engineering', context: 'Design/Cost', example: 'Propusimos optimización de valor en acabados.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-5-2', moduleId: 'arch-5', title: 'Approvals', type: 'vocabulary', order: 2, completed: false, duration: 20, content: { vocabulary: [ { id: 'a5v2', term: 'aprobación', translation: 'approval', context: 'Client/Admin', example: 'Obtenemos aprobación de planos firmados.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-5-3', moduleId: 'arch-5', title: 'Change Orders', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'a5v3', term: 'orden de cambio', translation: 'change order', context: 'Construction', example: 'Emitimos orden de cambio por ajuste de diseño.' , nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-6',
    title: 'MEP Coordination & BIM',
    description: 'Coordinate MEP trades with BIM, clash detection, and RFIs in Spanish.',
    industry: 'architecture',
    order: 6,
    estimatedMinutes: 60,
    completed: false,
    lessons: [
      { id: 'arch-6-1', moduleId: 'arch-6', title: 'BIM Review', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Coordinator', text: 'Revisemos el modelo BIM y choques detectados.', translation: 'Let’s review the BIM model and detected clashes.' } ], vocabulary: [ { id: 'a6v1', term: 'detección de choques', translation: 'clash detection', context: 'BIM', example: 'La detección de choques mostró conflictos en plafón.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-6-2', moduleId: 'arch-6', title: 'Model Updates', type: 'vocabulary', order: 2, completed: false, duration: 20, content: { vocabulary: [ { id: 'a6v2', term: 'modelo federado', translation: 'federated model', context: 'BIM', example: 'Publicamos el modelo federado semanal.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-6-3', moduleId: 'arch-6', title: 'RFI Responses', type: 'dialogue', order: 3, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Architect', text: 'Contestamos RFI con croquis y detalle ampliado.', translation: 'We answered the RFI with a sketch and enlarged detail.' } ], vocabulary: [ { id: 'a6v3', term: 'croquis', translation: 'sketch', context: 'Design', example: 'Adjuntamos croquis al RFI.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-7',
    title: 'Permitting & Codes',
    description: 'Navigate permits, inspections, and code compliance in Spanish.',
    industry: 'architecture',
    order: 7,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'arch-7-1', moduleId: 'arch-7', title: 'Permit Submittal', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'PM', text: 'Entregamos planos firmados y cálculo estructural.', translation: 'We submit signed drawings and structural calcs.' } ], vocabulary: [ { id: 'a7v1', term: 'licencia de construcción', translation: 'building permit', context: 'Permitting', example: 'La licencia está en trámite.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-7-2', moduleId: 'arch-7', title: 'Inspections', type: 'vocabulary', order: 2, completed: false, duration: 15, content: { vocabulary: [ { id: 'a7v2', term: 'inspección', translation: 'inspection', context: 'Permitting', example: 'Programamos inspección eléctrica.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-7-3', moduleId: 'arch-7', title: 'Code Compliance', type: 'vocabulary', order: 3, completed: false, duration: 20, content: { vocabulary: [ { id: 'a7v3', term: 'cumplimiento de código', translation: 'code compliance', context: 'Codes', example: 'Aseguramos cumplimiento de accesibilidad.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-8',
    title: 'Contracts & Meetings',
    description: 'AIA contracts, minutes, and coordination meetings in Spanish.',
    industry: 'architecture',
    order: 8,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'arch-8-1', moduleId: 'arch-8', title: 'Coordination Meeting', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'PM', text: 'Repasemos acuerdos y próximos pasos.', translation: 'Let’s review agreements and next steps.' } ], vocabulary: [ { id: 'a8v1', term: 'minuta', translation: 'minutes (meeting)', context: 'Meetings', example: 'Compartimos minuta después de la reunión.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-8-2', moduleId: 'arch-8', title: 'Contract Terms', type: 'vocabulary', order: 2, completed: false, duration: 15, content: { vocabulary: [ { id: 'a8v2', term: 'contrato AIA', translation: 'AIA contract', context: 'Contracts', example: 'El contrato AIA define responsabilidades.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-8-3', moduleId: 'arch-8', title: 'Meeting Follow-up', type: 'vocabulary', order: 3, completed: false, duration: 15, content: { vocabulary: [ { id: 'a8v3', term: 'acuerdo', translation: 'agreement', context: 'Meetings', example: 'Cerramos acuerdos por correo.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-9',
    title: 'Finishes & Quality Control',
    description: 'Submittals, mockups, and acceptance criteria in Spanish.',
    industry: 'architecture',
    order: 9,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'arch-9-1', moduleId: 'arch-9', title: 'Mockups', type: 'dialogue', order: 1, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Architect', text: 'Validemos el mockup de fachada y sellos.', translation: 'Let’s validate the facade mockup and sealants.' } ], vocabulary: [ { id: 'a9v1', term: 'muestra', translation: 'sample/mockup', context: 'Quality', example: 'La muestra cumple especificación.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-9-2', moduleId: 'arch-9', title: 'Acceptance Criteria', type: 'vocabulary', order: 2, completed: false, duration: 15, content: { vocabulary: [ { id: 'a9v2', term: 'criterios de aceptación', translation: 'acceptance criteria', context: 'Quality', example: 'Definimos criterios por acabado.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-9-3', moduleId: 'arch-9', title: 'Punchlist Closeout', type: 'dialogue', order: 3, completed: false, duration: 15, content: { dialogue: [ { speaker: 'PM', text: 'Cerramos pendientes de punchlist y limpieza final.', translation: 'We close punchlist items and final cleaning.' } ], vocabulary: [ { id: 'a9v3', term: 'entrega sustancial', translation: 'substantial completion', context: 'Turnover', example: 'Se logró la entrega sustancial.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  },
  {
    id: 'arch-10',
    title: 'Turnover & As-Builts',
    description: 'As-builts, O&M manuals, warranties, and closeout in Spanish.',
    industry: 'architecture',
    order: 10,
    estimatedMinutes: 55,
    completed: false,
    lessons: [
      { id: 'arch-10-1', moduleId: 'arch-10', title: 'As-Builts', type: 'vocabulary', order: 1, completed: false, duration: 15, content: { vocabulary: [ { id: 'a10v1', term: 'as-built', translation: 'as-built', context: 'Closeout', example: 'Entregamos planos as-built digitales.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-10-2', moduleId: 'arch-10', title: 'O&M Manuals', type: 'vocabulary', order: 2, completed: false, duration: 15, content: { vocabulary: [ { id: 'a10v2', term: 'manual O&M', translation: 'O&M manual', context: 'Closeout', example: 'Recibimos manuales O&M aprobados.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } },
      { id: 'arch-10-3', moduleId: 'arch-10', title: 'Warranty & Handover', type: 'dialogue', order: 3, completed: false, duration: 20, content: { dialogue: [ { speaker: 'Owner', text: '¿Cuál es la garantía para impermeabilización?', translation: 'What is the waterproofing warranty?' } ], vocabulary: [ { id: 'a10v3', term: 'garantía', translation: 'warranty', context: 'Closeout', example: 'La garantía es de 10 años.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 } ] } }
    ]
  }
];
