import { Users, BookOpen, Brain, TrendingUp } from 'lucide-react';
import type { GroupStats as GroupStatsType } from '../../types';

interface GroupStatsProps {
  stats: GroupStatsType | null;
  userProgress?: {
    completedLessons: number;
    vocabularyMastered: number;
    streakDays: number;
  };
}

export default function GroupStats({ stats, userProgress }: GroupStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-gray-600">Members</div>
          </div>
          <div className="text-2xl font-bold text-gray-400">-</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <div className="text-sm text-gray-600">Lessons</div>
          </div>
          <div className="text-2xl font-bold text-gray-400">-</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-gray-600">Vocabulary</div>
          </div>
          <div className="text-2xl font-bold text-gray-400">-</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <div className="text-sm text-gray-600">Group Streak</div>
          </div>
          <div className="text-2xl font-bold text-gray-400">-</div>
        </div>
      </div>
    );
  }

  const userRank = userProgress ? Math.round((stats.totalMembers - 1) * 0.3) + 1 : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <div className="text-sm text-gray-600">Members</div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
        <div className="text-xs text-gray-500 mt-1">{stats.activeMembers} active</div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-green-600" />
          <div className="text-sm text-gray-600">Lessons</div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalLessonsCompleted}</div>
        {userProgress && (
          <div className="text-xs text-gray-500 mt-1">
            You: {userProgress.completedLessons}
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <div className="text-sm text-gray-600">Vocabulary</div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalVocabularyMastered}</div>
        {userProgress && (
          <div className="text-xs text-gray-500 mt-1">
            You: {userProgress.vocabularyMastered}
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <div className="text-sm text-gray-600">Group Streak</div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.groupStreak}</div>
        <div className="text-xs text-gray-500 mt-1">
          Avg: {Math.round(stats.averageStreak)} days
        </div>
      </div>
    </div>
  );
}

