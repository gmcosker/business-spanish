import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { RotateCcw, CheckCircle, XCircle, ChevronRight, AlertCircle, Volume2 } from 'lucide-react';
import type { VocabularyItem } from '../../types';
import { 
  getWordsToReview, 
  updateItemAfterSuccess, 
  updateItemAfterFailure,
  getReviewPriority,
  getDaysUntilReview 
} from '../../utils/spacedRepetition';
import AudioController from '../../components/AudioController/AudioController';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';

export default function VocabularyReview() {
  const { modules, vocabularyItems, updateVocabularyItem } = useStore();
  const [reviewMode, setReviewMode] = useState<'due' | 'all'>('due');
  const [displayMode, setDisplayMode] = useState<'browse' | 'quiz'>('quiz');
  const [typeAnswerMode, setTypeAnswerMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [inputFeedback, setInputFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Swipe handlers
  const handleSwipeLeft = () => {
    // Swipe left = "Know It" / Easy
    if (showAnswer) {
      handleAnswer('easy');
    } else {
      setShowAnswer(true);
    }
    setSwipeDirection('left');
    setTimeout(() => setSwipeDirection(null), 300);
  };

  const handleSwipeRight = () => {
    // Swipe right = "Learn It" / Hard
    if (showAnswer) {
      handleAnswer('hard');
    } else {
      setShowAnswer(true);
    }
    setSwipeDirection('right');
    setTimeout(() => setSwipeDirection(null), 300);
  };

  const handleSwipeUp = () => {
    // Swipe up = Flip card / Show answer
    if (!showAnswer) {
      setShowAnswer(true);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    onSwipedUp: handleSwipeUp,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    swipeDuration: 300,
  });

  const handleNext = () => {
    setShowAnswer(false);
    setUserInput('');
    setInputFeedback(null);
    if (currentIndex < sortedVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const checkTypedAnswer = () => {
    if (!currentItem) return;
    
    const normalizeText = (text: string) =>
      text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[¿?¡!.,]/g, '') // Remove punctuation
        .trim();

    const normalizedInput = normalizeText(userInput);
    const normalizedTerm = normalizeText(currentItem.term);
    const normalizedTranslation = normalizeText(currentItem.translation);

    // Check if input matches either the Spanish term or English translation
    const isCorrect = normalizedInput === normalizedTerm || normalizedInput === normalizedTranslation;
    
    setInputFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowAnswer(true);

    if (isCorrect) {
      // Auto-advance after a short delay
      setTimeout(() => {
        handleAnswer('good');
      }, 1500);
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

        {/* Type Answer Toggle (only in quiz mode) */}
        {displayMode === 'quiz' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={typeAnswerMode}
                onChange={(e) => {
                  setTypeAnswerMode(e.target.checked);
                  setUserInput('');
                  setInputFeedback(null);
                  setShowAnswer(false);
                }}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Type the Answer (Active Recall)
              </span>
            </label>
            <span className="text-xs text-gray-500">
              Type the Spanish term or English translation
            </span>
          </div>
        )}
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
        <div className={`max-w-2xl mx-auto ${isMobile ? 'pb-24' : ''}`}>
          {/* Progress - Mobile: Fixed at top, Desktop: Normal */}
          <div className={`mb-6 ${isMobile ? 'sticky top-0 z-10 bg-white pb-2 pt-2' : ''}`}>
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

          {/* Flashcard - Mobile: Full screen height, Desktop: Normal */}
          <motion.div
            {...swipeHandlers}
            key={currentIndex}
            initial={{ opacity: 0, x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0 }}
            transition={{ duration: 0.3 }}
            className={`card p-4 md:p-8 flex flex-col ${
              isMobile 
                ? 'min-h-[calc(100vh-280px)] touch-none' 
                : 'min-h-[400px]'
            }`}
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full mb-6">
                {currentItem.context}
              </div>

              {!showAnswer ? (
                /* Question side */
                <div className="w-full">
                  {typeAnswerMode ? (
                    /* Type Answer Mode */
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <h2 className="text-4xl font-bold text-gray-900">
                          {currentItem.translation}
                        </h2>
                        <AudioController text={currentItem.translation} size="lg" />
                      </div>
                      <p className="text-gray-600 mb-6 italic">{currentItem.example}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type the Spanish term:
                          </label>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => {
                              setUserInput(e.target.value);
                              setInputFeedback(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && userInput.trim()) {
                                checkTypedAnswer();
                              }
                            }}
                            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                              inputFeedback === 'correct'
                                ? 'border-green-500 bg-green-50'
                                : inputFeedback === 'incorrect'
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 focus:border-primary-500'
                            }`}
                            placeholder="Type your answer..."
                            autoFocus
                          />
                        </div>
                        
                        {inputFeedback && (
                          <div className={`p-4 rounded-lg ${
                            inputFeedback === 'correct'
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              {inputFeedback === 'correct' ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="font-semibold text-green-900">Correct! 🎉</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="font-semibold text-red-900">Incorrect. Try again!</span>
                                </>
                              )}
                            </div>
                            {inputFeedback === 'incorrect' && (
                              <p className="text-sm text-red-700 mt-2">
                                The correct answer is: <strong>{currentItem.term}</strong>
                              </p>
                            )}
                          </div>
                        )}
                        
                        <button
                          onClick={checkTypedAnswer}
                          disabled={!userInput.trim()}
                          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] py-3"
                        >
                          Check Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Regular Show Answer Mode */
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
                        className="btn-primary min-h-[44px] px-6 py-3"
                      >
                        Show Answer
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Answer side */
                <div className="w-full">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-4xl font-bold text-gray-900">
                      {currentItem.term}
                    </h2>
                    <AudioController text={currentItem.term} size="lg" />
                  </div>
                  <p className="text-2xl text-primary-600 mb-4">
                    {currentItem.translation}
                  </p>
                  <p className="text-gray-600 mb-8 italic">{currentItem.example}</p>

                  {/* Answer buttons - Desktop only (mobile uses bottom bar) */}
                  {!isMobile && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-2">How well did you know this?</p>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleAnswer('hard')}
                          className="flex flex-col items-center gap-2 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors min-h-[80px]"
                        >
                          <XCircle className="w-6 h-6 text-red-600" />
                          <span className="text-sm font-medium text-red-700">Hard</span>
                          <span className="text-xs text-gray-600">Review soon</span>
                        </button>
                        <button
                          onClick={() => handleAnswer('good')}
                          className="flex flex-col items-center gap-2 p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 active:bg-yellow-100 transition-colors min-h-[80px]"
                        >
                          <RotateCcw className="w-6 h-6 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">Good</span>
                          <span className="text-xs text-gray-600">Normal review</span>
                        </button>
                        <button
                          onClick={() => handleAnswer('easy')}
                          className="flex flex-col items-center gap-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 active:bg-green-100 transition-colors min-h-[80px]"
                        >
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Easy</span>
                          <span className="text-xs text-gray-600">Review later</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Skip button - Hidden on mobile (use swipe instead) */}
            {!isMobile && (
              <button
                onClick={handleNext}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
              >
                Skip <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Mobile: Bottom Action Bar */}
          {isMobile && showAnswer && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom z-20 md:hidden">
              <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer('hard')}
                  className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-red-200 rounded-lg bg-red-50 active:bg-red-100 transition-colors min-h-[56px]"
                >
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Hard</span>
                </button>
                <button
                  onClick={() => handleAnswer('easy')}
                  className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-green-200 rounded-lg bg-green-50 active:bg-green-100 transition-colors min-h-[56px]"
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Easy</span>
                </button>
              </div>
              {/* Swipe hints */}
              <div className="text-xs text-center text-gray-500 mt-2">
                Swipe left for Easy • Swipe right for Hard
              </div>
            </div>
          )}

          {/* Mobile: Show Answer Button (when answer not shown) */}
          {isMobile && !showAnswer && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom z-20 md:hidden">
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-medium active:bg-primary-700 transition-colors min-h-[56px]"
              >
                Show Answer
              </button>
              <div className="text-xs text-center text-gray-500 mt-2">
                Swipe up to reveal answer
              </div>
            </div>
          )}

          {/* Stats - Mobile: 2x2 grid, Desktop: 4 columns */}
          <div className={`mt-6 grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{sortedVocabulary.length}</div>
              <div className="text-sm text-gray-600">In Queue</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{studiedCount}</div>
              <div className="text-sm text-gray-600">Studied Today</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-sky-600">
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

