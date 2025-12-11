import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  User, 
  Trophy,
  BarChart3,
  MessageCircle,
  X,
  Lock
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { hasFeatureAccess } from '../../utils/subscription';
import { useSwipeable } from 'react-swipeable';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useStore();

  // Swipe to close handler for mobile sidebar
  const swipeHandlers = useSwipeable({
    onSwipedLeft: onClose,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // Check access to premium features
  const canAccessConversationPractice = hasFeatureAccess(user?.subscriptionTier, 'conversationPractice');

  const allNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', premium: false },
    { to: '/learning-path', icon: BookOpen, label: 'Learning Path', premium: false },
    { to: '/vocabulary', icon: Library, label: 'Vocabulary Review', premium: false },
    { to: '/conversation-practice', icon: MessageCircle, label: 'Conversation Practice', premium: true, lockIcon: !canAccessConversationPractice },
    { to: '/achievements', icon: Trophy, label: 'Achievements', premium: false },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', premium: false },
    { to: '/profile', icon: User, label: 'Profile', premium: false },
  ];

  // Filter out or mark locked features
  const navItems = allNavItems.map(item => ({
    ...item,
    isLocked: item.premium && !canAccessConversationPractice,
  }));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-900">Avance</span>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.industry} • {user.level}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'sidebar-item-active' : 'sidebar-item'
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.isLocked && <Lock className="w-3 h-3 ml-auto" />}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        {...(isOpen ? swipeHandlers : {})}
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-900">Avance</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.industry} • {user.level}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `${isActive ? 'sidebar-item-active' : 'sidebar-item'} touch-target`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.isLocked && <Lock className="w-3 h-3 ml-auto" />}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

