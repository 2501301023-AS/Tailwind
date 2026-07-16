import React, { useState } from 'react';

const COMPLIANCE_WORKER_DB = [
  { email: 'mohan@geetauniversity.edu.in', password: 'password123', name: 'Mohan Kumar', role: 'Plumbing & Water Supply' },
  { email: 'ramesh@geetauniversity.edu.in', password: 'password123', name: 'Ramesh Singh', role: 'Cleaning & Housekeeping' }
];

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    const workerRecord = COMPLIANCE_WORKER_DB.find(
      (w) => w.email.toLowerCase() === cleanEmail && w.password === password
    );
    
    if (workerRecord) {
      onLoginSuccess(workerRecord);
    } else {
      setError('Authentication failed. Please verify your institutional email address and security password.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
    
      <div className="relative hidden w-1/2 bg-neutral-950 md:block">
        <img 
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80" 
          alt="Geeta University Campus Infrastructure" 
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0  from-[#09090b] via-[#09090b]/60 to-transparent" />
        <div className="absolute bottom-16 left-16 max-w-md space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#d15903] uppercase border-l-2 border-[#d15903] pl-2">
            A Modern Hostel Experience
          </span>
          <h1 className="text-5xl font-black tracking-tight text-white leading-none">Live, Learn,<br />Belong.</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Centralized Facility operations management matrix for maintenance engineers, janitorial services, and field technical crew.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center bg-[#09090b] px-8 py-12 md:w-1/2 lg:px-20 border-l border-neutral-900">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-[#d15903]/10 flex items-center justify-center text-xs font-bold text-[#d15903]">HC</div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">HostelConnect</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white pt-2">Sign in to your portal</h2>
            <p className="text-xs text-gray-400">Authorized personnel access only. Enter your credentials below.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/30 p-3.5 border border-red-900/50 text-xs text-red-400 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">University Email ID</label>
              <input
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-neutral-800 bg-[#121214] px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-[#d15903] focus:outline-none focus:ring-1 focus:ring-[#d15903] transition"
                placeholder="worker_name@geetauniversity.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Security Password</label>
              </div>
              <input
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-neutral-800 bg-[#121214] px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-[#d15903] focus:outline-none focus:ring-1 focus:ring-[#d15903] transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#e5f443] py-3 text-xs font-bold text-white uppercase tracking-wider transition hover:bg-[#b04a02] focus:outline-none focus:ring-2 focus:ring-[#d15903]"
            >
              Verify & Secure Login
            </button>
          </form>

          <div className="pt-4 text-center">
            <span className="text-[10px] text-gray-500 font-mono">© 2026 Geeta University Hostel Engineering Wing</span>
          </div>
        </div>
      </div>
    </div>
  );
}