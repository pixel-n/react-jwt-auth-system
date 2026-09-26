import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Card component handling Login and Signup forms
function AuthCard() {
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission and mock JWT creation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (tab === 'login') {
      // Build  JWT token string
      const dummyToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email }))}.signature`;
      login(dummyToken);
    } else {
      alert('Account created! Please log in.');
      setTab('login');
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
      
      {/* Brand Icon Header */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-md shadow-indigo-200">
          🔒
        </div>
      </div>

      {/* Form Title & Subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {tab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {tab === 'login' ? 'Enter your details to log in' : 'Sign up to get started'}
        </p>
      </div>

      {/* Login / Sign Up Tab Switcher */}
      <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setTab('login')}
          className={`py-2 rounded-lg transition-all ${
            tab === 'login'
              ? 'bg-white text-indigo-600 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setTab('signup')}
          className={`py-2 rounded-lg transition-all ${
            tab === 'signup'
              ? 'bg-white text-indigo-600 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 text-sm bg-white text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 placeholder-slate-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 text-sm bg-white text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 placeholder-slate-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] mt-2"
        >
          {tab === 'login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

// Dashboard view shown only when token exists
function ProtectedDashboard() {
  const { token, logout } = useAuth();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center">
      
      {/* Protected Route Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Protected Route
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back</h1>
      <p className="text-xs text-slate-500 mb-6">User verified. Your session is active.</p>

      {/* LocalStorage Token Display */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          JWT Token in localStorage
        </span>
        <p className="text-xs font-mono text-indigo-600 break-all bg-white p-2.5 rounded-lg border border-slate-200">
          {token}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}

// Router Gatekeeper component
function MainContent() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
      {token ? <ProtectedDashboard /> : <AuthCard />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}