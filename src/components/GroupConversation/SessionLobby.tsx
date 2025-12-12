import { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, Play, X } from 'lucide-react';
import type { GroupConversationSession } from '../../types';
import { useStore } from '../../store/useStore';
import { conversationScenarios } from '../../data/conversationScenarios';

interface SessionLobbyProps {
  session: GroupConversationSession;
  onStart: () => void;
  onLeave: () => void;
}

export default function SessionLobby({ session, onStart, onLeave }: SessionLobbyProps) {
  const { firebaseUser, user, setParticipantReady, startConversationSession } = useStore();
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);

  const scenario = conversationScenarios.find(s => s.id === session.scenarioId);
  const currentUserParticipant = session.participants.find(p => p.userId === firebaseUser?.uid);
  const isCreator = session.createdBy === firebaseUser?.uid;
  const allReady = session.participants.length === session.maxParticipants &&
    session.participants.every(p => p.isReady);
  const canStart = isCreator && allReady && session.status === 'scheduled';

  useEffect(() => {
    if (currentUserParticipant) {
      setReady(currentUserParticipant.isReady);
    }
  }, [currentUserParticipant]);

  const handleToggleReady = async () => {
    if (!session.id) return;
    const newReady = !ready;
    setReady(newReady);
    try {
      await setParticipantReady(session.id, newReady);
    } catch (error) {
      setReady(!newReady); // Revert on error
      alert('Failed to update ready status');
    }
  };

  const handleStart = async () => {
    if (!session.id) return;
    setStarting(true);
    try {
      await startConversationSession(session.id);
      onStart();
    } catch (error: any) {
      alert(error.message || 'Failed to start session');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Session Info */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {scenario?.title || 'Conversation Session'}
        </h2>
        <p className="text-gray-600 mb-4">{scenario?.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="px-3 py-1 bg-white/60 rounded-full">
            {session.type === 'role-play' ? 'Role-Play' : 'Group Conversation'}
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4" />
            {session.participants.length}/{session.maxParticipants} participants
          </span>
        </div>
      </div>

      {/* Participants */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
        <div className="space-y-3">
          {session.participants.map((participant) => (
            <div
              key={participant.userId}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                participant.userId === firebaseUser?.uid
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {participant.userAvatar ? (
                    <img
                      src={participant.userAvatar}
                      alt={participant.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-600">
                      {participant.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {participant.userName}
                    {participant.userId === firebaseUser?.uid && (
                      <span className="ml-2 text-xs text-primary-600">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{participant.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {participant.isReady ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    Waiting
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Waiting for more participants */}
        {session.participants.length < session.maxParticipants && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-800">
              Waiting for {session.maxParticipants - session.participants.length} more participant(s)...
            </p>
          </div>
        )}
      </div>

      {/* Scenario Context */}
      {scenario && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Scenario Context</h3>
          <p className="text-gray-700">{scenario.context}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {currentUserParticipant && (
          <button
            onClick={handleToggleReady}
            className={`flex-1 btn-secondary flex items-center justify-center gap-2 ${
              ready ? 'bg-green-50 border-green-200 text-green-700' : ''
            }`}
          >
            {ready ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Mark as Not Ready
              </>
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Mark as Ready
              </>
            )}
          </button>
        )}
        {canStart && (
          <button
            onClick={handleStart}
            disabled={starting}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {starting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Session
              </>
            )}
          </button>
        )}
        <button
          onClick={onLeave}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

