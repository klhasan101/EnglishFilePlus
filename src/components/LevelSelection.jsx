import React, { useState } from 'react';
import { ArrowLeft, Sprout, Flower2, TreePine, Trees, Flame, Crown, Info } from 'lucide-react';

const LEVELS = [
  { id: 'a1', label: 'Beginner', code: 'A1', description: 'Starting from scratch with basic greetings and phrases.', icon: Sprout, arabicLabel: 'مبتدئ' },
  { id: 'a2', label: 'Elementary', code: 'A2', description: 'Simple sentences and familiar everyday expressions.', icon: Flower2, arabicLabel: 'أساسي' },
  { id: 'b1', label: 'Pre-Intermediate', code: 'B1', description: 'Communicate in everyday situations with confidence.', icon: TreePine, arabicLabel: 'ما قبل المتوسط' },
  { id: 'b1plus', label: 'Intermediate', code: 'B1+', description: 'Understand main points in work and study topics.', icon: Trees, arabicLabel: 'متوسط' },
  { id: 'b2', label: 'Intermediate Plus', code: 'B2', description: 'Interact spontaneously with native speakers.', icon: Flame, arabicLabel: 'متوسط مرتفع' },
  { id: 'b2plus', label: 'Upper-Intermediate', code: 'B2+', description: 'Express opinions clearly on complex subjects.', icon: Flame, arabicLabel: 'فوق المتوسط' },
  { id: 'c1', label: 'Advanced', code: 'C1', description: 'Speak fluently and use language flexibly in all contexts.', icon: Crown, arabicLabel: 'متقدم' },
];

export default function LevelSelection({ currentLevel, setCurrentLevel, setView }) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel || 'a2');
  const [animatingCard, setAnimatingCard] = useState(null);

  const handleSelect = (levelId) => {
    setAnimatingCard(levelId);
    setTimeout(() => setAnimatingCard(null), 300);
    setSelectedLevel(levelId);
  };

  const handleConfirm = () => {
    setCurrentLevel(selectedLevel);
    setView('dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 max-w-2xl mx-auto">
          <button
            onClick={() => setView('profile')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors smooth-press"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-emerald-500 rounded-full transition-all duration-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 of 2</span>
          </div>
          <div className="w-6" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-8 pb-32 max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Choose Your Level
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We'll personalize your learning journey based on your selection.
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-3">
          {LEVELS.map((level) => {
            const isActive = selectedLevel === level.id;
            const LevelIcon = level.icon;
            
            return (
              <button
                key={level.id}
                onClick={() => handleSelect(level.id)}
                className={`w-full group flex items-center p-4 rounded-[20px] transition-all duration-300 text-left smooth-press ${
                  isActive 
                    ? 'bg-white border-2 border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.08)]' 
                    : 'bg-white border-2 border-transparent shadow-[0_4px_15px_rgba(30,41,59,0.04)] hover:border-slate-200'
                } ${animatingCard === level.id ? 'scale-[0.98]' : ''}`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center mr-4 transition-transform group-hover:scale-105 ${
                  isActive ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                  <LevelIcon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-[15px] leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {level.label} ({level.code})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{level.description}</p>
                </div>

                {/* Radio */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                  isActive ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                }`}>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-[scale-in_0.2s_ease-out]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info card */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <Info size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 leading-relaxed">
            You can always change your level later from your Profile settings.
          </p>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md px-5 py-4 border-t border-slate-100 z-40">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-500 text-white font-bold text-base py-4 rounded-2xl shadow-lg hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowLeft size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
