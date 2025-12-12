import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Users, ArrowLeft, UserMinus, UserPlus, Activity, TrendingUp, RefreshCw, Calendar, Award, BookOpen, Brain, Zap, MessageCircle } from 'lucide-react';
import GroupActivityFeed from '../../components/GroupActivity/GroupActivityFeed';
import GroupStats from '../../components/GroupStats/GroupStats';

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const {
    currentGroup,
    groupMembers,
    groupActivities,
    groupStats,
    user,
    progress,
    firebaseUser,
    loadGroupDetails,
    loadGroupActivities,
    leaveStudyGroup,
    joinIndustryGroup,
    studyGroups,
    loadUserStudyGroups,
    groupConversationSessions,
    loadGroupConversationSessions,
  } = useStore();
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Loading group details for:', groupId);
        
        // Load user's groups first to check membership
        const { loadUserStudyGroups } = useStore.getState();
        await loadUserStudyGroups();
        
        await Promise.all([
          loadGroupDetails(groupId),
          loadGroupActivities(groupId),
          loadGroupConversationSessions(groupId),
        ]);
        
        // Check if user is a member (check both store and fresh data)
        const currentState = useStore.getState();
        console.log('Current state after load:', {
          currentGroup: currentState.currentGroup,
          groupMembers: currentState.groupMembers.length,
          groupActivities: currentState.groupActivities.length,
          groupStats: currentState.groupStats,
        });
        
        setIsMember(
          currentState.studyGroups.some(g => g.id === groupId) ||
          currentState.groupMembers.some(m => m.userId === firebaseUser?.uid && m.isActive)
        );
      } catch (error) {
        console.error('Error loading group details:', error);
        alert(`Error loading group: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupId, loadGroupDetails, loadGroupActivities, firebaseUser]);

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    setLeaving(true);
    try {
      await leaveStudyGroup(groupId);
      setIsMember(false);
      navigate('/groups');
    } catch (error) {
      console.error('Error leaving group:', error);
    } finally {
      setLeaving(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupId || !currentGroup) return;
    setJoining(true);
    try {
      await joinIndustryGroup(currentGroup.industry);
      await loadUserStudyGroups(); // Refresh user's groups
      setIsMember(true);
      await Promise.all([
        loadGroupDetails(groupId),
        loadGroupActivities(groupId),
      ]);
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleRefresh = async () => {
    if (!groupId) return;
    setRefreshing(true);
    try {
      await Promise.all([
        loadGroupDetails(groupId),
        loadGroupActivities(groupId),
        loadUserStudyGroups(),
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className="text-gray-500">Loading group details...</div>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Group Not Found</h2>
          <p className="text-gray-600 mb-4">The study group you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/groups')} className="btn-primary">
            Back to Study Groups
          </button>
        </div>
      </div>
    );
  }

  const userProgress = user && progress ? {
    completedLessons: progress.completedLessons.length,
    vocabularyMastered: progress.vocabularyMastered,
    streakDays: progress.streakDays,
  } : undefined;

  // Helper function to calculate group streak from activities
  const calculateGroupStreak = (activities: typeof groupActivities): number => {
    if (activities.length === 0) return 0;
    
    const activityDates = activities
      .map(a => new Date(a.timestamp).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();
    
    if (activityDates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to 365 days
      const dateStr = currentDate.toDateString();
      if (activityDates.includes(dateStr) || (i === 0 && dateStr === today)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate basic stats from members if stats don't exist
  const calculatedStats = groupStats || (groupMembers.length > 0 ? {
    groupId: groupId || '',
    totalMembers: currentGroup?.memberCount || groupMembers.length,
    activeMembers: groupMembers.filter(m => {
      if (!m.lastActiveAt) return true;
      const lastActive = new Date(m.lastActiveAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastActive >= sevenDaysAgo;
    }).length,
    totalLessonsCompleted: groupActivities.filter(a => a.type === 'lesson_completed').length,
    totalVocabularyMastered: 0, // Would need to aggregate from member progress
    averageStreak: 0, // Would need to calculate from member progress
    groupStreak: (() => {
      // Calculate group streak from activities
      if (groupActivities.length === 0) return 0;
      const activityDates = groupActivities
        .map(a => new Date(a.timestamp).toDateString())
        .filter((date, index, self) => self.indexOf(date) === index)
        .sort()
        .reverse();
      if (activityDates.length === 0) return 0;
      let streak = 0;
      const today = new Date().toDateString();
      let currentDate = new Date();
      for (let i = 0; i < 365; i++) {
        const dateStr = currentDate.toDateString();
        if (activityDates.includes(dateStr) || (i === 0 && dateStr === today)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    })(),
    lastUpdated: new Date().toISOString(),
  } : null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 via-sky-50 to-blue-50 border-primary-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <button
              onClick={() => navigate('/groups')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Study Groups
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{currentGroup.name}</h1>
            <p className="text-gray-600 mt-2">{currentGroup.description}</p>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4" />
                <span className="font-medium">{currentGroup.memberCount} members</span>
              </div>
              <span className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                {currentGroup.industry.replace('-', ' ')}
              </span>
              {currentGroup.createdAt && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>Created {new Date(currentGroup.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isMember && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
                title="Refresh group data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            {isMember ? (
              <button
                onClick={handleLeaveGroup}
                disabled={leaving}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                {leaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Leaving...
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Leave Group
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleJoinGroup}
                disabled={joining}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {joining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Join Group
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Group Rules (if any) */}
      {currentGroup.rules && currentGroup.rules.length > 0 && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Group Guidelines
          </h3>
          <ul className="space-y-2">
            {currentGroup.rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Group Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Group Statistics
          </h2>
        </div>
        <GroupStats stats={calculatedStats} userProgress={userProgress} />
      </div>

      {/* Conversation Practice */}
      {isMember && (
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-600" />
                Conversation Practice
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Practice Spanish with your group members in real-time
              </p>
            </div>
            <button
              onClick={() => navigate(`/groups/${groupId}/conversations`)}
              className="btn-primary flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              View Sessions
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Role-Play Sessions</div>
              <div className="text-2xl font-bold text-gray-900">
                {groupConversationSessions.filter(s => s.type === 'role-play' && (s.status === 'active' || s.status === 'scheduled')).length}
              </div>
            </div>
            <div className="bg-white/60 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Group Conversations</div>
              <div className="text-2xl font-bold text-gray-900">
                {groupConversationSessions.filter(s => s.type === 'group-conversation' && (s.status === 'active' || s.status === 'scheduled')).length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Recent Activity
            {groupActivities.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({groupActivities.length} {groupActivities.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          {isMember && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
        <GroupActivityFeed activities={groupActivities} />
      </div>

      {/* Top Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Members ({groupMembers.length})
          </h2>
          {groupMembers.length > 10 && (
            <span className="text-sm text-gray-500">Showing top 10</span>
          )}
        </div>
        {groupMembers.length > 0 ? (
          <div className="card p-6">
            <div className="space-y-3">
              {groupMembers.slice(0, 10).map((member, index) => {
                const isActive = member.lastActiveAt ? (() => {
                  const lastActive = new Date(member.lastActiveAt);
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return lastActive >= sevenDaysAgo;
                })() : true;

                const joinedDate = member.joinedAt ? new Date(member.joinedAt) : null;
                const isCurrentUser = member.userId === firebaseUser?.uid;

                return (
                  <div 
                    key={member.id} 
                    className={`flex items-center gap-3 py-3 px-3 rounded-lg border transition-colors ${
                      isCurrentUser 
                        ? 'bg-primary-50 border-primary-200' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrentUser ? 'bg-primary-200' : 'bg-primary-100'
                      }`}>
                        {member.userAvatar ? (
                          <img
                            src={member.userAvatar}
                            alt={member.userName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-primary-600">
                            {member.userName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{member.userName}</div>
                        {isCurrentUser && (
                          <span className="text-xs bg-primary-200 text-primary-700 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{member.userEmail}</div>
                      {joinedDate && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {joinedDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {member.role === 'admin' && (
                        <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                          <Award className="w-3 h-3" />
                          Admin
                        </div>
                      )}
                      {member.role === 'moderator' && (
                        <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3" />
                          Moderator
                        </div>
                      )}
                      {member.role === 'member' && (
                        <div className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </div>
                      )}
                      {!isActive && (
                        <div className="text-xs text-gray-400">Inactive</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {groupMembers.length > 10 && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <button
                  onClick={() => {/* Could expand to show all members */}}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all {groupMembers.length} members →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Yet</h3>
            <p className="text-gray-600">Be the first to join this group!</p>
          </div>
        )}
      </div>
    </div>
  );
}

