import { BookOpen, Award, UserPlus, Target, Clock, Activity } from 'lucide-react';
import type { GroupActivity } from '../../types';
import { Link } from 'react-router-dom';

interface GroupActivityFeedProps {
  activities: GroupActivity[];
}

export default function GroupActivityFeed({ activities }: GroupActivityFeedProps) {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: GroupActivity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'achievement_earned':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'member_joined':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'challenge_created':
        return <Target className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: GroupActivity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return 'bg-blue-50 border-blue-200';
      case 'achievement_earned':
        return 'bg-yellow-50 border-yellow-200';
      case 'member_joined':
        return 'bg-green-50 border-green-200';
      case 'challenge_created':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
        <p className="text-gray-600">Activity from group members will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`card p-4 border ${getActivityColor(activity.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {activity.userAvatar ? (
                      <img
                        src={activity.userAvatar}
                        alt={activity.userName}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">
                          {activity.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{activity.userName}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.content}</p>
                  {activity.metadata?.lessonId && (
                    <Link
                      to={`/lesson/${activity.metadata.lessonId}`}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block"
                    >
                      View lesson →
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

