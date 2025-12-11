import { useStore } from '../../store/useStore';
import { TrendingUp, Clock, Target, Calendar, Award, Flame } from 'lucide-react';

export default function Analytics() {
  const { user, progress, modules } = useStore();

  if (!user || !progress) return null;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completionRate = totalLessons > 0
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;

  // Calculate average lessons per day (simplified)
  const daysSinceStart = Math.max(
    1,
    Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const avgLessonsPerDay = (progress.completedLessons.length / daysSinceStart).toFixed(1);

  // Estimate completion date
  const lessonsRemaining = totalLessons - progress.completedLessons.length;
  const daysToCompletion = Math.ceil(lessonsRemaining / parseFloat(avgLessonsPerDay));
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysToCompletion);

  // Generate real weekly data from daily activity
  const getWeeklyData = () => {
    if (!progress.dailyActivity || progress.dailyActivity.length === 0) {
      return [];
    }
    
    // Group activities by week
    const weeklyMap = new Map<string, { lessons: number; time: number }>();
    
    progress.dailyActivity.forEach(activity => {
      const date = new Date(activity.date);
      const year = date.getFullYear();
      const weekNum = getWeekNumber(date);
      const weekKey = `${year}-W${weekNum.toString().padStart(2, '0')}`;
      
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { lessons: 0, time: 0 });
      }
      
      const weekData = weeklyMap.get(weekKey)!;
      weekData.lessons += activity.lessonsCompleted;
      weekData.time += activity.timeSpent;
    });
    
    // Convert to array and sort by week
    return Array.from(weeklyMap.entries())
      .map(([week, data]) => ({
        week,
        lessons: data.lessons,
        time: data.time
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  };
  
  const weeklyData = getWeeklyData();
  const maxWeeklyLessons = Math.max(...weeklyData.map(d => d.lessons), 1);
  
  // Helper function to get week number
  function getWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
  
  // Calculate total time spent
  const totalHours = Math.floor(progress.totalTimeMinutes / 60);
  const totalMinutes = progress.totalTimeMinutes % 60;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-gray-600 mt-1">Track your progress and improve your learning</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          subtext={`${progress.completedLessons.length}/${totalLessons} lessons`}
          color="blue"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Total Time"
          value={totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`}
          subtext="All-time learning"
          color="green"
        />
        <MetricCard
          icon={<Flame className="w-5 h-5" />}
          label="Current Streak"
          value={progress.streakDays.toString()}
          subtext="days in a row"
          color="cyan"
        />
        <MetricCard
          icon={<Award className="w-5 h-5" />}
          label="Achievements"
          value={progress.achievements.length.toString()}
          subtext="badges earned"
          color="sky"
        />
      </div>

      {/* Progress over time */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h2>
        {weeklyData.length > 0 ? (
          <div className="space-y-4">
            {weeklyData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.week}</span>
                  <span className="text-sm text-gray-600">
                    {data.lessons} lesson{data.lessons !== 1 ? 's' : ''} • {Math.round(data.time / 60 * 10) / 10}h
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    style={{ width: `${(data.lessons / maxWeeklyLessons) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No activity data yet. Start learning to see your progress!</p>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
            </div>
          </div>
        )}
      </div>

      {/* Goal Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly goal */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Weekly Goal</h3>
              <p className="text-sm text-gray-600">
                {progress.weeklyProgressCount}/{progress.weeklyGoal} lessons
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (progress.weeklyProgressCount / progress.weeklyGoal) * 100)}%`,
                }}
              />
            </div>
          </div>
          {progress.weeklyProgressCount >= progress.weeklyGoal ? (
            <p className="text-sm text-green-700 font-medium">
              🎉 Great job! You've met your weekly goal!
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {progress.weeklyGoal - progress.weeklyProgressCount} lessons to go this week
            </p>
          )}
        </div>

        {/* Estimated completion */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Estimated Completion</h3>
              <p className="text-sm text-gray-600">At current pace</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {estimatedCompletionDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <p className="text-sm text-gray-600">
            ~{daysToCompletion} days remaining ({lessonsRemaining} lessons)
          </p>
          {user.targetDate && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Your target: {new Date(user.targetDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Module breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Module Progress</h2>
        <div className="space-y-4">
          {modules.map((module) => {
            const completedLessons = module.lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const percentage = Math.round((completedLessons / module.lessons.length) * 100);

            return (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">
                      {completedLessons}/{module.lessons.length} lessons • {module.estimatedMinutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{percentage}%</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Mastery</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {modules.flatMap((m) => m.lessons.flatMap((l) => l.content.vocabulary || [])).length}
            </div>
            <div className="text-sm text-gray-600">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {progress.vocabularyMastered}
            </div>
            <div className="text-sm text-gray-600">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-600 mb-1">
              {modules.flatMap((m) => m.lessons.flatMap((l) => l.content.vocabulary || [])).length -
                progress.vocabularyMastered}
            </div>
            <div className="text-sm text-gray-600">To Review</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: 'blue' | 'green' | 'cyan' | 'sky';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    sky: 'bg-sky-100 text-sky-600',
  };

  return (
    <div className="card p-6">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}

