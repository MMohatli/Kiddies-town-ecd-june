import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, DollarSign, Calendar as CalIcon, Truck, Plus, Mail, Check, Trash,
  ChevronDown, Search, Filter, AlertCircle, FileText, CheckCircle2, UserCheck, Trash2
} from 'lucide-react';
import { Learner, EnrolmentApplication, SchoolEvent, PaymentItem } from '../types';

interface AdminDashboardProps {
  learners: Learner[];
  enrolments: EnrolmentApplication[];
  events: SchoolEvent[];
  payments: PaymentItem[];
  onAddEvent: (event: SchoolEvent) => void;
  onApproveEnrolment: (enrolId: string) => void;
  onSendNotice: (parentName: string, amount: number) => void;
}

export default function AdminDashboard({
  learners,
  enrolments,
  events,
  payments,
  onAddEvent,
  onApproveEnrolment,
  onSendNotice
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'enrolments' | 'calendar' | 'transport'>('overview');
  
  // Notice triggers State
  const [notifiedParents, setNotifiedParents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Add Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00 AM');
  const [newEventCategory, setNewEventCategory] = useState<'Event' | 'Extra-mural' | 'Holiday' | 'Incursion'>('Event');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventSuccess, setEventSuccess] = useState(false);

  // Send Notice helper
  const triggerArrearsNotice = (parentName: string, amount: number) => {
    onSendNotice(parentName, amount);
    setNotifiedParents([...notifiedParents, parentName]);
    setTimeout(() => {
      setNotifiedParents(prev => prev.filter(name => name !== parentName));
    }, 4500);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    const nEvent: SchoolEvent = {
      id: 'event-' + Date.now(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      category: newEventCategory,
      description: newEventDesc,
      rsvps: []
    };

    onAddEvent(nEvent);
    setEventSuccess(true);
    
    // Reset Form
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    
    setTimeout(() => {
      setEventSuccess(false);
    }, 3000);
  };

  // Calculations for Arrears List
  const delinquentAccounts = [
    { id: 'da-1', parentName: 'Sarah Mbeki', childName: 'Leo Mbeki', amount: 2500, daysOverdue: 9, email: 'sarah.mbeki@mail.com' },
    { id: 'da-2', parentName: 'John Doe', childName: 'Samantha Doe', amount: 1200, daysOverdue: 4, email: 'john@doe.co.za' },
  ];

  // Calculations for Active/Pending counters
  const totalStudents = learners.length;
  const pendingEnrolmentsCount = enrolments.filter(e => e.status !== 'Approved').length;

  // Custom high-fidelity static attendance data for bar graphs (M, T, W, Th, F)
  const attendanceGraphData = [
    { day: 'Mon', present: 94, absent: 6 },
    { day: 'Tue', present: 88, absent: 12 },
    { day: 'Wed', present: 96, absent: 4 },
    { day: 'Thu', present: 92, absent: 8 },
    { day: 'Fri', present: 76, absent: 24 }
  ];

  // Filtered Learners lists for pipeline view
  const filteredLearners = learners.filter(l => {
    const matchesSearch = `${l.firstNames} ${l.surname}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || l.classType === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Admin Dashboard Sub-Navigation Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-lg gap-1 self-start w-fit shadow-xs">
        {[
          { id: 'overview', label: 'Admin Overview', icon: Users },
          { id: 'enrolments', label: 'Enrolment Pipeline', icon: FileText },
          { id: 'calendar', label: 'Calendar Planner', icon: CalIcon },
          { id: 'transport', label: 'Transport & Logistics', icon: Truck },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isActive ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {/* TAB 1: ADMIN OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Arrears Alerts Banner list */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Active Arrears & Unpaid accounts</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Generate direct notices to parent profiles immediately</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                      Action Required
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {delinquentAccounts.map((ac) => {
                      const isNotified = notifiedParents.includes(ac.parentName);
                      return (
                        <div key={ac.id} className="p-4 bg-slate-50 hover:bg-slate-100/85 transition-colors rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-xs text-slate-900">{ac.parentName}</h5>
                              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 rounded font-medium">
                                {ac.daysOverdue} Days Overdue
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Learner: {ac.childName} • Total Overdue: <span className="font-mono font-semibold text-slate-900">R{ac.amount}</span></p>
                          </div>

                          <button
                            onClick={() => triggerArrearsNotice(ac.parentName, ac.amount)}
                            className={`px-3 py-1.5 rounded text-[10px] font-semibold tracking-wide transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                              isNotified
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                            }`}
                            disabled={isNotified}
                          >
                            {isNotified ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                SMS & Email Notice Sent!
                              </>
                            ) : (
                              <>
                                <Mail className="w-3 h-3" />
                                Send Arrears Warning
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance counters */}
                <div className="bg-indigo-950 text-indigo-50 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-indigo-300">Kiddies Town Pipeline</h4>
                    <p className="text-xs text-indigo-200 mt-1 leading-relaxed">System dashboard for administrator controls</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-3 bg-indigo-900/50 rounded-xl border border-indigo-805">
                      <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Enrolled Kids</p>
                      <p className="text-2xl font-mono font-black mt-2 text-white">{totalStudents}</p>
                    </div>

                    <div className="p-3 bg-indigo-900/50 rounded-xl border border-indigo-805">
                      <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Pipeline Apps</p>
                      <p className="text-2xl font-mono font-black mt-2 text-white">{pendingEnrolmentsCount}</p>
                    </div>
                  </div>

                  <div className="text-[10px] leading-relaxed text-indigo-400 font-mono">
                    System Assigned Portal IP: 0.0.0.0 • Role: Chief Administrator (Shineon M.)
                  </div>
                </div>
              </div>

              {/* Sub Graphs Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Custom Attendance Bar chart (Fulfills Video/Img design specs) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Weekly Attendance registers Overview</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mb-6">Consolidated attendance data from all class registers (Mon - Fri)</p>
                  </div>

                  {/* High fidelity SVG bar chart */}
                  <div className="h-56 relative border-l border-b border-slate-100/80 pl-8 pb-8 flex justify-around items-end">
                    {/* Y-Axis guide lines */}
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-12 text-[10px] text-slate-300 font-mono">50%</div>
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-24 text-[10px] text-slate-300 font-mono">75%</div>
                    <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-36 text-[10px] text-slate-300 font-mono">100%</div>

                    {attendanceGraphData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group relative z-10 w-12">
                        {/* Attendance pills stacked */}
                        <div className="w-full flex flex-col justify-end gap-0.5 h-36">
                          {/* Present Bar (Green) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.present}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="bg-emerald-500 rounded-t-sm w-full font-mono font-bold text-[9px] text-white flex items-end justify-center pb-1 select-none"
                            title={`Present: ${data.present}%`}
                          >
                            {data.present > 40 && `${data.present}%`}
                          </motion.div>
                          {/* Absent Bar (Red) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.absent}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="bg-rose-400/90 rounded-b-sm w-full font-mono font-bold text-[9px] text-rose-50 flex items-start justify-center pt-0.5 cursor-pointer"
                            title={`Absent: ${data.absent}%`}
                          >
                            {data.absent > 10 && `${data.absent}%`}
                          </motion.div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{data.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transport distribution Doughnut chart + Legend specs */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Transport Logistics distribution</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mb-6">Learner geographic distribution areas for school transport planning</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* SVG Doughnut Circle */}
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Gray base segment */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                        {/* Ster Park: 55% Segment (Indigo) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="4.2" strokeDasharray="55 45" strokeDashoffset="0" />
                        {/* Flora Park: 30% Segment (Emerald) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-55" />
                        {/* CBD: 15% Segment (Amber) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-85" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-mono font-black text-slate-800">100%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Represented</span>
                      </div>
                    </div>

                    {/* Interactive Legend parameters */}
                    <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-indigo-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Ster Park (55%)</p>
                          <p className="text-[10px] text-slate-400">Primary Pick-up zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Flora Park (30%)</p>
                          <p className="text-[10px] text-slate-400">Secondary zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Polokwane CBD (15%)</p>
                          <p className="text-[10px] text-slate-400">Arranged bus pickups</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENROLMENT PIPELINE */}
          {activeTab === 'enrolments' && (
            <div className="space-y-6">
              {/* Pipeline summary overview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <h3 className="font-extrabold text-slate-800 text-base">Enrolment Application Register</h3>
                <p className="text-xs text-slate-400 mt-1">Review multi-step registrations, medical logs, and press Approve to synchronize child parameters immediately.</p>
              </div>

              {/* Table of active pipeline folders */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 uppercase tracking-widest text-[10px] font-bold text-slate-400 bg-slate-50/50">
                        <th className="py-3 px-4">Learner Name</th>
                        <th className="py-3 px-4">Desired Group</th>
                        <th className="py-3 px-4">Parent / Contact</th>
                        <th className="py-3 px-4 font-mono">Date Filed</th>
                        <th className="py-3 px-4">Form Progress</th>
                        <th className="py-3 px-4 text-center">Form Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {enrolments.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-4 px-4 text-slate-800 font-bold">
                            {app.childParticulars.firstNames} {app.childParticulars.surname}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-indigo-50 text-indigo-700">
                              {app.childParticulars.classType} Class
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold">
                            {app.parentParticulars?.mother?.firstNames || 'Nthabiseng'} Zulu
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-400">{app.dateApplied}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {/* progress counter step */}
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold font-mono">
                                Step {app.step} of 6
                              </span>
                              <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full" style={{ width: `${(app.step / 6) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {app.status === 'Approved' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                Confirmed Student
                              </span>
                            ) : (
                              <button
                                onClick={() => onApproveEnrolment(app.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Approve Enrolment
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR PLANNER */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Events list and planner Form */}
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="flex justify-between items-center mb-5 border-b border-indigo-50 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">Active Calendar Schedules</h3>
                    <p className="text-xs text-slate-400">Total listed events: {events.length}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 hover:bg-white transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600">
                            {ev.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{ev.date} at {ev.time}</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-sm">{ev.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{ev.description}</p>
                      </div>

                      {/* Display RSVP response rate */}
                      <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        RSVPs logged: {ev.rsvps.length} parents
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Event Form panel */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-1 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">Create New Year Event</h4>
                <p className="text-[11px] text-slate-400 mb-4 font-semibold">Instantly updates the parent and teacher calendars</p>

                {eventSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <h5 className="font-bold text-xs">Event scheduled!</h5>
                    <p className="text-[10px] mt-1 text-emerald-700/80">Notification push synchronized directly to the parents' app streams.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs font-semibold text-slate-600">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="e.g. End of Year Concert"
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-800 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200 w-full px-2 py-2 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Time</label>
                        <input
                          type="text"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="bg-slate-50 border border-slate-200 w-full px-2 py-2 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                          placeholder="09:00 AM"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Category</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-700 focus:outline-hidden"
                      >
                        <option value="Event">School Event</option>
                        <option value="Extra-mural">Extra-Mural Sport</option>
                        <option value="Incursion">Educational Incursion</option>
                        <option value="Holiday">School Holiday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Description / Brief Notes</label>
                      <textarea
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Provide details about standard dress requirements or refreshments..."
                        className="bg-slate-50 border border-slate-200 w-full px-3 py-2 rounded-lg text-slate-800 h-20 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl cursor-pointer"
                    >
                      Publish Schedule Event
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TRANSPORT & GEOGRAPHY */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <h3 className="font-extrabold text-slate-800 text-base">Transport Geography & Logistics Map</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage geographical coordinates and scheduled school busses pick-up points requested by parents.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Bus route specifications requested by parents */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <h4 className="font-extrabold text-slate-800 text-sm mb-4 border-b border-slate-50 pb-2">Active Transport Requests</h4>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150">
                      <div className="flex justify-between items-center text-xs font-bold font-mono">
                        <span className="text-indigo-800">Ster Park Bus Route</span>
                        <span className="text-indigo-600">Route A - 07:00 AM</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Active Pickups: <span className="font-bold text-slate-700">Leo Mbeki</span> (7 Grimm Street)</p>
                    </div>

                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150">
                      <div className="flex justify-between items-center text-xs font-bold font-mono">
                        <span className="text-indigo-800">Polokwane CBD Shuttle</span>
                        <span className="text-indigo-600">Route B - 07:15 AM</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Active Pickups: <span className="font-bold text-slate-700">Thabo Junior</span> (15 Hospital Road)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-950 text-indigo-50 rounded-2xl p-6 border border-indigo-950 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm mb-1">Geographical Profiling Benefits</h4>
                    <p className="text-xs mt-1 text-indigo-300 leading-relaxed">
                      By planning student distribution dynamically across Ster Park, Flora Park, and Polokwane CBD, Kiddies Town administration optimizes shuttle fuel and scheduling times.
                    </p>
                  </div>
                  <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-805 text-xs leading-relaxed text-indigo-400 font-mono mt-4">
                    Total Transport Registrars: 2 Learners Active.
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
