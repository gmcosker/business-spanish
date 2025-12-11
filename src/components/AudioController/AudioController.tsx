import { useState, useEffect, useRef } from 'react';
import { Volume2, Pause } from 'lucide-react';

interface AudioControllerProps {
  text: string;
  size?: 'sm' | 'lg';
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25] as const;
const DEFAULT_SPEED = 1.0;
const STORAGE_KEY = 'avance-audio-speed';

export default function AudioController({ text, size = 'sm' }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(DEFAULT_SPEED);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load saved speed preference
  useEffect(() => {
    const savedSpeed = localStorage.getItem(STORAGE_KEY);
    if (savedSpeed) {
      const speed = parseFloat(savedSpeed);
      if (SPEED_OPTIONS.includes(speed as any)) {
        setPlaybackSpeed(speed);
      }
    }
  }, []);

  // Save speed preference
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    localStorage.setItem(STORAGE_KEY, speed.toString());
    setShowSpeedMenu(false);
    
    // If currently playing, restart with new speed
    if (isPlaying && utteranceRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      // Auto-restart with new speed
      setTimeout(() => handleToggle(), 100);
    }
  };

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
      utteranceRef.current = utterance;

      if (spanishVoice) {
        utterance.voice = spanishVoice;
        utterance.lang = spanishVoice.lang;
      } else {
        utterance.lang = 'es-ES';
      }

      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
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

  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const buttonSize = isMobile && size === 'lg' ? 'min-w-[56px] min-h-[56px]' : '';

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        onClick={handleToggle}
        className={`text-gray-400 transition-colors touch-target ${buttonSize} flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${
          isPlaying ? 'text-primary-600' : 'hover:text-primary-600'
        }`}
        title={
          isPlaying && !isPaused ? 'Pause audio' :
          isPaused ? 'Resume audio' :
          'Play audio'
        }
      >
        {isPlaying && !isPaused ? (
          <Pause className={iconSize} />
        ) : (
          <Volume2 className={iconSize} />
        )}
      </button>
      
      {/* Speed selector */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSpeedMenu(!showSpeedMenu);
          }}
          className={`text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded transition-colors touch-target ${
            showSpeedMenu ? 'bg-gray-100' : ''
          }`}
          title="Playback speed"
        >
          {playbackSpeed}x
        </button>
        
        {showSpeedMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowSpeedMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[80px]">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    playbackSpeed === speed ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {speed}x {speed === 1.0 ? '(Normal)' : speed < 1.0 ? '(Slower)' : '(Faster)'}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

