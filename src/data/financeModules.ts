import type { Module } from '../types';

export const financeModules: Module[] = [
  {
    id: 'finance-1',
    title: 'Banking & Financial Services',
    description: 'Essential Spanish for banking professionals, loan officers, and financial advisors.',
    industry: 'finance',
    order: 1,
    estimatedMinutes: 70,
    completed: false,
    lessons: [
      {
        id: 'finance-1-1',
        moduleId: 'finance-1',
        title: 'Commercial Banking & Business Accounts',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            {
              speaker: 'Business Owner',
              text: 'Buenos días. Represento a TechSolutions S.A. y necesitamos abrir una cuenta corporativa.',
              translation: 'Good morning. I represent TechSolutions S.A. and we need to open a corporate account.',
            },
            {
              speaker: 'Banker',
              text: 'Perfecto. ¿Cuál es el volumen de transacciones mensuales que esperan?',
              translation: 'Perfect. What monthly transaction volume do you expect?',
            },
            {
              speaker: 'Business Owner',
              text: 'Estimamos entre $50,000 y $100,000 mensuales. También necesitamos línea de crédito.',
              translation: 'We estimate between $50,000 and $100,000 monthly. We also need a credit line.',
            },
            {
              speaker: 'Banker',
              text: 'Excelente. Para la línea de crédito necesitamos estados financieros de los últimos dos años.',
              translation: 'Excellent. For the credit line we need financial statements from the last two years.',
            },
            {
              speaker: 'Business Owner',
              text: 'Los tenemos listos. ¿Cuál es el proceso de aprobación?',
              translation: 'We have them ready. What\'s the approval process?',
            },
            {
              speaker: 'Banker',
              text: 'El análisis crediticio toma entre 5 y 7 días hábiles. ¿Cuánto necesitan?',
              translation: 'The credit analysis takes between 5 and 7 business days. How much do you need?',
            },
            {
              speaker: 'Business Owner',
              text: 'Solicitamos $250,000 para capital de trabajo y expansión.',
              translation: 'We\'re requesting $250,000 for working capital and expansion.',
            },
          ],
          vocabulary: [
            {
              id: 'f1',
              term: 'cuenta corporativa',
              translation: 'corporate account',
              context: 'Banking',
              example: 'La cuenta corporativa tiene beneficios especiales.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f2',
              term: 'volumen de transacciones',
              translation: 'transaction volume',
              context: 'Banking',
              example: 'El volumen de transacciones aumentó este mes.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f3',
              term: 'línea de crédito',
              translation: 'credit line',
              context: 'Banking',
              example: 'La línea de crédito tiene un límite de $500,000.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f4',
              term: 'estados financieros',
              translation: 'financial statements',
              context: 'Accounting',
              example: 'Los estados financieros muestran crecimiento.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f5',
              term: 'análisis crediticio',
              translation: 'credit analysis',
              context: 'Banking',
              example: 'El análisis crediticio fue favorable.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f6',
              term: 'capital de trabajo',
              translation: 'working capital',
              context: 'Finance',
              example: 'Necesitamos capital de trabajo para operaciones.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f7',
              term: 'días hábiles',
              translation: 'business days',
              context: 'Timeline',
              example: 'El proceso toma 5 días hábiles.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f8',
              term: 'gestionar',
              translation: 'to manage / to handle',
              context: 'Banking operations',
              example: 'Voy a gestionar la aprobación de su línea de crédito.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f9',
              term: 'solicitar',
              translation: 'to request / to apply for',
              context: 'Financial requests',
              example: 'Vamos a solicitar un préstamo para la expansión.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f10',
              term: 'aprobación',
              translation: 'approval',
              context: 'Credit approval',
              example: 'La aprobación del crédito llegó la semana pasada.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f11',
              term: 'interés',
              translation: 'interest rate',
              context: 'Financial terms',
              example: 'El interés del préstamo es muy competitivo.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f12',
              term: 'garantía',
              translation: 'collateral / guarantee',
              context: 'Banking security',
              example: 'Necesitamos ofrecer una garantía para el préstamo.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f13',
              term: 'plazo',
              translation: 'term / period',
              context: 'Loan terms',
              example: 'El plazo del préstamo es de 36 meses.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
          culturalNotes: [
            'Corporate banking in Latin America often requires personal guarantees from business owners.',
            'Credit approval processes can be lengthy - build relationships with bank officers.',
            'Many Latin American banks offer preferential rates for established corporate clients.',
            'Documentation requirements are strict - ensure all paperwork is properly notarized.',
          ],
        },
      },
      {
        id: 'finance-1-2',
        moduleId: 'finance-1',
        title: 'Financial Statements & Reports',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            {
              id: 'f6',
              term: 'estado financiero',
              translation: 'financial statement',
              context: 'Accounting',
              example: 'El estado financiero muestra la rentabilidad.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f7',
              term: 'balance general',
              translation: 'balance sheet',
              context: 'Accounting',
              example: 'El balance general incluye activos y pasivos.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f8',
              term: 'flujo de caja',
              translation: 'cash flow',
              context: 'Finance',
              example: 'El flujo de caja positivo es esencial.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f9',
              term: 'ingresos',
              translation: 'income / revenue',
              context: 'Finance',
              example: 'Los ingresos aumentaron este trimestre.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f10',
              term: 'gastos',
              translation: 'expenses',
              context: 'Finance',
              example: 'Debemos reducir los gastos operativos.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f11',
              term: 'utilidades',
              translation: 'profits / earnings',
              context: 'Finance',
              example: 'Las utilidades netas fueron de $100,000.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f12',
              term: 'pérdidas',
              translation: 'losses',
              context: 'Finance',
              example: 'La empresa reportó pérdidas este año.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
          practiceExercises: [
            {
              id: 'fex1',
              type: 'multiple-choice',
              question: 'What is "balance sheet" in Spanish?',
              options: ['balance general', 'flujo de caja', 'estado de resultados', 'cuenta corriente'],
              correctAnswer: 'balance general',
              explanation: '"Balance general" is the standard term for balance sheet in Spanish.',
            },
            {
              id: 'fex2',
              type: 'fill-blank',
              question: 'Complete: El _____ de caja muestra entradas y salidas de dinero.',
              correctAnswer: 'flujo',
              explanation: '"Flujo de caja" means cash flow.',
            },
          ],
        },
      },
      {
        id: 'finance-1-3',
        moduleId: 'finance-1',
        title: 'Investment Terminology',
        type: 'vocabulary',
        order: 3,
        completed: false,
        duration: 15,
        content: {
          vocabulary: [
            {
              id: 'f13',
              term: 'inversión',
              translation: 'investment',
              context: 'Finance',
              example: 'Nuestra inversión generó buenos rendimientos.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f14',
              term: 'acción',
              translation: 'stock / share',
              context: 'Investment',
              example: 'Compré acciones de esa empresa.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f15',
              term: 'bono',
              translation: 'bond',
              context: 'Investment',
              example: 'Los bonos del gobierno son seguros.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f16',
              term: 'dividendo',
              translation: 'dividend',
              context: 'Investment',
              example: 'La empresa paga dividendos trimestrales.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f17',
              term: 'rendimiento',
              translation: 'return / yield',
              context: 'Investment',
              example: 'El rendimiento anual fue del 8%.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'finance-2',
    title: 'Investment Banking & Capital Markets',
    description: 'Advanced Spanish for investment bankers, M&A professionals, and capital markets specialists.',
    industry: 'finance',
    order: 2,
    estimatedMinutes: 80,
    completed: false,
    lessons: [
      {
        id: 'finance-2-1',
        moduleId: 'finance-2',
        title: 'M&A Deal Structuring',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            {
              speaker: 'Investment Banker',
              text: 'Hemos analizado la propuesta de adquisición. El múltiplo EV/EBITDA está en línea con el mercado.',
              translation: 'We\'ve analyzed the acquisition proposal. The EV/EBITDA multiple is in line with the market.',
            },
            {
              speaker: 'Client',
              text: '¿Cuál es su recomendación sobre la estructura de la transacción?',
              translation: 'What\'s your recommendation on the transaction structure?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Sugerimos una combinación de efectivo y acciones. 70% efectivo, 30% acciones.',
              translation: 'We suggest a combination of cash and stock. 70% cash, 30% stock.',
            },
            {
              speaker: 'Client',
              text: '¿Qué pasa con la deuda? ¿Incluimos refinanciamiento?',
              translation: 'What about debt? Do we include refinancing?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Sí, podemos estructurar un paquete de financiamiento con múltiples bancos.',
              translation: 'Yes, we can structure a financing package with multiple banks.',
            },
            {
              speaker: 'Client',
              text: '¿Cuánto tiempo estiman para el cierre?',
              translation: 'How long do you estimate for closing?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Entre 4 y 6 meses, dependiendo de las aprobaciones regulatorias.',
              translation: 'Between 4 and 6 months, depending on regulatory approvals.',
            },
          ],
          vocabulary: [
            {
              id: 'f18',
              term: 'adquisición',
              translation: 'acquisition',
              context: 'M&A',
              example: 'La adquisición fue exitosa.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f19',
              term: 'múltiplo',
              translation: 'multiple',
              context: 'Valuation',
              example: 'El múltiplo EV/EBITDA es atractivo.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f20',
              term: 'EV/EBITDA',
              translation: 'EV/EBITDA (Enterprise Value/Earnings Before Interest, Taxes, Depreciation, Amortization)',
              context: 'Valuation',
              example: 'El múltiplo EV/EBITDA es de 8x.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f21',
              term: 'estructura de transacción',
              translation: 'transaction structure',
              context: 'M&A',
              example: 'La estructura de transacción es compleja.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f22',
              term: 'refinanciamiento',
              translation: 'refinancing',
              context: 'Finance',
              example: 'El refinanciamiento mejoró las condiciones.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f23',
              term: 'aprobaciones regulatorias',
              translation: 'regulatory approvals',
              context: 'Compliance',
              example: 'Las aprobaciones regulatorias están pendientes.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
          culturalNotes: [
            'M&A processes in Latin America often involve family-owned businesses with complex ownership structures.',
            'Regulatory approval timelines vary significantly by country - Mexico is typically faster than Brazil.',
            'Due diligence processes are thorough - expect detailed financial and legal reviews.',
          ],
        },
      },
      {
        id: 'finance-2-2',
        moduleId: 'finance-2',
        title: 'IPO Preparation & Capital Raising',
        type: 'dialogue',
        order: 2,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            {
              speaker: 'Investment Banker',
              text: 'Para la OPI necesitamos preparar el prospecto y realizar roadshows.',
              translation: 'For the IPO we need to prepare the prospectus and conduct roadshows.',
            },
            {
              speaker: 'CEO',
              text: '¿Cuál es el rango de valoración que están considerando?',
              translation: 'What valuation range are you considering?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Estimamos entre $800 millones y $1.2 mil millones. Depende del apetito del mercado.',
              translation: 'We estimate between $800 million and $1.2 billion. It depends on market appetite.',
            },
            {
              speaker: 'CEO',
              text: '¿Qué porcentaje de la empresa planean vender?',
              translation: 'What percentage of the company do you plan to sell?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Sugerimos entre 20% y 25% para mantener control y crear liquidez.',
              translation: 'We suggest between 20% and 25% to maintain control and create liquidity.',
            },
            {
              speaker: 'CEO',
              text: '¿Cuándo podríamos listar en la bolsa?',
              translation: 'When could we list on the stock exchange?',
            },
            {
              speaker: 'Investment Banker',
              text: 'Si todo va bien, podríamos estar listos para el Q2 del próximo año.',
              translation: 'If everything goes well, we could be ready for Q2 next year.',
            },
          ],
          vocabulary: [
            {
              id: 'f24',
              term: 'OPI',
              translation: 'IPO (Initial Public Offering)',
              context: 'Capital Markets',
              example: 'La OPI fue exitosa.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f25',
              term: 'prospecto',
              translation: 'prospectus',
              context: 'IPO',
              example: 'El prospecto está siendo revisado.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f26',
              term: 'roadshow',
              translation: 'roadshow',
              context: 'IPO',
              example: 'El roadshow comienza la próxima semana.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f27',
              term: 'valoración',
              translation: 'valuation',
              context: 'Finance',
              example: 'La valoración de la empresa es alta.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f28',
              term: 'apetito del mercado',
              translation: 'market appetite',
              context: 'Capital Markets',
              example: 'El apetito del mercado es fuerte.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f29',
              term: 'liquidez',
              translation: 'liquidity',
              context: 'Finance',
              example: 'La liquidez del mercado es limitada.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f30',
              term: 'bolsa',
              translation: 'stock exchange',
              context: 'Capital Markets',
              example: 'La empresa se listará en la bolsa de valores.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
        },
      },
      {
        id: 'finance-2-3',
        moduleId: 'finance-2',
        title: 'Risk Management & Compliance',
        type: 'vocabulary',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          vocabulary: [
            {
              id: 'f31',
              term: 'gestión de riesgos',
              translation: 'risk management',
              context: 'Finance',
              example: 'La gestión de riesgos es fundamental.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f32',
              term: 'cumplimiento',
              translation: 'compliance',
              context: 'Regulatory',
              example: 'El cumplimiento regulatorio es estricto.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f33',
              term: 'auditoría',
              translation: 'audit',
              context: 'Finance',
              example: 'La auditoría anual está programada.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f34',
              term: 'controles internos',
              translation: 'internal controls',
              context: 'Finance',
              example: 'Los controles internos son efectivos.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
            {
              id: 'f35',
              term: 'exposición al riesgo',
              translation: 'risk exposure',
              context: 'Risk Management',
              example: 'La exposición al riesgo es moderada.',
              nextReview: new Date(Date.now() + 86400000).toISOString(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
            },
          ],
          practiceExercises: [
            {
              id: 'fex5',
              type: 'speaking',
              question: 'Say in Spanish: "The IPO valuation range is between $800 million and $1.2 billion."',
              correctAnswer: 'El rango de valoración de la OPI está entre $800 millones y $1.2 mil millones.',
              explanation: 'Use "rango de valoración" for "valuation range" and "OPI" for "IPO".',
            },
            {
              id: 'fex6',
              type: 'multiple-choice',
              question: 'What does "OPI" stand for in Spanish?',
              options: ['Oferta Pública Inicial', 'Operación Pública Interna', 'Oportunidad Pública de Inversión'],
              correctAnswer: 'Oferta Pública Inicial',
              explanation: 'OPI stands for "Oferta Pública Inicial" (Initial Public Offering).',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'finance-3',
    title: 'Accounting & Financial Reporting',
    description: 'Prepare statements, discuss accruals, and present results in Spanish.',
    industry: 'finance',
    order: 3,
    estimatedMinutes: 75,
    completed: false,
    lessons: [
      {
        id: 'finance-3-1',
        moduleId: 'finance-3',
        title: 'Income Statement & Balance Sheet',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            { speaker: 'Controller', text: 'Revisemos el estado de resultados y el balance general.', translation: 'Let’s review the income statement and the balance sheet.' },
            { speaker: 'Analyst', text: 'El margen bruto mejoró 3 puntos.', translation: 'Gross margin improved by 3 points.' }
          ],
          vocabulary: [
            { id: 'fa3v1', term: 'estado de resultados', translation: 'income statement', context: 'Accounting', example: 'El estado de resultados muestra crecimiento de ingresos.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa3v2', term: 'balance general', translation: 'balance sheet', context: 'Accounting', example: 'El balance general refleja los activos y pasivos.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-3-2',
        moduleId: 'finance-3',
        title: 'Accruals & Adjustments',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa3v3', term: 'acumulación (devengo)', translation: 'accrual', context: 'Accounting', example: 'Registramos el gasto por acumulación.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa3v4', term: 'asiento de ajuste', translation: 'adjusting entry', context: 'Accounting', example: 'Hicimos los asientos de ajuste de cierre.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-3-3',
        moduleId: 'finance-3',
        title: 'Quarterly Results Presentation',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'CFO', text: 'Presentamos resultados trimestrales: EBITDA creció 12%.', translation: 'We present quarterly results: EBITDA grew 12%.' },
            { speaker: 'Investor', text: '¿Cómo afectó el tipo de cambio?', translation: 'How did FX affect the results?' }
          ],
          vocabulary: [
            { id: 'fa3v5', term: 'EBITDA', translation: 'EBITDA', context: 'Finance', example: 'El EBITDA mejoró gracias a eficiencia operativa.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa3v6', term: 'tipo de cambio', translation: 'exchange rate', context: 'Finance', example: 'El tipo de cambio impactó los costos.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-4',
    title: 'Risk Management & Compliance',
    description: 'Assess risk exposure, controls, and regulatory compliance in Spanish.',
    industry: 'finance',
    order: 4,
    estimatedMinutes: 70,
    completed: false,
    lessons: [
      {
        id: 'finance-4-1',
        moduleId: 'finance-4',
        title: 'Risk Assessment',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'Risk Lead', text: 'Identifiquemos riesgos operativos y de mercado.', translation: 'Let’s identify operational and market risks.' },
            { speaker: 'Analyst', text: 'La exposición al riesgo de crédito es baja.', translation: 'Credit risk exposure is low.' }
          ],
          vocabulary: [
            { id: 'fa4v1', term: 'controles internos', translation: 'internal controls', context: 'Risk', example: 'Auditamos los controles internos clave.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa4v2', term: 'cumplimiento normativo', translation: 'regulatory compliance', context: 'Risk/Compliance', example: 'Cumplimos con la normativa vigente.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-4-2',
        moduleId: 'finance-4',
        title: 'Policies & Audits',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa4v3', term: 'política de riesgo', translation: 'risk policy', context: 'Risk', example: 'Actualizamos la política de riesgo anual.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa4v4', term: 'auditoría', translation: 'audit', context: 'Compliance', example: 'Tenemos auditoría externa este mes.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-4-3',
        moduleId: 'finance-4',
        title: 'Regulatory Reporting',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'Compliance', text: 'Entregaremos el reporte regulatorio a tiempo.', translation: 'We will submit the regulatory report on time.' }
          ],
          vocabulary: [
            { id: 'fa4v5', term: 'supervisor', translation: 'regulatory supervisor', context: 'Compliance', example: 'Coordinamos con el supervisor financiero.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-5',
    title: 'Commercial Lending & Credit Analysis',
    description: 'Underwrite loans, analyze financials, and structure terms in Spanish.',
    industry: 'finance',
    order: 5,
    estimatedMinutes: 75,
    completed: false,
    lessons: [
      {
        id: 'finance-5-1',
        moduleId: 'finance-5',
        title: 'Loan Underwriting',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            { speaker: 'Credit Officer', text: 'Analicemos flujo de caja y colateral.', translation: 'Let’s analyze cash flow and collateral.' }
          ],
          vocabulary: [
            { id: 'fa5v1', term: 'flujo de caja', translation: 'cash flow', context: 'Lending', example: 'El flujo de caja es suficiente para el servicio de deuda.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa5v2', term: 'colateral', translation: 'collateral', context: 'Lending', example: 'El préstamo está respaldado por colateral.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-5-2',
        moduleId: 'finance-5',
        title: 'Covenants & Pricing',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa5v3', term: 'covenant', translation: 'covenant', context: 'Lending', example: 'Definimos covenants financieros claros.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa5v4', term: 'tasa de interés', translation: 'interest rate', context: 'Lending', example: 'La tasa de interés es variable.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-5-3',
        moduleId: 'finance-5',
        title: 'Credit Committee',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'Chair', text: 'El comité recomienda aprobar el crédito.', translation: 'The committee recommends approving the loan.' }
          ],
          vocabulary: [
            { id: 'fa5v5', term: 'comité de crédito', translation: 'credit committee', context: 'Lending', example: 'El comité de crédito revisa grandes operaciones.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-6',
    title: 'Wealth Management & Advisory',
    description: 'Advise clients on portfolios, risk tolerance, and planning in Spanish.',
    industry: 'finance',
    order: 6,
    estimatedMinutes: 70,
    completed: false,
    lessons: [
      {
        id: 'finance-6-1',
        moduleId: 'finance-6',
        title: 'Client Discovery & Goals',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'Advisor', text: 'Cuénteme sus objetivos y tolerancia al riesgo.', translation: 'Tell me about your goals and risk tolerance.' }
          ],
          vocabulary: [
            { id: 'fa6v1', term: 'cartera', translation: 'portfolio', context: 'Investments', example: 'Diversificamos la cartera.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa6v2', term: 'tolerancia al riesgo', translation: 'risk tolerance', context: 'Investments', example: 'Definimos la tolerancia al riesgo antes de invertir.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-6-2',
        moduleId: 'finance-6',
        title: 'Asset Allocation',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa6v3', term: 'asignación de activos', translation: 'asset allocation', context: 'Investments', example: 'La asignación de activos cambió a 60/40.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa6v4', term: 'rebalanceo', translation: 'rebalancing', context: 'Investments', example: 'Hacemos rebalanceo trimestral.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-6-3',
        moduleId: 'finance-6',
        title: 'Planning & Monitoring',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'Advisor', text: 'Revisamos el plan anualmente y ajustamos.', translation: 'We review the plan annually and adjust.' }
          ],
          vocabulary: [
            { id: 'fa6v5', term: 'objetivos financieros', translation: 'financial goals', context: 'Planning', example: 'Definimos objetivos financieros SMART.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-7',
    title: 'Insurance & Claims',
    description: 'Policies, underwriting, and claims management in Spanish.',
    industry: 'finance',
    order: 7,
    estimatedMinutes: 70,
    completed: false,
    lessons: [
      {
        id: 'finance-7-1',
        moduleId: 'finance-7',
        title: 'Policy Coverage & Premiums',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'Agent', text: 'Revisemos coberturas y la prima anual.', translation: 'Let’s review coverages and the annual premium.' }
          ],
          vocabulary: [
            { id: 'fa7v1', term: 'cobertura', translation: 'coverage', context: 'Insurance', example: 'La póliza incluye cobertura completa.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa7v2', term: 'prima', translation: 'premium', context: 'Insurance', example: 'La prima se paga anualmente.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-7-2',
        moduleId: 'finance-7',
        title: 'Claims Process',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa7v3', term: 'siniestro', translation: 'claim/incident', context: 'Insurance', example: 'Reportamos el siniestro dentro de 48 horas.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa7v4', term: 'deducible', translation: 'deductible', context: 'Insurance', example: 'El deducible es de $500.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-7-3',
        moduleId: 'finance-7',
        title: 'Underwriting & Risk',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'Underwriter', text: 'Evaluamos riesgo y determinamos primas.', translation: 'We evaluate risk and determine premiums.' }
          ],
          vocabulary: [
            { id: 'fa7v5', term: 'suscripción', translation: 'underwriting', context: 'Insurance', example: 'La suscripción evalúa el perfil de riesgo.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-8',
    title: 'Crypto & Digital Finance',
    description: 'Discuss crypto assets, wallets, compliance, and payments in Spanish.',
    industry: 'finance',
    order: 8,
    estimatedMinutes: 65,
    completed: false,
    lessons: [
      {
        id: 'finance-8-1',
        moduleId: 'finance-8',
        title: 'Assets & Wallets',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'PM', text: 'Integramos pagos con billeteras digitales.', translation: 'We are integrating payments with digital wallets.' }
          ],
          vocabulary: [
            { id: 'fa8v1', term: 'billetera', translation: 'wallet', context: 'Crypto', example: 'El usuario vincula su billetera al perfil.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa8v2', term: 'cadena de bloques', translation: 'blockchain', context: 'Crypto', example: 'La transacción se registró en la cadena de bloques.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-8-2',
        moduleId: 'finance-8',
        title: 'Compliance & AML',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa8v3', term: 'KYC', translation: 'know your customer', context: 'Compliance', example: 'Completamos KYC antes de activar la cuenta.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa8v4', term: 'AML', translation: 'anti-money laundering', context: 'Compliance', example: 'La política AML está vigente.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-8-3',
        moduleId: 'finance-8',
        title: 'Payments & Settlement',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            { speaker: 'Ops', text: 'El settlement ocurre en T+1.', translation: 'Settlement occurs at T+1.' }
          ],
          vocabulary: [
            { id: 'fa8v5', term: 'liquidación', translation: 'settlement', context: 'Payments', example: 'La liquidación se ejecuta al cierre del día.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-9',
    title: 'Mergers & Acquisitions (M&A)',
    description: 'Evaluate targets, negotiate terms, and execute deals in Spanish.',
    industry: 'finance',
    order: 9,
    estimatedMinutes: 75,
    completed: false,
    lessons: [
      {
        id: 'finance-9-1',
        moduleId: 'finance-9',
        title: 'Target Evaluation & Synergies',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            { speaker: 'Corp Dev', text: 'Analicemos sinergias y valuación.', translation: 'Let’s analyze synergies and valuation.' }
          ],
          vocabulary: [
            { id: 'fa9v1', term: 'sinergia', translation: 'synergy', context: 'M&A', example: 'Las sinergias operativas son significativas.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa9v2', term: 'due diligence', translation: 'due diligence', context: 'M&A', example: 'El due diligence inicia la próxima semana.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-9-2',
        moduleId: 'finance-9',
        title: 'Deal Structure',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa9v3', term: 'earn-out', translation: 'earn-out', context: 'M&A', example: 'Acordamos un earn-out a 2 años.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa9v4', term: 'cláusula de no competencia', translation: 'non-compete clause', context: 'M&A', example: 'Incluimos cláusula de no competencia.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-9-3',
        moduleId: 'finance-9',
        title: 'Integration Planning',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 30,
        content: {
          dialogue: [
            { speaker: 'PMO', text: 'Planifiquemos integración de sistemas y equipos.', translation: 'Let’s plan systems and teams integration.' }
          ],
          vocabulary: [
            { id: 'fa9v5', term: 'PMO', translation: 'project management office', context: 'Integration', example: 'La PMO coordina la integración.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'finance-10',
    title: 'Regulatory & Audit Processes',
    description: 'Prepare for external audits and ongoing regulatory processes in Spanish.',
    industry: 'finance',
    order: 10,
    estimatedMinutes: 65,
    completed: false,
    lessons: [
      {
        id: 'finance-10-1',
        moduleId: 'finance-10',
        title: 'External Audit Readiness',
        type: 'dialogue',
        order: 1,
        completed: false,
        duration: 20,
        content: {
          dialogue: [
            { speaker: 'CFO', text: 'Aseguremos evidencia y conciliaciones completas.', translation: 'Let’s ensure evidence and complete reconciliations.' }
          ],
          vocabulary: [
            { id: 'fa10v1', term: 'conciliación', translation: 'reconciliation', context: 'Audit', example: 'Terminamos conciliaciones bancarias.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-10-2',
        moduleId: 'finance-10',
        title: 'Ongoing Regulatory Processes',
        type: 'vocabulary',
        order: 2,
        completed: false,
        duration: 20,
        content: {
          vocabulary: [
            { id: 'fa10v2', term: 'reportes periódicos', translation: 'periodic reports', context: 'Regulatory', example: 'Enviamos reportes periódicos al regulador.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 },
            { id: 'fa10v3', term: 'requerimiento', translation: 'requirement/request', context: 'Regulatory', example: 'Respondimos el requerimiento del supervisor.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      },
      {
        id: 'finance-10-3',
        moduleId: 'finance-10',
        title: 'Closing Meeting & Findings',
        type: 'dialogue',
        order: 3,
        completed: false,
        duration: 25,
        content: {
          dialogue: [
            { speaker: 'Auditor', text: 'Presentamos hallazgos y recomendaciones.', translation: 'We present findings and recommendations.' }
          ],
          vocabulary: [
            { id: 'fa10v4', term: 'hallazgo', translation: 'finding', context: 'Audit', example: 'Cerramos el hallazgo con acciones correctivas.', nextReview: new Date(Date.now()+86400000).toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0 }
          ]
        }
      }
    ]
  }
];

