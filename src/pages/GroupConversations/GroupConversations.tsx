import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { MessageCircle, Users, Clock, Play, Plus, ArrowLeft } from 'lucide-react';
import CreateSessionModal from '../../components/GroupConversation/CreateSessionModal';
import { conversationScenarios } from '../../data/conversationScenarios';

export default function GroupConversations() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const {
    currentGroup,
    groupConversationSessions,
    loadGroupConversationSessions,
    createConversationSession,
    joinConversationSession,
    user,
    firebaseUser,
  } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;
    loadGroupConversationSessions(groupId);
  }, [groupId, loadGroupConversationSessions]);

  const handleCreateSession = async (
    scenarioId: string,
    type: 'role-play' | 'group-conversation',
    scheduledStartTime?: string
  ) => {
    if (!groupId) return;
    await createConversationSession(groupId, scenarioId, type, scheduledStartTime);
  };

  const handleJoinSession = async (sessionId: string) => {
    setJoining(sessionId);
    try {
      await joinConversationSession(sessionId);
      navigate(`/groups/${groupId}/conversations/${sessionId}`);
    } catch (error: any) {
      alert(error.message || 'Failed to join session');
    } finally {
      setJoining(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScenarioTitle = (scenarioId: string) => {
    const scenario = conversationScenarios.find(s => s.id === scenarioId);
    return scenario?.title || scenarioId;
  };

  const activeSessions = groupConversationSessions.filter(s => s.status === 'active' || s.status === 'scheduled');
  const completedSessions = groupConversationSessions.filter(s => s.status === 'completed');

  if (!currentGroup) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="card p-8 text-center">
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/groups/${groupId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Group
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Conversation Practice</h1>
          <p className="text-gray-600 mt-1">Practice Spanish with your group members</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map((session) => {
              const isParticipant = session.participants.some(p => p.userId === firebaseUser?.uid);
              const canJoin = !isParticipant && session.participants.length < session.maxParticipants;

              return (
                <div key={session.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getScenarioTitle(session.scenarioId)}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {session.type === 'role-play' ? 'Role-Play' : 'Group Conversation'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.participants.length}/{session.maxParticipants}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>

                  {isParticipant ? (
                    <button
                      onClick={() => navigate(`/groups/${groupId}/conversations/${session.id}`)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue Session
                    </button>
                  ) : canJoin ? (
                    <button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={joining === session.id}
                      className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {joining === session.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Join Session
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Session is full
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.slice(0, 6).map((session) => (
              <div key={session.id} className="card p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{getScenarioTitle(session.scenarioId)}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {session.completedAt && new Date(session.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {groupConversationSessions.length === 0 && (
        <div className="card p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Sessions Yet</h3>
          <p className="text-gray-600 mb-6">
            Create a session to practice Spanish with your group members.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Session
          </button>
        </div>
      )}

      {/* Create Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateSession}
        groupIndustry={currentGroup.industry}
      />
    </div>
  );
}

