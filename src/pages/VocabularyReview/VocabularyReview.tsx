import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Volume2, RotateCcw, CheckCircle, XCircle, ChevronRight, AlertCircle, Pause } from 'lucide-react';
import type { VocabularyItem } from '../../types';
import { 
  getWordsToReview, 
  updateItemAfterSuccess, 
  updateItemAfterFailure,
  getReviewPriority,
  getDaysUntilReview 
} from '../../utils/spacedRepetition';

// AudioController component for managing play/pause/resume
function AudioController({ text, size = 'sm' }: { text: string; size?: 'sm' | 'lg' }) {
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
        <Pause className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      ) : (
        <Volume2 className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      )}
    </button>
  );
}

export default function VocabularyReview() {
  const { modules, vocabularyItems, updateVocabularyItem } = useStore();
  const [reviewMode, setReviewMode] = useState<'due' | 'all'>('due');
  const [displayMode, setDisplayMode] = useState<'browse' | 'quiz'>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);

  // Collect all vocabulary from lessons
  const allVocabulary: VocabularyItem[] = modules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.content.vocabulary || [])
  );

  // Get words that need review today
  const wordsToReview = getWordsToReview(allVocabulary);
  
  // Choose which vocabulary set to use
  const vocabularyToUse = reviewMode === 'due' ? wordsToReview : allVocabulary;
  
  // Sort by priority (high priority first), then by Spanish-specific words first
  const ENGLISH_LOANWORDS = [
    'startup', 'ceo', 'cto', 'coo', 'cfo', 'pr', 'hr', 'vc', 'ipo',
    'mrr', 'cac', 'ltv', 'roi', 'kpi', 'saas', 'paas', 'iaas',
    'api', 'sdk', 'mvp', 'ui', 'ux', 'qa', 'devops', 'ci/cd',
    'agile', 'scrum', 'kanban', 'retro', 'standup', 'sprint',
    'backend', 'frontend', 'fullstack', 'deployment', 'pull request',
    'query', 'database', 'software', 'hardware', 'bug', 'feature',
    'wireframe', 'mockup', 'prototype', 'roadmap', 'backlog',
    'performance', 'issue', 'testing', 'refactoring'
  ];

  const isEnglishLoanword = (term: string): boolean => {
    const normalized = term.toLowerCase().replace(/\s+/g, '-');
    return ENGLISH_LOANWORDS.includes(normalized);
  };

  const sortedVocabulary = [...vocabularyToUse].sort((a, b) => {
    const priorityA = getReviewPriority(a);
    const priorityB = getReviewPriority(b);
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    
    // First sort by priority
    const priorityDiff = priorityOrder[priorityA] - priorityOrder[priorityB];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by Spanish-specific words first
    const aIsLoanword = isEnglishLoanword(a.term);
    const bIsLoanword = isEnglishLoanword(b.term);
    
    if (aIsLoanword && !bIsLoanword) return 1;  // a is loanword, b is Spanish - put a after
    if (!aIsLoanword && bIsLoanword) return -1; // a is Spanish, b is loanword - put a first
    return 0; // Both same type, maintain order
  });

  const currentItem = sortedVocabulary[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < sortedVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAnswer = (quality: 'easy' | 'good' | 'hard') => {
    setStudiedCount(studiedCount + 1);
    
    const item = currentItem;
    let updatedItem: VocabularyItem;
    
    // Use the spaced repetition algorithm
    if (quality === 'easy' || quality === 'good') {
      updatedItem = updateItemAfterSuccess(item);
    } else {
      updatedItem = updateItemAfterFailure(item);
    }

    // Update in the store
    updateVocabularyItem(item.id, {
      interval: updatedItem.interval,
      easeFactor: updatedItem.easeFactor,
      nextReview: updatedItem.nextReview,
      repetitions: updatedItem.repetitions,
    });

    handleNext();
  };

  if (allVocabulary.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Vocabulary Yet</h2>
        <p className="text-gray-600 mb-6">
          Complete lessons to build your vocabulary collection
        </p>
        <button
          onClick={() => window.location.href = '/learning-path'}
          className="btn-primary"
        >
          Start Learning
        </button>
      </div>
    );
  }

  if (reviewMode === 'due' && wordsToReview.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
        <p className="text-gray-600 mb-6">
          You have no words due for review today. Great job! Keep learning new vocabulary.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/learning-path'}
            className="btn-primary block mx-auto"
          >
            Continue Learning
          </button>
          <button
            onClick={() => { setReviewMode('all'); setCurrentIndex(0); }}
            className="btn-secondary block mx-auto"
          >
            Review All Words
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vocabulary Review</h1>
            <p className="text-gray-600 mt-1">
              {wordsToReview.length} words due for review • {allVocabulary.length} total terms
            </p>
          </div>
        </div>

        {/* Filter switcher */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => { 
              setReviewMode('due'); 
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              reviewMode === 'due'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Words Due ({wordsToReview.length})
          </button>
          <button
            onClick={() => { 
              setReviewMode('all');
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              reviewMode === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Words ({allVocabulary.length})
          </button>
        </div>

        {/* Display mode switcher */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDisplayMode('quiz')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              displayMode === 'quiz'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quiz Mode
          </button>
          <button
            onClick={() => setDisplayMode('browse')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              displayMode === 'browse'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse
          </button>
        </div>
      </div>

      {displayMode === 'browse' ? (
        /* Browse mode - Grid of vocabulary */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedVocabulary.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.term}</h3>
                    <AudioController text={item.term} />
                  </div>
                  <p className="text-gray-600">{item.translation}</p>
                </div>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {item.context}
                </span>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                <span className="font-medium">Example:</span> {item.example}
              </p>
              {item.repetitions > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  Reviewed {item.repetitions} times
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Quiz mode - Flashcard style */
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {currentIndex + 1} / {sortedVocabulary.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / sortedVocabulary.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div className="card p-8 min-h-[400px] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full mb-6">
                {currentItem.context}
              </div>

              {!showAnswer ? (
                /* Question side */
                <div>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <h2 className="text-4xl font-bold text-gray-900">
                      {currentItem.term}
                    </h2>
                    <AudioController text={currentItem.term} size="lg" />
                  </div>
                  <p className="text-gray-600 mb-8 italic">{currentItem.example}</p>
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="btn-primary"
                  >
                    Show Answer
                  </button>
                </div>
              ) : (
                /* Answer side */
                <div className="w-full">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-4xl font-bold text-gray-900">
                      {currentItem.term}
                    </h2>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-2xl text-primary-600 mb-4">
                    {currentItem.translation}
                  </p>
                  <p className="text-gray-600 mb-8 italic">{currentItem.example}</p>

                  {/* Answer buttons */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-2">How well did you know this?</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAnswer('hard')}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-6 h-6 text-red-600" />
                        <span className="text-sm font-medium text-red-700">Hard</span>
                        <span className="text-xs text-gray-600">Review soon</span>
                      </button>
                      <button
                        onClick={() => handleAnswer('good')}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                      >
                        <RotateCcw className="w-6 h-6 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">Good</span>
                        <span className="text-xs text-gray-600">Normal review</span>
                      </button>
                      <button
                        onClick={() => handleAnswer('easy')}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Easy</span>
                        <span className="text-xs text-gray-600">Review later</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skip button */}
            <button
              onClick={handleNext}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
            >
              Skip <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{sortedVocabulary.length}</div>
              <div className="text-sm text-gray-600">In Queue</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{studiedCount}</div>
              <div className="text-sm text-gray-600">Studied Today</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {wordsToReview.length}
              </div>
              <div className="text-sm text-gray-600">Words Due</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {allVocabulary.filter((v) => v.repetitions > 3).length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

