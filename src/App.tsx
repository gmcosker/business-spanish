import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Onboarding from './pages/Onboarding/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import LearningPath from './pages/LearningPath/LearningPath';
import LessonViewer from './pages/LessonViewer/LessonViewer';
import VocabularyReview from './pages/VocabularyReview/VocabularyReview';
import Profile from './pages/Profile/Profile';
import Achievements from './pages/Achievements/Achievements';
import Analytics from './pages/Analytics/Analytics';
import ConversationPractice from './pages/ConversationPractice/ConversationPractice';
import AchievementToast from './components/AchievementToast/AchievementToast';
import SearchModal from './components/Search/SearchModal';
import Login from './pages/Auth/Login';
import Pricing from './pages/Pricing/Pricing';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import Landing from './pages/Landing/Landing';
import SkillsAssessment from './pages/SkillsAssessment/SkillsAssessment';
import { onAuthChange } from './services/auth';
import { getCurrentUserData } from './services/auth';

function App() {
  const { isOnboarding, user, firebaseUser, newAchievements, clearNewAchievements, setFirebaseUser, setUser, loadProgressFromFirestore, syncProgressToFirestore } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: any) => {
      setIsAuthLoading(true);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        // Load user data from Firestore
        const userData = await getCurrentUserData(firebaseUser.uid);
        if (userData) {
          setUser({
            id: userData.uid,
            name: userData.displayName,
            email: userData.email,
            industry: 'tech', // TODO: Get from Firestore
            level: 'intermediate', // TODO: Get from Firestore
            goal: '',
            createdAt: userData.createdAt,
            subscriptionTier: userData.subscriptionTier,
          });
        }
        
        // Load progress from Firestore
        await loadProgressFromFirestore();
      } else {
        setFirebaseUser(null);
        // Don't set user to null to avoid type errors
      }
      
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUser, loadProgressFromFirestore]);

  // Sync progress to Firestore whenever it changes (debounced)
  useEffect(() => {
    if (firebaseUser && user) {
      const timeoutId = setTimeout(() => {
        syncProgressToFirestore();
      }, 2000); // Wait 2 seconds before syncing to avoid too many writes

      return () => clearTimeout(timeoutId);
    }
  }, [user, firebaseUser]);

  // Show loading spinner while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!firebaseUser) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/assessment" element={<SkillsAssessment />} />
          <Route path="/payment-success" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Show onboarding if user hasn't completed it yet
  if (isOnboarding) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/assessment" element={<SkillsAssessment />} />
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        
        {/* Skills Assessment */}
        <Route path="/assessment" element={<SkillsAssessment />} />
        
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Layout onSearchOpen={() => setIsSearchOpen(true)} />}>
          <Route index element={<Dashboard />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="lesson/:lessonId" element={<LessonViewer />} />
          <Route path="vocabulary" element={<VocabularyReview />} />
          <Route path="conversation-practice" element={<ConversationPractice />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Achievement Toasts */}
      {newAchievements.map((achievement, index) => (
        <AchievementToast
          key={achievement.id}
          achievement={achievement}
          onClose={() => {
            if (index === newAchievements.length - 1) {
              clearNewAchievements();
            }
          }}
        />
      ))}
    </BrowserRouter>
  );
}

export default App;

