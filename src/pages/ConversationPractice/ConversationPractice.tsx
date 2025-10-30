import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, TrendingUp, Mic, Volume2, Pause, Lock } from 'lucide-react';
import { analyzeResponseAdvanced, getNextNodeBasedOnResponse } from '../../utils/conversationAnalysis';
import { conversationScenarios, type ConversationScenario } from '../../data/conversationScenarios';
import { useStore } from '../../store/useStore';
import { hasFeatureAccess, getUpgradeUrl, getFeatureLimitMessage } from '../../utils/subscription';

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
        <Pause className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}

function ScenarioSelector({ scenarios, onSelect }: { scenarios: any[], onSelect: (scenario: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Conversation Practice</h1>
        <p className="text-gray-600 mt-2">
          Practice real business conversations with AI-powered scenarios
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">AI Partner</h3>
              <p className="text-sm text-gray-600">Converses with you in realistic business scenarios</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Real-Time Feedback</h3>
              <p className="text-sm text-gray-600">Get instant pronunciation and accuracy feedback</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your improvement over time</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Scenarios</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => {
            const difficultyColors = {
              beginner: 'bg-green-100 text-green-700',
              intermediate: 'bg-yellow-100 text-yellow-700',
              advanced: 'bg-red-100 text-red-700'
            };

            const industryIcons = {
              tech: '💻',
              finance: '💰',
              logistics: '📦',
              'customer-service': '🎧',
              architecture: '🏗️',
              healthcare: '🏥'
            } as const;

            return (
              <button
                key={scenario.id}
                onClick={() => onSelect(scenario)}
                className="card p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{industryIcons[scenario.industry as keyof typeof industryIcons]}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}`}>
                        {scenario.difficulty}
                      </span>
                      <span className="text-gray-500 capitalize">{scenario.industry.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConversationWindow({ scenario }: { scenario: ConversationScenario }) {
  const navigate = useNavigate();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentNode = scenario.dialogueFlow[currentNodeIndex];

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        handleUserResponse(spokenText);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Recognition error:', event.error);
        setIsListening(false);
        
        // Reset recognition if it got into a bad state
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        
        // Clean up media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    // Prevent multiple simultaneous starts
    if (isListening || isWaitingForResponse) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      setIsListening(true);
      
      if (recognitionRef.current) {
        // Only start if not already listening
        try {
          recognitionRef.current.start();
        } catch (error: any) {
          // Ignore "already started" errors
          if (error.message && !error.message.includes('already started')) {
            console.error('Error starting recognition:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (!isListening) return;
    
    try {
      if (recognitionRef.current) {
        // Check if recognition is actually running before trying to stop
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleUserResponse = async (transcribedText: string) => {
    if (!currentNode?.expectedResponses) {
      // AI node - simulate AI speaking
      setTimeout(() => {
        setCurrentNodeIndex(prev => prev + 1);
      }, 2000);
      return;
    }

    // Check accuracy (simplified for MVP)
    const accuracy = checkResponseAccuracy(transcribedText, currentNode.expectedResponses);
    setFeedback(accuracy);

    setIsWaitingForResponse(true);

    setTimeout(() => {
      setConversationHistory(prev => [...prev, {
        speaker: 'user',
        text: transcribedText,
        accuracy: accuracy.score
      }]);

      setFeedback(null);
      
      // Check if we should advance or handle specific responses
      const nextNodeIndex = getNextNodeIndex(transcribedText, currentNodeIndex, scenario);
      
      setCurrentNodeIndex(nextNodeIndex);
      setIsWaitingForResponse(false);
    }, 3000);
  };

  const getNextNodeIndex = (userResponse: string, currentIndex: number, scenario: ConversationScenario): number => {
    const currentNode = scenario.dialogueFlow[currentIndex];
    return getNextNodeBasedOnResponse(userResponse, currentNode, scenario, currentIndex);
  };

  const checkResponseAccuracy = (userText: string, expectedResponses: string[]) => {
    return analyzeResponseAdvanced(userText, expectedResponses);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{scenario.title}</h2>
            <p className="text-gray-600">{scenario.context}</p>
          </div>
          <button
            onClick={() => navigate('/conversation-practice')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Conversation Messages */}
      <div className="space-y-4">
        {currentNode && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold">AI</span>
            </div>
            <div className="card p-4 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-gray-900 flex-1">{currentNode.text || ''}</p>
                <AudioController text={currentNode.text || ''} />
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-lg ${
            feedback.feedbackLevel === 'excellent' ? 'bg-green-50 border border-green-200' :
            feedback.feedbackLevel === 'good' ? 'bg-blue-50 border border-blue-200' :
            feedback.feedbackLevel === 'needs-improvement' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${
                feedback.feedbackLevel === 'excellent' ? 'text-green-600' :
                feedback.feedbackLevel === 'good' ? 'text-blue-600' :
                feedback.feedbackLevel === 'needs-improvement' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {feedback.feedbackLevel === 'excellent' ? '🎉' :
                 feedback.feedbackLevel === 'good' ? '👍' :
                 feedback.feedbackLevel === 'needs-improvement' ? '💡' : '📝'}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${
                  feedback.feedbackLevel === 'excellent' ? 'text-green-900' :
                  feedback.feedbackLevel === 'good' ? 'text-blue-900' :
                  feedback.feedbackLevel === 'needs-improvement' ? 'text-yellow-900' :
                  'text-red-900'
                }`}>
                  {feedback.feedbackMessage}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className={`px-2 py-1 rounded ${
                    feedback.isFluent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feedback.isFluent ? '✓ Fluido' : '• Corto'}
                  </span>
                  <span className="text-gray-600">
                    Precisión: {Math.round(feedback.score * 100)}%
                  </span>
                </div>
                
                {/* Enhanced feedback: Grammar, Vocabulary, Pronunciation */}
                {(feedback.grammarIssues || feedback.vocabularySuggestions || feedback.pronunciationTips) && (
                  <div className="mt-3 space-y-2">
                    {feedback.grammarIssues && feedback.grammarIssues.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs font-medium text-yellow-900 mb-1">📝 Gramática:</p>
                        {feedback.grammarIssues.map((issue: string, idx: number) => (
                          <p key={idx} className="text-xs text-yellow-800 ml-2">• {issue}</p>
                        ))}
                      </div>
                    )}
                    
                    {feedback.vocabularySuggestions && feedback.vocabularySuggestions.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-xs font-medium text-blue-900 mb-1">📚 Vocabulario:</p>
                        {feedback.vocabularySuggestions.map((suggestion: string, idx: number) => (
                          <p key={idx} className="text-xs text-blue-800 ml-2">• {suggestion}</p>
                        ))}
                      </div>
                    )}
                    
                    {feedback.pronunciationTips && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-2">
                        <p className="text-xs font-medium text-purple-900 mb-1">🔊 Pronunciación:</p>
                        <p className="text-xs text-purple-800 ml-2">• {feedback.pronunciationTips}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {feedback.feedbackLevel !== 'excellent' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 italic mb-1">
                      Sugerencia: "{feedback.correctAnswer}"
                    </p>
                    {feedback.alternativePhrases && feedback.alternativePhrases.length > 0 && (
                      <div className="text-xs text-gray-600 mt-2">
                        Otras formas de expresar: {feedback.alternativePhrases.slice(0, 2).join('" / "')}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Your Response:</p>
            {currentNode?.feedbackHints && (
              <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                💡 <span className="font-medium">Hint:</span> {currentNode.feedbackHints}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
              disabled={isWaitingForResponse}
            >
              <Mic className="w-5 h-5" />
              {isListening ? 'Recording...' : 'Hold to Speak'}
            </button>
            <div className="flex-1 min-w-0">
              {transcript ? (
                <p className="text-sm text-gray-700 italic truncate">"{transcript}"</p>
              ) : (
                <p className="text-xs text-gray-400 italic">Your response will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold">
            {currentNodeIndex + 1} / {scenario.dialogueFlow.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{
              width: `${((currentNodeIndex + 1) / scenario.dialogueFlow.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ConversationPractice() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const canAccessConversationPractice = hasFeatureAccess(user?.subscriptionTier, 'conversationPractice');

  // Check if user has access
  if (!canAccessConversationPractice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conversation Practice
          </h2>
          <p className="text-gray-600 mb-6">
            {getFeatureLimitMessage('conversationPractice')}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(getUpgradeUrl('conversationPractice'))}
              className="w-full btn-primary"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedScenario) {
    return <ScenarioSelector scenarios={conversationScenarios} onSelect={setSelectedScenario} />;
  }

  return <ConversationWindow scenario={selectedScenario} />;
}

