# Business Spanish Pro

A professional Spanish language learning platform designed specifically for working professionals and entrepreneurs seeking fluency in Spanish for real-world business communication across Latin America.

## Features

### ✅ Complete Feature Set

#### Core Learning Experience
- **Onboarding Flow**: Personalized 4-step onboarding with language placement, industry selection, and goal setting
- **4 Industry-Specific Learning Paths**:
  - Tech/Startups (3 modules, 10+ lessons)
  - Finance & Banking (2 modules, 5+ lessons)
  - Logistics & Operations (1 module, 3+ lessons)
  - Customer Service (1 module, 3+ lessons)
- **Interactive Lessons**: Video lessons, dialogues, vocabulary cards, and practice exercises
- **Speech Recognition**: Real-time pronunciation practice with Web Speech API
- **SRS-Based Vocabulary Builder**: Spaced repetition system with flashcards and quiz mode
- **Responsive Design**: Clean, professional UI optimized for desktop and mobile

#### Progress & Motivation
- **Achievement System**: 12+ unlockable badges across milestones, streaks, and mastery categories
- **Achievement Toasts**: Real-time celebration when unlocking new achievements
- **Streak Tracking**: Daily streak counter with visual indicators
- **Advanced Analytics**: Detailed progress tracking with charts and projections
- **Weekly Goals**: Set and track weekly lesson completion targets

#### Discovery & Navigation
- **Global Search**: Find lessons and vocabulary across all modules instantly
- **Smart Navigation**: Progressive lesson unlocking with clear visual indicators
- **Dashboard**: Quick overview with next lesson, stats, and progress
- **Progress Persistence**: All data saved locally to browser storage

### 🎯 Core User Journeys

1. **Onboarding**: Language level assessment → Industry selection → Goal setting → Get matched content
2. **Learning**: Browse modules → Complete lessons with dialogue and practice → Speech practice → Review vocabulary
3. **Progress**: Track completion, vocabulary mastery, maintain streaks, unlock achievements
4. **Discovery**: Search for specific topics → Jump to relevant lessons → Bookmark favorites
5. **Analytics**: View detailed progress → Adjust goals → Track estimated completion

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout/              # Sidebar, TopBar, main layout
│   ├── SpeechPractice/      # Speech recognition component
│   ├── AchievementToast/    # Achievement notification popups
│   └── Search/              # Global search modal
├── pages/
│   ├── Onboarding/          # Multi-step onboarding flow
│   ├── Dashboard/           # Main dashboard with stats
│   ├── LearningPath/        # Module and lesson browser
│   ├── LessonViewer/        # Lesson content viewer with speech practice
│   ├── VocabularyReview/    # Flashcard-style vocabulary practice (browse/quiz)
│   ├── Achievements/        # Achievement badges and progress
│   ├── Analytics/           # Advanced analytics dashboard
│   └── Profile/             # User profile and settings
├── store/
│   └── useStore.ts          # Zustand store with persistence & achievements
├── data/
│   ├── sampleModules.ts     # Tech industry content
│   ├── financeModules.ts    # Finance industry content
│   ├── logisticsModules.ts  # Logistics industry content
│   └── customerServiceModules.ts  # Customer Service content
├── utils/
│   └── achievements.ts      # Achievement checking logic
├── types/
│   └── index.ts             # TypeScript type definitions
└── App.tsx                  # Main app with routing & toasts
```

## Design System

### Colors

- **Primary**: Indigo/Purple (inspired by Skillshare design)
- **Success**: Green
- **Warning**: Orange/Yellow
- **Danger**: Red
- **Neutral**: Gray scale

### Components

- **Buttons**: Primary and secondary variants
- **Cards**: White with subtle shadows and borders
- **Sidebar**: Fixed navigation with responsive mobile drawer
- **Flashcards**: Interactive vocabulary review system

## Sample Content

### Tech/Startups (3 Modules)
1. **Introduction to Business Spanish** (3 lessons, 45 min)
   - Professional greetings & introductions
   - Business email etiquette
   - Tech vocabulary essentials

2. **Tech Meetings & Presentations** (3 lessons, 60 min)
   - Starting a meeting
   - Presenting technical information
   - Practice: Leading a standup

3. **Client Calls & Negotiations** (1 lesson, 60 min)
   - Understanding client needs

### Finance & Banking (2 Modules)
1. **Financial Spanish Fundamentals** (3 lessons, 50 min)
   - Banking & accounts
   - Financial statements & reports
   - Investment terminology

2. **Client Advisory & Meetings** (2 lessons, 45 min)
   - Financial consultation
   - Presenting financial reports

### Logistics & Operations (1 Module)
1. **Supply Chain Basics** (3 lessons, 45 min)
   - Warehouse operations
   - Shipping & transportation
   - Vendor communications

### Customer Service (1 Module)
1. **Customer Service Fundamentals** (3 lessons, 50 min)
   - Greeting customers
   - Handling complaints
   - Phone etiquette

## Features Completed (Phase 2)

✅ Speech recognition pronunciation practice  
✅ Achievement and badge system with 12+ achievements  
✅ Finance industry learning path (2 modules)  
✅ Logistics industry learning path (1 module)  
✅ Customer Service industry learning path (1 module)  
✅ Global search functionality  
✅ Advanced analytics dashboard with charts and projections  

## Future Enhancements (Phase 3+)

Based on the PRD and project plan, features for future development:

- **Backend & Authentication**: User accounts, cloud sync, multi-device support
- **Live Tutoring**: 1-on-1 video sessions with native speakers
- **AI Enhancements**: ChatGPT-powered conversation practice, smart recommendations
- **Regional Dialects**: Mexico, Colombia, Argentina, Spain variants
- **Mobile Apps**: Native iOS and Android applications
- **Team Features**: Corporate accounts, team progress tracking, custom content
- **Content Tools**: Slack/Email plugin for vocabulary extraction
- **Certification**: CEFR-aligned assessments and digital certificates
- **Community**: Peer review, study groups, social features

## Data Persistence

User data is stored in browser localStorage, including:
- User profile and preferences
- Lesson completion status
- Vocabulary review progress
- Learning streaks

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private project - All rights reserved

## Contact

For questions or feedback about Business Spanish Pro, please contact the development team.

