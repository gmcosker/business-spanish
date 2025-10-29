import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { BookOpen, Target, TrendingUp, Clock, Award, ArrowRight, Brain, ClipboardList } from 'lucide-react';
import { getWordsToReview } from '../../utils/spacedRepetition';
import type { VocabularyItem } from '../../types';

export default function Dashboard() {
  const { user, progress, modules } = useStore();
  const navigate = useNavigate();

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
          color={wordsToReview.length > 0 ? 'orange' : 'green'}
          highlight={wordsToReview.length > 0}
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Vocabulary Mastered"
          value={allVocabulary.filter(v => v.repetitions > 3).length.toString()}
          color="purple"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Weekly Goal"
          value={`${currentProgress.weeklyProgressCount || 0}/${currentProgress.weeklyGoal || 0}`}
          color="orange"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next lesson card */}
          {nextLesson && (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Continue Learning</h2>
                  <p className="text-sm text-gray-600">Pick up where you left off</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-6 mb-4">
                <div className="flex items-center gap-2 text-sm text-primary-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Next Lesson</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {nextLesson.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {nextLesson.duration} minutes • {nextLesson.type}
                </p>
                <button
                  onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Start Lesson <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Learning path progress */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal card */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Goal</h3>
            <div className="bg-primary-50 rounded-lg p-4">
              <Target className="w-6 h-6 text-primary-600 mb-2" />
              <p className="text-sm text-gray-700">{currentUser.goal}</p>
              {currentUser.targetDate && (
                <p className="text-xs text-gray-600 mt-2">
                  Target: {new Date(currentUser.targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/vocabulary')}
                className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 border ${
                  wordsToReview.length > 0 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Review Vocabulary</span>
                  {wordsToReview.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
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
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 border border-gray-200"
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
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <div className="font-medium text-gray-900">Browse Modules</div>
                <div className="text-sm text-gray-600">Explore all lessons</div>
              </button>
            </div>
          </div>

          {/* Streak card */}
          <div className="card p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="text-center">
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentProgress.streakDays}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
              <p className="text-xs text-gray-600 mt-2">Keep it up!</p>
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
  color: 'blue' | 'green' | 'purple' | 'orange';
  highlight?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className={`card p-6 ${highlight ? 'ring-2 ring-orange-500' : ''}`}>
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{module.title}</h4>
        <span className="text-xs font-medium text-primary-600">{percentage}%</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">
          {completedLessons}/{totalLessons}
        </span>
      </div>
    </div>
  );
}

