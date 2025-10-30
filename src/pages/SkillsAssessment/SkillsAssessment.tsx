import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, ChevronRight, Volume2, Check, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './SkillsAssessment.css';

interface AssessmentResults {
  speaking: number;
  vocabulary: number;
  reading: number;
  cultural: number;
  listening: number;
  overall: number;
  recommendedModules: string[];
  learningPath: 'focused' | 'balanced' | 'intensive';
  focusAreas: string[];
}

const SkillsAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();
  
  const [currentSection, setCurrentSection] = useState<string>('intro');
  const [speakingTranscript, setSpeakingTranscript] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES'; // Spanish
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setSpeakingTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognition);
      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeakingTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = (): AssessmentResults => {
    // Calculate scores (0-5 scale)
    const speaking = calculateSpeakingScore();
    const vocabulary = calculateVocabularyScore();
    const reading = calculateReadingScore();
    const cultural = calculateCulturalScore();
    const listening = (vocabulary + reading) / 2; // Estimate from other skills
    
    const overall = (speaking + vocabulary + reading + cultural + listening) / 5;
    
    // Determine learning path
    const scores = { speaking, vocabulary, reading, cultural, listening };
    const strengths = Object.entries(scores)
      .filter(([_, score]) => score >= 3.5)
      .map(([skill]) => skill);
    const weaknesses = Object.entries(scores)
      .filter(([_, score]) => score < 3)
      .map(([skill]) => skill);

    let learningPath: 'focused' | 'balanced' | 'intensive' = 'balanced';
    let recommendedModules: string[] = [];
    let focusAreas: string[] = [];

    if (weaknesses.length >= 3) {
      learningPath = 'intensive';
      recommendedModules = [
        'tech-1', 'tech-2', 'conversation-practice', 
        'vocabulary-review', 'finance-1'
      ];
      focusAreas = weaknesses;
    } else if (weaknesses.length > 0) {
      learningPath = 'focused';
      recommendedModules = getFocusedModules(weaknesses[0]);
      focusAreas = weaknesses;
    } else {
      learningPath = 'balanced';
      recommendedModules = [
        'tech-1', 'tech-2', 'tech-3', 'finance-1', 
        'conversation-practice', 'vocabulary-review'
      ];
      focusAreas = strengths;
    }

    // Add industry-specific recommendations
    const industryModules = getIndustryModules();
    recommendedModules = [...industryModules, ...recommendedModules];

    return {
      speaking,
      vocabulary,
      reading,
      cultural,
      listening,
      overall,
      recommendedModules: [...new Set(recommendedModules)],
      learningPath,
      focusAreas
    };
  };

  const calculateSpeakingScore = (): number => {
    const transcript = speakingTranscript.toLowerCase();
    let score = 2; // Base score
    
    // Check for Spanish words
    const spanishWords = transcript.split(' ').filter(word => 
      word.includes('a') || word.includes('o') || word.includes('e') ||
      word.includes('í') || word.includes('á') || word.includes('é')
    );
    
    if (spanishWords.length > 3) score = 3;
    if (spanishWords.length > 5 && transcript.length > 50) score = 4;
    if (spanishWords.length > 8 && transcript.length > 100) score = 5;
    
    return score;
  };

  const calculateVocabularyScore = (): number => {
    let correct = 0;
    vocabularyQuestions.forEach((q, i) => {
      const selectedAnswer = answers[`vocab${i + 1}`];
      if (selectedAnswer) {
        const optionIndex = parseInt(selectedAnswer.split('-')[1]);
        if (q.options[optionIndex]?.value === 'correct') {
          correct++;
        }
      }
    });
    return (correct / 5) * 5;
  };

  const calculateReadingScore = (): number => {
    let correct = 0;
    readingQuestions.forEach((q, i) => {
      const selectedAnswer = answers[`reading${i + 1}`];
      if (selectedAnswer) {
        const optionIndex = parseInt(selectedAnswer.split('-')[1]);
        if (q.options[optionIndex]?.value === 'correct') {
          correct++;
        }
      }
    });
    return (correct / 3) * 5;
  };

  const calculateCulturalScore = (): number => {
    let correct = 0;
    culturalQuestions.forEach((q, i) => {
      const selectedAnswer = answers[`cultural${i + 1}`];
      if (selectedAnswer) {
        const optionIndex = parseInt(selectedAnswer.split('-')[1]);
        if (q.options[optionIndex]?.value === 'correct') {
          correct++;
        }
      }
    });
    return (correct / 3) * 5;
  };

  const getFocusedModules = (weakness: string): string[] => {
    const moduleMap: Record<string, string[]> = {
      speaking: ['conversation-practice', 'tech-1', 'finance-1'],
      vocabulary: ['vocabulary-review', 'tech-1', 'tech-2'],
      reading: ['tech-1', 'finance-1'],
      cultural: ['tech-1', 'finance-1', 'cs-1'],
      listening: ['conversation-practice', 'tech-1']
    };
    return moduleMap[weakness] || ['tech-1'];
  };

  const getIndustryModules = (): string[] => {
    const industry = answers.industry || 'tech';
    return industry === 'tech' ? ['tech-1', 'tech-2'] : [`${industry}-1`];
  };

  const handleContinue = () => {
    if (currentSection === 'speaking') {
      stopRecording();
      setCurrentSection('vocabulary');
    } else if (currentSection === 'vocabulary') {
      setCurrentSection('reading');
    } else if (currentSection === 'reading') {
      setCurrentSection('cultural');
    } else if (currentSection === 'cultural') {
      setCurrentSection('industry');
    } else if (currentSection === 'industry') {
      // Calculate and show results
      const assessmentResults = calculateResults();
      setResults(assessmentResults);
      setCurrentSection('results');
    } else if (currentSection === 'results') {
      // Complete onboarding with assessment results
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const handleRetake = () => {
    setCurrentSection('intro');
    setAnswers({});
    setSpeakingTranscript('');
    setResults(null);
  };

  if (currentSection === 'intro') {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <h1>Welcome to Your Personalized Learning Path</h1>
          <p className="intro-text">
            This quick assessment (5-7 minutes) will help us understand your comfort level 
            with Spanish and create a customized learning plan just for you.
          </p>
          
          <div className="assessment-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Speaking Comfort Check</h3>
                <p>Record yourself speaking Spanish (participation-based)</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Vocabulary Quiz</h3>
                <p>Test your business Spanish vocabulary</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Reading & Cultural</h3>
                <p>Assess comprehension and cultural awareness</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Industry Focus</h3>
                <p>Choose your primary business area</p>
              </div>
            </div>
            
            <div className="assessment-note">
              <p className="note-text">
                <strong>Remember:</strong> This assessment evaluates your comfort and engagement with Spanish. 
                Detailed pronunciation feedback will be provided during your lessons.
              </p>
            </div>
          </div>

          <button 
            className="cta-primary assessment-cta"
            onClick={() => setCurrentSection('speaking')}
          >
            Begin Assessment
            <ChevronRight />
          </button>
        </div>
      </div>
    );
  }

  if (currentSection === 'results' && results) {
    return (
      <div className="assessment-container results-container">
        <div className="assessment-card results-card">
          <h1>Your Personalized Learning Path</h1>
          
          <div className="results-overview">
            <div className="score-card overall-score">
              <div className="score-label">Overall Proficiency</div>
              <div className="score-value">{results.overall.toFixed(1)}/5</div>
            </div>
            
            <div className="skills-grid">
              <div className="skill-item">
                <div className="skill-label">Speaking</div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill" 
                    style={{ width: `${results.speaking * 20}%` }}
                  />
                </div>
                <div className="skill-score">{results.speaking.toFixed(1)}/5</div>
              </div>
              <div className="skill-item">
                <div className="skill-label">Vocabulary</div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill" 
                    style={{ width: `${results.vocabulary * 20}%` }}
                  />
                </div>
                <div className="skill-score">{results.vocabulary.toFixed(1)}/5</div>
              </div>
              <div className="skill-item">
                <div className="skill-label">Reading</div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill" 
                    style={{ width: `${results.reading * 20}%` }}
                  />
                </div>
                <div className="skill-score">{results.reading.toFixed(1)}/5</div>
              </div>
              <div className="skill-item">
                <div className="skill-label">Cultural</div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill" 
                    style={{ width: `${results.cultural * 20}%` }}
                  />
                </div>
                <div className="skill-score">{results.cultural.toFixed(1)}/5</div>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h2>Recommended Learning Path: {results.learningPath.charAt(0).toUpperCase() + results.learningPath.slice(1)}</h2>
            
            <div className="focus-areas">
              <h3>Focus Areas:</h3>
              <div className="focus-tags">
                {results.focusAreas.map(area => (
                  <span key={area} className="focus-tag">
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="recommended-modules">
              <h3>Your Customized Modules:</h3>
              <ul>
                {results.recommendedModules.slice(0, 6).map(module => (
                  <li key={module}>
                    <Check className="check-icon" />
                    {module.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            className="cta-primary assessment-cta"
            onClick={handleContinue}
          >
            Start Learning
            <ChevronRight />
          </button>
          
          <button 
            className="cta-secondary assessment-cta"
            onClick={handleRetake}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${getProgressPercentage()}%` 
            }} 
          />
        </div>

        {/* Speaking Section */}
        {currentSection === 'speaking' && (
          <div className="section-content">
            <h2>Speaking Assessment</h2>
            <p className="section-description">
              We'll evaluate your speaking engagement and comfort level with Spanish. 
              Click the microphone button and say the following sentence:
            </p>
            
            <div className="assessment-disclaimer">
              <p className="disclaimer-text">
                <strong>Note:</strong> This assessment evaluates your participation and comfort 
                speaking Spanish, not pronunciation accuracy. We'll provide pronunciation feedback 
                during your actual lessons!
              </p>
            </div>
            
            <div className="speaking-prompt">
              <Volume2 className="audio-icon" />
              <p>"Estoy interesado en discutir una oportunidad de negocio con su equipo."</p>
              <p className="translation">"I am interested in discussing a business opportunity with your team."</p>
            </div>

            <div className="voice-recorder">
              <button 
                className={`record-button ${isRecording ? 'recording' : ''}`}
                onClick={startRecording}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </button>
              <p className="record-status">
                {isRecording ? 'Recording...' : 'Hold to speak'}
              </p>
            </div>

            {speakingTranscript && (
              <div className="transcript-display">
                <p className="transcript-label">Your response:</p>
                <p className="transcript-text">{speakingTranscript}</p>
              </div>
            )}

            <button 
              className="cta-primary assessment-cta"
              onClick={handleContinue}
              disabled={!speakingTranscript}
            >
              Continue
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Vocabulary Section */}
        {currentSection === 'vocabulary' && (
          <div className="section-content">
            <h2>Vocabulary Assessment</h2>
            <p className="section-description">
              Choose the best Spanish translation for each business term:
            </p>
            
            <div className="quiz-questions">
              {vocabularyQuestions.map((q, i) => (
                <div key={q.id} className="quiz-question">
                  <h3>{q.question}</h3>
                  <div className="quiz-options">
                    {q.options.map((option, optIndex) => (
                      <button
                        key={`${q.id}-${optIndex}`}
                        className={`quiz-option ${answers[`vocab${i + 1}`] === `${q.id}-${optIndex}` ? 'selected' : ''}`}
                        onClick={() => handleAnswer(`vocab${i + 1}`, `${q.id}-${optIndex}`)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="cta-primary assessment-cta"
              onClick={handleContinue}
              disabled={!answers.vocab1 || !answers.vocab5}
            >
              Continue
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Reading Section */}
        {currentSection === 'reading' && (
          <div className="section-content">
            <h2>Reading Comprehension</h2>
            <p className="section-description">
              Read this business email and answer the questions below:
            </p>
            
            <div className="reading-passage">
              <p>
                Estimado equipo,<br />
                Me gustaría programar una reunión para discutir el proyecto. 
                ¿Está disponible mañana a las 3 PM? Por favor, confirme su asistencia 
                antes del mediodía.
              </p>
            </div>

            <div className="quiz-questions">
              {readingQuestions.map((q, i) => (
                <div key={q.id} className="quiz-question">
                  <h3>{q.question}</h3>
                  <div className="quiz-options">
                    {q.options.map((option, optIndex) => (
                      <button
                        key={`${q.id}-${optIndex}`}
                        className={`quiz-option ${answers[`reading${i + 1}`] === `${q.id}-${optIndex}` ? 'selected' : ''}`}
                        onClick={() => handleAnswer(`reading${i + 1}`, `${q.id}-${optIndex}`)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="cta-primary assessment-cta"
              onClick={handleContinue}
              disabled={!answers.reading1 || !answers.reading3}
            >
              Continue
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Cultural Section */}
        {currentSection === 'cultural' && (
          <div className="section-content">
            <h2>Cultural Awareness</h2>
            <p className="section-description">
              Understanding business culture is crucial. Select the most appropriate response:
            </p>
            
            <div className="quiz-questions">
              {culturalQuestions.map((q, i) => (
                <div key={q.id} className="quiz-question">
                  <h3>{q.question}</h3>
                  <div className="quiz-options">
                    {q.options.map((option, optIndex) => (
                      <button
                        key={`${q.id}-${optIndex}`}
                        className={`quiz-option ${answers[`cultural${i + 1}`] === `${q.id}-${optIndex}` ? 'selected' : ''}`}
                        onClick={() => handleAnswer(`cultural${i + 1}`, `${q.id}-${optIndex}`)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="cta-primary assessment-cta"
              onClick={handleContinue}
              disabled={!answers.cultural1 || !answers.cultural3}
            >
              Continue
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Industry Section */}
        {currentSection === 'industry' && (
          <div className="section-content">
            <h2>Industry Focus</h2>
            <p className="section-description">
              Select the industry where you'll primarily use Spanish:
            </p>
            
            <div className="industry-grid">
              {industries.map(industry => (
                <button
                  key={industry.id}
                  className={`industry-card ${answers.industry === industry.id ? 'selected' : ''}`}
                  onClick={() => handleAnswer('industry', industry.id)}
                >
                  <div className="industry-icon">{industry.icon}</div>
                  <h3>{industry.name}</h3>
                  <p>{industry.description}</p>
                </button>
              ))}
            </div>

            <button 
              className="cta-primary assessment-cta"
              onClick={handleContinue}
              disabled={!answers.industry}
            >
              Complete Assessment
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Quiz Data
const vocabularyQuestions = [
  {
    id: 'vocab1',
    question: 'What is the Spanish translation for "Revenue"?',
    options: [
      { label: 'Ingresos', value: 'correct' },
      { label: 'Gastos', value: 'incorrect' },
      { label: 'Ventas', value: 'incorrect' },
      { label: 'Costos', value: 'incorrect' }
    ]
  },
  {
    id: 'vocab2',
    question: 'How do you say "To negotiate" in Spanish?',
    options: [
      { label: 'Vender', value: 'incorrect' },
      { label: 'Negociar', value: 'correct' },
      { label: 'Aprobar', value: 'incorrect' },
      { label: 'Contratar', value: 'incorrect' }
    ]
  },
  {
    id: 'vocab3',
    question: 'What does "El plazo" mean in business context?',
    options: [
      { label: 'The deal', value: 'incorrect' },
      { label: 'The deadline', value: 'correct' },
      { label: 'The budget', value: 'incorrect' },
      { label: 'The contract', value: 'incorrect' }
    ]
  },
  {
    id: 'vocab4',
    question: 'Translate "Meeting" to Spanish:',
    options: [
      { label: 'Conversación', value: 'incorrect' },
      { label: 'Entrevista', value: 'incorrect' },
      { label: 'Reunión', value: 'correct' },
      { label: 'Llamada', value: 'incorrect' }
    ]
  },
  {
    id: 'vocab5',
    question: 'What is "El presupuesto"?',
    options: [
      { label: 'The proposal', value: 'incorrect' },
      { label: 'The budget', value: 'correct' },
      { label: 'The invoice', value: 'incorrect' },
      { label: 'The payment', value: 'incorrect' }
    ]
  }
];

const readingQuestions = [
  {
    id: 'reading1',
    question: 'What time is the meeting?',
    options: [
      { label: 'Morning', value: 'incorrect' },
      { label: '3 PM', value: 'correct' },
      { label: 'Noon', value: 'incorrect' },
      { label: 'Not specified', value: 'incorrect' }
    ]
  },
  {
    id: 'reading2',
    question: 'When should you confirm attendance?',
    options: [
      { label: 'Before morning', value: 'incorrect' },
      { label: 'Before 3 PM', value: 'incorrect' },
      { label: 'Before noon', value: 'correct' },
      { label: 'After the meeting', value: 'incorrect' }
    ]
  },
  {
    id: 'reading3',
    question: 'What is the main topic of the email?',
    options: [
      { label: 'A new hire', value: 'incorrect' },
      { label: 'Scheduling a meeting', value: 'correct' },
      { label: 'Project completion', value: 'incorrect' },
      { label: 'Budget approval', value: 'incorrect' }
    ]
  }
];

const culturalQuestions = [
  {
    id: 'cultural1',
    question: 'In a first business meeting with Latin American colleagues, you should:',
    options: [
      { label: 'Get straight to business immediately', value: 'incorrect' },
      { label: 'Greet warmly and exchange pleasantries first', value: 'correct' },
      { label: 'Present your proposal right away', value: 'incorrect' },
      { label: 'Discuss business via email only', value: 'incorrect' }
    ]
  },
  {
    id: 'cultural2',
    question: 'What is the most appropriate way to address a client in Spanish?',
    options: [
      { label: 'Use informal "tú" in all situations', value: 'incorrect' },
      { label: 'Use formal "usted" until invited to be informal', value: 'correct' },
      { label: 'Use their first name immediately', value: 'incorrect' },
      { label: 'Avoid using names altogether', value: 'incorrect' }
    ]
  },
  {
    id: 'cultural3',
    question: 'When scheduling meetings in Latin America, you should:',
    options: [
      { label: 'Expect strict punctuality', value: 'incorrect' },
      { label: 'Allow extra time for relationship building', value: 'correct' },
      { label: 'Keep meetings under 15 minutes', value: 'incorrect' },
      { label: 'Schedule back-to-back meetings', value: 'incorrect' }
    ]
  }
];

const industries = [
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    description: 'Software, startups, SaaS'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    description: 'Banking, investment, accounting'
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: '📦',
    description: 'Supply chain, operations, shipping'
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    icon: '🤝',
    description: 'Support, sales, client relations'
  },
  {
    id: 'architecture',
    name: 'Architecture & Construction',
    icon: '🏗️',
    description: 'Drawings, RFIs, field coordination'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical Admin',
    icon: '🏥',
    description: 'Patient intake, triage, care instructions'
  }
];

const getProgressPercentage = () => {
  const sections = ['intro', 'speaking', 'vocabulary', 'reading', 'cultural', 'industry', 'results'];
  const currentIndex = sections.indexOf('speaking'); // Starting from speaking
  return (currentIndex / (sections.length - 1)) * 100;
};

export default SkillsAssessment;

