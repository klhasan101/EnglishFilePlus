import React, { useState } from 'react';
import { Flame, Bell, Check, Play, Lock, ChevronDown, Award, Star } from 'lucide-react';

export default function Dashboard({ 
  streakCount, 
  setStreakCount, 
  completedLessons, 
  toggleLessonCompleted, 
  setView 
}) {
  const [level, setLevel] = useState('Elementary A1-A2');
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const levels = ['Beginner A1', 'Elementary A1-A2', 'Pre-Intermediate B1-B2', 'Intermediate B2'];

  // Calculate dynamic progress
  // Let's say: File 1 is completed = 50%
  // File 1 & File 2 completed = 85%
  // File 1, File 2 & File 3 completed = 100%
  // If none completed = 15% (just getting started)
  let calculatedProgress = 15;
  const hasFile1 = completedLessons.includes('file1');
  const hasFile2 = completedLessons.includes('file2');
  const hasFile3 = completedLessons.includes('file3');

  if (hasFile1 && hasFile2 && hasFile3) {
    calculatedProgress = 100;
  } else if (hasFile1 && hasFile2) {
    calculatedProgress = 85;
  } else if (hasFile1) {
    calculatedProgress = 50;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-32 text-slate-800">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-slate-100 px-6 h-16 flex justify-between items-center md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgovp1GZvWpLjqoih5FosOwOWEgMfmUxUa2bynuhicJZIKe1HSh7zqtUvsIZ0HAyz6b-bYj4JyyRGi8M4ork265_2EwMpjKoSENvAOCeMP0tw6YIzUuM-QiX3v6I-H65vqSAnZUifhBCnHZ4ZOx-Cyw7ka0_5UOKlNW10HO7MWGXxLZgTn9OWZukqn6U5byHx9wxkgAzWkrLgzcqZTPDYwmpMGTteUPSKDvA0CetdnR3tL1ZFyIGioHHyTLqjn2WEWUmnMvN1JTbQ" 
              alt="Alex Avatar"
            />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">English File</h1>
        </div>

        {/* Level Selector Badge */}
        <div className="relative">
          <button 
            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all smooth-press"
          >
            <span>{level}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showLevelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showLevelDropdown && (
            <div className="absolute top-10 right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevel(lvl);
                    setShowLevelDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${level === lvl ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Streak and Notification */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setStreakCount(prev => prev + 1)}
            className="flex items-center gap-1 cursor-pointer select-none group"
            title="Click to increase streak!"
          >
            <span className="text-lg font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streakCount}d</span>
            </span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 hover:scale-105 transition-all">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mt-20 px-6 max-w-2xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-6 mt-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Alex!</h2>
          <p className="text-sm text-slate-500 mt-1">
            You're making excellent progress in <span className="font-semibold text-slate-800">{level}</span>.
          </p>
        </div>

        {/* Progress and Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Circular SVG Progress Ring Card */}
          <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(30,41,59,0.06)] transition-all duration-300">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  className="text-slate-100" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="40" 
                  stroke="currentColor" 
                  strokeWidth="6"
                ></circle>
                <circle 
                  className="text-emerald-500 transition-all duration-1000 ease-out" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="40" 
                  stroke="currentColor" 
                  strokeDasharray={2 * Math.PI * 40} 
                  strokeDashoffset={2 * Math.PI * 40 - (calculatedProgress / 100) * 2 * Math.PI * 40} 
                  strokeWidth="6"
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-900">{calculatedProgress}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Course Progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">Keep learning to hit 100%!</p>
              <div className="mt-2 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                {hasFile1 && hasFile2 ? 'Great Pace!' : 'Getting Started'}
              </div>
            </div>
          </div>

          {/* Stats Bento Card */}
          <div className="bg-slate-900 text-white rounded-[20px] p-5 shadow-lg relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="gloss-effect absolute inset-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <Award className="text-amber-400 w-8 h-8" />
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gold League
                </span>
              </div>
              <h3 className="text-base font-bold">Elite Scholar</h3>
              <p className="text-slate-400 text-xs mt-1">You rank in the top 5% of learners this week.</p>
            </div>
            <div className="mt-4 relative z-10 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Star size={14} className="fill-emerald-400" />
              <span>1,240 Total XP Earned</span>
            </div>
          </div>
        </div>

        {/* Interactive Learning Path Roadmap */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Learning Path</h3>
          <div className="relative py-4 max-w-sm mx-auto">
            {/* Vertical connector line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 roadmap-dashed-path"></div>
            
            <div className="flex flex-col gap-16 relative">
              
              {/* Node 1: File 1 */}
              <div className="flex flex-col items-center relative group">
                {hasFile1 ? (
                  <button 
                    onClick={() => toggleLessonCompleted('file1')}
                    className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-md relative z-10 hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Click to reset progress"
                  >
                    <Check className="text-white w-7 h-7 stroke-[3px]" />
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleLessonCompleted('file1')}
                    className="w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-md relative z-10 pulsing-ring hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Click to complete File 1"
                  >
                    <Play className="text-emerald-400 w-6 h-6 fill-emerald-400 translate-x-0.5" />
                  </button>
                )}
                <div className="mt-3 text-center">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block mb-0.5 ${hasFile1 ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {hasFile1 ? 'Completed' : 'Active Lesson'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">File 1: Nice to meet you</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Greetings, introductions, and basic questions.</p>
                </div>
              </div>

              {/* Node 2: File 2 */}
              <div className="flex flex-col items-center relative group">
                {hasFile2 ? (
                  <button 
                    onClick={() => toggleLessonCompleted('file2')}
                    className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-md relative z-10 hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Click to reset progress"
                  >
                    <Check className="text-white w-7 h-7 stroke-[3px]" />
                  </button>
                ) : hasFile1 ? (
                  // Active because File 1 is completed
                  <button 
                    onClick={() => setView('lessonHub')}
                    className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-lg relative z-10 pulsing-ring hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Start File 2"
                  >
                    <Play className="text-white w-8 h-8 fill-white translate-x-0.5" />
                  </button>
                ) : (
                  // Locked because File 1 is not completed
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center relative z-10 border border-slate-300">
                    <Lock className="text-slate-400 w-6 h-6" />
                  </div>
                )}
                <div className="mt-3 text-center max-w-xs">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block mb-0.5 ${hasFile2 ? 'text-emerald-500' : hasFile1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasFile2 ? 'Completed' : hasFile1 ? 'Current Lesson' : 'Locked'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">File 2: Eating Out</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ordering food, restaurant items, and menu vocabulary.</p>
                  {hasFile1 && !hasFile2 && (
                    <button 
                      onClick={() => setView('lessonHub')}
                      className="mt-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-sm smooth-press transition-all duration-150 pointer-events-auto"
                    >
                      Continue Lesson
                    </button>
                  )}
                </div>
              </div>

              {/* Node 3: File 3 */}
              <div className="flex flex-col items-center relative group">
                {hasFile3 ? (
                  <button 
                    onClick={() => toggleLessonCompleted('file3')}
                    className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-md relative z-10 hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Click to reset progress"
                  >
                    <Check className="text-white w-7 h-7 stroke-[3px]" />
                  </button>
                ) : hasFile1 && hasFile2 ? (
                  // Active because File 2 is completed
                  <button 
                    onClick={() => toggleLessonCompleted('file3')}
                    className="w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-md relative z-10 pulsing-ring hover:scale-105 active:scale-95 transition-transform duration-200"
                    title="Click to complete File 3"
                  >
                    <Play className="text-emerald-400 w-6 h-6 fill-emerald-400 translate-x-0.5" />
                  </button>
                ) : (
                  // Locked
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center relative z-10 border border-slate-300">
                    <Lock className="text-slate-400 w-5 h-5" />
                  </div>
                )}
                <div className="mt-3 text-center">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block mb-0.5 ${hasFile3 ? 'text-emerald-500' : hasFile1 && hasFile2 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasFile3 ? 'Completed' : hasFile1 && hasFile2 ? 'Active Lesson' : 'Locked'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">File 3: Travel</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Airports, hotel stays, and transport communication.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
