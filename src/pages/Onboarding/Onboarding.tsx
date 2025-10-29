import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { LanguageLevel, Industry } from '../../types';

export default function Onboarding() {
  const { onboardingData, updateOnboarding, completeOnboarding, setModules, setAllModules, setCurrentIndustry } = useStore();
  const [step, setStep] = useState(onboardingData.step);

  const handleNext = () => {
    updateOnboarding({ step: step + 1 });
    setStep(step + 1);
  };

  const handleBack = () => {
    updateOnboarding({ step: step - 1 });
    setStep(step - 1);
  };

  const handleComplete = async () => {
    // Load all industry modules
    const { techModules } = await import('../../data/sampleModules');
    const { financeModules } = await import('../../data/financeModules');
    const { logisticsModules } = await import('../../data/logisticsModules');
    const { customerServiceModules } = await import('../../data/customerServiceModules');
    
    // Store all modules by industry
    setAllModules('tech', techModules);
    setAllModules('finance', financeModules);
    setAllModules('logistics', logisticsModules);
    setAllModules('customer-service', customerServiceModules);
    
    // Set the initial industry based on user selection
    const initialIndustry = onboardingData.industry || 'tech';
    setCurrentIndustry(initialIndustry);
    
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">BS</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Business Spanish Pro</span>
          </div>
          <p className="text-gray-600">Professional Spanish for Real-World Business</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step ? 'w-12 bg-primary-600' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content card */}
        <div className="card p-8">
          {step === 0 && <WelcomeStep onNext={handleNext} />}
          {step === 1 && (
            <LevelStep
              onNext={handleNext}
              onBack={handleBack}
              currentLevel={onboardingData.level}
            />
          )}
          {step === 2 && (
            <IndustryStep
              onNext={handleNext}
              onBack={handleBack}
              currentIndustry={onboardingData.industry}
            />
          )}
          {step === 3 && (
            <GoalStep
              onBack={handleBack}
              onComplete={handleComplete}
              currentGoal={onboardingData.goal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Business Spanish Pro
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Master Spanish for real-world business communication across Latin America.
        Let's customize your learning experience.
      </p>
      <button onClick={onNext} className="btn-primary inline-flex items-center gap-2">
        Get Started <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function LevelStep({
  onNext,
  onBack,
  currentLevel,
}: {
  onNext: () => void;
  onBack: () => void;
  currentLevel?: LanguageLevel;
}) {
  const { updateOnboarding } = useStore();
  const [selected, setSelected] = useState<LanguageLevel | undefined>(currentLevel);

  const levels: { value: LanguageLevel; label: string; description: string }[] = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'Little to no Spanish experience',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Can hold basic conversations',
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Fluent but want business vocabulary',
    },
  ];

  const handleContinue = () => {
    if (selected) {
      updateOnboarding({ level: selected });
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your Spanish level?</h2>
      <p className="text-gray-600 mb-6">This helps us personalize your learning path.</p>

      <div className="space-y-3 mb-8">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => setSelected(level.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selected === level.value
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900">{level.label}</div>
            <div className="text-sm text-gray-600">{level.description}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function IndustryStep({
  onNext,
  onBack,
  currentIndustry,
}: {
  onNext: () => void;
  onBack: () => void;
  currentIndustry?: Industry;
}) {
  const { updateOnboarding } = useStore();
  const [selected, setSelected] = useState<Industry | undefined>(currentIndustry);

  const industries: { value: Industry; label: string; description: string }[] = [
    {
      value: 'tech',
      label: 'Tech / Startups',
      description: 'Software, product management, development',
    },
    {
      value: 'finance',
      label: 'Finance',
      description: 'Banking, investments, accounting',
    },
    {
      value: 'logistics',
      label: 'Logistics & Operations',
      description: 'Supply chain, shipping, warehouse',
    },
    {
      value: 'customer-service',
      label: 'Customer Service',
      description: 'Sales, support, client relations',
    },
  ];

  const handleContinue = () => {
    if (selected) {
      updateOnboarding({ industry: selected });
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What industry are you in?</h2>
      <p className="text-gray-600 mb-6">
        We'll focus on vocabulary and scenarios relevant to your field.
      </p>

      <div className="space-y-3 mb-8">
        {industries.map((industry) => (
          <button
            key={industry.value}
            onClick={() => setSelected(industry.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selected === industry.value
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900">{industry.label}</div>
            <div className="text-sm text-gray-600">{industry.description}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function GoalStep({
  onBack,
  onComplete,
  currentGoal,
}: {
  onBack: () => void;
  onComplete: () => void;
  currentGoal?: string;
}) {
  const navigate = useNavigate();
  const { updateOnboarding } = useStore();
  const [goal, setGoal] = useState(currentGoal || '');
  const [targetDate, setTargetDate] = useState('');

  const handleComplete = async () => {
    updateOnboarding({ goal, targetDate });
    // Redirect to assessment instead of completing onboarding
    navigate('/assessment');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your goal?</h2>
      <p className="text-gray-600 mb-6">
        Setting a goal helps keep you motivated and on track.
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your goal
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Lead sales calls in Spanish within 3 months"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target date (optional)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!goal}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Take Assessment <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

