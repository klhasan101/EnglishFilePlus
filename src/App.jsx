import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LessonHub from './components/LessonHub';
import ShadowingLab from './components/ShadowingLab';
import ChatSimulator from './components/ChatSimulator';
import VocabularyFlashcards from './components/VocabularyFlashcards';
import LevelSelection from './components/LevelSelection';
import Registration from './components/Registration';
import { User, Award, Flame, Calendar, BookOpen, Star, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setView] = useState('dashboard');
  const [streakCount, setStreakCount] = useState(5);
  const [completedLessons, setCompletedLessons] = useState(['file1']); // File 1 is completed by default
  const [speechGoalCompleted, setSpeechGoalCompleted] = useState(3); // 3 of 5 completed
  const [selectedPhrase, setSelectedPhrase] = useState({
    title: 'Meeting at the Cafe',
    phrase: 'Can I have some water, please?',
    audioUrl: ''
  });
  const [currentLevel, setCurrentLevel] = useState('a2'); // Default level
  const [isRegistered, setIsRegistered] = useState(true); // Default to registered for existing users
  const [vocabProgress, setVocabProgress] = useState({}); // { wordId: 'mastered' | 'learning' | 'unseen' }
  
  // Default Chat History matching Screen 4
  const defaultChatHistory = [
    {
      id: 'jenny-init',
      sender: 'jenny',
      text: "Hi there! Welcome to the cafe. What can I get for you today? ☕",
      timestamp: "09:41 AM"
    },
    {
      id: 'user-init',
      sender: 'user',
      text: "I'd like a double espresso, please.",
      timestamp: "09:42 AM"
    }
  ];
  
  const [chatHistory, setChatHistory] = useState(defaultChatHistory);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem('ef_streakCount');
      if (savedStreak !== null) setStreakCount(parseInt(savedStreak, 10));

      const savedCompleted = localStorage.getItem('ef_completedLessons');
      if (savedCompleted !== null) setCompletedLessons(JSON.parse(savedCompleted));

      const savedGoal = localStorage.getItem('ef_speechGoalCompleted');
      if (savedGoal !== null) setSpeechGoalCompleted(parseInt(savedGoal, 10));

      const savedChat = localStorage.getItem('ef_chatHistory');
      if (savedChat !== null) setChatHistory(JSON.parse(savedChat));
      
      const savedPhrase = localStorage.getItem('ef_selectedPhrase');
      if (savedPhrase !== null) setSelectedPhrase(JSON.parse(savedPhrase));

      const savedLevel = localStorage.getItem('ef_currentLevel');
      if (savedLevel !== null) setCurrentLevel(savedLevel);

      const savedRegistered = localStorage.getItem('ef_isRegistered');
      if (savedRegistered !== null) setIsRegistered(savedRegistered === 'true');

      const savedVocab = localStorage.getItem('ef_vocabProgress');
      if (savedVocab !== null) setVocabProgress(JSON.parse(savedVocab));
    } catch (e) {
      console.error("Failed to load local storage state: ", e);
    }
  }, []);

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ef_streakCount', streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('ef_completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('ef_speechGoalCompleted', speechGoalCompleted.toString());
  }, [speechGoalCompleted]);

  useEffect(() => {
    localStorage.setItem('ef_chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('ef_selectedPhrase', JSON.stringify(selectedPhrase));
  }, [selectedPhrase]);

  useEffect(() => {
    localStorage.setItem('ef_currentLevel', currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('ef_isRegistered', isRegistered.toString());
  }, [isRegistered]);

  useEffect(() => {
    localStorage.setItem('ef_vocabProgress', JSON.stringify(vocabProgress));
  }, [vocabProgress]);

  // Reset function to clear and restart everything
  const handleResetAllData = () => {
    if (window.confirm("Are you sure you want to reset your learning progress?")) {
      setStreakCount(5);
      setCompletedLessons(['file1']);
      setSpeechGoalCompleted(3);
      setChatHistory(defaultChatHistory);
      setSelectedPhrase({
        title: 'Meeting at the Cafe',
        phrase: 'Can I have some water, please?',
        audioUrl: ''
      });
      setCurrentLevel('a2');
      setVocabProgress({});
      localStorage.clear();
      setView('dashboard');
    }
  };

  // Toggle lesson complete/incomplete state (Roadmap nodes)
  const toggleLessonCompleted = (lessonId) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  // Increment daily speech goal
  const handleSpeechGoalComplete = () => {
    setSpeechGoalCompleted(prev => (prev < 5 ? prev + 1 : 5));
  };

  // Determine if we should show the bottom navbar
  const hideNavbarViews = ['levelSelect', 'register', 'shadowingLab'];
  const showNavbar = !hideNavbarViews.includes(currentView);

  // Render active view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            streakCount={streakCount}
            setStreakCount={setStreakCount}
            completedLessons={completedLessons}
            toggleLessonCompleted={toggleLessonCompleted}
            setView={setView}
          />
        );
      case 'lessonHub':
        return (
          <LessonHub 
            setView={setView}
            setSelectedPhrase={setSelectedPhrase}
            speechGoalCompleted={speechGoalCompleted}
          />
        );
      case 'shadowingLab':
        return (
          <ShadowingLab 
            setView={setView}
            selectedPhrase={selectedPhrase}
            onSpeechGoalComplete={handleSpeechGoalComplete}
          />
        );
      case 'chat':
        return (
          <ChatSimulator 
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        );
      case 'vocab':
        return (
          <VocabularyFlashcards
            vocabProgress={vocabProgress}
            setVocabProgress={setVocabProgress}
            setView={setView}
          />
        );
      case 'levelSelect':
        return (
          <LevelSelection
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            setView={setView}
          />
        );
      case 'register':
        return (
          <Registration
            setView={setView}
            setIsRegistered={setIsRegistered}
          />
        );
      case 'profile':
        return (
          <div className="w-full min-h-screen bg-slate-50 font-sans pb-32 text-slate-800 pt-20 px-6 max-w-2xl mx-auto">
            {/* User Profile Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgovp1GZvWpLjqoih5FosOwOWEgMfmUxUa2bynuhicJZIKe1HSh7zqtUvsIZ0HAyz6b-bYj4JyyRGi8M4ork265_2EwMpjKoSENvAOCeMP0tw6YIzUuM-QiX3v6I-H65vqSAnZUifhBCnHZ4ZOx-Cyw7ka0_5UOKlNW10HO7MWGXxLZgTn9OWZukqn6U5byHx9wxkgAzWkrLgzcqZTPDYwmpMGTteUPSKDvA0CetdnR3tL1ZFyIGioHHyTLqjn2WEWUmnMvN1JTbQ" 
                  alt="Alex Avatar"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-4">{localStorage.getItem('ef_userName') || 'Alex Mercer'}</h2>
              <p className="text-xs text-slate-400 mt-1">Elementary Student • Since June 2026</p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 w-full mt-6 pt-6 border-t border-slate-100 text-center gap-2">
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">{streakCount}d</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Streak</span>
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">{completedLessons.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Files Done</span>
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">1,240</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">XP Points</span>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="text-amber-400" size={18} />
                <span>Achievements Earned</span>
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">5-Day Heat Streak</h4>
                    <p className="text-[10px] text-slate-400">Completed lessons 5 days in a row.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Perfect Shadowing Match</h4>
                    <p className="text-[10px] text-slate-400">Scored above 90% in Shadowing Lab.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings/Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setView('levelSelect')}
                className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 flex items-center justify-between hover:border-emerald-300 transition-colors smooth-press"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <BookOpen size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900">Change Level</h4>
                    <p className="text-[10px] text-slate-400">Currently: Elementary (A2)</p>
                  </div>
                </div>
                <span className="text-slate-300">→</span>
              </button>

              <button
                onClick={() => setView('register')}
                className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 flex items-center justify-between hover:border-emerald-300 transition-colors smooth-press"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900">Account Settings</h4>
                    <p className="text-[10px] text-slate-400">Update your profile and preferences</p>
                  </div>
                </div>
                <span className="text-slate-300">→</span>
              </button>
            </div>

            {/* Reset option */}
            <div className="mt-12 text-center">
              <button 
                onClick={handleResetAllData}
                className="text-xs text-slate-400 hover:text-red-500 inline-flex items-center gap-1.5 border border-slate-200 hover:border-red-200 px-3.5 py-1.5 rounded-full transition-colors smooth-press"
              >
                <RefreshCw size={12} />
                <span>Reset Application Database</span>
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard streakCount={streakCount} setStreakCount={setStreakCount} completedLessons={completedLessons} toggleLessonCompleted={toggleLessonCompleted} setView={setView} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 w-full md:max-w-2xl md:mx-auto md:border-x md:border-slate-200 md:shadow-2xl">
      {/* Dynamic Screen View */}
      {renderView()}

      {/* Persistent Bottom Nav Bar (hidden on transactional screens) */}
      {showNavbar && <Navbar currentView={currentView} setView={setView} />}
    </div>
  );
}
