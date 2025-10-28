import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { BookOpen, Clock, CheckCircle2, Circle, Lock, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { hasFeatureAccess, getUpgradeUrl, getFeatureLimitMessage } from '../../utils/subscription';

export default function LearningPath() {
  const { modules, progress, allModules, currentIndustry, setCurrentIndustry, quickMode, toggleQuickMode, user } = useStore();
  const navigate = useNavigate();
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close industry selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowIndustrySelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!progress) return null;

  const industries = {
    'tech': { name: 'Tech & Startups', modules: allModules['tech'] || [], color: 'purple' },
    'finance': { name: 'Finance & Banking', modules: allModules['finance'] || [], color: 'green' },
    'logistics': { name: 'Logistics & Supply Chain', modules: allModules['logistics'] || [], color: 'blue' },
    'customer-service': { name: 'Customer Service', modules: allModules['customer-service'] || [], color: 'orange' },
  };

  const canSwitchIndustries = hasFeatureAccess(user?.subscriptionTier, 'multipleIndustries');
  const hasUsedFirstIndustry = !!currentIndustry;

  const switchIndustry = (industry: string) => {
    // Check if user can access this industry
    if (!canSwitchIndustries && industry !== currentIndustry && hasUsedFirstIndustry) {
      // Show upgrade prompt
      if (confirm(getFeatureLimitMessage('multipleIndustries') + '\n\nWould you like to upgrade?')) {
        navigate(getUpgradeUrl('multipleIndustries'));
      }
      return;
    }
    
    setCurrentIndustry(industry);
    setShowIndustrySelector(false);
  };

  // Calculate total modules across ALL industries
  const totalModulesAcrossAllIndustries = Object.values(allModules).reduce(
    (sum, mods) => sum + mods.length,
    0
  );

  // Calculate completed modules in the CURRENT industry
  const completedModulesInCurrentIndustry = modules.filter((module) =>
    progress.completedModules.includes(module.id)
  ).length;

  // Calculate total completed modules across ALL industries
  const totalCompletedModules = progress.completedModules.length;

  // Calculate percentage for current industry
  const currentIndustryProgress = modules.length > 0
    ? Math.round((completedModulesInCurrentIndustry / modules.length) * 100)
    : 0;

  // Calculate percentage for all industries combined
  const globalProgress = totalModulesAcrossAllIndustries > 0
    ? Math.round((totalCompletedModules / totalModulesAcrossAllIndustries) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Industry Selector */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Learning Path</h1>
          <p className="text-gray-600 mt-1">
            Complete modules in order to build your business Spanish skills
          </p>
        </div>
        
        {/* Quick Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleQuickMode}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              quickMode
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {quickMode ? '✓ Quick Mode On' : 'Quick Mode'}
          </button>
          
          {/* Industry Selector */}
          <div className="relative" ref={selectorRef}>
            <button
              onClick={() => setShowIndustrySelector(!showIndustrySelector)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">
                {currentIndustry ? industries[currentIndustry].name : 'Select Industry'}
              </span>
            </button>
            
            {showIndustrySelector && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {Object.entries(industries).map(([key, { name, color }]) => {
                  const isLocked = !canSwitchIndustries && key !== currentIndustry && hasUsedFirstIndustry;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => switchIndustry(key)}
                      disabled={isLocked}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        isLocked 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : currentIndustry === key 
                            ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{name}</span>
                        <div className="flex items-center gap-2">
                          {currentIndustry === key && <CheckCircle2 className="w-5 h-5" />}
                          {isLocked && <Lock className="w-4 h-4" />}
                        </div>
                      </div>
                      {isLocked && (
                        <p className="text-xs text-gray-500 mt-1">Upgrade to unlock</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="space-y-4">
        {/* Current Industry Progress Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentIndustry ? industries[currentIndustry].name : 'Overall'} Progress
              </h2>
              <p className="text-sm text-gray-600">
                {completedModulesInCurrentIndustry} of {modules.length} modules completed
                {currentIndustry && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({totalCompletedModules} total across all industries)
                  </span>
                )}
              </p>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {currentIndustryProgress}%
            </div>
          </div>
          
          {/* Current industry progress bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-600 rounded-full transition-all duration-500"
              style={{
                width: `${currentIndustryProgress}%`,
              }}
            />
          </div>
        </div>

        {/* All Industries Progress Overview */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Progress Across All Industries</h3>
          <div className="space-y-3">
            {Object.entries(industries).map(([key, { name }]) => {
              const industryModules = allModules[key] || [];
              const completedInIndustry = industryModules.filter((mod) =>
                progress.completedModules.includes(mod.id)
              ).length;
              const progressPercent = industryModules.length > 0
                ? Math.round((completedInIndustry / industryModules.length) * 100)
                : 0;
              
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{name}</span>
                    <span className="text-gray-600">
                      {completedInIndustry}/{industryModules.length} modules • {progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        key === currentIndustry
                          ? 'bg-gradient-to-r from-primary-600 to-primary-400'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modules.map((module, index) => {
          const completedLessons = module.lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          const totalLessons = module.lessons.length;
          const isCompleted = progress.completedModules.includes(module.id);
          // In quick mode, all modules are unlocked; otherwise follow normal progression
          const isUnlocked = quickMode || index === 0 || progress.completedModules.includes(modules[index - 1]?.id);

          return (
            <div
              key={module.id}
              className={`card p-6 ${
                isUnlocked ? 'hover:shadow-md transition-shadow' : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Module number */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    isCompleted
                      ? 'bg-green-100 text-green-700'
                      : isUnlocked
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                </div>

                {/* Module content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                    {!isUnlocked && <Lock className="w-5 h-5 text-gray-400 ml-4" />}
                  </div>

                  {/* Module meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~{module.estimatedMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-primary-600">
                        {completedLessons}/{totalLessons} completed
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{
                          width: `${(completedLessons / totalLessons) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Lessons list */}
                  {isUnlocked && (
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const lessonCompleted = progress.completedLessons.includes(lesson.id);
                        // In quick mode, all lessons are unlocked; otherwise follow normal progression
                        const lessonUnlocked =
                          quickMode ||
                          lessonIndex === 0 ||
                          progress.completedLessons.includes(module.lessons[lessonIndex - 1]?.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => lessonUnlocked && navigate(`/lesson/${lesson.id}`)}
                            disabled={!lessonUnlocked}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                              lessonCompleted
                                ? 'border-green-200 bg-green-50'
                                : lessonUnlocked
                                ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                : 'border-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {lessonCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : lessonUnlocked ? (
                              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">{lesson.title}</div>
                              <div className="text-sm text-gray-600">
                                {lesson.duration} min • {lesson.type}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

