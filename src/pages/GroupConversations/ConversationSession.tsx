import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Send, ArrowLeft, Users, LogOut } from 'lucide-react';
import ConversationMessage from '../../components/GroupConversation/ConversationMessage';
import SessionLobby from '../../components/GroupConversation/SessionLobby';
import { conversationScenarios } from '../../data/conversationScenarios';

export default function ConversationSession() {
  const { groupId, sessionId } = useParams<{ groupId: string; sessionId: string }>();
  const navigate = useNavigate();
  const {
    currentConversationSession,
    conversationMessages,
    subscribeToConversation,
    sendConversationMessage,
    firebaseUser,
    user,
  } = useStore();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to real-time updates
    unsubscribeRef.current = subscribeToConversation(sessionId);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [sessionId, subscribeToConversation]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const scenario = currentConversationSession
    ? conversationScenarios.find(s => s.id === currentConversationSession.scenarioId)
    : null;

  const currentUserParticipant = currentConversationSession?.participants.find(
    p => p.userId === firebaseUser?.uid
  );

  const isUserTurn = () => {
    if (!currentConversationSession || !firebaseUser) return false;
    const currentTurnIndex = currentConversationSession.scenarioConfig.currentTurnIndex;
    const turnOrder = currentConversationSession.scenarioConfig.turnOrder;
    const currentUserId = turnOrder[currentTurnIndex % turnOrder.length];
    return currentUserId === firebaseUser.uid;
  };

  const getCurrentNode = () => {
    if (!scenario || !currentConversationSession) return null;
    const nodeIndex = currentConversationSession.conversationState.currentNodeIndex;
    return scenario.dialogueFlow[nodeIndex];
  };

  const handleSendMessage = async () => {
    if (!sessionId || !messageText.trim() || !isUserTurn() || sending) return;

    const currentNode = getCurrentNode();
    if (!currentNode) return;

    setSending(true);
    try {
      await sendConversationMessage(sessionId, currentNode.id, messageText.trim());
      setMessageText('');
    } catch (error: any) {
      alert(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!currentConversationSession) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="card p-8 text-center">
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  // Show lobby if session is scheduled
  if (currentConversationSession.status === 'scheduled') {
    return (
      <SessionLobby
        session={currentConversationSession}
        onStart={() => {
          // Session will automatically update via real-time subscription
        }}
        onLeave={() => navigate(`/groups/${groupId}/conversations`)}
      />
    );
  }

  const canSend = isUserTurn() && currentConversationSession.status === 'active';
  const currentNode = getCurrentNode();

  return (
    <div className="max-w-5xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/groups/${groupId}/conversations`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {scenario?.title || 'Conversation Session'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {currentConversationSession.participants.length} participants
              </span>
              {currentUserParticipant && (
                <>
                  <span>•</span>
                  <span>Your role: {currentUserParticipant.role}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/groups/${groupId}/conversations`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            conversationMessages.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                isCurrentUser={message.userId === firebaseUser?.uid}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Current Node Info (if active) */}
      {currentNode && currentConversationSession.status === 'active' && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="max-w-3xl mx-auto">
            {currentNode.speaker === 'ai' && currentNode.text && (
              <div className="text-sm text-blue-900">
                <strong>System:</strong> {currentNode.text}
              </div>
            )}
            {currentNode.speaker === 'user' && currentNode.feedbackHints && (
              <div className="text-sm text-blue-800">
                <strong>Hint:</strong> {currentNode.feedbackHints}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Turn Indicator */}
      {!canSend && currentConversationSession.status === 'active' && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="max-w-3xl mx-auto text-sm text-yellow-800">
            {(() => {
              const currentTurnIndex = currentConversationSession.scenarioConfig.currentTurnIndex;
              const turnOrder = currentConversationSession.scenarioConfig.turnOrder;
              const currentUserId = turnOrder[currentTurnIndex % turnOrder.length];
              const currentParticipant = currentConversationSession.participants.find(
                p => p.userId === currentUserId
              );
              return currentParticipant
                ? `Waiting for ${currentParticipant.userName} to respond...`
                : 'Waiting for next turn...';
            })()}
          </div>
        </div>
      )}

      {/* Message Input */}
      {currentConversationSession.status === 'active' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={canSend ? "Type your response in Spanish..." : "Waiting for your turn..."}
              disabled={!canSend || sending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!canSend || sending || !messageText.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      )}

      {/* Completed State */}
      {currentConversationSession.status === 'completed' && (
        <div className="bg-green-50 border-t border-green-200 p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Conversation Complete! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              Great job practicing Spanish with your group!
            </p>
            <button
              onClick={() => navigate(`/groups/${groupId}/conversations`)}
              className="btn-primary"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

