import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { User, Target, Award, TrendingUp, Settings, LogOut, Palette, Bell, Volume2, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/auth';
import type { UserPreferences } from '../../types';

export default function Profile() {
  const { user, progress, modules, resetApp, updateUserPreferences, setFirebaseUser } = useStore();
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      setFirebaseUser(null);
      resetApp();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Initialize preferences with defaults
  const preferences = user?.preferences || {
    theme: 'light' as const,
    notifications: true,
    emailReminders: false,
    streakReminders: true,
    soundEnabled: true,
    autoPlayAudio: true,
  };
  
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    updateUserPreferences({ [key]: value });
  };

  if (!user || !progress) return null;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completionRate = totalLessons > 0
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;

  const handleReset = () => {
    resetApp();
    window.location.href = '/';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and learning preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{user.email || 'No email set'}</p>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full capitalize">
                  {user.industry}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full capitalize">
                  {user.level}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Member since</div>
                <div className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal card */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Goal</h3>
                <p className="text-gray-700 mb-3">{user.goal}</p>
                {user.targetDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Target Date:</span>
                    <span className="font-medium">
                      {new Date(user.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.vocabularyMastered}
                  </div>
                  <div className="text-sm text-gray-600">Vocabulary Mastered</div>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔥</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.streakDays}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.completedModules.length}
                  </div>
                  <div className="text-sm text-gray-600">Modules Done</div>
                </div>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              App Settings
            </h3>
            <div className="space-y-4">
              {/* Theme Setting */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Theme</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handlePreferenceChange('theme', theme)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        preferences.theme === theme
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {theme === 'light' && <Sun className="w-4 h-4" />}
                      {theme === 'dark' && <Moon className="w-4 h-4" />}
                      {theme === 'auto' && <Monitor className="w-4 h-4" />}
                      <span className="capitalize">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Settings */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Sound Effects</div>
                      <div className="text-sm text-gray-600">Play audio feedback</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.soundEnabled ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Auto-play Audio</div>
                  <div className="text-sm text-gray-600">Automatically play pronunciations</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoPlayAudio', !preferences.autoPlayAudio)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.autoPlayAudio ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      preferences.autoPlayAudio ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notification Settings */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Notifications</div>
                      <div className="text-sm text-gray-600">App notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Streak Reminders</div>
                  <div className="text-sm text-gray-600">Get reminded to maintain your streak</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('streakReminders', !preferences.streakReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.streakReminders ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      preferences.streakReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Learning preferences */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Weekly Goal</div>
                  <div className="text-sm text-gray-600">Number of lessons per week</div>
                </div>
                <div className="text-lg font-semibold text-primary-600">
                  {progress.weeklyGoal}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Industry Focus</div>
                  <div className="text-sm text-gray-600">Your current learning path</div>
                </div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {user.industry}
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-900">Language Level</div>
                  <div className="text-sm text-gray-600">Your current proficiency</div>
                </div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {user.level}
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account</h3>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Danger zone */}
          <div className="card p-6 border-2 border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reset your progress and start over. This action cannot be undone.
            </p>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Reset All Progress
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-700">
                  Are you sure? This will delete all your progress.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

