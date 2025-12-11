import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { BookOpen, Clock, CheckCircle2, Circle, Lock, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { hasFeatureAccess, getUpgradeUrl, getFeatureLimitMessage } from '../../utils/subscription';

export default function LearningPath() {
  const { progress, allModules, currentIndustry, setCurrentIndustry, quickMode, toggleQuickMode, user, backfillCompletedModules } = useStore();
  const navigate = useNavigate();
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  
  // Get modules for the current industry
  const modules = currentIndustry ? (allModules[currentIndustry] || []) : [];

  // Backfill completed modules when component mounts or when modules/progress become available
  useEffect(() => {
    if (progress && Object.keys(allModules).length > 0) {
      backfillCompletedModules();
    }
  }, [progress, allModules, backfillCompletedModules]);

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
    'tech': { name: 'Tech & Startups', modules: allModules['tech'] || [], color: 'sky' },
    'finance': { name: 'Finance & Banking', modules: allModules['finance'] || [], color: 'green' },
    'logistics': { name: 'Logistics & Supply Chain', modules: allModules['logistics'] || [], color: 'blue' },
    'customer-service': { name: 'Customer Service', modules: allModules['customer-service'] || [], color: 'cyan' },
    'architecture': { name: 'Architecture & Construction', modules: allModules['architecture'] || [], color: 'sky' },
    'healthcare': { name: 'Healthcare & Medical Admin', modules: allModules['healthcare'] || [], color: 'cyan' },
  } as const;

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
                {currentIndustry ? industries[currentIndustry as keyof typeof industries].name : 'Select Industry'}
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
        <div className="card p-6 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-sky-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentIndustry ? industries[currentIndustry as keyof typeof industries].name : 'Overall'} Progress
                </h2>
                <p className="text-sm text-gray-600">
                  {completedModulesInCurrentIndustry} of {modules.length || 0} modules completed
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
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-sky-600 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${currentIndustryProgress}%`,
                }}
              />
            </div>
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
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all ${
                        key === currentIndustry
                          ? 'bg-gradient-to-r from-primary-600 to-sky-600'
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
      {modules.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Modules Available</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Modules for your selected industry are loading. If this persists, try selecting a different industry or refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module, index) => {
          const completedLessons = module.lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          const totalLessons = module.lessons.length;
          const isCompleted = progress.completedModules.includes(module.id);
          
          // Check if previous module is fully completed (all lessons done)
          const previousModuleFullyCompleted = index === 0 || (() => {
            const prevModule = modules[index - 1];
            if (!prevModule) return true;
            const prevCompleted = prevModule.lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            return prevCompleted === prevModule.lessons.length;
          })();
          
          // In quick mode, all modules are unlocked; otherwise follow normal progression
          const isUnlocked = quickMode || index === 0 || previousModuleFullyCompleted;

          return (
            <div
              key={module.id}
              className={`card p-6 relative overflow-hidden ${
                isUnlocked ? 'hover:shadow-md transition-all' : 'opacity-60'
              }`}
            >
              {/* Subtle gradient overlay for unlocked modules */}
              {isUnlocked && !isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/3 via-sky-500/3 to-transparent pointer-events-none" />
              )}
              {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
              )}
              
              <div className="relative z-10 flex items-start gap-4">
                {/* Module number */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
                      : isUnlocked
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-200'
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
                    {(() => {
                      const percentage = Math.round((completedLessons / totalLessons) * 100);
                      // Color-coded progress: green (80%+), sky (50-79%), cyan (25-49%), blue (<25%)
                      const getProgressColor = (percent: number) => {
                        if (percent >= 80) return 'from-green-500 to-green-600';
                        if (percent >= 50) return 'from-sky-500 to-sky-600';
                        if (percent >= 25) return 'from-cyan-500 to-cyan-600';
                        return 'from-blue-500 to-blue-600';
                      };
                      const progressGradient = getProgressColor(percentage);
                      
                      return (
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r ${progressGradient} rounded-full transition-all duration-500 shadow-sm`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Lessons list */}
                  {isUnlocked && (
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        // In quick mode, all lessons are unlocked; otherwise follow normal progression
                        const lessonUnlocked =
                          quickMode ||
                          lessonIndex === 0 ||
                          progress.completedLessons.includes(module.lessons[lessonIndex - 1]?.id);
                        
                        // Only show lesson as completed if:
                        // 1. It's in completedLessons AND
                        // 2. The module is unlocked AND
                        // 3. The lesson itself is unlocked (to prevent showing completed lessons from locked modules)
                        const lessonCompleted = isUnlocked && lessonUnlocked && progress.completedLessons.includes(lesson.id);

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
      )}
    </div>
  );
}

