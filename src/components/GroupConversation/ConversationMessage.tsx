import { Award, MessageCircle, User, Clock } from 'lucide-react';
import type { DialogueMessage } from '../../types';

interface ConversationMessageProps {
  message: DialogueMessage;
  isCurrentUser: boolean;
  onAddFeedback?: (messageId: string) => void;
}

export default function ConversationMessage({ message, isCurrentUser, onAddFeedback }: ConversationMessageProps) {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFeedbackColor = (level?: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-50 border-green-200 text-green-800';
      case 'good': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'needs-improvement': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'poor': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const isSystemMessage = message.messageType === 'system' || message.messageType === 'ai-prompt';

  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isSystemMessage 
          ? 'bg-gray-200' 
          : isCurrentUser 
            ? 'bg-primary-100' 
            : 'bg-gray-100'
      }`}>
        {message.userAvatar && !isSystemMessage ? (
          <img
            src={message.userAvatar}
            alt={message.userName}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">
            {isSystemMessage ? <MessageCircle className="w-5 h-5" /> : message.userName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-900">{message.userName}</span>
          {message.role && message.role !== 'System' && (
            <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
              {message.role}
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className={`rounded-lg p-4 ${
          isSystemMessage
            ? 'bg-gray-100 border border-gray-200'
            : isCurrentUser
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-200'
        }`}>
          <p className={isCurrentUser && !isSystemMessage ? 'text-white' : 'text-gray-900'}>
            {message.text}
          </p>
        </div>

        {/* Feedback */}
        {message.feedback && (
          <div className={`mt-2 p-3 rounded-lg border ${getFeedbackColor(message.feedback.feedbackLevel)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">
                Score: {Math.round(message.feedback.score * 100)}%
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">
                {message.feedback.feedbackLevel}
              </span>
            </div>
            {message.feedback.grammarIssues && message.feedback.grammarIssues.length > 0 && (
              <div className="text-xs mt-2">
                <strong>Grammar:</strong> {message.feedback.grammarIssues.join(', ')}
              </div>
            )}
            {message.feedback.vocabularySuggestions && message.feedback.vocabularySuggestions.length > 0 && (
              <div className="text-xs mt-1">
                <strong>Suggestions:</strong> {message.feedback.vocabularySuggestions.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Peer Feedback */}
        {message.peerFeedback && message.peerFeedback.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.peerFeedback.map((feedback, index) => (
              <div key={index} className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                <div className="font-medium text-gray-900">{feedback.fromUserName}</div>
                <div className="text-gray-700">{feedback.comment}</div>
                {feedback.rating && (
                  <div className="text-xs text-gray-500 mt-1">
                    Rating: {'⭐'.repeat(feedback.rating)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Feedback Button (for other users' messages) */}
        {!isCurrentUser && !isSystemMessage && onAddFeedback && (
          <button
            onClick={() => onAddFeedback(message.id)}
            className="mt-2 text-xs text-primary-600 hover:text-primary-700"
          >
            Add feedback
          </button>
        )}
      </div>
    </div>
  );
}

