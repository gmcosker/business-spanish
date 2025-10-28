import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface SpeechPracticeProps {
  targetPhrase: string;
  translation: string;
  onComplete?: () => void;
}

export default function SpeechPractice({ targetPhrase, translation, onComplete }: SpeechPracticeProps) {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES'; // Spanish

      recognitionInstance.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        checkAccuracy(spokenText);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const checkAccuracy = (spokenText: string) => {
    // Simple accuracy check - normalize and compare
    const normalizeText = (text: string) =>
      text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[¿?¡!.,]/g, '') // Remove punctuation
        .trim();

    const normalizedTarget = normalizeText(targetPhrase);
    const normalizedSpoken = normalizeText(spokenText);

    // Calculate similarity
    const words = normalizedTarget.split(' ');
    const spokenWords = normalizedSpoken.split(' ');
    
    let matchCount = 0;
    words.forEach(word => {
      if (spokenWords.includes(word)) {
        matchCount++;
      }
    });

    const accuracy = (matchCount / words.length) * 100;

    if (accuracy >= 70) {
      setFeedback('correct');
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    } else {
      setFeedback('incorrect');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (recognition && isSupported) {
          setTranscript('');
          setFeedback(null);
          setIsListening(true);
          try {
            recognition.start();
          } catch (error) {
            console.error('Error starting recognition:', error);
            setIsListening(false);
          }
        }
        cleanup();
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startListening = () => {
    if (!recognition) return;
    
    setTranscript('');
    setFeedback(null);
    setIsListening(true);
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const playAudio = () => {
    // Stop any ongoing playback
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8; // Slightly slower for learning
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Speech Recognition Not Supported</h3>
            <p className="text-sm text-yellow-700">
              Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎤 Pronunciation Practice
      </h3>

      {/* Target phrase */}
      <div className="bg-primary-50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Say this phrase:</p>
            <p className="text-xl font-semibold text-gray-900">{targetPhrase}</p>
            <p className="text-sm text-gray-600 mt-1 italic">{translation}</p>
          </div>
          <button
            onClick={playAudio}
            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
            title={isPlaying ? "Stop playback" : "Listen to pronunciation"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Microphone control */}
      <div className="text-center mb-4">
        <button
          onClick={isRecording ? stopRecording : (isListening ? stopListening : startRecording)}
          disabled={isListening}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : isListening
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : isListening ? (
            <Mic className="w-10 h-10 text-white animate-pulse" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
        <p className="text-sm text-gray-600 mt-3">
          {isRecording 
            ? 'Recording... Click to stop and analyze' 
            : isListening 
            ? 'Listening... Speak now!' 
            : 'Click to start recording'}
        </p>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">You said:</p>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-900">{transcript}</p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            feedback === 'correct'
              ? 'bg-green-50 border border-green-200'
              : 'bg-orange-50 border border-orange-200'
          }`}
        >
          {feedback === 'correct' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">¡Excelente!</p>
                <p className="text-sm text-green-700">Great pronunciation! Moving on...</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900">Try Again</p>
                <p className="text-sm text-orange-700">
                  Your pronunciation needs work. Listen to the target phrase and try again.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

