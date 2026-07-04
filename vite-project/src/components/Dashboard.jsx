import React, { useState, useEffect, useMemo } from 'react';

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
  { date: '2026-07-02', status: 'Present', checkIn: '08:45 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-07-01', status: 'Present', checkIn: '08:22 AM', verifiedBy: 'Admin (Warden Wing-A)' },
  { date: '2026-06-30', status: 'Absent', checkIn: '—', verifiedBy: 'System Auto-Absence Flag' },
  { date: '2026-06-29', status: 'Present', checkIn: '08:40 AM', verifiedBy: 'Admin (Warden Wing-A)' }
];

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [profileOpen, setProfileOpen] = useState(false);
  const [tickets, setTickets] = useState(() => {
    const localData = localStorage.getItem('gu_hostel_tickets');
    return localData ? JSON.parse(localData) : INITIAL_SYSTEM_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('gu_hostel_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const todayAttendanceStatus = useMemo(() => {
    const todayLog = ADMIN_MASTER_ATTENDANCE_DB.find(log => log.date === '2026-07-03');
    return todayLog ? todayLog : { status: 'Not Marked Yet', checkIn: '—', verifiedBy: 'Awaiting Admin Audit' };
  }, []);

  const adminApprovedPresents = useMemo(() => {
    return ADMIN_MASTER_ATTENDANCE_DB.filter(log => log.status === 'Present').length;
  }, []);

  const scopedTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.type === user.role);
  }, [tickets, user.role]);

  const taskAnalytics = useMemo(() => {
    const todayStr = '2026-07-03';
    let counts = { pending: 0, progress: 0, todayCompleted: 0, monthlyCompleted: 0 };

    scopedTickets.forEach(ticket => {
      if (ticket.status === 'Pending') counts.pending++;
      if (ticket.status === 'In Progress') counts.progress++;
      
      if (ticket.status === 'Completed') {
        counts.monthlyCompleted++; 
        if (ticket.completionDate === todayStr) {
          counts.todayCompleted++;
        }
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

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      
      <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-[#121214]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="h-8 w-8 rounded-lg bg-[#d15903] flex items-center justify-center font-black text-xs text-white">GU</div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">HostelConnect</h1>
                <span className="text-[10px] text-gray-500 block leading-none font-medium">Geeta University Operations</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1.5">
              <button 
                onClick={() => { setActiveTab('dashboard'); setProfileOpen(false); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition ${activeTab === 'dashboard' ? 'bg-neutral-800 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Overview Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('tasks'); setProfileOpen(false); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition ${activeTab === 'tasks' ? 'bg-neutral-800 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Active Complaints Room Matrix ({taskAnalytics.pending + taskAnalytics.progress})
              </button>
              <button 
                onClick={() => { setActiveTab('attendance'); setProfileOpen(false); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition ${activeTab === 'attendance' ? 'bg-neutral-800 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Attendance Reports
              </button>
            </nav>
          </div>

          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-900 transition focus:outline-none"
            >
              <div className="h-7 w-7 rounded-full bg-[#d15903]/20 border border-[#d15903]/40 flex items-center justify-center text-[11px] font-bold text-[#d15903]">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden sm:block text-left text-xs max-w-120px">
                <p className="font-semibold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[9px] text-gray-500 truncate mt-0.5">{user.role.split(' ')[0]} Expert</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-neutral-800 bg-[#121214] p-2 shadow-xl">
                <div className="px-3 py-2.5 border-b border-neutral-900">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] font-mono text-[#d15903] mt-0.5 truncate">{user.email}</p>
                </div>
                <div className="p-1 pt-1.5">
                  <button 
                    onClick={onLogout}
                    className="w-full text-left block rounded px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/20 transition"
                  >
                    Disconnect Session Portal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-950 pb-5">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 block">Personalized Field Station Dashboard</span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">Welcome back, {user.name.split(' ')[0]}</h2>
                <p className="text-xs text-neutral-400 mt-1">Domain: <span className="text-[#d15903] font-mono">{user.role}</span></p>
              </div>

              <div className="flex items-center gap-4 bg-[#121214] border border-neutral-800 rounded-xl px-4 py-3 select-none">
                <div className="text-left">
                  <span className="text-[9px] block uppercase font-bold text-gray-400 tracking-wider">Today's Attendance Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`h-2 w-2 rounded-full ${todayAttendanceStatus.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-extrabold text-white">
                      Admin Marked: {todayAttendanceStatus.status}
                    </span>
                  </div>
                </div>
                <div className="text-right border-l border-neutral-800 pl-4 text-[10px] font-mono text-gray-500">
                  {/* <span className="block">Logged: {todayAttendanceStatus.checkIn}</span>
                  <span className="block text-[9px] text-[#d15903] font-sans font-medium">{todayAttendanceStatus.verifiedBy}</span> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Assigned Queue (New)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black font-mono text-white">{taskAnalytics.pending}</span>
                </div>
              </div>
              <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Active Remediation</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black font-mono text-white">{taskAnalytics.progress}</span>
                </div>
              </div>
              <div className="bg-[#121214] p-4 rounded-xl border border-neutral-800 ring-2 ring-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Today Work Complete</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black font-mono text-emerald-400">{taskAnalytics.todayCompleted}</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider pl-1">Live Update</span>
                </div>
              </div>
              <div className="bg-[#121214] p-4 rounded-xl border border-neutral-900">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Monthly Work Complete</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black font-mono text-purple-300">{taskAnalytics.monthlyCompleted}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] rounded-xl border border-neutral-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Immediate Room Maintenance Tickets</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-xs font-semibold text-[#d15903] hover:underline">Open Full Matrix Tracker →</button>
              </div>
              
              {scopedTickets.filter(t => t.status !== 'Completed').length === 0 ? (
                <div className="py-8 text-center border border-dashed border-neutral-800 rounded-lg text-xs text-gray-500">
                  ✨ Perfect Standby! No active or open room complaints currently waiting in your pipeline.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scopedTickets.filter(t => t.status !== 'Completed').map(ticket => (
                    <div key={ticket.id} className="p-4 bg-[#17171a] border border-neutral-800 rounded-xl flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-white block">{ticket.room}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${ticket.status === 'Pending' ? 'bg-amber-950/50 text-amber-500' : 'bg-blue-950/50 text-blue-500'}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed pt-1">{ticket.details}</p>
                      </div>
                      <div className="pt-2 border-t border-neutral-900 flex justify-end">
                        {ticket.status === 'Pending' ? (
                          <button 
                            onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
                            className="w-full py-1.5 rounded bg-blue-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-blue-700 transition"
                          >
                            ⚡ Start Processing Work
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateTicketStatus(ticket.id, 'Completed')}
                            className="w-full py-1.5 rounded bg-emerald-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-emerald-700 transition"
                          >
                            ✓ Mark as Fully Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Active Room Complaints Control Board</h2>
              <p className="text-xs text-gray-400 mt-1">Safely modify room repair stages. Changes sync with metrics in real-time.</p>
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
                    <th className="p-4 w-44 text-center">Interactive Management Action Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-xs text-gray-300">
                  {scopedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-neutral-900/20 transition">
                      <td className="p-4 font-mono font-bold text-gray-500">{ticket.id}</td>
                      <td className="p-4">
                        <span className="font-medium text-gray-200 block">{ticket.block}</span>
                        <span className="text-[10px] text-gray-500">{ticket.floor}</span>
                      </td>
                      <td className="p-4 font-bold text-white">{ticket.room}</td>
                      <td className="p-4 text-gray-400 leading-normal">{ticket.details}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          ticket.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
                          ticket.status === 'In Progress' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' :
                          'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {ticket.status === 'Pending' && (
                          <button 
                            onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
                            className="w-full py-1.5 rounded bg-blue-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-blue-700 transition"
                          >
                            ⚡ Initiate Operations
                          </button>
                        )}
                        {ticket.status === 'In Progress' && (
                          <button 
                            onClick={() => updateTicketStatus(ticket.id, 'Completed')}
                            className="w-full py-1.5 rounded bg-emerald-600 font-bold text-[10px] text-white uppercase tracking-wider hover:bg-emerald-700 transition"
                          >
                            ✓ Finalize Settle
                          </button>
                        )}
                        {ticket.status === 'Completed' && (
                          <span className="text-[11px] font-mono text-neutral-600 line-through select-none block text-center">Closed Entry Archive</span>
                        )}
                      </td>
                    </tr>
                  ))}
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
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Admin Approved Presents</span>
                <span className="text-2xl font-black text-white font-mono mt-1.5 block">{adminApprovedPresents} Days</span>
              </div>
              <div className="bg-[#121214] p-5 rounded-xl border border-neutral-900 text-center">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Total Work Executed</span>
                <span className="text-2xl font-black text-white font-mono mt-1.5 block">{taskAnalytics.monthlyCompleted} Jobs</span>
              </div>
            </div>

            <div className="bg-[#121214] rounded-xl border border-neutral-900 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Shift Timeline Ledger (Read-Only Master Log)</h3>
              <div className="overflow-hidden rounded-lg border border-neutral-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#17171a] border-b border-neutral-900 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="p-3.5">Calendar Date</th>
                      <th className="p-3.5">Biometric Status</th>
                      <th className="p-3.5">Approved Arrival Check-In</th>
                      <th className="p-3.5">Authorized Verification Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-gray-300">
                    {ADMIN_MASTER_ATTENDANCE_DB.map((log, i) => (
                      <tr key={i} className="hover:bg-neutral-900/30">
                        <td className="p-3.5 font-sans text-xs font-medium text-white">{log.date}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${log.status === 'Present' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/60 text-red-400 border border-red-900/40'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-400">{log.checkIn}</td>
                        <td className="p-3.5 font-sans text-xs text-gray-500">{log.verifiedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}