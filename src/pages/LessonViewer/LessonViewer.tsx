import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, CheckCircle, Volume2, Eye, EyeOff, AlertCircle, Pause } from 'lucide-react';
import { useState } from 'react';
import SpeechPractice from '../../components/SpeechPractice/SpeechPractice';

// AudioController component for managing play/pause/resume
function AudioController({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleToggle = () => {
    if (!isPlaying && !isPaused) {
      // Start playing
      const voices = window.speechSynthesis.getVoices();
      let spanishVoice = voices.find(v => v.lang === 'es-ES' && v.name.toLowerCase().includes('sarah')) ||
                         voices.find(v => v.lang === 'es-ES') ||
                         voices.find(v => v.lang === 'es-MX') ||
                         voices.find(v => v.lang === 'es-US') ||
                         voices.find(v => v.lang.startsWith('es-'));
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
        utterance.lang = spanishVoice.lang;
      } else {
        utterance.lang = 'es-ES';
      }
      
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } else if (isPlaying && !isPaused) {
      // Pause
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`text-gray-400 transition-colors ${
        isPlaying ? 'text-primary-600' : 'hover:text-primary-600'
      }`}
      title={
        isPlaying && !isPaused ? 'Pause audio' :
        isPaused ? 'Resume audio' :
        'Play audio'
      }
    >
      {isPlaying && !isPaused ? (
        <Pause className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
}

export default function LessonViewer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { modules, progress, completeLesson } = useStore();
  const [showTranslations, setShowTranslations] = useState(false);

  if (!lessonId || !progress) return null;

  const lesson = modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  const module = modules.find((m) => m.id === lesson?.moduleId);

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600">Lesson not found</p>
        <button onClick={() => navigate('/learning-path')} className="btn-primary mt-4">
          Back to Learning Path
        </button>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.includes(lesson.id);

  const handleComplete = () => {
    completeLesson(lesson.id);
    
    // Find next lesson
    const currentModuleIndex = modules.findIndex((m) => m.id === module.id);
    const currentLessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);
    
    let nextLesson = null;
    
    // Check for next lesson in current module
    if (currentLessonIndex < module.lessons.length - 1) {
      nextLesson = module.lessons[currentLessonIndex + 1];
    } else if (currentModuleIndex < modules.length - 1) {
      // Check for first lesson in next module
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        nextLesson = nextModule.lessons[0];
      }
    }

    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate('/learning-path');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button
          onClick={() => navigate('/learning-path')}
          className="flex items-center gap-1 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Learning Path
        </button>
        <span>/</span>
        <span className="text-gray-400">{module.title}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{lesson.title}</span>
      </div>
      
      {/* Header */}
      <div>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-primary-600 font-medium mb-1">{module.title}</div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600 mt-2">
              {lesson.duration} minutes • {lesson.type}
            </p>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Lesson content */}
      <div className="card p-8">
        {/* Video placeholder */}
        {lesson.type === 'video' && (
          <div className="mb-8">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-lg">Video Lesson</p>
                <p className="text-sm text-gray-400 mt-2">
                  In a production app, this would be an embedded video player
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dialogue */}
        {lesson.content.dialogue && lesson.content.dialogue.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Dialogue</h2>
              <button
                onClick={() => setShowTranslations(!showTranslations)}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                {showTranslations ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Hide Translations
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Show Translations
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {lesson.content.dialogue.map((line, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-primary-700">{line.speaker}</div>
                    <AudioController text={line.text} />
                  </div>
                  <p className="text-lg text-gray-900 mb-2">{line.text}</p>
                  {showTranslations && (
                    <p className="text-sm text-gray-600 italic">{line.translation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary */}
        {lesson.content.vocabulary && lesson.content.vocabulary.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Vocabulary</h2>
            <div className="grid gap-4">
              {lesson.content.vocabulary.map((item) => (
                <VocabularyItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Cultural Notes */}
        {lesson.content.culturalNotes && lesson.content.culturalNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cultural Notes 🌎</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              {lesson.content.culturalNotes.map((note, index) => (
                <p key={index} className="text-sm text-gray-700">
                  • {note}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Speech Practice */}
        {lesson.content.dialogue && lesson.content.dialogue.length > 0 && (
          <div className="mb-8">
            <SpeechPractice
              targetPhrase={lesson.content.dialogue[0].text}
              translation={lesson.content.dialogue[0].translation || ''}
            />
          </div>
        )}

        {/* Practice Exercises */}
        {lesson.content.practiceExercises && lesson.content.practiceExercises.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice</h2>
            <div className="space-y-4">
              {lesson.content.practiceExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </div>
        )}

        {/* Complete button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <button
            onClick={() => navigate('/learning-path')}
            className="btn-secondary"
          >
            Back to Modules
          </button>
          <button
            onClick={handleComplete}
            className="btn-primary flex items-center gap-2"
          >
            {isCompleted ? 'Continue to Next Lesson' : 'Mark as Complete'}
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VocabularyItemCard({ item }: { item: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">
              {item.term}
            </span>
            <AudioController text={item.term} />
          </div>
          <span className="text-sm text-gray-600">{item.translation}</span>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.context}
        </span>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        <span className="font-medium">Example:</span> {item.example}
      </p>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: any }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = (selectedAnswer: string) => {
    setUserAnswer(selectedAnswer);
    
    // Normalize text for comparison (remove accents and lowercase)
    const normalizeText = (text: string) =>
      text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[¿?¡!.,]/g, '') // Remove punctuation
        .trim();
    
    const normalizedUser = normalizeText(selectedAnswer);
    const normalizedCorrect = normalizeText(exercise.correctAnswer);
    
    const correct = normalizedUser === normalizedCorrect;
    setIsCorrect(correct);
  };

  const getOptionClassName = (option: string, userAnswer: string) => {
    if (userAnswer === '') {
      return 'border-gray-200 hover:border-primary-300 hover:bg-primary-50';
    }
    
    const isSelected = userAnswer === option;
    const isAnswerCorrect = option === exercise.correctAnswer;
    
    if (isSelected) {
      // User's selected answer
      if (isAnswerCorrect) {
        return 'border-green-500 bg-green-50 text-green-900';
      } else {
        return 'border-red-500 bg-red-50 text-red-900';
      }
    } else if (isAnswerCorrect) {
      // Correct answer (not selected by user)
      return 'border-green-500 bg-green-50 text-green-900';
    } else {
      // Other options
      return 'border-gray-200 text-gray-500';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-medium text-gray-900 mb-3">{exercise.question}</p>

      {exercise.type === 'multiple-choice' && (
        <div className="space-y-2 mb-3">
          {exercise.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => checkAnswer(option)}
              disabled={isCorrect !== null}
              className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
                isCorrect === null ? 'cursor-pointer' : 'cursor-default'
              } ${getOptionClassName(option, userAnswer)}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isCorrect !== null && userAnswer === option && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )
                )}
                {isCorrect !== null && option === exercise.correctAnswer && userAnswer !== option && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {exercise.type === 'fill-blank' && (
        <div className="mb-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onBlur={() => checkAnswer(userAnswer)}
            placeholder="Type your answer..."
            className={`w-full px-4 py-2 border rounded-lg ${
              isCorrect === true
                ? 'border-green-500 bg-green-50'
                : isCorrect === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
          />
        </div>
      )}

      {/* Immediate Feedback */}
      {isCorrect !== null && (
        <div className={`mt-3 p-4 rounded-lg flex items-start gap-3 ${
          isCorrect
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">¡Correcto! 🎉</p>
                {exercise.explanation && (
                  <p className="text-sm text-green-700">{exercise.explanation}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-1">Incorrecto</p>
                <p className="text-sm text-red-700 mb-2">
                  The correct answer is: <strong>{exercise.correctAnswer}</strong>
                </p>
                {exercise.explanation && (
                  <p className="text-sm text-red-700">{exercise.explanation}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

