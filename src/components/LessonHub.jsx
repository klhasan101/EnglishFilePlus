import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, ChevronRight, Mic, BookOpen, Layers, Sparkles } from 'lucide-react';

export default function LessonHub({ setView, setSelectedPhrase, speechGoalCompleted }) {
  const [activeTab, setActiveTab] = useState('pronunciation');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});

  // Conversations list
  const conversations = [
    {
      id: 'cafe',
      title: 'Meeting at the Cafe',
      level: 'Beginner',
      duration: '2:45',
      targetPhrase: 'Can I have some water, please?',
      imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjSQKBaIarMethTbS_hQUT-9PM3mNLr8wdMcTCS4gQRBNqAtxE8va1MJwtpX8Al4PnSu6gOe5QCrkTNFdFiBkm1dBFO9eS9qKJkKHhpO754_lqkSAFJ-uW5e4zs3MgnxFgy-GagiUzs0gZbJMkUhnGtencGOyb3kBdmqUHn5Rdv2AAIV31Z3i68m3m4X4ys1Sh-S36knU3oVS0Bgx01niOQd5sBJyyBW7ohW-hqwXD1j9gKYk7lP7WOIeSSarBfMxYKQVRQiHtbHU',
      progress: 85,
    },
    {
      id: 'intro',
      title: 'Introducing Yourself',
      level: 'Beginner',
      duration: '1:20',
      targetPhrase: "Hello! Nice to meet you, I'm Alex.",
      imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVleA87-letz9hTC57S6XRKYUJQO68cdqbKseK4m9-Xr_rD19t-qs748jbZVkI_4NJdsN-RqtVTOk0YQEPwFgAHGNrZwDYqUIc5RuaHruPeYwEaHFS4JmU_Az8sYh7r_do464o7fPMKlRjE32by2OdOtT9C9yqwE6XKyD7brk_ndsmGxYaLAQfPXhdiERTper9IlSqIO_1IV2BdRU235BWtqLsaVs3LHYriUhYVS124ze7AHQNJ7-UVhN0iMbgLoKTee8-z05P1yw',
      progress: 20,
    },
    {
      id: 'reception',
      title: 'At the Reception',
      level: 'Beginner',
      duration: '3:10',
      targetPhrase: 'Excuse me, is there a reservation under my name?',
      imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKWqFzGBaKxsbIAbYUpuu8B9Wt0VfSK-kRnQS4VHuBwK1DVRIq1L-qIxlogfMlLARUfQmdfnIneX4c_4SQo6ywtSFRZ154EaBC7elXsGY7bSDZb29ruQgnWB5UPTrygh-p6oZ4ECKJ2F2VL4nWL35M-S4-waX_l1YfaP2QJMNnfzNQVu01ziygfEcoLw56SSelsQ_Np-C2U8mtAwDzSjbGCeFiQIqqFWoIoB3vtUmcnGALCnxoP4vrM230DtVtrRrv_2WkgklxJts',
      progress: 0,
    }
  ];

  // Simulated audio playing logic
  const handlePlayToggle = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      // Simulate incrementing audio timeline
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          const curr = prev[id] || 0;
          if (curr >= 100) {
            clearInterval(interval);
            setPlayingAudioId(null);
            return { ...prev, [id]: 100 };
          }
          return { ...prev, [id]: curr + 5 };
        });
      }, 300);
    }
  };

  const handleStartShadowing = (phraseInfo) => {
    setSelectedPhrase(phraseInfo);
    setView('shadowingLab');
  };

  // Grammar tab data
  const grammarTopics = [
    { title: 'Present Simple of Be', desc: 'Statements, negatives, and questions with I, you, we, they.', difficulty: 'A1' },
    { title: 'Possessive Adjectives', desc: 'Using my, your, his, her, its, our, their correctly.', difficulty: 'A1' },
  ];

  // Vocab tab data
  const vocabTopics = [
    { title: 'Classroom Vocabulary', desc: 'Objects, requests, and common classroom language.', count: '15 Words' },
    { title: 'Nationalities & Countries', desc: 'Expressing where people are from.', count: '24 Words' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-32 text-slate-800">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('dashboard')}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors smooth-press"
          >
            <ArrowLeft className="text-slate-900 w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">File 1A: First Impressions</h1>
        </div>
        <div className="bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="text-xs font-extrabold text-emerald-600">5 🔥</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-20 px-6 max-w-2xl mx-auto">
        
        {/* Segmented Tab Controls */}
        <div className="bg-slate-200/60 p-1.5 rounded-full flex relative mb-6">
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all ${
              activeTab === 'grammar' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Grammar Bank
          </button>
          <button 
            onClick={() => setActiveTab('vocabulary')}
            className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all ${
              activeTab === 'vocabulary' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vocabulary Bank
          </button>
          <button 
            onClick={() => setActiveTab('pronunciation')}
            className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all ${
              activeTab === 'pronunciation' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pronunciation Lab
          </button>
        </div>

        {/* Tab Content: Grammar Bank */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <BookOpen className="text-slate-500 w-5 h-5" />
                <span>Active Rules</span>
              </h3>
              <p className="text-xs text-slate-500">Practice writing correct grammatical sentences for level Elementary.</p>
            </div>
            {grammarTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.03)] hover:border-slate-300 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-800">{topic.title}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">{topic.difficulty}</span>
                </div>
                <p className="text-xs text-slate-500">{topic.desc}</p>
                <button className="mt-3 text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1">
                  <span>Start Practice</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Vocabulary Bank */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Layers className="text-slate-500 w-5 h-5" />
                <span>Vocabulary Flashcards</span>
              </h3>
              <p className="text-xs text-slate-500">Swipe or tap vocabulary decks to learn new terms.</p>
            </div>
            {vocabTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.03)] hover:border-slate-300 transition-all flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{topic.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{topic.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-extrabold block mb-2">{topic.count}</span>
                  <button className="text-xs font-bold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1">
                    <span>Study</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Pronunciation Lab (Active by default) */}
        {activeTab === 'pronunciation' && (
          <div>
            {/* Daily Speech Goal Card */}
            <section className="mb-6">
              <div className="bg-white p-5 rounded-[20px] shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-950 mb-1">Daily Speech Goal</h2>
                    <p className="text-xs text-slate-500">Shadow 5 oxford conversations today.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Mic className="text-emerald-500 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-extrabold text-emerald-600">
                      {speechGoalCompleted}/5 Completed
                    </span>
                    <span className="text-xs text-slate-500">
                      {Math.round((speechGoalCompleted / 5) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)] transition-all duration-1000" 
                      style={{ width: `${(speechGoalCompleted / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Conversation Library */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Conversation Library</h3>
                <span className="text-xs font-bold text-emerald-600 cursor-pointer hover:underline">View All</span>
              </div>

              {conversations.map((conv) => {
                const isPlaying = playingAudioId === conv.id;
                const progressPercentage = audioProgress[conv.id] || 0;

                return (
                  <div 
                    key={conv.id} 
                    className="group bg-white p-4 rounded-[20px] shadow-[0_4px_20px_rgba(30,41,59,0.04)] hover:shadow-[0_10px_30px_rgba(30,41,59,0.06)] transition-all flex items-center gap-4 border border-slate-100 relative overflow-hidden"
                  >
                    {/* Conversation Thumbnail */}
                    <div 
                      className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100"
                    >
                      <img 
                        src={conv.imgUrl} 
                        alt={conv.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Hover Play Button Overlay */}
                      <button 
                        onClick={() => handlePlayToggle(conv.id)}
                        className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isPlaying ? (
                          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900">
                            <Pause size={16} fill="currentColor" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900">
                            <Play size={16} fill="currentColor" className="translate-x-0.5" />
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Meta and Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                          {conv.level}
                        </span>
                        <span className="text-slate-400 text-[10px] font-semibold">{conv.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug truncate">
                        {conv.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate italic">
                        "{conv.targetPhrase}"
                      </p>

                      {/* Play Progress Track */}
                      {isPlaying && (
                        <div className="mt-2.5 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 items-end justify-center flex-shrink-0">
                      {/* Play toggle on the right */}
                      <button 
                        onClick={() => handlePlayToggle(conv.id)}
                        className={`w-9 h-9 rounded-full border-2 border-slate-100 flex items-center justify-center smooth-press transition-colors ${
                          isPlaying ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="translate-x-0.5" />}
                      </button>
                      
                      {/* Launch shadowing button */}
                      <button
                        onClick={() => handleStartShadowing({ 
                          title: conv.title, 
                          phrase: conv.targetPhrase,
                          audioUrl: conv.imgUrl 
                        })}
                        className="text-[10px] font-extrabold text-slate-900 border border-slate-200 hover:border-slate-800 px-2.5 py-1 rounded-lg transition-colors smooth-press"
                      >
                        Shadow Lab
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Float Action Area (Sticky CTA) */}
            <div className="fixed bottom-20 left-0 w-full px-6 pb-6 pointer-events-none z-30 md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
              <div className="max-w-md mx-auto flex justify-center">
                <button 
                  onClick={() => handleStartShadowing({ 
                    title: 'Meeting at the Cafe', 
                    phrase: 'Can I have some water, please?',
                    audioUrl: conversations[0].imgUrl 
                  })}
                  className="pointer-events-auto bg-slate-900 text-white w-full py-4 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2.5 smooth-press"
                >
                  <Sparkles size={16} className="text-emerald-400" />
                  <span>Start Shadowing Lab</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
