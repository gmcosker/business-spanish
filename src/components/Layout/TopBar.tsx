import { Menu, Bell, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick?: () => void;
}

export default function TopBar({ onMenuClick, onSearchClick }: TopBarProps) {
  const { progress } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search button */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Streak counter */}
          {progress && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-medium text-orange-700">
                {progress.streakDays} day streak
              </span>
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}

