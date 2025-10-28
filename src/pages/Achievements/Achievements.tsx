import { useStore } from '../../store/useStore';
import { Lock, Calendar } from 'lucide-react';
import { getAllAchievements } from '../../utils/achievements';

export default function Achievements() {
  const { progress } = useStore();

  if (!progress) return null;

  const allAchievements = getAllAchievements();
  const unlockedIds = new Set(progress.achievements.map(a => a.id));

  const categories = {
    milestone: { title: '🎯 Milestones', achievements: [] as any[] },
    streak: { title: '🔥 Streaks', achievements: [] as any[] },
    mastery: { title: '📚 Mastery', achievements: [] as any[] },
  };

  // Organize achievements by category
  Object.values(allAchievements).forEach((def: any) => {
    const unlocked = progress.achievements.find(a => a.id === def.id);
    const achievement = unlocked || { ...def, unlockedAt: null };
    
    if (categories[def.category as keyof typeof categories]) {
      categories[def.category as keyof typeof categories].achievements.push(achievement);
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-1">
          {progress.achievements.length} of {Object.keys(allAchievements).length} unlocked
        </p>
      </div>

      {/* Progress bar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-primary-600">
            {Math.round((progress.achievements.length / Object.keys(allAchievements).length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
            style={{
              width: `${(progress.achievements.length / Object.keys(allAchievements).length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Achievement categories */}
      {Object.entries(categories).map(([key, category]) => (
        <div key={key}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.achievements.map((achievement: any) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`card p-6 transition-all ${
                    isUnlocked
                      ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-5xl ${!isUnlocked && 'grayscale'}`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-12 h-12 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      {isUnlocked && achievement.unlockedAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}





