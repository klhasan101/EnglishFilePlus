import React from 'react';
import { Home, BookOpen, MessageSquare, User } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'vocab', label: 'Vocab', icon: BookOpen },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 bg-white border-t border-slate-100 rounded-t-2xl shadow-[0_-4px_20px_rgba(30,41,59,0.06)] md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'lessonHub') || (item.id === 'dashboard' && currentView === 'shadowingLab');

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-4 rounded-full smooth-press transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-600 font-semibold scale-95'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IconComponent size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
            <span className="text-xs uppercase tracking-wider font-bold" style={{ fontSize: '10px' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
