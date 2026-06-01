import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, Calendar as CalIcon, MessageSquare, BookOpen, CreditCard, 
  User, Plus, FileText, Send, ChevronRight, Activity, Clock, ShieldAlert,
  Download, Sparkles, Check, HelpCircle, Upload, Heart, Landmark, CheckCircle2,
  Facebook
} from 'lucide-react';
import { Learner, ParentProfile, ProgressReport, PaymentItem, ChatMessage, SchoolEvent, JournalPost, WeeklyTheme } from '../types';
import ProgressReportView from './ProgressReportView';

interface ParentDashboardProps {
  learner: Learner;
  profile: ParentProfile;
  reports: ProgressReport[];
  payments: PaymentItem[];
  chatHistory: ChatMessage[];
  events: SchoolEvent[];
  journalPosts: JournalPost[];
  themes: WeeklyTheme[];
  onAddMessage: (msg: string) => void;
  onRsvpEvent: (eventId: string, status: 'Yes' | 'No' | 'Maybe') => void;
  onAddPayment: (item: PaymentItem) => void;
}

export default function ParentDashboard({
  learner,
  profile,
  reports,
  payments,
  chatHistory,
  events,
  journalPosts,
  themes,
  onAddMessage,
  onRsvpEvent,
  onAddPayment
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'calendar' | 'journal' | 'finance' | 'profile'>('overview');
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'Yes' | 'No' | 'Maybe'>('Yes');
  
  // Custom manual payment logger states
  const [payDescription, setPayDescription] = useState('Monthly Fees / October Aftercare');
  const [payAmount, setPayAmount] = useState('2500');
  const [payRef, setPayRef] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const outstandingFees = payments
    .filter(p => p.status === 'In Arrears' || p.status === 'Unpaid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onAddMessage(messageText);
    setMessageText('');
  };

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    
    const newPay: PaymentItem = {
      id: 'pay-manual-' + Date.now(),
      description: payDescription,
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      status: 'Pending Verification',
      receiptNo: payRef ? `REF-${payRef.toUpperCase()}` : `REF-${Math.floor(Math.random() * 900000 + 100000)}`
    };

    onAddPayment(newPay);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayDescription('Monthly Fees / October Aftercare');
      setPayAmount('2500');
      setPayRef('');
    }, 4000);
  };

  // Precalculated Milestones to display based on Term 3 report or general indicators
  const milestoneCategories = [
    { label: 'Social & Emotional', val: 95, status: 'Exceptional', color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
    { label: 'Numeracy (D1)', val: 82, status: 'On Track', color: 'bg-indigo-500', bg: 'bg-indigo-50 text-indigo-700' },
    { label: 'Fine Motor Skills (H)', val: 88, status: 'On Track', color: 'bg-sky-500', bg: 'bg-sky-50 text-sky-700' },
    { label: 'Language / Literacy (C1)', val: 56, status: 'Progressing', color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Visual Navigation Links Panel */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible items-center lg:items-stretch sticky top-6">
          <div className="hidden lg:block pb-3 mb-2 border-b border-slate-200">
            <h4 className="font-bold text-xs text-slate-400 tracking-wider uppercase px-3">Parent Portal</h4>
            <div className="flex items-center gap-2 px-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 font-medium">Linked: {learner.preferredName}</span>
            </div>
          </div>

          {[
            { id: 'overview', label: 'Notice Board & Highlights', icon: Sparkles, activeStyle: 'bg-amber-50 text-amber-700 border-l-4 border-amber-500', iconColorActive: 'text-amber-500' },
            { id: 'reports', label: 'Academic Reports', icon: FileText, activeStyle: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500', iconColorActive: 'text-indigo-500' },
            { id: 'calendar', label: 'School Calendar', icon: CalIcon, activeStyle: 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500', iconColorActive: 'text-emerald-500' },
            { id: 'journal', label: 'Classroom Gallery', icon: BookOpen, activeStyle: 'bg-rose-50 text-rose-700 border-l-4 border-rose-500', iconColorActive: 'text-rose-500' },
            { id: 'finance', label: 'Fees & Payments', icon: CreditCard, activeStyle: 'bg-sky-50 text-sky-700 border-l-4 border-sky-500', iconColorActive: 'text-sky-500' },
            { id: 'profile', label: 'Contact & Family Info', icon: User, activeStyle: 'bg-teal-50 text-teal-700 border-l-4 border-teal-500', iconColorActive: 'text-teal-500' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedReport(null);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer w-full ${
                  isActive
                    ? tab.activeStyle
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? tab.iconColorActive : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Dashboard Frame */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedReport ? '-report' : '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && !selectedReport && (
              <div className="space-y-6">
                {/* Outstanding Payment Warning alert banner */}
                {outstandingFees > 0 && (
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs"
                  >
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-amber-900">Action Required: Outstanding School Fees</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Outstanding fees: <span className="font-bold">R{outstandingFees.toLocaleString()}</span>. Please submit proof of payment as soon as possible to avoid penalties.
                      </p>
                      <button
                        onClick={() => setActiveTab('finance')}
                        className="text-xs font-bold text-amber-950 underline hover:text-amber-800 transition-colors mt-2 cursor-pointer"
                      >
                        Submit Proof of Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Top Quick Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Learner status block */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">Active Learner</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{learner.firstNames} {learner.surname}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{learner.classType} Class (Ages 4-5)</p>
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                      <div className="p-1.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-1.5 border border-emerald-100">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Present</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Arrived at {learner.arrivedTime || '07:45'} AM</span>
                    </div>
                  </div>

                  {/* Weekly Theme block */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Weekly Theme</span>
                      <h3 className="text-lg font-semibold text-slate-900 mt-2 flex items-center gap-1.5">
                        🦁 {themes[0]?.title || 'Safari Adventures'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {themes[0]?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 transition-colors mt-4 self-start cursor-pointer"
                    >
                      Explore themes & photos <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Upcoming event block */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Upcoming Event</span>
                      <h3 className="text-lg font-semibold text-slate-900 mt-2 line-clamp-1">
                        📸 {events[0]?.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Date: <span className="font-semibold text-slate-700">{events[0]?.date}</span> at {events[0]?.time}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 transition-colors mt-4 self-start cursor-pointer"
                    >
                      Event Details & RSVP <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-grid of chat and milestones */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Milestones Panel */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">School Readiness Milestones</h3>
                        <p className="text-xs text-slate-500">Assessed metrics for 5 Year Old program graduates</p>
                      </div>
                      <span className="p-2 bg-slate-50 text-indigo-600 rounded-lg border border-slate-200">
                        <Activity className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="space-y-4">
                      {milestoneCategories.map((m) => (
                        <div key={m.label}>
                          <div className="flex justify-between items-center text-xs font-semibold mb-1">
                            <span className="text-slate-600 font-medium">{m.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">{m.val}%</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${m.bg}`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.val}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${m.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Chat Widget */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Teacher Instant Messaging</h3>
                        <p className="text-xs text-slate-500">Secure real-time compliance communication</p>
                      </div>
                      <span className="p-2 bg-slate-50 text-indigo-600 rounded-lg border border-slate-200">
                        <MessageSquare className="w-5 h-5" />
                      </span>
                    </div>

                    {/* Chat Messages flow */}
                    <div className="space-y-3.5 my-3 h-48 overflow-y-auto pr-1">
                      {chatHistory.map((msg) => {
                        const isMe = msg.sender === 'Parent';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] font-bold text-slate-400 px-1 mb-0.5">
                              {msg.senderName} • {msg.timestamp}
                            </span>
                            <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 pt-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type message directly to Teacher Anne..."
                        className="flex-1 bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-white cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Facebook Community Activity Feed & Updates */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-5">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="p-1 px-1.5 bg-blue-100 text-blue-600 rounded-md text-xs font-black flex items-center justify-center">
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                        <span>Official Facebook Community Feed & Activities</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Stay connected with Kiddies Town graduation photos, parents day events, fun walks, and newsletter reports.</p>
                    </div>
                    <a 
                      href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer hover:shadow-sm"
                    >
                      <Facebook className="w-3.5 h-3.5 block" />
                      <span>Join Facebook Group</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      {
                        title: "2025 Year-End Graduation Day",
                        date: "Nov 2025 • Announcement",
                        text: "Congratulations to our beautiful Grade R Graduates (Tigers Class)! High-resolution group pictures and parent-teacher speeches are now uploaded to the community page.",
                        likes: 42,
                        comments: 18,
                        img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=60"
                      },
                      {
                        title: "Annual Ster Park Fun Walk & Picnic",
                        date: "Oct 2025 • Activity Update",
                        text: "Parents, teachers, and energetic kids! Thank you for making our annual 3km Kiddies Fun Walk on the Ster Park trail such a success. See the colorful balloon arch pics!",
                        likes: 35,
                        comments: 12,
                        img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=60"
                      },
                      {
                        title: "Creative Arts & Cake Sale Morning",
                        date: "Sep 2025 • School Highlight",
                        text: "Roses and Giraffes absolute masterpieces in clay and finger-paint. Our cake sale raised sufficient funds for new safety playground mats! Thank you, community!",
                        likes: 56,
                        comments: 24,
                        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60"
                      }
                    ].map((post, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-xs transition-all flex flex-col justify-between">
                        <div>
                          <img src={post.img} alt={post.title} className="w-full h-32 object-cover border-b border-slate-200" referrerPolicy="no-referrer" />
                          <div className="p-4">
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide block mb-1">{post.date}</span>
                            <h4 className="font-bold text-slate-800 text-xs mb-1.5">{post.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 font-medium">{post.text}</p>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
                          <span>👍 {post.likes} Likes</span>
                          <span>💬 {post.comments} Comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMIC REPORTS TAB */}
            {activeTab === 'reports' && !selectedReport && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <h3 className="font-extrabold text-slate-800 text-lg">Academic Performance Reports</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage and view children progress reports evaluated by Kiddies Town teachers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between transition-all hover:border-indigo-100 hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide ${
                            report.released
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {report.released ? 'Released' : 'Pending Evaluation'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono font-bold">
                            Academic Year: {report.academicYear}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">Term {report.term} Progress Report</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {report.released ? `Released on ${report.releasedDate}` : 'Results will be released mid November.'}
                        </p>
                      </div>

                      {report.released ? (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-slate-100 transition-all font-semibold text-xs rounded-xl cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          View Detailed Performance Sheet
                        </button>
                      ) : (
                        <div className="mt-6 flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-400">
                          <HelpCircle className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Comments locked until principal release approvals.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IF A REPORT IS SELECTED IN THE HUB, SHOW IT INLINE */}
            {selectedReport && (
              <ProgressReportView
                report={selectedReport}
                learner={learner}
                onBack={() => setSelectedReport(null)}
              />
            )}

            {/* CALENDAR & RSVP TAB */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Interactive School Events Grid */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-5 border-b border-indigo-50 pb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">School Event Calendar</h3>
                      <p className="text-xs text-slate-400">Year planner and extracurricular event list</p>
                    </div>
                    <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 font-mono text-xs font-bold rounded-lg">
                      October - November 2025
                    </span>
                  </div>

                  {/* Display standard 35 grid elements representing November to fulfill calendar designs */}
                  <div className="mb-6 grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500 font-semibold uppercase border-b border-slate-100 pb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 mb-6">
                    {Array.from({ length: 31 }).map((_, idx) => {
                      const dayVal = idx + 1;
                      const hasEvent = [27].includes(dayVal); // Match photo days or soccer match days
                      return (
                        <div
                          key={idx}
                          className={`aspect-square sm:p-2 flex flex-col items-center justify-between rounded-lg border border-slate-100 text-xs font-semibold ${
                            hasEvent ? 'bg-indigo-50 border-indigo-200' : 'bg-white'
                          }`}
                        >
                          <span className={hasEvent ? 'text-indigo-700 font-bold' : 'text-slate-600'}>{dayVal}</span>
                          {hasEvent && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mb-0.5 animate-pulse" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RSVP Details and Action panel */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h3 className="font-extrabold text-slate-800 text-base mb-4">Upcoming Events list</h3>
                    
                    <div className="space-y-4">
                      {events.map((event) => {
                        const rsvp = event.rsvps.find(r => r.parentName === profile.name);
                        return (
                          <div
                            key={event.id}
                            className={`p-4 rounded-xl border transition-all ${
                              selectedEventId === event.id
                                ? 'bg-indigo-50/50 border-indigo-400'
                                : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {event.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{event.date}</span>
                            </div>
                            <h4 className="font-black text-slate-800 text-sm">{event.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>

                            <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                RSVP Status:{' '}
                                <span className={`font-bold ${
                                  rsvp?.status === 'Yes' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>
                                  {rsvp?.status || 'No Response'}
                                </span>
                              </span>

                              <div className="flex gap-1.5">
                                {(['Yes', 'No', 'Maybe'] as const).map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => onRsvpEvent(event.id, opt)}
                                    className={`px-2 py-1 text-[10px] font-black rounded-md border cursor-pointer ${
                                      rsvp?.status === opt
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLASSROOM GALLERY TAB */}
            {activeTab === 'journal' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Classroom Gallery & Lessons</h3>
                    <p className="text-xs text-slate-400">
                      Visual records of children engaged in creative arts, physical exercises, and lessons. Supporting CARE, EDUCATE & DEVELOP.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-pink-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    Teacher Verified Posts Only
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {journalPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-48 object-cover object-center bg-slate-100"
                      />
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold font-mono text-indigo-500 mb-1">{post.date}</p>
                          <h4 className="font-black text-slate-800 text-base">{post.title}</h4>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {post.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-semibold">Posted by {post.postedBy}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-pink-600 font-black tracking-wide uppercase">
                            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Facebook Gallery Redirection banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100 shrink-0">
                      <Facebook className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Do you want to see standard classroom activity archives?</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Explore our daily highlight reels, class videos, and playground sports galleries on our public page.</p>
                    </div>
                  </div>
                  <a 
                    href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>View Facebook Albums</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* FINANCE & PAYMENTS TAB */}
            {activeTab === 'finance' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Account Balances and History list */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Visual Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Outstanding</span>
                      <h3 className="text-2xl font-bold font-mono mt-3">R{outstandingFees.toLocaleString()}.00</h3>
                      <p className="text-[10px] text-slate-400 mt-2">Due by 1st of each month</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Monthly Fee</span>
                      <h3 className="text-2xl font-bold font-mono text-slate-800 mt-3">R2,500.00</h3>
                      <p className="text-[10px] text-slate-500 mt-2">Due 01 Nov 2025 (Full Day)</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Processed</span>
                      <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-3">R2,500.00</h3>
                      <p className="text-[10px] text-slate-500 mt-2">Processed on 01 Sep 2025</p>
                    </div>
                  </div>

                  {/* Payment Logs */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-930 text-base mb-4">Payment & Invoices History</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-500 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold text-slate-450">
                            <th className="py-3 px-2">Description</th>
                            <th className="py-3 px-2">Date</th>
                            <th className="py-3 px-2 text-right">Amount</th>
                            <th className="py-3 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {payments.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-2 text-slate-900 font-semibold">{item.description}</td>
                              <td className="py-3.5 px-2 font-mono text-slate-400">{item.date}</td>
                              <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-900">
                                R{item.amount.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-2 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                                  item.status === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : item.status === 'Pending Verification'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bank account details and Manual payment Logger */}
                <div className="space-y-6">
                  {/* bank account panel */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 shadow-sm">
                    <h3 className="font-semibold text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2 text-white">
                      <Landmark className="w-4 h-4 text-indigo-400" />
                      <span>Kiddies Town Bank Details</span>
                    </h3>

                    <div className="space-y-3 font-mono text-[11px] text-slate-300">
                      <div>
                        <p className="text-[10px] text-slate-400">Capitec Bank</p>
                        <p className="font-semibold text-white">A/C: 17 046 859 05</p>
                        <p className="text-[10px] text-slate-500">Linked Cell: 079 386 6233</p>
                      </div>
                      <div className="border-t border-slate-800 my-2 pt-2">
                        <p className="text-[10px] text-slate-400">Nedbank Account</p>
                        <p className="font-semibold text-white">A/C: 110 679 2211</p>
                      </div>
                      <div className="border-t border-slate-800 my-2 pt-2">
                        <p className="text-[10px] text-slate-400">First National Bank (FNB)</p>
                        <p className="font-semibold text-white">A/C: 6274 1889 490</p>
                      </div>
                      <div className="border-t border-slate-805 my-2 pt-2">
                        <p className="text-[10px] text-slate-400">Standard Bank</p>
                        <p className="font-semibold text-white">A/C: 1013 675 3726</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-lg mt-4 border border-slate-800 text-[10px] leading-relaxed text-slate-400 select-text">
                      ⚠️ Please use child's registered name and surname as payment reference. Mail proof to <span className="underline">admin@kiddiestown.co.za</span> or WhatsApp.
                    </div>
                  </div>

                  {/* Manual Payment Submit form */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h4 className="font-extrabold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Submit Payment Proof</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-4 font-semibold">Log a direct bank transfer details for admin validations</p>

                    {paySuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-center"
                      >
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                        <h5 className="font-black text-xs">Payment logged successfully!</h5>
                        <p className="text-[10px] mt-1 text-emerald-700/80">Our Financial Administrator was notified. Your status is now "Pending Verification".</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleManualPaymentSubmit} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fee Category</label>
                          <select
                            value={payDescription}
                            onChange={(e) => setPayDescription(e.target.value)}
                            className="bg-slate-50 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
                          >
                            <option value="Monthly Fees / October Aftercare">Monthly Fees / October Aftercare</option>
                            <option value="Monthly Fees / November Full Day">Monthly Fees / November Full Day</option>
                            <option value="School Registration Fee (New Year 2025)">Registration Fee (R600)</option>
                            <option value="Excursion / Outing Fee">Excursion / Outing Fee</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount Transferred (ZAR)</label>
                          <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="bg-slate-50 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-hidden"
                            placeholder="e.g. 2500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Reference Code / Slip No</label>
                          <input
                            type="text"
                            value={payRef}
                            onChange={(e) => setPayRef(e.target.value)}
                            className="bg-slate-50 w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800 placeholder-slate-300 focus:outline-hidden"
                            placeholder="e.g. FNB1200388"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-white font-bold tracking-wide mt-2 cursor-pointer"
                        >
                          Submit Proof and Log Reference
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FAMILY PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Child particulars card */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h3 className="font-extrabold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">Learner Particulars</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold">
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">First Names:</span>
                        <span className="text-slate-800">{learner.firstNames}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Surname/Family Name:</span>
                        <span className="text-slate-800">{learner.surname}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Preferred Name:</span>
                        <span className="text-slate-800">{learner.preferredName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Date of Birth:</span>
                        <span className="text-slate-800">{learner.dob}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">ID Number:</span>
                        <span className="text-slate-800 font-mono">{learner.idNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Home Language:</span>
                        <span className="text-slate-800">{learner.homeLanguage}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Religion:</span>
                        <span className="text-slate-800">{learner.religion}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Registered Class:</span>
                        <span className="text-indigo-700 font-bold">{learner.classType} Class</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h3 className="font-extrabold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">Parent / Guardian Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-extrabold text-indigo-950 text-xs mb-3">Mother: {profile.mother.firstNames} {profile.mother.surname}</h4>
                        <div className="space-y-2 text-[11px] font-medium text-slate-600">
                          <p>ID: <span className="font-mono text-slate-800">{profile.mother.idNumber}</span></p>
                          <p>Occupation: <span className="text-slate-800">{profile.mother.occupation}</span></p>
                          <p>Employer: <span className="text-slate-800">{profile.mother.employer}</span></p>
                          <p>Cell No: <span className="text-slate-800">{profile.mother.cellNo}</span></p>
                          <p>Email: <span className="text-slate-800">{profile.mother.email}</span></p>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-extrabold text-indigo-950 text-xs mb-3">Father: {profile.father.firstNames} {profile.father.surname}</h4>
                        <div className="space-y-2 text-[11px] font-medium text-slate-600">
                          <p>ID: <span className="font-mono text-slate-800">{profile.father.idNumber}</span></p>
                          <p>Occupation: <span className="text-slate-800">{profile.father.occupation}</span></p>
                          <p>Employer: <span className="text-slate-800">{profile.father.employer}</span></p>
                          <p>Cell No: <span className="text-slate-800">{profile.father.cellNo}</span></p>
                          <p>Email: <span className="text-slate-800">{profile.father.email}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical panel right column */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h3 className="font-extrabold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">Medical Profile</h3>
                    
                    <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                        <span className="font-bold text-rose-800 block text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> List of Allergies
                        </span>
                        <p className="font-semibold text-rose-950">Peanuts, Shellfish. Required Epipen in school bag.</p>
                      </div>

                      <div className="space-y-1 mt-4">
                        <p className="font-bold text-slate-500">Medical Aid Fund:</p>
                        <p className="font-semibold text-slate-800">Discovery Health</p>
                        <p className="text-[10px] text-slate-400 font-mono">Plan: Classic Saver (No. 60511210)</p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-slate-500">Family Physician Plan:</p>
                        <p className="font-semibold text-slate-800">Dr. Melusi Khoza</p>
                        <p className="text-[10px] text-indigo-600 font-mono">Tel: 015 023 1111</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                    <h3 className="font-extrabold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">Emergency Contacts</h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-600">TM</div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">Thabo Mbeki</p>
                          <p className="text-[10px] text-slate-400 font-medium">Uncle • +27 82 120 4455</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-600">GZ</div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">Grace Zulu</p>
                          <p className="text-[10px] text-slate-400 font-medium font-semibold">Grandmother • +27 71 889 6043</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
