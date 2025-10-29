export interface DialogueNode {
  id: string;
  speaker: 'ai' | 'user';
  text?: string; // Optional for user nodes
  expectedResponses?: string[];
  followUpNodes?: string[];
  feedbackHints?: string;
}

export interface ConversationScenario {
  id: string;
  industry: 'tech' | 'finance' | 'logistics' | 'customer-service';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  context: string;
  dialogueFlow: DialogueNode[];
}

// Sample Conversation Scenarios
export const conversationScenarios: ConversationScenario[] = [
  {
    id: 'tech-pitch-1',
    industry: 'tech',
    difficulty: 'intermediate',
    title: 'Elevator Pitch',
    description: 'Pitch your startup to a potential investor',
    context: 'You meet a VC at a networking event. They ask about your company.',
    dialogueFlow: [
      {
        id: 'ai-intro',
        speaker: 'ai',
        text: '¡Hola! Soy Carlos de Venture Capital Latin America. ¿Me podrías hablar sobre tu startup?',
        followUpNodes: ['user-pitch-start']
      },
      {
        id: 'user-pitch-start',
        speaker: 'user',
        expectedResponses: [
          'Mi startup se llama InnovateTech',
          'Trabajamos en soluciones SaaS',
          'Estamos desarrollando software para empresas',
          'Somos una empresa de tecnología que ayuda a negocios'
        ],
        followUpNodes: ['ai-ask-value'],
        feedbackHints: 'Mention your company name + what you do'
      },
      {
        id: 'ai-ask-value',
        speaker: 'ai',
        text: 'Interesante. ¿Cuál es tu propuesta de valor único?',
        followUpNodes: ['user-value-prop']
      },
      {
        id: 'user-value-prop',
        speaker: 'user',
        expectedResponses: [
          'Reducimos costos operativos en un 40%',
          'Aumentamos la productividad',
          'Nuestra plataforma es más intuitiva',
          'Ofrecemos integración fácil con sistemas existentes'
        ],
        followUpNodes: ['ai-ask-market'],
        feedbackHints: 'Explain the unique benefit your product offers'
      },
      {
        id: 'ai-ask-market',
        speaker: 'ai',
        text: '¿Cuál es tu mercado objetivo?',
        followUpNodes: ['user-market-answer']
      },
      {
        id: 'user-market-answer',
        speaker: 'user',
        expectedResponses: [
          'Pequeñas y medianas empresas',
          'Startups tecnológicas',
          'Empresas que buscan digitalizarse',
          'PyMEs en Latinoamérica',
          'Pequeña empresa',
          'Grandes empresas'
        ],
        followUpNodes: ['ai-ask-revenue-potential'],
        feedbackHints: 'Describe your target market or customer type'
      },
      {
        id: 'ai-ask-revenue-potential',
        speaker: 'ai',
        text: 'Interesante. ¿Cuál es tu potencial de ingresos mensuales?',
        followUpNodes: ['user-revenue-potential']
      },
      {
        id: 'user-revenue-potential',
        speaker: 'user',
        expectedResponses: [
          'Estimamos llegar a 100,000 dólares en 6 meses',
          'Nuestro objetivo es 50,000 dólares mensuales',
          'Proyectamos ingresos significativos',
          'Esperamos un crecimiento rápido'
        ],
        followUpNodes: ['ai-ask-investment'],
        feedbackHints: 'Give a specific revenue projection or goal'
      },
      {
        id: 'ai-ask-investment',
        speaker: 'ai',
        text: 'Perfecto. ¿Cuánto capital necesitas para escalar?',
        followUpNodes: ['user-investment-answer']
      },
      {
        id: 'user-investment-answer',
        speaker: 'user',
        expectedResponses: [
          'Buscamos 500,000 dólares',
          'Necesitamos entre 300,000 y 500,000 dólares',
          'Nuestro objetivo es 250,000 dólares',
          'Estamos buscando financiación estratégica'
        ],
        followUpNodes: ['ai-end'],
        feedbackHints: 'State the specific amount of funding you need'
      },
      {
        id: 'ai-end',
        speaker: 'ai',
        text: 'Excelente. ¿Puedo tener tu tarjeta de presentación? Me gustaría conocer más.',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'finance-deal-1',
    industry: 'finance',
    difficulty: 'beginner',
    title: 'Banking Meeting',
    description: 'Discuss your business banking needs',
    context: 'You\'re meeting with a bank representative to open a business account.',
    dialogueFlow: [
      {
        id: 'ai-greet',
        speaker: 'ai',
        text: 'Buenos días. Soy María González del Banco Empresarial. ¿En qué puedo ayudarte hoy?',
        followUpNodes: ['user-intro']
      },
      {
        id: 'user-intro',
        speaker: 'user',
        expectedResponses: [
          'Quiero abrir una cuenta empresarial',
          'Necesito una cuenta de negocios',
          'Me gustaría abrir una cuenta bancaria para mi empresa'
        ],
        followUpNodes: ['ai-ask-company'],
        feedbackHints: 'Use "cuenta empresarial" or "cuenta de negocios"'
      },
      {
        id: 'ai-ask-company',
        speaker: 'ai',
        text: 'Por supuesto. ¿Cuál es el nombre de su empresa y tipo de negocio?',
        followUpNodes: ['user-company-info']
      },
      {
        id: 'user-company-info',
        speaker: 'user',
        expectedResponses: [
          'Somos una empresa de tecnología',
          'Tenemos un negocio de servicios',
          'Vendemos productos en línea',
          'Ofrecemos consultoría financiera'
        ],
        followUpNodes: ['ai-ask-revenue'],
        feedbackHints: 'Describe your company type or business model'
      },
      {
        id: 'ai-ask-revenue',
        speaker: 'ai',
        text: '¿Cuál es su volumen de ingresos mensual aproximado?',
        followUpNodes: ['user-revenue-info']
      },
      {
        id: 'user-revenue-info',
        speaker: 'user',
        expectedResponses: [
          'Entre 10,000 y 50,000 dólares',
          'Más de 50,000 dólares al mes',
          'Entre 5,000 y 10,000 dólares',
          'Menos de 5,000 dólares mensuales'
        ],
        followUpNodes: ['ai-options'],
        feedbackHints: 'Provide your monthly revenue range'
      },
      {
        id: 'ai-options',
        speaker: 'ai',
        text: 'Perfecto. Tenemos tres planes de cuentas empresariales. ¿Le gustaría conocer los detalles?',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'customer-complaint-1',
    industry: 'customer-service',
    difficulty: 'intermediate',
    title: 'Handling Customer Complaint',
    description: 'Respond to an unhappy customer professionally',
    context: 'A customer calls upset about delayed service. You need to resolve it.',
    dialogueFlow: [
      {
        id: 'ai-complaint',
        speaker: 'ai',
        text: '¡Hola! Tengo un problema con mi pedido. Lo ordené hace dos semanas y aún no ha llegado.',
        followUpNodes: ['user-apologize']
      },
      {
        id: 'user-apologize',
        speaker: 'user',
        expectedResponses: [
          'Lo siento mucho por la demora',
          'Me disculpo por el inconveniente',
          'Entiendo su frustración y me disculpo',
          'Perdone la tardanza'
        ],
        followUpNodes: ['ai-ask-order'],
        feedbackHints: 'Start with an apology using "lo siento" or "me disculpo"'
      },
      {
        id: 'ai-ask-order',
        speaker: 'ai',
        text: 'Claro, me gustaría saber el número de su pedido para revisar su estado.',
        followUpNodes: ['user-provide-order']
      },
      {
        id: 'user-provide-order',
        speaker: 'user',
        expectedResponses: [
          'El número de pedido es ABC123',
          'Mi pedido es el número 45678',
          'El número es 789012',
          'Aquí está el número: 345678'
        ],
        followUpNodes: ['ai-investigate'],
        feedbackHints: 'Say "el número de pedido es..." + order number'
      },
      {
        id: 'ai-investigate',
        speaker: 'ai',
        text: 'Permítame revisar eso en nuestro sistema. ¿Puede esperar un momento?',
        followUpNodes: ['user-affirmative']
      },
      {
        id: 'user-affirmative',
        speaker: 'user',
        expectedResponses: [
          'Por supuesto',
          'Sí, puedo esperar',
          'Claro',
          'No hay problema'
        ],
        followUpNodes: ['ai-solution'],
        feedbackHints: 'Use a polite affirmative like "por supuesto" or "claro"'
      },
      {
        id: 'ai-solution',
        speaker: 'ai',
        text: 'He encontrado el problema. Su pedido se retrasó por un problema logístico. Lo enviaremos inmediatamente con envío prioritario sin costo adicional.',
        followUpNodes: ['user-acknowledge']
      },
      {
        id: 'user-acknowledge',
        speaker: 'user',
        expectedResponses: [
          'Gracias por resolver esto',
          'Lo agradezco mucho',
          'Perfecto, muchas gracias',
          'Se lo agradezco'
        ],
        followUpNodes: ['ai-close'],
        feedbackHints: 'Express gratitude with "gracias" or "se lo agradezco"'
      },
      {
        id: 'ai-close',
        speaker: 'ai',
        text: 'De nada. ¿Hay algo más en lo que pueda ayudarlo hoy?',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'sales-call-1',
    industry: 'tech',
    difficulty: 'advanced',
    title: 'Sales Call - Software Demo',
    description: 'Present your product to a potential client',
    context: 'You\'re calling a potential client to demo your enterprise software solution.',
    dialogueFlow: [
      {
        id: 'ai-greet',
        speaker: 'ai',
        text: 'Hola, habla con Roberto Martínez de Logística Global. Me dijiste que querías hablar sobre tu software.',
        followUpNodes: ['user-intro']
      },
      {
        id: 'user-intro',
        speaker: 'user',
        expectedResponses: [
          'Sí, gracias por su tiempo. Tengo una solución que puede interesarle',
          'Correcto, tengo una demo para mostrarle',
          'Sí, me gustaría presentarle nuestra plataforma',
          'Exacto, tenemos un software para su industria'
        ],
        followUpNodes: ['ai-ask-product'],
        feedbackHints: 'Confirm and express that you have a solution to show'
      },
      {
        id: 'ai-ask-product',
        speaker: 'ai',
        text: 'Bien, cuéntame de qué se trata. ¿Qué hace su software?',
        followUpNodes: ['user-explain']
      },
      {
        id: 'user-explain',
        speaker: 'user',
        expectedResponses: [
          'Optimiza la cadena de suministro y reduce costos',
          'Mejora la gestión de inventario en tiempo real',
          'Automatiza procesos logísticos',
          'Reduce errores en almacenamiento y envío'
        ],
        followUpNodes: ['ai-ask-benefits'],
        feedbackHints: 'Explain what the software does in simple terms'
      },
      {
        id: 'ai-ask-benefits',
        speaker: 'ai',
        text: 'Interesante. ¿Qué beneficios específicos obtendría mi empresa?',
        followUpNodes: ['user-benefits']
      },
      {
        id: 'user-benefits',
        speaker: 'user',
        expectedResponses: [
          'Reduciría costos operativos en 30%',
          'Aumentaría la eficiencia en 40%',
          'Eliminaría errores manuales',
          'Mejoraría la satisfacción del cliente'
        ],
        followUpNodes: ['ai-ask-pricing'],
        feedbackHints: 'Give specific, measurable benefits (use percentages)'
      },
      {
        id: 'ai-ask-pricing',
        speaker: 'ai',
        text: 'Suena bien. ¿Cuál es el precio?',
        followUpNodes: ['user-pricing']
      },
      {
        id: 'user-pricing',
        speaker: 'user',
        expectedResponses: [
          'Tenemos tres planes, desde 500 dólares mensuales',
          'El costo depende del tamaño de su operación',
          'Ofrecemos un plan personalizado para su empresa',
          'Comienza en 800 dólares mensuales'
        ],
        followUpNodes: ['ai-ask-trial'],
        feedbackHints: 'Mention price range or that it depends on company size'
      },
      {
        id: 'ai-ask-trial',
        speaker: 'ai',
        text: '¿Ofrecen una prueba gratuita?',
        followUpNodes: ['user-trial']
      },
      {
        id: 'user-trial',
        speaker: 'user',
        expectedResponses: [
          'Sí, ofrecemos 30 días gratis',
          'Claro, puede probarlo sin compromiso',
          'Sí, 14 días de prueba gratuito',
          'Por supuesto, le damos acceso inmediato'
        ],
        followUpNodes: ['ai-next-steps'],
        feedbackHints: 'Confirm that you offer a free trial period'
      },
      {
        id: 'ai-next-steps',
        speaker: 'ai',
        text: 'Perfecto. Me gustaría ver la demo. ¿Cuándo podemos programar esto?',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'bug-fix-1',
    industry: 'tech',
    difficulty: 'intermediate',
    title: 'Bug Fix Discussion',
    description: 'Discuss a critical bug with your development team',
    context: 'You\'re in a sprint planning meeting discussing a critical bug that needs immediate attention.',
    dialogueFlow: [
      {
        id: 'ai-bug-report',
        speaker: 'ai',
        text: 'Tenemos un bug crítico en producción. El sistema de pago está fallando en dispositivos móviles.',
        followUpNodes: ['user-acknowledge-bug']
      },
      {
        id: 'user-acknowledge-bug',
        speaker: 'user',
        expectedResponses: [
          'Entiendo, es urgente',
          'Es crítico, necesitamos solucionarlo ya',
          'Bien, asignemos prioridad alta',
          'Vamos a resolverlo inmediatamente'
        ],
        followUpNodes: ['ai-ask-cause'],
        feedbackHints: 'Acknowledge urgency with "es crítico" or "urgente"'
      },
      {
        id: 'ai-ask-cause',
        speaker: 'ai',
        text: '¿Alguien sabe qué está causando el problema?',
        followUpNodes: ['user-explain-cause']
      },
      {
        id: 'user-explain-cause',
        speaker: 'user',
        expectedResponses: [
          'Parece ser un problema con la API de pago',
          'Es un error en el código de validación',
          'El problema está en la integración con el servidor',
          'Probablemente un problema de compatibilidad'
        ],
        followUpNodes: ['ai-ask-assignment'],
        feedbackHints: 'Mention the technical component that might be failing'
      },
      {
        id: 'ai-ask-assignment',
        speaker: 'ai',
        text: '¿Quién puede tomar esto? Necesitamos alguien con experiencia en el módulo de pago.',
        followUpNodes: ['user-volunteer']
      },
      {
        id: 'user-volunteer',
        speaker: 'user',
        expectedResponses: [
          'Yo puedo tomarlo, conozco ese código',
          'Puedo hacerme cargo',
          'Me encargo de esto',
          'Yo lo resuelvo'
        ],
        followUpNodes: ['ai-ask-timeline'],
        feedbackHints: 'Volunteer by saying "yo puedo tomarlo" or "me encargo"'
      },
      {
        id: 'ai-ask-timeline',
        speaker: 'ai',
        text: '¿Cuánto tiempo necesitas para solucionarlo?',
        followUpNodes: ['user-estimate']
      },
      {
        id: 'user-estimate',
        speaker: 'user',
        expectedResponses: [
          'Lo tendré listo en 4 horas',
          'Creo que en medio día',
          'En unas 6 horas',
          'Para el final del día'
        ],
        followUpNodes: ['ai-confirm'],
        feedbackHints: 'Give a specific time estimate (hours or by end of day)'
      },
      {
        id: 'ai-confirm',
        speaker: 'ai',
        text: 'Perfecto. Avísame cuando lo tengas listo para hacer el deploy.',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'strategy-meeting-1',
    industry: 'tech',
    difficulty: 'advanced',
    title: 'Strategy Meeting Q4 Planning',
    description: 'Present your Q4 strategy to the executive team',
    context: 'You\'re presenting your department\'s Q4 plan in an executive strategy meeting.',
    dialogueFlow: [
      {
        id: 'ai-intro',
        speaker: 'ai',
        text: 'Perfecto, vamos a ver tu plan para Q4. ¿Cuál es tu objetivo principal para este trimestre?',
        followUpNodes: ['user-objective']
      },
      {
        id: 'user-objective',
        speaker: 'user',
        expectedResponses: [
          'Aumentar las ventas en un 25%',
          'Lanzar dos nuevos productos',
          'Expandir al mercado de América Latina',
          'Mejorar la retención de clientes en 15%'
        ],
        followUpNodes: ['ai-ask-strategy'],
        feedbackHints: 'State a specific, measurable objective'
      },
      {
        id: 'ai-ask-strategy',
        speaker: 'ai',
        text: 'Interesante. ¿Cómo planeas lograr ese objetivo?',
        followUpNodes: ['user-strategy']
      },
      {
        id: 'user-strategy',
        speaker: 'user',
        expectedResponses: [
          'Incrementando el equipo de ventas',
          'Invertiendo más en marketing digital',
          'Mejorando nuestros procesos internos',
          'Creando alianzas estratégicas'
        ],
        followUpNodes: ['ai-ask-resources'],
        feedbackHints: 'Explain the specific tactics or actions to achieve your goal'
      },
      {
        id: 'ai-ask-resources',
        speaker: 'ai',
        text: '¿Qué recursos necesitas para ejecutar este plan?',
        followUpNodes: ['user-resources']
      },
      {
        id: 'user-resources',
        speaker: 'user',
        expectedResponses: [
          'Necesitamos contratar 5 personas más',
          'Un presupuesto adicional de 200,000 dólares',
          'Tres meses de tiempo para implementar',
          'Apoyo del departamento de tecnología'
        ],
        followUpNodes: ['ai-ask-timeline'],
        feedbackHints: 'List specific resources: budget, staff, time, or support needed'
      },
      {
        id: 'ai-ask-timeline',
        speaker: 'ai',
        text: '¿Cuál es tu cronograma para alcanzar estos objetivos?',
        followUpNodes: ['user-timeline']
      },
      {
        id: 'user-timeline',
        speaker: 'user',
        expectedResponses: [
          'Esperamos completarlo en 3 meses',
          'Para fin de trimestre',
          'En dos meses podremos ver resultados',
          'Principios del próximo año'
        ],
        followUpNodes: ['ai-end'],
        feedbackHints: 'Provide a specific timeline for completion'
      },
      {
        id: 'ai-end',
        speaker: 'ai',
        text: 'Excelente plan. Tienes nuestro apoyo. Mantennos informados del progreso.',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'manager-inquiry-1',
    industry: 'finance',
    difficulty: 'beginner',
    title: 'Responding to Manager',
    description: 'Answer your manager\'s questions about project status',
    context: 'Your manager calls to check on your project progress and upcoming deadlines.',
    dialogueFlow: [
      {
        id: 'ai-check-in',
        speaker: 'ai',
        text: 'Hola, quería revisar el estado del proyecto con ustedes. ¿Cómo van?',
        followUpNodes: ['user-status']
      },
      {
        id: 'user-status',
        speaker: 'user',
        expectedResponses: [
          'Vamos bien, estamos en el 70% de avance',
          'Estamos un poco atrasados',
          'Todo va según lo planificado',
          'Necesitamos más tiempo'
        ],
        followUpNodes: ['ai-ask-deadline'],
        feedbackHints: 'Give status update with percentage or general state'
      },
      {
        id: 'ai-ask-deadline',
        speaker: 'ai',
        text: '¿Pueden cumplir con la fecha límite original?',
        followUpNodes: ['user-deadline']
      },
      {
        id: 'user-deadline',
        speaker: 'user',
        expectedResponses: [
          'Sí, sin problema',
          'Necesitamos extenderla una semana',
          'Podemos cumplirla',
          'Parece que sí'
        ],
        followUpNodes: ['ai-ask-blockers'],
        feedbackHints: 'Confirm if you can meet the deadline or request extension'
      },
      {
        id: 'ai-ask-blockers',
        speaker: 'ai',
        text: '¿Tienen algún impedimento o bloqueador?',
        followUpNodes: ['user-blockers']
      },
      {
        id: 'user-blockers',
        speaker: 'user',
        expectedResponses: [
          'Necesitamos acceso a más recursos',
          'Estamos esperando feedback del cliente',
          'Hay algunos problemas técnicos',
          'Necesitamos más información'
        ],
        followUpNodes: ['ai-ask-help'],
        feedbackHints: 'Mention specific blocking issues: resources, technical problems, or dependencies'
      },
      {
        id: 'ai-ask-help',
        speaker: 'ai',
        text: '¿En qué puedo ayudarlos a desbloquear esto?',
        followUpNodes: ['user-request-help']
      },
      {
        id: 'user-request-help',
        speaker: 'user',
        expectedResponses: [
          'Podría revisar el código conmigo',
          'Puede hablar con el cliente por nosotros',
          'Necesitamos aprobación para más recursos',
          'Su apoyo sería muy útil'
        ],
        followUpNodes: ['ai-close'],
        feedbackHints: 'Request specific help: review, approval, or coordination support'
      },
      {
        id: 'ai-close',
        speaker: 'ai',
        text: 'Perfecto, voy a apoyarlos. Manténganme actualizado.',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'job-interview-1',
    industry: 'tech',
    difficulty: 'advanced',
    title: 'Technical Job Interview',
    description: 'Answer interview questions for a senior developer position',
    context: 'You\'re interviewing for a senior software engineer role at a tech company.',
    dialogueFlow: [
      {
        id: 'ai-greet-interviewer',
        speaker: 'ai',
        text: '¡Hola! Soy Laura, desarrolladora senior. Gracias por venir. ¿Podrías contarme sobre tu experiencia técnica?',
        followUpNodes: ['user-introduce-experience']
      },
      {
        id: 'user-introduce-experience',
        speaker: 'user',
        expectedResponses: [
          'Tengo 5 años de experiencia desarrollando software',
          'He trabajado principalmente con JavaScript y Python',
          'Mi experiencia es en desarrollo full-stack',
          'He estado en el sector tecnológico por 8 años'
        ],
        followUpNodes: ['ai-ask-technologies'],
        feedbackHints: 'Mention years of experience + your main technical skills'
      },
      {
        id: 'ai-ask-technologies',
        speaker: 'ai',
        text: 'Interesante. ¿Qué tecnologías conoces mejor?',
        followUpNodes: ['user-mention-tech']
      },
      {
        id: 'user-mention-tech',
        speaker: 'user',
        expectedResponses: [
          'React, Node.js, y bases de datos SQL',
          'Java, Spring Framework, y microservicios',
          'Python, Django, y machine learning',
          'Angular, TypeScript, y AWS'
        ],
        followUpNodes: ['ai-ask-challenges'],
        feedbackHints: 'List specific technologies/frameworks you work with'
      },
      {
        id: 'ai-ask-challenges',
        speaker: 'ai',
        text: '¿Puedes darme un ejemplo de un problema técnico difícil que hayas resuelto?',
        followUpNodes: ['user-describe-challenge']
      },
      {
        id: 'user-describe-challenge',
        speaker: 'user',
        expectedResponses: [
          'Optimicé una base de datos que era muy lenta usando índices',
          'Implementé un sistema de caché que redujo la latencia en 50%',
          'Resolví un bug crítico de concurrencia en producción',
          'Refactoricé código legacy para mejorar mantenibilidad'
        ],
        followUpNodes: ['ai-ask-solution-process'],
        feedbackHints: 'Describe a specific technical problem you solved'
      },
      {
        id: 'ai-ask-solution-process',
        speaker: 'ai',
        text: 'Interesante. ¿Cuál fue tu proceso para resolverlo?',
        followUpNodes: ['user-explain-process']
      },
      {
        id: 'user-explain-process',
        speaker: 'user',
        expectedResponses: [
          'Primero analicé los logs y métricas para identificar el problema',
          'Investigé las mejores prácticas y luego implementé la solución',
          'Hice pruebas exhaustivas antes de desplegar',
          'Colaboré con el equipo para revisar el código'
        ],
        followUpNodes: ['ai-ask-availability'],
        feedbackHints: 'Explain your problem-solving process and methodology'
      },
      {
        id: 'ai-ask-availability',
        speaker: 'ai',
        text: 'Perfecto. ¿Cuándo podrías empezar?',
        followUpNodes: ['user-give-availability']
      },
      {
        id: 'user-give-availability',
        speaker: 'user',
        expectedResponses: [
          'Podría empezar en dos semanas',
          'Estoy disponible en un mes',
          'Puedo empezar inmediatamente',
          'Necesito avisar a mi empresa actual con anticipación'
        ],
        followUpNodes: ['ai-end-interview'],
        feedbackHints: 'Give a specific timeframe when you can start'
      },
      {
        id: 'ai-end-interview',
        speaker: 'ai',
        text: 'Excelente. Te contactaremos pronto con los próximos pasos.',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'team-standup-1',
    industry: 'tech',
    difficulty: 'intermediate',
    title: 'Daily Team Standup',
    description: 'Share your progress in a daily team meeting',
    context: 'You\'re in your daily team standup meeting. Share what you\'ve done and what you\'re working on.',
    dialogueFlow: [
      {
        id: 'ai-start-standup',
        speaker: 'ai',
        text: 'Buenos días, equipo. Empecemos el standup. ¿Qué hiciste ayer y en qué estás trabajando hoy?',
        followUpNodes: ['user-share-progress']
      },
      {
        id: 'user-share-progress',
        speaker: 'user',
        expectedResponses: [
          'Ayer completé la funcionalidad de autenticación, hoy voy a trabajar en el API',
          'Terminé las pruebas unitarias, hoy empiezo con la integración',
          'Ayer resolví bugs, hoy continúo con la nueva feature',
          'Completé el diseño, hoy empiezo la implementación'
        ],
        followUpNodes: ['ai-ask-blockers'],
        feedbackHints: 'Share: what you completed yesterday + what you\'re working on today'
      },
      {
        id: 'ai-ask-blockers',
        speaker: 'ai',
        text: '¿Tienes algún impedimento que te esté bloqueando?',
        followUpNodes: ['user-mention-blockers']
      },
      {
        id: 'user-mention-blockers',
        speaker: 'user',
        expectedResponses: [
          'Necesito acceso a la base de datos de prueba',
          'Estoy esperando la aprobación del diseño',
          'Estoy esperando feedback del cliente',
          'No tengo bloquedores por ahora'
        ],
        followUpNodes: ['ai-close-standup'],
        feedbackHints: 'Mention any blockers, or say "no tengo bloquedores"'
      },
      {
        id: 'ai-close-standup',
        speaker: 'ai',
        text: 'Entendido. ¿Algo más?',
        followUpNodes: []
      }
    ]
  },
  {
    id: 'vendor-negotiation-1',
    industry: 'finance',
    difficulty: 'advanced',
    title: 'Vendor Contract Negotiation',
    description: 'Negotiate contract terms with a vendor',
    context: 'You\'re negotiating a service contract with a new vendor for your company.',
    dialogueFlow: [
      {
        id: 'ai-vendor-greeting',
        speaker: 'ai',
        text: '¡Hola! Gracias por considerar nuestros servicios. ¿Cuáles son sus requisitos?',
        followUpNodes: ['user-state-requirements']
      },
      {
        id: 'user-state-requirements',
        speaker: 'user',
        expectedResponses: [
          'Necesitamos soporte 24/7 y integración con nuestro sistema',
          'Requieren servicios de consultoría y actualizaciones regulares',
          'Buscamos una solución escalable y con soporte técnico',
          'Necesitamos un contrato anual con opción de renovación'
        ],
        followUpNodes: ['ai-present-proposal'],
        feedbackHints: 'Specify your requirements: support, features, contract terms'
      },
      {
        id: 'ai-present-proposal',
        speaker: 'ai',
        text: 'Perfecto. Nuestra propuesta incluye esas características por 50,000 dólares anuales. ¿Qué le parece?',
        followUpNodes: ['user-counter-proposal']
      },
      {
        id: 'user-counter-proposal',
        speaker: 'user',
        expectedResponses: [
          'Es un poco alto. Nuestro presupuesto es de 40,000 dólares',
          'Podemos pagar eso si incluyen capacitación adicional',
          '¿Podríamos negociar el precio?',
          'Eso está fuera de nuestro rango presupuestario'
        ],
        followUpNodes: ['ai-respond-negotiation'],
        feedbackHints: 'Negotiate by mentioning your budget or requesting better terms'
      },
      {
        id: 'ai-respond-negotiation',
        speaker: 'ai',
        text: 'Entiendo. ¿Podemos acordar 45,000 con capacitación incluida?',
        followUpNodes: ['user-finalize-agreement']
      },
      {
        id: 'user-finalize-agreement',
        speaker: 'user',
        expectedResponses: [
          'Eso funciona para nosotros',
          'Necesito confirmarlo con mi equipo',
          'Podemos proceder con esos términos',
          'Perfecto, cerremos el trato'
        ],
        followUpNodes: ['ai-confirm-deal'],
        feedbackHints: 'Accept the offer or say you need to confirm'
      },
      {
        id: 'ai-confirm-deal',
        speaker: 'ai',
        text: 'Excelente. Te enviaré el contrato esta semana.',
        followUpNodes: []
      }
    ]
  }
];

