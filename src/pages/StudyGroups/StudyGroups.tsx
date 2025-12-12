import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Users, TrendingUp, ArrowRight, UserPlus, Activity, Award } from 'lucide-react';
import type { Industry } from '../../types';

export default function StudyGroups() {
  const { user, firebaseUser, studyGroups, loadUserStudyGroups, joinIndustryGroup } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        await loadUserStudyGroups();
      } catch (error) {
        console.error('Error loading study groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, [loadUserStudyGroups]);

  const handleJoinIndustryGroup = async (industry: Industry) => {
    console.log('handleJoinIndustryGroup called with:', industry);
    console.log('firebaseUser:', firebaseUser);
    console.log('user:', user);
    
    if (!firebaseUser || !user) {
      setError('Please log in to join a study group.');
      return;
    }
    
    setJoining(industry);
    setError(null);
    try {
      console.log('Calling joinIndustryGroup...');
      await joinIndustryGroup(industry);
      console.log('joinIndustryGroup completed, reloading groups...');
      // Reload groups to update UI
      await loadUserStudyGroups();
      console.log('Groups reloaded');
    } catch (error: any) {
      console.error('Error joining group:', error);
      setError(error?.message || 'Failed to join group. Please try again.');
    } finally {
      setJoining(null);
    }
  };

  const isInIndustryGroup = (industry: Industry): boolean => {
    return studyGroups.some(g => g.industry === industry);
  };

  const industries: Industry[] = ['tech', 'finance', 'logistics', 'customer-service', 'architecture', 'healthcare'];
  const industryNames: Record<Industry, string> = {
    'tech': 'Tech',
    'finance': 'Finance',
    'logistics': 'Logistics',
    'customer-service': 'Customer Service',
    'architecture': 'Architecture',
    'healthcare': 'Healthcare',
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className="text-gray-500">Loading study groups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
        <p className="text-gray-600 mt-1">Connect with professionals in your industry learning Spanish</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-red-600">⚠️</div>
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* User's Study Groups */}
      {studyGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyGroups.map((group) => (
              <div key={group.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{group.memberCount} members</span>
                      </div>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs capitalize">
                        {group.industry}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  View Group <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Industry Groups */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industries.map((industry) => {
            const isMember = isInIndustryGroup(industry);
            const isJoining = joining === industry;
            
            return (
              <div key={industry} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {industryNames[industry]} Professionals
                    </h3>
                    <p className="text-sm text-gray-600">
                      {industry === 'tech' && 'Connect with tech professionals learning Spanish for business communication.'}
                      {industry === 'finance' && 'Join finance professionals mastering Spanish for banking and finance contexts.'}
                      {industry === 'logistics' && 'Learn Spanish with logistics and operations professionals.'}
                      {industry === 'customer-service' && 'Practice customer service Spanish with fellow professionals.'}
                      {industry === 'architecture' && 'Study Spanish for architecture and construction with industry peers.'}
                      {industry === 'healthcare' && 'Learn medical Spanish with healthcare professionals.'}
                    </p>
                  </div>
                </div>
                {isMember ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Award className="w-4 h-4" />
                    <span>You're a member</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Join button clicked for industry:', industry);
                      handleJoinIndustryGroup(industry);
                    }}
                    disabled={isJoining}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {isJoining ? (
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
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {studyGroups.length === 0 && (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Study Groups Yet</h3>
          <p className="text-gray-600 mb-6">
            Join an industry group to connect with other professionals learning Spanish.
          </p>
        </div>
      )}
    </div>
  );
}

