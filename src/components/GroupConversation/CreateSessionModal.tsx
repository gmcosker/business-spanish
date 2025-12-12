import { useState } from 'react';
import { X, MessageCircle, Users, Calendar } from 'lucide-react';
import { conversationScenarios, type ConversationScenario } from '../../data/conversationScenarios';
import type { Industry } from '../../types';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (scenarioId: string, type: 'role-play' | 'group-conversation', scheduledStartTime?: string) => Promise<void>;
  groupIndustry: Industry;
}

export default function CreateSessionModal({ isOpen, onClose, onCreate, groupIndustry }: CreateSessionModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [sessionType, setSessionType] = useState<'role-play' | 'group-conversation'>('role-play');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [creating, setCreating] = useState(false);

  // Filter scenarios by group industry
  const availableScenarios = conversationScenarios.filter(
    s => s.industry === groupIndustry || s.industry === 'tech' // Include tech as default
  );

  const handleCreate = async () => {
    if (!selectedScenario) {
      alert('Please select a scenario');
      return;
    }

    setCreating(true);
    try {
      await onCreate(
        selectedScenario,
        sessionType,
        scheduledTime || undefined
      );
      onClose();
      // Reset form
      setSelectedScenario('');
      setScheduledTime('');
      setSessionType('role-play');
    } catch (error: any) {
      alert(error.message || 'Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Conversation Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSessionType('role-play')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  sessionType === 'role-play'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="w-6 h-6 text-primary-600 mb-2" />
                <div className="font-semibold text-gray-900">Role-Play</div>
                <div className="text-sm text-gray-600 mt-1">2 participants</div>
              </button>
              <button
                onClick={() => setSessionType('group-conversation')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  sessionType === 'group-conversation'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6 text-primary-600 mb-2" />
                <div className="font-semibold text-gray-900">Group Conversation</div>
                <div className="text-sm text-gray-600 mt-1">3-4 participants</div>
              </button>
            </div>
          </div>

          {/* Scenario Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Choose a scenario...</option>
              {availableScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title} ({scenario.difficulty})
                </option>
              ))}
            </select>
            {selectedScenario && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                {(() => {
                  const scenario = availableScenarios.find(s => s.id === selectedScenario);
                  return scenario ? (
                    <>
                      <div className="font-medium text-gray-900">{scenario.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{scenario.description}</div>
                      <div className="text-xs text-gray-500 mt-2">{scenario.context}</div>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Scheduled Time (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Schedule Start Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to start immediately when all participants are ready
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !selectedScenario}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

