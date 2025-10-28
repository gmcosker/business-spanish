/**
 * Enhanced conversation analysis utilities
 * Provides semantic understanding, vocabulary analysis, and grammar detection
 */

export interface EnhancedFeedback {
  score: number;
  feedbackLevel: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  feedbackMessage: string;
  isFluent: boolean;
  isPassing: boolean;
  correctAnswer: string;
  
  // Enhanced feedback properties
  grammarIssues?: string[];
  vocabularySuggestions?: string[];
  pronunciationTips?: string;
  alternativePhrases?: string[];
}

/**
 * Analyze user response with enhanced semantic understanding
 */
export function analyzeResponseAdvanced(
  userText: string,
  expectedResponses: string[]
): EnhancedFeedback {
  const normalized = normalizeText(userText);
  
  let bestMatch = 0;
  let matchedResponse = '';
  let bestIndex = 0;
  
  // Find best matching expected response
  for (let i = 0; i < expectedResponses.length; i++) {
    const expected = expectedResponses[i];
    const expectedNormalized = normalizeText(expected);
    const similarity = calculateAdvancedSimilarity(normalized, expectedNormalized);
    
    if (similarity > bestMatch) {
      bestMatch = similarity;
      matchedResponse = expected;
      bestIndex = i;
    }
  }
  
  // Analyze response structure
  const wordCount = userText.split(/\s+/).length;
  const isFluent = wordCount >= 4;
  
  // Detect grammar issues
  const grammarIssues = detectGrammarIssues(userText, matchedResponse);
  
  // Suggest vocabulary improvements
  const vocabularySuggestions = suggestVocabulary(userText, matchedResponse);
  
  // Provide alternative phrases
  const alternativePhrases = expectedResponses.slice(0, 3);
  
  // Determine feedback level with enhanced thresholds
  let feedbackLevel: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  let feedbackMessage: string;
  
  if (bestMatch > 0.7 && isFluent && grammarIssues.length === 0) {
    feedbackLevel = 'excellent';
    feedbackMessage = '¡Excelente! Comunicación clara y gramaticalmente correcta.';
  } else if (bestMatch > 0.5 && isFluent) {
    feedbackLevel = 'good';
    feedbackMessage = `¡Bien hecho! Comunicación efectiva. ${
      grammarIssues.length > 0 ? 'Presta atención a la gramática.' : ''
    }`;
  } else if (bestMatch > 0.35) {
    feedbackLevel = 'needs-improvement';
    feedbackMessage = 'Entendido, pero intenta ser más específico y fluido.';
  } else {
    feedbackLevel = 'poor';
    feedbackMessage = 'Necesitas practicar más. Considera usar frases más completas.';
  }
  
  return {
    score: bestMatch,
    isPassing: bestMatch > 0.35,
    correctAnswer: expectedResponses[0],
    feedbackLevel,
    feedbackMessage,
    isFluent,
    grammarIssues: grammarIssues.length > 0 ? grammarIssues : undefined,
    vocabularySuggestions: vocabularySuggestions.length > 0 ? vocabularySuggestions : undefined,
    alternativePhrases: alternativePhrases,
    pronunciationTips: getPronunciationTips(matchedResponse)
  };
}

/**
 * Advanced semantic similarity calculation
 * Uses multiple strategies: word overlap, phrase matching, and conceptual similarity
 */
function calculateAdvancedSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  // Strategy 1: Jaccard similarity
  const jaccardSimilarity = calculateJaccard(str1, str2);
  
  // Strategy 2: Common key phrases
  const phraseSimilarity = checkPhrases(str1, str2);
  
  // Strategy 3: Semantic keywords (business terms)
  const businessTerms = extractBusinessTerms(str1);
  const expectedTerms = extractBusinessTerms(str2);
  const termOverlap = calculateTermOverlap(businessTerms, expectedTerms);
  
  // Weighted average
  return (jaccardSimilarity * 0.5) + (phraseSimilarity * 0.3) + (termOverlap * 0.2);
}

function calculateJaccard(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

function checkPhrases(str1: string, str2: string): number {
  const phrases1 = extractPhrases(str1);
  const phrases2 = extractPhrases(str2);
  
  let matches = 0;
  for (const phrase1 of phrases1) {
    for (const phrase2 of phrases2) {
      if (phrase1.toLowerCase().includes(phrase2.toLowerCase()) || 
          phrase2.toLowerCase().includes(phrase1.toLowerCase())) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(phrases1.length, phrases2.length);
}

function extractPhrases(text: string): string[] {
  const phrases: string[] = [];
  const words = text.split(/\s+/);
  
  // Extract 2-3 word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }
  }
  
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2 && words[i + 2].length > 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  
  return phrases;
}

function extractBusinessTerms(text: string): string[] {
  const businessKeywords = [
    'empresa', 'negocio', 'cliente', 'ventas', 'producto', 'servicio',
    'proyecto', 'presupuesto', 'contrato', 'reunión', 'ventas', 'marketing',
    'tecnología', 'software', 'finanzas', 'inversión', 'equipo', 'gerente',
    'deadline', 'objetivo', 'meta', 'estrategia', 'plazo', 'costo', 'precio'
  ];
  
  const textLower = text.toLowerCase();
  const terms: string[] = [];
  
  for (const keyword of businessKeywords) {
    if (textLower.includes(keyword)) {
      terms.push(keyword);
    }
  }
  
  return terms;
}

function calculateTermOverlap(terms1: string[], terms2: string[]): number {
  const set1 = new Set(terms1);
  const set2 = new Set(terms2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Detect common grammar issues in Spanish
 */
function detectGrammarIssues(userText: string, expectedText: string): string[] {
  const issues: string[] = [];
  const userLower = userText.toLowerCase();
  
  // Check for missing articles
  const articles = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'];
  const hasArticles = articles.some(article => 
    new RegExp(`\\b${article}\\b`).test(userLower)
  );
  
  // Check for verb conjugation issues (basic check for common verbs)
  const commonVerbs = {
    'soy': 'ser',
    'es': 'ser',
    'estoy': 'estar',
    'está': 'estar',
    'tengo': 'tener',
    'tiene': 'tener',
    'necesito': 'necesitar',
    'necesita': 'necesitar'
  };
  
  // Check for missing conjugation
  for (const [conjugated, base] of Object.entries(commonVerbs)) {
    if (expectedText.toLowerCase().includes(base) && !userLower.includes(conjugated)) {
      issues.push(`Considera usar la forma conjugada del verbo "${conjugated}"`);
    }
  }
  
  // Check for proper gender agreement (basic)
  const masculineWords = ['empresario', 'cliente', 'proyecto'];
  const feminineWords = ['empresaria', 'clienta', 'proyecta'];
  
  return issues;
}

/**
 * Suggest vocabulary improvements
 */
function suggestVocabulary(userText: string, expectedText: string): string[] {
  const suggestions: string[] = [];
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  
  // Suggest more professional/business-appropriate terms
  const vocabularyMap: { [key: string]: string[] } = {
    'cosa': ['aspecto', 'elemento', 'factor'],
    'hacer': ['realizar', 'ejecutar', 'desarrollar'],
    'dar': ['brindar', 'ofrecer', 'proporcionar'],
    'bueno': ['eficaz', 'exitoso', 'beneficioso'],
    'malo': ['ineficiente', 'problemático', 'poco efectivo']
  };
  
  for (const [common, professional] of Object.entries(vocabularyMap)) {
    if (userLower.includes(common) && !expectedLower.includes(common)) {
      suggestions.push(`Considera usar términos más profesionales como: ${professional.join(', ')}`);
    }
  }
  
  return suggestions;
}

/**
 * Get pronunciation tips for specific phrases
 */
function getPronunciationTips(text: string): string {
  const tips: string[] = [];
  
  if (text.includes('rr')) {
    tips.push('Pronuncia la "rr" con fuerza');
  }
  
  if (text.includes('ñ')) {
    tips.push('Pronuncia la "ñ" como "nya"');
  }
  
  if (text.includes('ll')) {
    tips.push('Pronuncia la "ll" como "y" suave');
  }
  
  return tips.length > 0 ? tips.join('. ') : 'Pronuncia claramente cada palabra';
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .trim();
}

/**
 * Enhanced branching logic based on semantic analysis
 */
export function getNextNodeBasedOnResponse(
  userResponse: string,
  currentNode: any,
  scenario: any,
  currentIndex: number
): number {
  const responseLower = userResponse.toLowerCase();
  
  // Extract key concepts from user response
  const keyConcepts = extractConcepts(userResponse);
  
  // Check for context-based branching
  if (keyConcepts.has('problema') || keyConcepts.has('issue') || keyConcepts.has('error')) {
    // Look for problem-solving or technical nodes
    const problemNodeIndex = scenario.dialogueFlow.findIndex((node: any, idx: number) =>
      idx > currentIndex && (
        node.text.toLowerCase().includes('problema') ||
        node.text.toLowerCase().includes('solución') ||
        node.text.toLowerCase().includes('error')
      )
    );
    if (problemNodeIndex !== -1) return problemNodeIndex;
  }
  
  if (keyConcepts.has('tecnología') || keyConcepts.has('tech') || keyConcepts.has('software')) {
    const techNodeIndex = scenario.dialogueFlow.findIndex((node: any, idx: number) =>
      idx > currentIndex && (
        node.text.toLowerCase().includes('tecnolog') ||
        node.text.toLowerCase().includes('software')
      )
    );
    if (techNodeIndex !== -1) return techNodeIndex;
  }
  
  if (keyConcepts.has('pequeña') || keyConcepts.has('pyme') || keyConcepts.has('startup')) {
    const smallBizNodeIndex = scenario.dialogueFlow.findIndex((node: any, idx: number) =>
      idx > currentIndex && (
        node.text.toLowerCase().includes('pequeña') ||
        node.text.toLowerCase().includes('pyme')
      )
    );
    if (smallBizNodeIndex !== -1) return smallBizNodeIndex;
  }
  
  // Extract numerical values for revenue/funding conversations
  const numbers = userResponse.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const value = parseInt(numbers[0]);
    if (value > 0 && value < 10000) {
      // Small value - might indicate startup or small business context
      const smallNodeIndex = scenario.dialogueFlow.findIndex((node: any, idx: number) =>
        idx > currentIndex && node.text.toLowerCase().includes('pequeña')
      );
      if (smallNodeIndex !== -1) return smallNodeIndex;
    }
  }
  
  // Check for time references
  if (keyConcepts.has('semana') || keyConcepts.has('mes') || keyConcepts.has('año')) {
    const timeNodeIndex = scenario.dialogueFlow.findIndex((node: any, idx: number) =>
      idx > currentIndex && (
        node.text.toLowerCase().includes('tiempo') ||
        node.text.toLowerCase().includes('cronograma') ||
        node.text.toLowerCase().includes('deadline')
      )
    );
    if (timeNodeIndex !== -1) return timeNodeIndex;
  }
  
  // Default: just advance to next node
  return currentIndex + 1;
}

function extractConcepts(text: string): Set<string> {
  const concepts = new Set<string>();
  const words = text.toLowerCase().split(/\s+/);
  
  const importantWords = [
    'tecnología', 'tech', 'software', 'empresa', 'negocio', 'cliente',
    'ventas', 'producto', 'servicio', 'problema', 'solución', 'error',
    'pequeña', 'pyme', 'startup', 'finanzas', 'inversión', 'dinero',
    'semana', 'mes', 'año', 'tiempo', 'cronograma', 'deadline',
    'equipo', 'gerente', 'empleado', 'trabajo', 'proyecto'
  ];
  
  for (const word of words) {
    if (importantWords.includes(word)) {
      concepts.add(word);
    }
  }
  
  return concepts;
}




