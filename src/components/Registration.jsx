import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap } from 'lucide-react';

export default function Registration({ setView, setIsRegistered }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate registration
    setTimeout(() => {
      localStorage.setItem('ef_userName', formData.name);
      localStorage.setItem('ef_userEmail', formData.email);
      localStorage.setItem('ef_isRegistered', 'true');
      setIsRegistered(true);
      setIsSubmitting(false);
      setView('levelSelect');
    }, 1200);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const updated = {...prev}; delete updated[field]; return updated; });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-5 py-4 max-w-md mx-auto">
          <button 
            onClick={() => setView('dashboard')} 
            className="text-slate-600 hover:text-slate-900 transition-colors smooth-press"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 2 of 2</span>
            <div className="flex gap-1 mt-1">
              <div className="w-8 h-1 rounded-full bg-emerald-500" />
              <div className="w-8 h-1 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="w-6" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-md px-5 pt-6 pb-12 mx-auto flex flex-col items-center">
        {/* Hero Text */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500">
            Join millions of learners and start your journey today.
          </p>
        </div>

        {/* Decorative Icon */}
        <div className="w-full h-28 relative mb-8 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100">
          {/* Floating decorative circles */}
          <div className="absolute top-3 left-6 w-8 h-8 rounded-full bg-emerald-100 opacity-50 animate-pulse" />
          <div className="absolute bottom-4 right-8 w-6 h-6 rounded-full bg-amber-100 opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-6 right-14 w-4 h-4 rounded-full bg-blue-100 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <GraduationCap size={28} className="text-white" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
            <div className={`relative group rounded-2xl transition-all duration-300 ${
              focusedField === 'name' ? 'shadow-[0_10px_30px_rgba(30,41,59,0.08)]' : 'shadow-[0_4px_20px_rgba(30,41,59,0.05)]'
            }`}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your name"
                className={`w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all ${
                  errors.name ? 'border-red-300 focus:border-red-400' : 
                  focusedField === 'name' ? 'border-emerald-400' : 'border-transparent'
                }`}
              />
              <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                focusedField === 'name' ? 'text-emerald-500' : 'text-slate-400'
              }`} />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
            <div className={`relative group rounded-2xl transition-all duration-300 ${
              focusedField === 'email' ? 'shadow-[0_10px_30px_rgba(30,41,59,0.08)]' : 'shadow-[0_4px_20px_rgba(30,41,59,0.05)]'
            }`}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="example@mail.com"
                className={`w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all ${
                  errors.email ? 'border-red-300 focus:border-red-400' : 
                  focusedField === 'email' ? 'border-emerald-400' : 'border-transparent'
                }`}
              />
              <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
              }`} />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className={`relative group rounded-2xl transition-all duration-300 ${
              focusedField === 'password' ? 'shadow-[0_10px_30px_rgba(30,41,59,0.08)]' : 'shadow-[0_4px_20px_rgba(30,41,59,0.05)]'
            }`}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none transition-all ${
                  errors.password ? 'border-red-300 focus:border-red-400' : 
                  focusedField === 'password' ? 'border-emerald-400' : 'border-transparent'
                }`}
              />
              <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
              }`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-emerald-500 text-white font-bold text-sm py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Start Learning Now</span>
                <ArrowLeft size={16} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <button className="text-emerald-600 font-bold hover:underline">
              Log in
            </button>
          </p>
        </div>

        {/* Elite Feature Card */}
        <div className="mt-8 p-4 bg-slate-900 rounded-2xl flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Elite Feature</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Get 3 free trial days of the accelerated learning program.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
