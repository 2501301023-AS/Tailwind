import React, { useState, useEffect, useMemo, useRef } from 'react';

const INITIAL_SYSTEM_TICKETS = [
  { id: 'GU-PL-902', block: 'Block-A (Boys Residence)', floor: '3rd Floor', room: 'Room 304-A', type: 'Plumbing & Water Supply', details: 'Leaking bathroom flush tank valve causing continuous floor water logging.', status: 'Pending', completionDate: null },
  { id: 'GU-PL-903', block: 'Block-A (Boys Residence)', floor: '1st Floor', room: 'Room 112-B', type: 'Plumbing & Water Supply', details: 'No water pressure output in wash basin faucet assembly.', status: 'In Progress', completionDate: null },
  { id: 'GU-PL-899', block: 'Block-C (Girls Wing)', floor: '4th Floor', room: 'Room 405-C', type: 'Plumbing & Water Supply', details: 'Clogged drainage network lines in central washroom floor unit.', status: 'Completed', completionDate: '2026-07-03' }, 
  { id: 'GU-PL-812', block: 'Block-B (International)', floor: '2nd Floor', room: 'Room 211-A', type: 'Plumbing & Water Supply', details: 'Geyser heating element breakdown replacement.', status: 'Completed', completionDate: '2026-06-15' }, 
  
  { id: 'GU-CL-411', block: 'Block-B (International)', floor: '4th Floor', room: 'Room 415-B', type: 'Cleaning & Housekeeping', details: 'Deep floor sanitation and balcony window pane cleanup requirements.', status: 'Pending', completionDate: null },
  { id: 'GU-CL-402', block: 'Block-C (Girls Wing)', floor: 'Ground Floor', room: 'Room 004-A', type: 'Cleaning & Housekeeping', details: 'Post-structural repair cleanup and waste collection dispatch.', status: 'Completed', completionDate: '2026-07-03' }, 
  { id: 'GU-CL-390', block: 'Block-A (Boys Residence)', floor: '2nd Floor', room: 'Room 220-C', type: 'Cleaning & Housekeeping', details: 'Corridor chemical wash and trash bin sanitization routine.', status: 'Completed', completionDate: '2026-06-22' } 
];

const ADMIN_MASTER_ATTENDANCE_DB = [
  { date: '2026-07-03', status: 'Present', checkIn: '08:30 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-07-02', status: 'Absent', checkIn: '08:45 AM', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-07-01', status: 'Present', checkIn: '08:22 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-30', status: 'Absent', checkIn: '—', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-06-29', status: 'Present', checkIn: '08:40 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-28', status: 'Present', checkIn: '08:15 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-27', status: 'Present', checkIn: '08:30 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-26', status: 'Absent', checkIn: '—', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-06-25', status: 'Present', checkIn: '08:50 AM', verifiedBy: 'Admin (Warden Wing-B)' },
  { date: '2026-06-24', status: 'Present', checkIn: '08:20 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-23', status: 'Present', checkIn: '08:35 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-22', status: 'Present', checkIn: '08:10 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-21', status: 'Absent', checkIn: '—', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-06-20', status: 'Present', checkIn: '08:42 AM', verifiedBy: 'Admin (Warden Wing-B)' },
  { date: '2026-06-19', status: 'Present', checkIn: '08:28 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-18', status: 'Present', checkIn: '08:31 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-17', status: 'Present', checkIn: '08:55 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-16', status: 'Absent', checkIn: '—', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-06-15', status: 'Present', checkIn: '08:24 AM', verifiedBy: 'Admin (Warden Wing-A)' }
];

export default function Dashboard({ user = { name: 'Staff Member', email: 'staff@geeta.edu.in', role: 'Plumbing & Water Supply' }, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const fileInputRef = useRef(null);
  
  const [tickets, setTickets] = useState(() => {
    const localData = localStorage.getItem('gu_hostel_tickets');
    return localData ? JSON.parse(localData) : INITIAL_SYSTEM_TICKETS;
  });

  const [userMeta, setUserMeta] = useState(() => {
    const localUser = localStorage.getItem(`gu_user_meta_${user.email || 'default'}`);
    if (localUser) return JSON.parse(localUser);
    
    return {
      phone: user.phone || '+91 98765 43210',
      address: user.address || 'Staff Quarters, Sector-4, Geeta University Campus',
      emergencyPhone: user.emergencyPhone || '+91 99999 11111',
      avatarUrl: user.avatarUrl || null,
      ...user
    };
  });

  useEffect(() => {
    localStorage.setItem('gu_hostel_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(`gu_user_meta_${user.email || 'default'}`, JSON.stringify(userMeta));
  }, [userMeta, user.email]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserMeta(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const todayAttendanceStatus = useMemo(() => {
    const todayLog = ADMIN_MASTER_ATTENDANCE_DB.find(log => log.date === '2026-07-03');
    return todayLog ? todayLog : { status: 'Not Marked Yet', checkIn: '—', verifiedBy: 'Awaiting Admin Audit' };
  }, []);

  const adminApprovedPresents = useMemo(() => {
    return ADMIN_MASTER_ATTENDANCE_DB.filter(log => log.status === 'Present').length;
  }, []);

  const scopedTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.type === userMeta.role);
  }, [tickets, userMeta.role]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'All') return scopedTickets;
    return scopedTickets.filter(ticket => ticket.status === statusFilter);
  }, [scopedTickets, statusFilter]);

  const taskAnalytics = useMemo(() => {
    const todayStr = '2026-07-03';
    let counts = { pending: 0, progress: 0, todayCompleted: 0, monthlyCompleted: 0 };

    scopedTickets.forEach(ticket => {
      if (ticket.status === 'Pending') counts.pending++;
      if (ticket.status === 'In Progress') counts.progress++;
      if (ticket.status === 'Completed') {
        counts.monthlyCompleted++; 
        if (ticket.completionDate === todayStr) counts.todayCompleted++;
      }
    });

    return counts;
  }, [scopedTickets]);

  const updateTicketStatus = (ticketId, targetStatus) => {
    const todayStr = '2026-07-03';
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { 
          ...t, 
          status: targetStatus,
          completionDate: targetStatus === 'Completed' ? todayStr : t.completionDate 
        };
      }
      return t;
    }));
  };

  // Calendar Engine for July 2026 (Starts on a Wednesday, 31 Days)
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfWeek = 3; 
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2026-07-${i.toString().padStart(2, '0')}`;
      const log = ADMIN_MASTER_ATTENDANCE_DB.find(d => d.date === dateStr);
      days.push({
        day: i,
        dateStr: dateStr,
        status: log ? log.status : 'Unmarked'
      });
    }
    return days;
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', count: null },
    { id: 'tasks', label: 'Active Complaints Room Matrix', count: taskAnalytics.pending + taskAnalytics.progress },
    { id: 'attendance', label: 'Attendance Reports', count: null },
  ];

  // Calendar Component
  const AttendanceCalendarWidget = () => (
    <div className="bg-[#121214] rounded-xl border border-neutral-900 p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Monthly Attendance Heatmap</h3>
        <span className="text-[10px] font-bold text-white bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700 shadow-sm">July 2026</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 pb-1.5">{day}</div>
        ))}
        
        {calendarDays.map((calDay, idx) => {
          if (!calDay) return <div key={`empty-${idx}`} className="h-10 rounded-lg"></div>;
          
          let styleClass = "bg-[#17171a] border-neutral-800 text-neutral-500 hover:border-neutral-700";
          if (calDay.status === 'Present') {
            styleClass = "bg-emerald-950/40 border-emerald-900/50 text-emerald-400 ring-1 ring-emerald-500/20 font-black";
          } else if (calDay.status === 'Absent') {
            styleClass = "bg-red-950/40 border-red-900/50 text-red-400 ring-1 ring-red-500/20 font-black";
          }
          
          return (
            <div 
              key={calDay.dateStr} 
              title={`${calDay.dateStr}: ${calDay.status}`}
              className={`h-10 rounded-lg border flex items-center justify-center text-xs font-mono transition-all duration-200 cursor-default ${styleClass}`}
            >
              {calDay.day}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-neutral-900 justify-center bg-[#17171a]/50 p-2 rounded-lg">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col relative">
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* --- DESKTOP LEFT SIDEBAR --- */}
        <aside className="hidden md:flex w-72 bg-[#121214] border-r border-neutral-900 flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
          <div className="flex-1 flex flex-col pt-6 overflow-y-auto">
            <div className="flex items-center gap-2.5 px-6 pb-6 border-b border-neutral-900 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="h-8 w-8 rounded-lg bg-[#d15903] flex items-center justify-center font-black text-xs text-white">GU</div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">HostelConnect</h1>
                <span className="text-[10px] text-gray-500 block leading-none font-medium">Geeta University Operations</span>
              </div>
            </div>

            <div className="px-4 py-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block px-2">Compliance Portal</span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === item.id ? 'bg-neutral-800 text-white' : 'text-gray-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === item.id ? 'bg-[#d15903] text-white' : 'bg-neutral-800 text-gray-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div 
            onClick={() => setProfileModalOpen(true)}
            className="p-4 border-t border-neutral-900 bg-[#17171a] cursor-pointer hover:bg-neutral-800/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {userMeta.avatarUrl ? (
                  <img src={userMeta.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-neutral-700 shrink-0" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#d15903]/20 border border-[#d15903]/40 flex items-center justify-center text-xs font-bold text-[#d15903] group-hover:bg-[#d15903]/30 shrink-0">
                    {userMeta.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="text-left text-xs truncate">
                  <p className="font-semibold text-white truncate group-hover:text-[#d15903] transition">{userMeta.name}</p>
                  <p className="text-[9px] text-gray-500 truncate">{userMeta.role.split(' ')[0]} Expert</p>
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-gray-400 transition text-[10px]">View Detail ↗</span>
            </div>
          </div>
        </aside>

        {/* --- MOBILE TOP NAVBAR --- */}
        <header className="md:hidden top-0 z-40 w-full border-b border-neutral-900 bg-[#121214] px-4 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-[#d15903] flex items-center justify-center font-black text-xs text-white">GU</div>
            <span className="text-xs font-bold text-white tracking-wide">HostelConnect</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setProfileModalOpen(true)}
              className="h-7 w-7 rounded-full overflow-hidden bg-[#d15903]/20 border border-[#d15903]/40 flex items-center justify-center text-[10px] font-bold text-[#d15903]"
            >
              {userMeta.avatarUrl ? (
                <img src={userMeta.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                userMeta.name.split(' ').map(n => n[0]).join('')
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-neutral-800 transition focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#121214] border-b border-neutral-900 shadow-xl z-50 p-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold tracking-wide transition ${activeTab === item.id ? 'bg-neutral-800 text-white' : 'text-gray-400'}`}
                >
                  <span>{item.label}</span>
                  {item.count !== null && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-gray-400">{item.count}</span>}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* --- PROFILE MODAL SHEET --- */}
        {profileModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121214] border border-neutral-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <div className="bg to-amber-700 relative flex justify-end p-2 h-16">
                <button onClick={() => setProfileModalOpen(false)} className="bg-black/40 hover:bg-black/60 transition text-white h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold absolute top-2 right-2">✕</button>
              </div>

              <div className="px-6 pb-6 relative">
                <div onClick={() => fileInputRef.current?.click()} className="absolute -top-10 left-6 group/avatar cursor-pointer" title="Click to update Profile Image">
                  {userMeta.avatarUrl ? (
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden ring-4 ring-[#121214]">
                      <img src={userMeta.avatarUrl} alt={userMeta.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="relative h-20 w-20 rounded-xl bg-neutral-800 border-2 border-[#d15903] flex items-center justify-center text-2xl font-black text-[#d15903] shadow-md ring-4 ring-[#121214]">
                      {userMeta.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <div className="pt-12">
                  <h3 className="text-xl font-black text-white">{userMeta.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#d15903]/10 text-[#d15903] font-bold tracking-wider rounded uppercase border border-[#d15903]/30 inline-block mt-1">{userMeta.role} Specialist</span>

                  <div className="mt-6 space-y-4 border-t border-neutral-900 pt-4 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block">Work Type Domain</label>
                      <p className="text-neutral-200 font-medium mt-0.5">{userMeta.role}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block">Email Address</label>
                        <p className="text-neutral-200 font-mono mt-0.5 break-all">{userMeta.email}</p>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block">Phone Line</label>
                        <p className="text-neutral-200 font-mono mt-0.5">{userMeta.phone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block">Registered Physical Address</label>
                      <p className="text-neutral-300 mt-0.5 leading-relaxed">{userMeta.address}</p>
                    </div>
                    <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
                      <label className="text-[9px] uppercase font-extrabold text-red-400 block tracking-wide">Emergency Phone Link</label>
                      <p className="text-red-200 font-mono font-bold mt-0.5 text-sm">{userMeta.emergencyPhone}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between gap-3">
                    <button onClick={onLogout} className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/30 text-red-400 text-xs font-bold tracking-wide transition">Disconnect Session</button>
                    <button onClick={() => setProfileModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold tracking-wide transition">Close Profile View</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN INTERACTIVE VIEW AREA --- */}
        <main className="flex-1 md:ml-72 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-950 pb-5">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 block">Personalized Field Station Dashboard</span>
                  <h2 className="text-3xl font-black text-white tracking-tight mt-1">Welcome back, {userMeta.name.split(' ')[0]}</h2>
                  <p className="text-xs text-neutral-400 mt-1">Domain: <span className="text-[#d15903] font-mono">{userMeta.role}</span></p>
                </div>

                <div className="flex items-center gap-4 bg-[#121214] border border-neutral-800 rounded-xl px-4 py-3 select-none">
                  <div className="text-left">
                    <span className="text-[9px] block uppercase font-bold text-gray-400 tracking-wider">Today's Attendance Status</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`h-2 w-2 rounded-full ${todayAttendanceStatus.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <span className="text-xs font-extrabold text-white">Admin Marked: {todayAttendanceStatus.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Assigned Queue (New)</span>
                  <span className="text-3xl font-black font-mono text-white mt-2 block">{taskAnalytics.pending}</span>
                </div>
                <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Active Remediation</span>
                  <span className="text-3xl font-black font-mono text-white mt-2 block">{taskAnalytics.progress}</span>
                </div>
                <div className="bg-[#121214] p-4 rounded-xl border border-neutral-800 ring-2 ring-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Today Work Complete</span>
                  <span className="text-3xl font-black font-mono text-emerald-400 mt-2 block">{taskAnalytics.todayCompleted}</span>
                </div>
                <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Monthly Work Complete</span>
                  <span className="text-3xl font-black font-mono text-purple-300 mt-2 block">{taskAnalytics.monthlyCompleted}</span>
                </div>
              </div>

              {/* Dashboard Integrated Calendar Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AttendanceCalendarWidget />
                </div>
                
                <div className="bg-[#121214] rounded-xl border border-neutral-900 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Immediate Tickets</h3>
                    <button onClick={() => setActiveTab('tasks')} className="text-xs font-semibold text-[#d15903] hover:underline">Full Control Matrix →</button>
                  </div>
                  
                  {scopedTickets.filter(t => t.status !== 'Completed').length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-neutral-800 rounded-lg text-xs text-gray-500">✨ Perfect Standby! No open room complaints.</div>
                  ) : (
                    <div className="space-y-3 max-h-290px overflow-y-auto pr-1">
                      {scopedTickets.filter(t => t.status !== 'Completed').map(ticket => (
                        <div key={ticket.id} className="p-3 bg-[#17171a] border border-neutral-800 rounded-xl flex flex-col justify-between gap-2 text-[11px]">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white">{ticket.room}</span>
                            <span className={`px-1 py-0.2 font-mono text-[9px] uppercase rounded ${ticket.status === 'Pending' ? 'text-amber-500' : 'text-blue-500'}`}>{ticket.status}</span>
                          </div>
                          <p className="text-gray-400 line-clamp-2">{ticket.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Active Room Complaints Control Board</h2>
                  <p className="text-xs text-gray-400 mt-1">Safely modify room repair stages. Changes sync with metrics in real-time.</p>
                </div>
                <div className="flex items-center bg-[#17171a] p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
                  {['All', 'Pending', 'In Progress', 'Completed'].map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setStatusFilter(filterOpt)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition uppercase ${statusFilter === filterOpt ? 'bg-[#d15903] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-900 bg-[#121214]">
                <table className="w-full text-left border-collapse min-w-800px">
                  <thead>
                    <tr className="bg-[#17171a] border-b border-neutral-900 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="p-4 w-28">Ticket ID</th>
                      <th className="p-4 w-48">Hostel Block Identity</th>
                      <th className="p-4 w-32">Room Code</th>
                      <th className="p-4">Detailed Technical Complaint Ticket</th>
                      <th className="p-4 w-32">Current State Status</th>
                      <th className="p-4 w-44 text-center">Interactive Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-xs text-gray-300">
                    {filteredTickets.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500 tracking-wide font-medium italic">No logs match your selected queue status state filter selection.</td></tr>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-neutral-900/20 transition">
                          <td className="p-4 font-mono font-bold text-gray-500">{ticket.id}</td>
                          <td className="p-4">
                            <span className="font-medium text-gray-200 block">{ticket.block}</span>
                            <span className="text-[10px] text-gray-500">{ticket.floor}</span>
                          </td>
                          <td className="p-4 font-bold text-white">{ticket.room}</td>
                          <td className="p-4 text-gray-400 leading-normal">{ticket.details}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${ticket.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' : ticket.status === 'In Progress' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'}`}>{ticket.status}</span>
                          </td>
                          <td className="p-4 text-center">
                            {ticket.status === 'Pending' && <button onClick={() => updateTicketStatus(ticket.id, 'In Progress')} className="w-full py-1.5 rounded bg-blue-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-blue-700 transition">⚡ Initiate Operations</button>}
                            {ticket.status === 'In Progress' && <button onClick={() => updateTicketStatus(ticket.id, 'Completed')} className="w-full py-1.5 rounded bg-emerald-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-emerald-700 transition">✓ Finalize Settle</button>}
                            {ticket.status === 'Completed' && <span className="text-[11px] font-mono text-neutral-600 line-through select-none block text-center">Closed Entry Archive</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Timesheet Audit & Performance Records</h2>
                <p className="text-xs text-gray-400 mt-1">Official verified records logged directly by the Hostel Warden and Central Admin Panel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121214] p-5 rounded-xl border border-neutral-900 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Audit Cycle</span>
                  <span className="text-base font-bold text-white mt-1.5 block">July 2026 Cycle</span>
                </div>
                <div className="bg-[#121214] p-5 rounded-xl border border-neutral-900 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Approved Presences</span>
                  <span className="text-base font-bold text-emerald-400 mt-1.5 block">{adminApprovedPresents} Days</span>
                </div>
                <div className="bg-[#121214] p-5 rounded-xl border border-neutral-900 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Attendance Accuracy Score</span>
                  <span className="text-base font-bold text-white mt-1.5 block">
                    {((adminApprovedPresents / 19) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Attendance Table Logs */}
              <div className="overflow-x-auto rounded-xl border border-neutral-900 bg-[#121214]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#17171a] border-b border-neutral-900 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="p-4">Log Date</th>
                      <th className="p-4">Daily Status Flag</th>
                      <th className="p-4">Logged Gate Check-In</th>
                      <th className="p-4">Approving Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-xs text-gray-300">
                    {ADMIN_MASTER_ATTENDANCE_DB.map((log) => (
                      <tr key={log.date} className="hover:bg-neutral-900/10 transition">
                        <td className="p-4 font-mono font-bold text-neutral-400">{log.date}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Present' 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' 
                              : 'bg-red-950/40 text-red-400 border border-red-900/50'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{log.checkIn}</td>
                        <td className="p-4 text-neutral-400">{log.verifiedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}