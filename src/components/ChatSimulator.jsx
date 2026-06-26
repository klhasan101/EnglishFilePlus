import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Mic, Volume2, Check, Coffee } from 'lucide-react';

export default function ChatSimulator({ chatHistory, setChatHistory }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const chatEndRef = useRef(null);

  // Default dialogue tree for simulated café roleplay
  const defaultChips = [
    { text: "Just water, thanks", nextReply: "Sure! I'll bring you some water right away. Would you like ice or a slice of lemon with that? 🍋", chips: ["Yes, please", "No, just plain is fine", "Can I get a croissant too?"] },
    { text: "Can I see the menu?", nextReply: "Of course! Here is our menu. 📋 Today we have fresh scones, butter croissants, and organic muffins. What catches your eye?", chips: ["I'll have a scone, please", "A croissant and tea, please", "Just a black coffee"] },
    { text: "Where is the restroom?", nextReply: "The restroom is just down the hallway on your left, past the coffee machine. 🚻 Let me know if you'd like to order when you return!", chips: ["Thank you so much", "I'll order a coffee first", "Great, thanks!"] }
  ];

  const [activeChips, setActiveChips] = useState(defaultChips);

  // Dynamic replies for subsequent chips
  const dynamicChipReplies = {
    "Yes, please": {
      reply: "Excellent, ice and lemon it is! 🍋 I'll bring it right over. Can I get you anything else to eat?",
      chips: ["No, that's all", "Let me see the menu", "A slice of chocolate cake"]
    },
    "No, just plain is fine": {
      reply: "No problem at all, just plain water. I'll get that for you. Ready to order anything else?",
      chips: ["I'd like a muffin, please", "Just the water", "Let me think about it"]
    },
    "Can I get a croissant too?": {
      reply: "Certainly! One fresh warm croissant. Would you like butter or jam with it? 🥐",
      chips: ["With butter, please", "Just plain", "And a double espresso"]
    },
    "I'll have a scone, please": {
      reply: "Yum! Scones are a customer favorite. I'll warm it up for you. Would you like clotted cream and jam? 🍓",
      chips: ["Yes, both please!", "Just jam is fine", "No thanks, plain"]
    },
    "A croissant and tea, please": {
      reply: "Classic choice! One warm croissant and a cup of English Breakfast tea. ☕ Coming right up!",
      chips: ["Thank you!", "Can I get milk with the tea?", "Is the tea organic?"]
    },
    "Just a black coffee": {
      reply: "Perfect. One hot black coffee. I'll brew that fresh for you. ☕ Anything else?",
      chips: ["No, thanks", "Actually, a muffin too", "Can I get it decaf?"]
    },
    "Thank you so much": {
      reply: "You're very welcome! Take your time, and just wave when you're ready to order. 😊",
      chips: defaultChips.map(c => c.text) // reset
    },
    "I'll order a coffee first": {
      reply: "Sure! One hot coffee first. What kind of coffee would you prefer? Espresso, Cappuccino, or Americano?",
      chips: ["Cappuccino, please", "Double Espresso", "An Americano"]
    },
    "Great, thanks!": {
      reply: "Happy to help! Let me know if you need anything else. enjoy your time at the cafe!",
      chips: defaultChips.map(c => c.text) // reset
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const speakText = (text, messageId) => {
    if ('speechSynthesis' in window) {
      if (speakingId === messageId) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB'; // Oxford Accent
        utterance.onend = () => setSpeakingId(null);
        setSpeakingId(messageId);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Mock sound effect visual toggle
      setSpeakingId(messageId);
      setTimeout(() => setSpeakingId(null), 1500);
    }
  };

  const simulateJennyResponse = (userMessage, customReplyText, nextChips = []) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const jennyMessage = {
        id: 'jenny-' + Date.now(),
        sender: 'jenny',
        text: customReplyText || `That sounds wonderful! I'll get that ready for you right away. ☕`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, jennyMessage]);

      // Set next suggestion chips
      if (nextChips.length > 0) {
        setActiveChips(nextChips);
      } else {
        // Fallback or loop back to main options
        setActiveChips(defaultChips);
      }
    }, 1500);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputText('');

    // Check if user clicked a suggestion chip with specific reply flow
    const matchedChip = defaultChips.find(c => c.text === text);
    const matchedDynamic = dynamicChipReplies[text];

    if (matchedChip) {
      const nextChips = matchedChip.chips.map(chipText => {
        // map string to chip object structure
        const subReply = dynamicChipReplies[chipText];
        return {
          text: chipText,
          nextReply: subReply ? subReply.reply : "Coming right up!",
          chips: subReply && subReply.chips ? subReply.chips : []
        };
      });
      simulateJennyResponse(text, matchedChip.nextReply, nextChips);
    } else if (matchedDynamic) {
      const nextChips = matchedDynamic.chips.map(chipText => {
        const subReply = dynamicChipReplies[chipText];
        return {
          text: chipText,
          nextReply: subReply ? subReply.reply : "Here you go!",
          chips: subReply && subReply.chips ? subReply.chips : []
        };
      });
      simulateJennyResponse(text, matchedDynamic.reply, nextChips);
    } else {
      // Generic chat response
      simulateJennyResponse(text);
    }
  };

  const handleChipClick = (chip) => {
    handleSendMessage(chip.text || chip);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-44 text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkjwAECfbOaMJkwfiDge8EtXROiL6ldnlXxf6v-0LGOTkE9FCbI2piJT9LepEsqeYorHmigTOlBS6Gqlj5gVn_5-_P2w571FOwt2A0V9sJgPi-yAYUxh7H287-1w8bFfRaoQ3l0BnQuu-YmAxQPETXp6758TTpyCNtLpmgStEbF3Eib2XzbpRLm5rP1xMc_wGy-r7ocU2C-BlgkBUOF6bWlGtk-XMpfCnvOJCo1oJXDA0Vgs4fW8m8xFAupuvpIWc4GnvlgZ0uj0g" 
                alt="Jenny Waitress"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Jenny (Oxford Waitress)</h1>
            <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 uppercase tracking-wider">
              <span>● Online Tutor</span>
            </p>
          </div>
        </div>
        <div className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-extrabold">
          5 🔥
        </div>
      </header>

      {/* Main Chat Panel */}
      <main className="flex-1 mt-16 px-6 py-4 max-w-2xl mx-auto w-full flex flex-col h-full overflow-hidden">
        
        {/* Context Banner */}
        <div className="mb-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.03)] flex items-start gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Coffee size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Cafe Simulator</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Learn food vocabulary and standard café requests.</p>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-20 max-h-[calc(100vh-320px)] chat-scrollbar">
          {chatHistory.map((msg) => {
            const isJenny = msg.sender === 'jenny';
            const isSpeaking = speakingId === msg.id;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col gap-1 max-w-[85%] ${isJenny ? 'items-start' : 'items-end ml-auto'}`}
              >
                <div className={`p-4 rounded-[20px] shadow-[0_2px_12px_rgba(30,41,59,0.03)] text-sm leading-relaxed relative group ${
                  isJenny 
                    ? 'bg-slate-900 text-white rounded-bl-[4px]' 
                    : 'bg-emerald-500 text-white rounded-br-[4px]'
                }`}>
                  <p>{msg.text}</p>
                  
                  {/* Speaker icon for Jenny's text read aloud */}
                  {isJenny && (
                    <button 
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`absolute -right-9 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white border border-slate-100 text-slate-700 rounded-full shadow-sm hover:bg-slate-50 transition-colors ${
                        isSpeaking ? 'text-emerald-500 border-emerald-300 bg-emerald-50' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Volume2 size={13} className={isSpeaking ? 'animate-bounce' : ''} />
                    </button>
                  )}
                </div>
                
                {/* Meta details */}
                <div className="flex items-center gap-1 px-1.5">
                  <span className="text-[9px] text-slate-400 font-medium">
                    {msg.timestamp || '09:41 AM'}
                  </span>
                  {!isJenny && (
                    <Check size={10} className="text-emerald-500 stroke-[3px]" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator Animation */}
          {isTyping && (
            <div className="flex items-center gap-2 max-w-[80%]">
              <div className="bg-slate-200 text-slate-500 px-4 py-3 rounded-[20px] rounded-bl-[4px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jenny is typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Suggestion Chips Section */}
      <div className="fixed bottom-32 left-0 w-full px-6 z-30 md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <div className="max-w-md mx-auto overflow-x-auto no-scrollbar flex gap-2 pb-1.5">
          {activeChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 hover:border-slate-800 rounded-full text-xs font-bold text-slate-800 shadow-[0_2px_8px_rgba(30,41,59,0.03)] hover:shadow-md transition-all active:scale-95 smooth-press"
            >
              {chip.text || chip}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input Bar */}
      <div className="fixed bottom-16 left-0 w-full bg-white border-t border-slate-100 pt-4 pb-6 px-6 z-30 md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="max-w-md mx-auto flex items-center gap-2.5"
        >
          <div className="relative flex-1">
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-full pl-5 pr-12 py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder:text-slate-400"
              placeholder="Type cafe request..." 
              type="text"
            />
            <button 
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <Smile size={16} />
            </button>
          </div>

          <button 
            type="submit"
            className="w-12 h-12 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-full smooth-press transition-transform shadow-md"
          >
            <Send size={16} />
          </button>

          <button 
            type="button"
            className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white rounded-full smooth-press transition-transform shadow-md relative voice-pulse"
          >
            <Mic size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
