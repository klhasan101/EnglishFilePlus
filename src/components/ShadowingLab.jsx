import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Mic, CheckCircle, Info, Languages, Sparkles } from 'lucide-react';

export default function ShadowingLab({ setView, selectedPhrase, onSpeechGoalComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // Waveform heights state (40 bars)
  const [waveHeights, setWaveHeights] = useState(
    Array.from({ length: 40 }, (_, i) => 10 + Math.random() * 80 * (Math.sin(i / 5) * 0.5 + 0.5))
  );

  const waveIntervalRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const phraseText = selectedPhrase?.phrase || "Can I have some water, please?";
  const phraseTitle = selectedPhrase?.title || "Meeting at the Cafe";

  // Audio Playback simulation
  useEffect(() => {
    if (isPlaying) {
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 40 }, () => 15 + Math.random() * 85)
        );
      }, 150);
    } else {
      clearInterval(waveIntervalRef.current);
      // Reset to default smooth shape
      setWaveHeights(
        Array.from({ length: 40 }, (_, i) => 10 + Math.random() * 70 * (Math.sin(i / 5) * 0.5 + 0.5))
      );
    }
    return () => clearInterval(waveIntervalRef.current);
  }, [isPlaying]);

  // Recording timer simulation (3 seconds)
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(3);
      setShowEvaluation(false);
      
      // Animate waveform intensely during recording
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 40 }, () => 25 + Math.random() * 75)
        );
      }, 100);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(recordingTimerRef.current);
            clearInterval(waveIntervalRef.current);
            setIsRecording(false);
            setShowEvaluation(true);
            // Trigger speech goal increment
            if (onSpeechGoalComplete) {
              onSpeechGoalComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
    }
    return () => {
      clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleMicToggle = () => {
    if (isRecording) {
      // Cancel recording
      setIsRecording(false);
    } else {
      setIsPlaying(false);
      setIsRecording(true);
    }
  };

  const handleRetry = () => {
    setShowEvaluation(false);
    setIsPlaying(false);
    setIsRecording(false);
    setShowTranslation(false);
  };

  // Helper to split phrase into words and highlight them
  const renderEvaluationText = () => {
    const isWaterPhrase = phraseText.toLowerCase().includes("some water");

    if (isWaterPhrase) {
      // "Can I have some water, please?"
      return (
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed text-center px-4">
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">Can I have</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">some</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">water</span>
          <span className="text-slate-400">,</span>{' '}
          <span className="text-amber-500 border-b-2 border-amber-200 px-1" title="Practice this word">please</span>
          <span className="text-slate-400">?</span>
        </h2>
      );
    } else if (phraseText.toLowerCase().includes("nice to meet")) {
      // "Hello! Nice to meet you, I'm Alex."
      return (
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed text-center px-4">
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">Hello!</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">Nice</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">to</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">meet</span>{' '}
          <span className="text-amber-500 border-b-2 border-amber-200 px-1">you</span>
          <span className="text-slate-400">,</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">I'm</span>{' '}
          <span className="text-emerald-500 border-b-2 border-emerald-200 px-1">Alex.</span>
        </h2>
      );
    } else {
      // Generic parser
      const words = phraseText.split(" ");
      return (
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed text-center px-4">
          {words.map((word, idx) => {
            const isLast = idx === words.length - 1;
            return (
              <React.Fragment key={idx}>
                <span className={isLast ? "text-amber-500 border-b-2 border-amber-200 px-1" : "text-emerald-500 border-b-2 border-emerald-200 px-1"}>
                  {word}
                </span>
                {idx < words.length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </h2>
      );
    }
  };

  // Get translation text
  const getTranslation = () => {
    if (phraseText.toLowerCase().includes("some water")) {
      return "¿Me podría dar un poco de agua, por favor?";
    }
    if (phraseText.toLowerCase().includes("nice to meet")) {
      return "¡Hola! Gusto en conocerte, soy Alex.";
    }
    return "Disculpe, ¿hay alguna reservación a mi nombre?";
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-48 text-slate-800">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('lessonHub')}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors smooth-press"
          >
            <ArrowLeft className="text-slate-900 w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Shadowing Lab</h1>
        </div>
        <div className="bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-extrabold text-emerald-600">
          {phraseTitle}
        </div>
      </header>

      {/* Main Canvas */}
      <main className="mt-20 px-6 max-w-2xl mx-auto w-full">
        
        {/* Waveform Card */}
        <section className="mb-6 mt-4">
          <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(30,41,59,0.04)] border border-slate-100 overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {isRecording ? "Your Recording" : "Native Speaker Model"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-xs font-bold text-slate-700">
                  {isRecording ? `Recording... ${recordingSeconds}s` : "Audio Loaded"}
                </span>
              </div>
            </div>

            {/* Waveform Bars */}
            <div className="h-28 flex items-end justify-between gap-0.5 px-2 mb-6">
              {waveHeights.map((height, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full waveform-bar transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-400' 
                      : isPlaying 
                        ? 'bg-emerald-400' 
                        : 'bg-slate-200'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>

            {/* Waveform Controls */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isRecording}
                className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-md smooth-press disabled:opacity-50"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
              </button>
              <div className="text-xs font-semibold text-slate-500">
                {isPlaying ? "0:02 / 0:03" : "0:00 / 0:03"}
              </div>
            </div>
          </div>
        </section>

        {/* Target Phrase Box */}
        <section className="mb-6 text-center py-6">
          <div className="inline-flex items-center justify-center gap-1.5 mb-2 bg-slate-100 text-slate-600 px-3.5 py-1 rounded-full text-xs font-bold">
            <Volume2 size={14} />
            <span>Listen & Shadow</span>
          </div>

          <div className="mt-3">
            {showEvaluation ? (
              renderEvaluationText()
            ) : (
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-relaxed px-4">
                "{phraseText}"
              </h2>
            )}
          </div>

          {showTranslation && (
            <p className="text-sm font-semibold text-emerald-600 mt-3 animate-fade-in italic">
              {getTranslation()}
            </p>
          )}
        </section>

        {/* Real-time AI Evaluation Overlay */}
        {showEvaluation && (
          <section className="mb-6 animate-scale-up">
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-emerald-500 w-5 h-5" />
                <span className="text-2xl font-black text-emerald-600">94% Match!</span>
              </div>
              <p className="text-xs text-slate-500 text-center max-w-xs leading-normal mt-1.5">
                {phraseText.toLowerCase().includes("some water") 
                  ? "Excellent flow! Your \"some water\" was perfect. Try softening the \"p\" in \"please\" slightly." 
                  : "Excellent rhythm and stress placement! Practice your ending sound slightly to get 100%."}
              </p>

              {/* Tag Details */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Correct Pronunciation</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                  <Info size={14} className="text-amber-500" />
                  <span>Needs Practice (1 word)</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Control Station Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-[0_-4px_20px_rgba(30,41,59,0.06)] rounded-t-[32px] md:max-w-2xl md:left-1/2 md:-translate-x-1/2 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          
          {/* Retry Button */}
          <button 
            onClick={handleRetry}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 smooth-press transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/50">
              <RotateCcw size={18} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Retry</span>
          </button>

          {/* Glowing Microphone Button */}
          <div className="relative">
            <button 
              onClick={handleMicToggle}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative z-10 smooth-press transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 text-white mic-pulse-ring' 
                  : 'bg-emerald-500 text-white shadow-emerald-200/50 hover:shadow-xl'
              }`}
            >
              <Mic size={32} className={isRecording ? 'animate-pulse' : ''} />
            </button>
            {!isRecording && !showEvaluation && (
              <div className="absolute -inset-1.5 rounded-full bg-emerald-500/10 -z-0 animate-ping"></div>
            )}
          </div>

          {/* Translate Button */}
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex flex-col items-center gap-1 smooth-press transition-colors ${
              showTranslation ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
              showTranslation ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200/50'
            }`}>
              <Languages size={18} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Translate</span>
          </button>
        </div>

        {/* Success Theme Progress Bar at footer bottom */}
        <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-1000 ease-out rounded-full"
            style={{ width: showEvaluation ? '94%' : '0%' }}
          ></div>
        </div>
      </footer>
    </div>
  );
}
