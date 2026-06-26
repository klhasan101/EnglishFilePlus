import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Volume2, Check, X, Star, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Shuffle, Eye, EyeOff } from 'lucide-react';

const VOCAB_DATA = {
  file1: {
    title: "File 1: Nice to meet you",
    subtitle: "Greetings & Introductions",
    color: "emerald",
    words: [
      { id: 1, word: "Hello", phonetic: "/həˈləʊ/", definition: "A greeting used when meeting someone", example: "Hello, my name is Alex.", category: "greeting" },
      { id: 2, word: "Goodbye", phonetic: "/ɡʊdˈbaɪ/", definition: "A farewell expression when leaving", example: "Goodbye, see you tomorrow!", category: "greeting" },
      { id: 3, word: "Please", phonetic: "/pliːz/", definition: "Used to make a polite request", example: "Can I have some water, please?", category: "polite" },
      { id: 4, word: "Thank you", phonetic: "/θæŋk juː/", definition: "An expression of gratitude", example: "Thank you for your help.", category: "polite" },
      { id: 5, word: "Sorry", phonetic: "/ˈsɒri/", definition: "Used to apologize or express regret", example: "Sorry, I didn't understand.", category: "polite" },
      { id: 6, word: "Name", phonetic: "/neɪm/", definition: "A word by which a person is known", example: "My name is Sarah.", category: "personal" },
      { id: 7, word: "Country", phonetic: "/ˈkʌntri/", definition: "A nation with its own government", example: "What country are you from?", category: "personal" },
      { id: 8, word: "Job", phonetic: "/dʒɒb/", definition: "Paid work or employment", example: "What's your job?", category: "personal" },
      { id: 9, word: "Nice", phonetic: "/naɪs/", definition: "Pleasant, enjoyable, or attractive", example: "Nice to meet you!", category: "adjective" },
      { id: 10, word: "Student", phonetic: "/ˈstjuːdənt/", definition: "A person who is studying", example: "I'm a student at the university.", category: "personal" },
    ]
  },
  file2: {
    title: "File 2: Eating Out",
    subtitle: "Restaurant & Food Vocabulary",
    color: "amber",
    words: [
      { id: 11, word: "Menu", phonetic: "/ˈmenjuː/", definition: "A list of dishes available in a restaurant", example: "Can I see the menu, please?", category: "restaurant" },
      { id: 12, word: "Waiter", phonetic: "/ˈweɪtər/", definition: "A person who serves at tables", example: "The waiter brought us the menu.", category: "restaurant" },
      { id: 13, word: "Bill", phonetic: "/bɪl/", definition: "A statement of charges for food/drink", example: "Can we have the bill, please?", category: "restaurant" },
      { id: 14, word: "Reservation", phonetic: "/ˌrezəˈveɪʃən/", definition: "An arrangement to have a table kept", example: "I'd like to make a reservation for two.", category: "restaurant" },
      { id: 15, word: "Appetizer", phonetic: "/ˈæpɪtaɪzər/", definition: "A small dish eaten before the main course", example: "Would you like an appetizer?", category: "food" },
      { id: 16, word: "Main course", phonetic: "/meɪn kɔːrs/", definition: "The principal dish of a meal", example: "For the main course, I'll have the steak.", category: "food" },
      { id: 17, word: "Dessert", phonetic: "/dɪˈzɜːrt/", definition: "A sweet course eaten at the end of a meal", example: "What desserts do you have?", category: "food" },
      { id: 18, word: "Delicious", phonetic: "/dɪˈlɪʃəs/", definition: "Highly pleasant to taste", example: "This pasta is delicious!", category: "adjective" },
      { id: 19, word: "Spicy", phonetic: "/ˈspaɪsi/", definition: "Flavored with strong spices", example: "I don't like spicy food.", category: "adjective" },
      { id: 20, word: "Tip", phonetic: "/tɪp/", definition: "Money given for good service", example: "We left a generous tip.", category: "restaurant" },
      { id: 21, word: "Vegetarian", phonetic: "/ˌvedʒɪˈteəriən/", definition: "A person who does not eat meat", example: "Do you have vegetarian options?", category: "food" },
      { id: 22, word: "Starter", phonetic: "/ˈstɑːrtər/", definition: "A small amount of food at the start of a meal", example: "I'll have the soup as a starter.", category: "food" },
      { id: 23, word: "Beverage", phonetic: "/ˈbevərɪdʒ/", definition: "A drink, especially one other than water", example: "What beverages do you have?", category: "food" },
      { id: 24, word: "Order", phonetic: "/ˈɔːrdər/", definition: "To request food or drink in a restaurant", example: "Are you ready to order?", category: "restaurant" },
    ]
  }
};

export default function VocabularyFlashcards({ vocabProgress, setVocabProgress, setView }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(true);
  const [animateDirection, setAnimateDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const currentDeck = selectedFile ? VOCAB_DATA[selectedFile] : null;
  const currentCard = currentDeck ? currentDeck.words[currentIndex] : null;

  // Card status helpers
  const getCardStatus = (wordId) => vocabProgress[wordId] || 'unseen';
  
  const markCard = (wordId, status) => {
    setVocabProgress(prev => ({ ...prev, [wordId]: status }));
  };

  const getDeckStats = (fileKey) => {
    const words = VOCAB_DATA[fileKey].words;
    const mastered = words.filter(w => vocabProgress[w.id] === 'mastered').length;
    const learning = words.filter(w => vocabProgress[w.id] === 'learning').length;
    const unseen = words.filter(w => !vocabProgress[w.id] || vocabProgress[w.id] === 'unseen').length;
    return { total: words.length, mastered, learning, unseen };
  };

  // Navigation
  const goToNext = useCallback(() => {
    if (!currentDeck || currentIndex >= currentDeck.words.length - 1) return;
    setAnimateDirection('left');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setAnimateDirection(null);
    }, 200);
  }, [currentDeck, currentIndex]);

  const goToPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setAnimateDirection('right');
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      setAnimateDirection(null);
    }, 200);
  }, [currentIndex]);

  // Touch swipe
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? goToNext() : goToPrev();
    }
    setTouchStart(null);
  };

  // Speak word
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Shuffle deck
  const shuffleDeck = () => {
    if (!currentDeck) return;
    setCurrentIndex(Math.floor(Math.random() * currentDeck.words.length));
    setIsFlipped(false);
  };

  // --- Deck Selection View ---
  if (!selectedFile) {
    return (
      <div className="w-full min-h-screen bg-slate-50 font-sans pb-32 text-slate-800 pt-20 px-5 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Vocabulary Bank</h1>
          <p className="text-sm text-slate-500">Master new words with interactive flashcards.</p>
        </div>

        {/* Overall Progress Ring */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                <circle 
                  cx="40" cy="40" r="34" fill="transparent" 
                  stroke="#10b981" strokeWidth="6" 
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - Object.values(vocabProgress).filter(v => v === 'mastered').length / 24)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-extrabold text-slate-800">
                  {Object.values(vocabProgress).filter(v => v === 'mastered').length}/{24}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Words Mastered</h3>
              <p className="text-xs text-slate-400 mt-1">
                {Object.values(vocabProgress).filter(v => v === 'learning').length} still learning • 
                {24 - Object.values(vocabProgress).filter(v => v === 'mastered').length - Object.values(vocabProgress).filter(v => v === 'learning').length} unseen
              </p>
            </div>
          </div>
        </div>

        {/* Deck Cards */}
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Choose a Deck</h3>
        <div className="space-y-3">
          {Object.entries(VOCAB_DATA).map(([key, deck]) => {
            const stats = getDeckStats(key);
            const progressPercent = stats.total > 0 ? ((stats.mastered / stats.total) * 100) : 0;
            
            return (
              <button
                key={key}
                onClick={() => { setSelectedFile(key); setCurrentIndex(0); setIsFlipped(false); }}
                className="w-full bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 text-left hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 smooth-press group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{deck.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{deck.subtitle}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    stats.mastered === stats.total 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : stats.learning > 0 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-slate-100 text-slate-500'
                  }`}>
                    {stats.mastered === stats.total ? 'Complete' : stats.learning > 0 ? 'In Progress' : 'New'}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{stats.mastered} mastered</span>
                  <span>{stats.learning} learning</span>
                  <span>{stats.unseen} unseen</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Spaced Repetition Info */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <Star className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-bold text-emerald-700">Spaced Repetition</h4>
            <p className="text-[11px] text-emerald-600 mt-0.5">Cards you mark as "learning" will reappear more frequently to reinforce memory.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Flashcard Study View ---
  const status = currentCard ? getCardStatus(currentCard.id) : 'unseen';
  const stats = getDeckStats(selectedFile);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-32 text-slate-800 pt-20 px-5 max-w-2xl mx-auto">
      {/* Header with back */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setSelectedFile(null)} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors smooth-press"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">{currentDeck.title}</h2>
          <p className="text-[10px] text-slate-400">{currentIndex + 1} of {currentDeck.words.length}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPhonetic(!showPhonetic)} className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Toggle phonetics">
            {showPhonetic ? <Eye size={16} className="text-slate-500" /> : <EyeOff size={16} className="text-slate-500" />}
          </button>
          <button onClick={shuffleDeck} className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Shuffle">
            <Shuffle size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {currentDeck.words.map((w, i) => (
          <div 
            key={w.id} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-emerald-500 scale-y-125' :
              vocabProgress[w.id] === 'mastered' ? 'bg-emerald-300' :
              vocabProgress[w.id] === 'learning' ? 'bg-amber-300' :
              'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* 3D Flashcard */}
      <div 
        className="perspective-[1000px] mb-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full cursor-pointer transition-transform duration-500 ease-out ${
            animateDirection === 'left' ? '-translate-x-full opacity-0' :
            animateDirection === 'right' ? 'translate-x-full opacity-0' : ''
          }`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {/* Front */}
          <div 
            className="w-full min-h-[320px] bg-white rounded-[28px] shadow-[0_8px_40px_rgba(30,41,59,0.06)] border border-slate-100 p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Status badge */}
            <div className={`absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              status === 'mastered' ? 'bg-emerald-50 text-emerald-600' :
              status === 'learning' ? 'bg-amber-50 text-amber-600' :
              'bg-slate-100 text-slate-400'
            }`}>
              {status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '↻ Learning' : 'New'}
            </div>

            {/* Bookmark */}
            <button 
              onClick={(e) => { e.stopPropagation(); markCard(currentCard.id, status === 'mastered' ? 'unseen' : 'mastered'); }}
              className="absolute top-5 left-5 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
            >
              {status === 'mastered' ? <BookmarkCheck size={18} className="text-emerald-500" /> : <Bookmark size={18} className="text-slate-300" />}
            </button>

            {/* Word */}
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{currentCard?.word}</h2>
            {showPhonetic && (
              <p className="text-base text-slate-400 font-mono mb-4">{currentCard?.phonetic}</p>
            )}
            
            {/* Speak button */}
            <button 
              onClick={(e) => { e.stopPropagation(); speakWord(currentCard?.word); }}
              className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors smooth-press"
            >
              <Volume2 size={20} className="text-emerald-600" />
            </button>

            <p className="text-xs text-slate-300 mt-6">Tap to reveal definition</p>
          </div>

          {/* Back */}
          <div 
            className="w-full min-h-[320px] bg-slate-900 rounded-[28px] shadow-[0_8px_40px_rgba(30,41,59,0.15)] border border-slate-700 p-8 flex flex-col justify-center absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-white mb-1">{currentCard?.word}</h2>
              {showPhonetic && <p className="text-sm text-slate-400 font-mono">{currentCard?.phonetic}</p>}
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 mb-4">
              <p className="text-sm text-emerald-400 font-semibold uppercase tracking-wider mb-2">Definition</p>
              <p className="text-base text-white leading-relaxed">{currentCard?.definition}</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-5">
              <p className="text-sm text-amber-400 font-semibold uppercase tracking-wider mb-2">Example</p>
              <p className="text-base text-slate-300 italic leading-relaxed">"{currentCard?.example}"</p>
            </div>

            <p className="text-xs text-slate-500 text-center mt-5">Tap to flip back</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between px-4 mb-6">
        <button 
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all smooth-press ${
            currentIndex === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white shadow-md text-slate-600 hover:shadow-lg'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center">
          <span className="text-xs text-slate-400 font-semibold">{currentIndex + 1} / {currentDeck.words.length}</span>
        </div>

        <button 
          onClick={goToNext}
          disabled={currentIndex >= currentDeck.words.length - 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all smooth-press ${
            currentIndex >= currentDeck.words.length - 1 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white shadow-md text-slate-600 hover:shadow-lg'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { markCard(currentCard.id, 'learning'); goToNext(); }}
          className="flex-1 bg-amber-50 text-amber-700 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors smooth-press border border-amber-200"
        >
          <RotateCcw size={16} />
          <span>Still Learning</span>
        </button>
        <button
          onClick={() => { markCard(currentCard.id, 'mastered'); goToNext(); }}
          className="flex-1 bg-emerald-500 text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors smooth-press shadow-md"
        >
          <Check size={16} />
          <span>Got It!</span>
        </button>
      </div>

      {/* Mini stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_2px_12px_rgba(30,41,59,0.03)] border border-slate-100">
          <span className="text-lg font-extrabold text-emerald-500 block">{stats.mastered}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mastered</span>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_2px_12px_rgba(30,41,59,0.03)] border border-slate-100">
          <span className="text-lg font-extrabold text-amber-500 block">{stats.learning}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Learning</span>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_2px_12px_rgba(30,41,59,0.03)] border border-slate-100">
          <span className="text-lg font-extrabold text-slate-400 block">{stats.unseen}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unseen</span>
        </div>
      </div>
    </div>
  );
}
