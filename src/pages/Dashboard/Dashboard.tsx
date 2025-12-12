import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { BookOpen, Target, TrendingUp, Clock, Award, ArrowRight, Brain, ClipboardList, Users, Activity } from 'lucide-react';
import { getWordsToReview } from '../../utils/spacedRepetition';
import type { VocabularyItem } from '../../types';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user, progress, modules, studyGroups, groupActivities, loadUserStudyGroups, loadGroupActivities } = useStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load study groups and activities
  useEffect(() => {
    const loadGroups = async () => {
      if (user) {
        await loadUserStudyGroups();
        // Load activities for first group if available
        if (studyGroups.length > 0) {
          await loadGroupActivities(studyGroups[0].id);
        }
      }
    };
    loadGroups();
  }, [user, loadUserStudyGroups, loadGroupActivities]);

  // Create default user/progress if auth is bypassed (development mode)
  const defaultUser = {
    id: 'dev-user',
    name: 'Developer',
    email: 'dev@example.com',
    industry: 'tech' as const,
    level: 'intermediate' as const,
    goal: 'Learn Spanish for business',
    targetDate: undefined,
    createdAt: new Date().toISOString(),
  };

  const defaultProgress = {
    userId: 'dev-user',
    completedLessons: [],
    completedModules: [],
    vocabularyMastered: 0,
    totalVocabulary: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString(),
    weeklyGoal: 5,
    weeklyProgressCount: 0,
    achievements: [],
    totalTimeMinutes: 0,
    dailyActivity: [],
    weeklyProgressData: [],
  };

  const currentUser = user || defaultUser;
  const currentProgress = progress || defaultProgress;

  const completionRate = modules.length > 0
    ? Math.round((currentProgress.completedModules.length / modules.length) * 100)
    : 0;

  const nextLesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => !currentProgress.completedLessons.includes(l.id));

  // Collect all vocabulary from lessons
  const allVocabulary: VocabularyItem[] = modules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.content.vocabulary || [])
  );

  // Get words that need review today
  const wordsToReview = getWordsToReview(allVocabulary);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {currentUser.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Ready to continue your Spanish journey?</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          color="blue"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Lessons Completed"
          value={currentProgress.completedLessons.length.toString()}
          color="green"
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          label="Words to Review"
          value={wordsToReview.length.toString()}
          color={wordsToReview.length > 0 ? 'sky' : 'green'}
          highlight={wordsToReview.length > 0}
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Vocabulary Mastered"
          value={allVocabulary.filter(v => v.repetitions > 3).length.toString()}
          color="sky"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Weekly Goal"
          value={`${currentProgress.weeklyProgressCount || 0}/${currentProgress.weeklyGoal || 0}`}
          color="cyan"
          highlight={currentProgress.weeklyProgressCount >= currentProgress.weeklyGoal}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next lesson card */}
          {nextLesson ? (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Continue Learning</h2>
                  <p className="text-sm text-gray-600">Pick up where you left off</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-sky-600 rounded-xl p-6 mb-4 shadow-lg">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-sm text-white/90 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Next Lesson</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {nextLesson.title}
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    {nextLesson.duration} minutes • {nextLesson.type}
                  </p>
                  <button
                    onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                    className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-white/90 active:bg-white/80 transition-colors inline-flex items-center gap-2 shadow-md touch-target"
                  >
                    Start Lesson <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Lessons Completed!</h2>
                <p className="text-gray-600 mb-6">
                  You've finished all available lessons. Great work! Keep practicing to maintain your skills.
                </p>
                <div className="space-y-3">
                <button
                  onClick={() => navigate('/vocabulary')}
                  className="btn-primary inline-flex items-center gap-2 touch-target"
                >
                  Review Vocabulary <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/conversation-practice')}
                  className="btn-secondary block mx-auto touch-target"
                >
                  Practice Conversations
                </button>
                </div>
              </div>
            </div>
          )}

          {/* Learning path progress */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
            {modules.length > 0 ? (
              <>
                <div className="space-y-3">
                  {modules.slice(0, 3).map((module) => (
                    <ModuleCard key={module.id} module={module} progress={currentProgress} />
                  ))}
                </div>
                <button
                  onClick={() => navigate('/learning-path')}
                  className="mt-4 w-full btn-secondary"
                >
                  View All Modules
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-gray-600 mb-4">No modules available yet.</p>
                <button
                  onClick={() => navigate('/learning-path')}
                  className="btn-secondary"
                >
                  Explore Learning Path
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal card */}
          <div className="card p-6 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-sky-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-semibold text-gray-900 mb-3">Your Goal</h3>
              <div className="bg-gradient-to-br from-primary-50 to-sky-50 rounded-lg p-4 border border-primary-100/50">
                <Target className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-gray-700 font-medium">{currentUser.goal}</p>
                {currentUser.targetDate && (
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Target: {new Date(currentUser.targetDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/vocabulary')}
                className={`w-full text-left px-4 py-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 border touch-target ${
                  wordsToReview.length > 0 
                    ? 'border-sky-300 bg-sky-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Review Vocabulary</span>
                  {wordsToReview.length > 0 && (
                    <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
                      {wordsToReview.length}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {wordsToReview.length > 0 
                    ? `${wordsToReview.length} words due for review`
                    : 'Practice with flashcards'}
                </div>
              </button>
              <button
                onClick={() => navigate('/assessment')}
                className="w-full text-left px-4 py-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-200 touch-target"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Retake Assessment</span>
                </div>
                <div className="text-sm text-gray-600">
                  Customize your learning path
                </div>
              </button>
              <button
                onClick={() => navigate('/learning-path')}
                className="w-full text-left px-4 py-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-200 touch-target"
              >
                <div className="font-medium text-gray-900">Browse Modules</div>
                <div className="text-sm text-gray-600">Explore all lessons</div>
              </button>
            </div>
          </div>

          {/* Study Group Widget */}
          {studyGroups.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Study Group
                </h3>
                <button
                  onClick={() => navigate('/groups')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {studyGroups.slice(0, 1).map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{group.name}</h4>
                      <span className="text-xs text-gray-500">{group.memberCount} members</span>
                    </div>
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="w-full btn-secondary text-sm py-2"
                    >
                      View Group
                    </button>
                  </div>
                ))}
                {groupActivities.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Recent Activity
                    </div>
                    {groupActivities.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="text-xs text-gray-600 truncate">
                        {activity.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Streak card */}
          <div className="card p-6 relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 shadow-lg">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/20 via-transparent to-blue-400/20 animate-pulse" />
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0-4v2H0v-2h18zm0-4v2H0v-2h18z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2 drop-shadow-lg">🔥</div>
              <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                {currentProgress.streakDays}
              </div>
              <div className="text-sm text-white/90 font-medium">Day Streak</div>
              <p className="text-xs text-white/80 mt-2">Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'sky' | 'cyan';
  highlight?: boolean;
}) {
  const colorConfig = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      borderGradient: 'from-blue-500 to-blue-400',
      border: 'border-blue-200',
    },
    green: {
      iconBg: 'bg-green-50 text-green-600',
      gradient: 'from-green-500/10 via-green-400/5 to-transparent',
      borderGradient: 'from-green-500 to-green-400',
      border: 'border-green-200',
    },
    sky: {
      iconBg: 'bg-sky-50 text-sky-600',
      gradient: 'from-sky-500/10 via-sky-400/5 to-transparent',
      borderGradient: 'from-sky-500 to-sky-400',
      border: 'border-sky-200',
    },
    cyan: {
      iconBg: 'bg-cyan-50 text-cyan-600',
      gradient: 'from-cyan-500/10 via-cyan-400/5 to-transparent',
      borderGradient: 'from-cyan-500 to-cyan-400',
      border: 'border-cyan-200',
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`card p-6 relative overflow-hidden ${highlight ? 'ring-2 ring-sky-500 ring-offset-2' : ''}`}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`inline-flex p-2 rounded-lg ${config.iconBg} mb-3 shadow-sm`}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
      
      {/* Subtle border accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.borderGradient} opacity-30`} />
    </div>
  );
}

function ModuleCard({
  module,
  progress,
}: {
  module: any;
  progress: any;
}) {
  const completedLessons = module.lessons.filter((l: any) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const totalLessons = module.lessons.length;
  const percentage = Math.round((completedLessons / totalLessons) * 100);

  // Color-coded progress: green (80%+), sky (50-79%), cyan (25-49%), blue (<25%)
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'from-green-500 to-green-600';
    if (percent >= 50) return 'from-sky-500 to-sky-600';
    if (percent >= 25) return 'from-cyan-500 to-cyan-600';
    return 'from-blue-500 to-blue-600';
  };

  const getProgressBgColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-50 border-green-200';
    if (percent >= 50) return 'bg-sky-50 border-sky-200';
    if (percent >= 25) return 'bg-cyan-50 border-cyan-200';
    return 'bg-blue-50 border-blue-200';
  };

  const progressGradient = getProgressColor(percentage);
  const cardBg = getProgressBgColor(percentage);

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-all ${cardBg}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{module.title}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          percentage >= 80 ? 'text-green-700 bg-green-100' :
          percentage >= 50 ? 'text-sky-700 bg-sky-100' :
          percentage >= 25 ? 'text-cyan-700 bg-cyan-100' :
          'text-blue-700 bg-blue-100'
        }`}>
          {percentage}%
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${progressGradient} rounded-full transition-all duration-500 shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-right">
          {completedLessons}/{totalLessons}
        </span>
      </div>
    </div>
  );
}

