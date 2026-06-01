import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, HelpCircle, Heart, Star, BookOpen,
  User, CheckCircle2, ChevronRight, MessageCircle, DollarSign, Users, Award,
  Menu, X, Bell, Search, Facebook
} from 'lucide-react';

// Modules imports
import { 
  initialLearners, initialParentProfile, initialProgressReports, 
  initialPaymentHistory, initialChatHistory, initialWeeklyThemes, 
  initialSchoolEvents, initialJournalPosts, initialEnrolments 
} from './data/mockData';
import { Learner, ParentProfile, ProgressReport, PaymentItem, ChatMessage, SchoolEvent, JournalPost, WeeklyTheme, EnrolmentApplication } from './types';

import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import EnrolmentWizard from './components/EnrolmentWizard';

export default function App() {
  // PERSISTED DATA STATES
  const [learners, setLearners] = useState<Learner[]>(initialLearners);
  const [parentProfile, setParentProfile] = useState<ParentProfile>(initialParentProfile);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>(initialProgressReports);
  const [paymentHistory, setPaymentHistory] = useState<PaymentItem[]>(initialPaymentHistory);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChatHistory);
  const [themes, setThemes] = useState<WeeklyTheme[]>(initialWeeklyThemes);
  const [events, setEvents] = useState<SchoolEvent[]>(initialSchoolEvents);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(initialJournalPosts);
  const [enrolments, setEnrolments] = useState<EnrolmentApplication[]>(initialEnrolments);

  // DB Synchronization State Tracker
  const [usingNeon, setUsingNeon] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);

  // Load NeonDB / Local fallback state on mount
  useEffect(() => {
    async function loadAllData() {
      try {
        const res = await fetch('/api/all-data');
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        if (data) {
          if (data.learners) setLearners(data.learners);
          if (data.parentProfile) setParentProfile(data.parentProfile);
          if (data.progressReports) setProgressReports(data.progressReports);
          if (data.paymentHistory) setPaymentHistory(data.paymentHistory);
          if (data.chatHistory) setChatHistory(data.chatHistory);
          if (data.themes) setThemes(data.themes);
          if (data.events) setEvents(data.events);
          if (data.journalPosts) setJournalPosts(data.journalPosts);
          if (data.enrolments) setEnrolments(data.enrolments);
          setUsingNeon(!!data.usingNeon);
        }
      } catch (err) {
        console.error("Failed to load backend databases:", err);
      } finally {
        setLoadingDb(false);
      }
    }
    loadAllData();
  }, []);

  // Sync Post helper
  const postData = async (endpoint: string, payload: any) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        setUsingNeon(!!data.usingNeon);
      }
    } catch (err) {
      console.warn(`Local buffering. Could not write to ${endpoint}:`, err);
    }
  };

  // VIEW PERSPECTIVES SELECTOR: parent | admin | teacher | enrolment
  const [roleMode, setRoleMode] = useState<'parent' | 'admin' | 'teacher' | 'enrolment'>('parent');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trigger notice modal simulator
  const [noticeAlert, setNoticeAlert] = useState<{ show: boolean; msg: string } | null>(null);

  // Active student reference for parent dashboard (defaults to Leo)
  const activeStudent = learners.find(s => s.id === 'student-leo') || learners[0];

  // Auto-respond teacher simulation when parent sends a message
  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg && lastMsg.sender === 'Parent') {
      const timer = setTimeout(async () => {
        const teacherResponse: ChatMessage = {
          id: 'chat-auto-' + Date.now(),
          sender: 'Teacher',
          senderName: 'Teacher Anne',
          text: `Hi Sarah! Yes, that sounds absolutely fine. I'll make sure to double-check their workbook exercises before standard Friday pickup. Hope you have a great afternoon!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, teacherResponse]);
        await postData('/api/chats', teacherResponse);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [chatHistory]);

  // HANDLERS
  const handleParentAddMessage = async (text: string) => {
    const newMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      sender: 'Parent',
      senderName: parentProfile.name,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
    await postData('/api/chats', newMsg);
  };

  const handleTeacherAddMessage = async (text: string) => {
    const newMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      sender: 'Teacher',
      senderName: 'Teacher Anne',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
    await postData('/api/chats', newMsg);
  };

  const handleRsvpEvent = async (eventId: string, status: 'Yes' | 'No' | 'Maybe') => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    const existingIdx = ev.rsvps.findIndex(r => r.parentName === parentProfile.name);
    let updatedRsvps = [...ev.rsvps];
    if (existingIdx >= 0) {
      updatedRsvps[existingIdx] = { parentName: parentProfile.name, count: 1, status: status };
    } else {
      updatedRsvps.push({ parentName: parentProfile.name, count: 1, status: status });
    }
    const updatedEvent = { ...ev, rsvps: updatedRsvps };

    setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    await postData('/api/events', updatedEvent);
  };

  const handleAddPayment = async (newPay: PaymentItem) => {
    setPaymentHistory(prev => [newPay, ...prev]);
    await postData('/api/payments', newPay);
  };

  const handleAddEvent = async (newEvent: SchoolEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    await postData('/api/events', newEvent);
  };

  const handleApproveEnrolment = async (enrolId: string) => {
    const applicant = enrolments.find(e => e.id === enrolId);
    if (!applicant) return;

    const updatedApp: EnrolmentApplication = { ...applicant, status: 'Approved' };
    setEnrolments(prev => prev.map(app => app.id === enrolId ? updatedApp : app));
    await postData('/api/enrolments', updatedApp);

    if (applicant.childParticulars) {
      const newGrad: Learner = {
        id: applicant.childParticulars.id || 'student-' + Date.now(),
        surname: applicant.childParticulars.surname || 'Zulu',
        firstNames: applicant.childParticulars.firstNames || 'Nthabi',
        preferredName: applicant.childParticulars.preferredName || applicant.childParticulars.firstNames || 'Nthabi',
        dob: applicant.childParticulars.dob || '2019-11-20',
        idNumber: applicant.childParticulars.idNumber || '1911205345089',
        gender: applicant.childParticulars.gender || 'Male',
        homeLanguage: applicant.childParticulars.homeLanguage || 'Sesotho',
        classType: applicant.childParticulars.classType || 'Giraffes',
        attendanceStatus: 'Present',
        arrivedTime: '08:00'
      };
      setLearners(prev => [...prev, newGrad]);
      await postData('/api/learners', newGrad);
    }
  };

  const handleSendNotice = (parentName: string, amount: number) => {
    setNoticeAlert({
      show: true,
      msg: `Financial Arrears Notification dispatched successfully to ${parentName}! Notice requested: Outstanding school fee of R${amount.toLocaleString()}.`
    });
    setTimeout(() => {
      setNoticeAlert(null);
    }, 4500);
  };

  const handleUpdateAttendance = async (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    const student = learners.find(s => s.id === studentId);
    if (!student) return;

    const updatedStudent: Learner = {
      ...student,
      attendanceStatus: status,
      arrivedTime: status === 'Present' ? '08:00' : undefined
    };
    setLearners(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    await postData('/api/learners', updatedStudent);
  };

  const handleUpdateMilestones = (studentId: string, milestones: { label: string; val: number }[]) => {
    // Milestones adjust simulation
  };

  const handleSaveReport = async (newReport: ProgressReport) => {
    setProgressReports(prev => {
      const idx = prev.findIndex(r => r.learnerId === newReport.learnerId && r.term === newReport.term);
      if (idx >= 0) {
        const c = [...prev];
        c[idx] = newReport;
        return c;
      }
      return [...prev, newReport];
    });
    await postData('/api/progress-reports', newReport);
  };

  const handleAddTheme = async (newTheme: WeeklyTheme) => {
    setThemes(prev => [newTheme, ...prev]);
    await postData('/api/themes', newTheme);
  };

  const handleWizardComplete = async (app: EnrolmentApplication) => {
    setEnrolments(prev => [app, ...prev]);
    await postData('/api/enrolments', app);
  };

  // Role Mode specific branding color classes generator
  const getRoleColors = (id: string, active: boolean) => {
    if (!active) return 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 pl-3 border-l-4 border-transparent';
    switch (id) {
      case 'parent':
        return 'bg-indigo-50/80 text-indigo-700 font-bold pl-3 border-l-4 border-indigo-500';
      case 'admin':
        return 'bg-amber-50/80 text-amber-700 font-bold pl-3 border-l-4 border-amber-500';
      case 'teacher':
        return 'bg-emerald-50/80 text-emerald-700 font-bold pl-3 border-l-4 border-emerald-500';
      case 'enrolment':
        return 'bg-rose-50/80 text-rose-700 font-bold pl-3 border-l-4 border-rose-500';
      default:
        return 'bg-slate-100 text-slate-800 font-bold pl-3';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 select-none antialiased">
      {/* Sidebar on desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        <div className="p-6 flex flex-col justify-between h-full bg-white">
          <div>
            {/* Logo element with real logo from Facebook first page link */}
            <div className="flex items-center gap-3 mb-10">
              <div className="relative shrink-0 flex items-center">
                <img 
                  src="https://graph.facebook.com/100084221528687/picture?type=large" 
                  alt="Kiddies Town Logo" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('sidebar-brand-balloons');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div id="sidebar-brand-balloons" className="hidden -space-x-1 shrink-0 flex items-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-xs" />
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-xs" />
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-white shadow-xs" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow-xs" />
                </div>
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-indigo-950 block leading-none">KIDDIES TOWN</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">CARE • EDUCATE • DEVELOP</span>
                {/* Neon SQL Sync Indicator */}
                <div className="mt-1 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${usingNeon ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[7px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                    {usingNeon ? 'NeonDB Active' : 'Demo Mode'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links (Role Playgrounds) */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Workspace Roles</p>
              {[
                { id: 'parent', label: '🏠 Parent Workspace', desc: 'Sarah Mbeki', text: 'View reports, pay, chat' },
                { id: 'admin', label: '💼 Admin Portal', desc: 'Shineon M.', text: 'Arrears logs, calendar' },
                { id: 'teacher', label: '👩‍🏫 Teacher Hub', desc: 'Teacher Anne', text: 'Mark Roster, set themes' },
                { id: 'enrolment', label: '📝 New Enrolment', desc: '6-Step Wizard', text: 'Apply for admission' },
              ].map((r) => {
                const isActive = roleMode === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRoleMode(r.id as any)}
                    className={`w-full flex items-start gap-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${getRoleColors(r.id, isActive)}`}
                    title={r.text}
                  >
                    <div className="leading-tight mt-0.5">
                      <span className="block font-bold">{r.label}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">{r.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Facebook Community Portal Widget */}
            <div className="mt-8 pt-6 border-t border-slate-150">
              <a 
                href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-200">
                  <Facebook className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="text-xs font-bold text-blue-900 block uppercase tracking-wider">Facebook Page</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5 group-hover:underline">Join our community &rarr;</span>
                </div>
              </a>
            </div>
          </div>

          {/* User Card at bottom of sidebar matching the AetherFlow recording */}
          <div className="pt-4 border-t border-slate-200 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 shrink-0">
                {roleMode === 'parent' ? 'SM' : roleMode === 'admin' ? 'SM' : roleMode === 'teacher' ? 'TA' : 'GA'}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {roleMode === 'parent' ? 'Sarah Mbeki' : roleMode === 'admin' ? 'Shineon M.' : roleMode === 'teacher' ? 'Teacher Anne' : 'Guest Applicant'}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium font-mono">
                  {roleMode === 'parent' ? 'Parent profile' : roleMode === 'admin' ? 'Principal' : roleMode === 'teacher' ? 'Tigers Lead' : 'Admissions Portal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer / overlay screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 p-6 flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 flex items-center">
                      <img 
                        src="https://graph.facebook.com/100084221528687/picture?type=large" 
                        alt="Kiddies Town Logo" 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.getElementById('mobile-brand-balloons');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                      <div id="mobile-brand-balloons" className="hidden -space-x-1 shrink-0 flex items-center">
                        <span className="w-3 rounded-full bg-red-500 border border-white shadow-xs" />
                        <span className="w-3 rounded-full bg-amber-400 border border-white shadow-xs" />
                        <span className="w-3 rounded-full bg-indigo-500 border border-white shadow-xs" />
                        <span className="w-3 rounded-full bg-emerald-500 border border-white shadow-xs" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-black tracking-tight text-indigo-950 block leading-tight">KIDDIES TOWN</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider block">CARE • EDUCATE • DEVELOP</span>
                      {/* Neon SQL Sync Indicator */}
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className={`w-1 h-1 rounded-full ${usingNeon ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-[6px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                          {usingNeon ? 'NeonDB Active' : 'Demo Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Workspace Roles</p>
                  {[
                    { id: 'parent', label: '🏠 Parent Workspace', desc: 'Sarah Mbeki' },
                    { id: 'admin', label: '💼 Admin Portal', desc: 'Shineon M.' },
                    { id: 'teacher', label: '👩‍🏫 Teacher Workspace', desc: 'Teacher Anne' },
                    { id: 'enrolment', label: '📝 New Enrolment', desc: 'Admission Wizard' },
                  ].map((r) => {
                    const isActive = roleMode === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRoleMode(r.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${getRoleColors(r.id, isActive)}`}
                      >
                        <div className="leading-tight mt-1">
                          <span className="block font-bold">{r.label}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{r.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Facebook Community Portal Widget */}
                <div className="mt-6 pt-5 border-t border-slate-150">
                  <a 
                    href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-xs font-bold text-blue-900 block uppercase tracking-wider">Facebook Page</span>
                      <span className="text-[10px] text-blue-600 font-semibold block mt-0.5 group-hover:underline">Join community &rarr;</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 shrink-0">
                    {roleMode === 'parent' ? 'SM' : roleMode === 'admin' ? 'SM' : roleMode === 'teacher' ? 'TA' : 'GA'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {roleMode === 'parent' ? 'Sarah Mbeki' : roleMode === 'admin' ? 'Shineon M.' : roleMode === 'teacher' ? 'Teacher Anne' : 'Guest Applicant'}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-medium">
                      {roleMode === 'parent' ? 'Parent profile' : roleMode === 'admin' ? 'Principal' : roleMode === 'teacher' ? 'Tigers Instructor' : 'Admissions'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content scroll window */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 overflow-y-auto">
        {/* Top Header matching AetherFlow recording style */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger menu toggle */}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Kiddies Town Logo Image in the Header Navigation */}
            <img 
              src="https://graph.facebook.com/100084221528687/picture?type=large" 
              alt="Kiddies Town Logo" 
              className="w-9 h-9 rounded-full object-cover border border-indigo-200 shadow-xs block shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 md:text-base tracking-tight leading-none uppercase">
                {roleMode === 'parent' && 'Parent Workspace Roster'}
                {roleMode === 'admin' && 'Compliance Administration Portal'}
                {roleMode === 'teacher' && 'Teacher Progress Tracker'}
                {roleMode === 'enrolment' && 'Admissions Application Portal'}
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold font-mono mt-1 hidden md:block">
                {roleMode === 'parent' && 'Sarah M. linked to Leo Mbeki'}
                {roleMode === 'admin' && 'Kiddies Town Board Audit Controls'}
                {roleMode === 'teacher' && 'Class: Tigers (Age Group 4-5 Years Old)'}
                {roleMode === 'enrolment' && 'Stepwise WIL Compliance Enrollment Wizard'}
              </p>
            </div>
          </div>

          {/* Live Search and action control bar */}
          <div className="flex items-center gap-4">
            {/* Top contacts displayed inline */}
            <div className="hidden xl:flex items-center gap-4 text-[10px] text-slate-400 font-mono font-semibold tracking-wide border-r border-slate-200 pr-4">
              <span>📍 Ster Park</span>
              <span>📞 015 023 0600</span>
            </div>

            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Live system index search..." 
                className="bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs pl-8 pr-4 py-1.5 w-44 lg:w-56 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                readOnly
                title="Global portal index lookup"
                value="System Online Logged"
              />
            </div>

            {/* Icon trigger buttons */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 cursor-pointer" title="System alerts notification list">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {/* Dynamic perspective primary actions trigger helper */}
            <div>
              {roleMode === 'parent' && (
                <button 
                  onClick={() => setRoleMode('enrolment')}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors shadow-xs cursor-pointer"
                >
                  Enroll New Child
                </button>
              )}
              {roleMode === 'admin' && (
                <button 
                  onClick={() => handleSendNotice('Sarah Mbeki', 2500)}
                  className="bg-slate-900 text-indigo-50 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  Dispatch Arrears Notice
                </button>
              )}
              {roleMode === 'teacher' && (
                <button 
                  onClick={() => {
                    handleAddTheme({
                      title: 'Ocean Life Exploration',
                      description: 'Interactive lesson themes reviewing maritime ecosystems, dolphins class activities, and water science.',
                      weekNo: 25,
                      activities: ['Water tray play', 'Sponge printing', 'Ocean floor soundscapes']
                    });
                    setNoticeAlert({
                      show: true,
                      msg: 'Dispatched marine biology lesson plan parameters inside parent portals!'
                    });
                    setTimeout(() => setNoticeAlert(null), 3000);
                  }}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  Log Week 25 Theme
                </button>
              )}
              {roleMode === 'enrolment' && (
                <button 
                  onClick={() => setRoleMode('parent')}
                  className="bg-slate-250 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                >
                  Back To Parent Portal
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE BODY COMPOSITION */}
        <main className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={roleMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {roleMode === 'parent' && (
                <ParentDashboard
                  learner={activeStudent}
                  profile={parentProfile}
                  reports={progressReports}
                  payments={paymentHistory}
                  chatHistory={chatHistory}
                  events={events}
                  journalPosts={journalPosts}
                  themes={themes}
                  onAddMessage={handleParentAddMessage}
                  onRsvpEvent={handleRsvpEvent}
                  onAddPayment={handleAddPayment}
                />
              )}

              {roleMode === 'admin' && (
                <AdminDashboard
                  learners={learners}
                  enrolments={enrolments}
                  events={events}
                  payments={paymentHistory}
                  onAddEvent={handleAddEvent}
                  onApproveEnrolment={handleApproveEnrolment}
                  onSendNotice={handleSendNotice}
                />
              )}

              {roleMode === 'teacher' && (
                <TeacherDashboard
                  learners={learners}
                  themes={themes}
                  reports={progressReports}
                  chats={chatHistory}
                  onUpdateAttendance={handleUpdateAttendance}
                  onUpdateMilestones={handleUpdateMilestones}
                  onSaveReport={handleSaveReport}
                  onAddTheme={handleAddTheme}
                  onSendMessage={handleTeacherAddMessage}
                />
              )}

              {roleMode === 'enrolment' && (
                <EnrolmentWizard
                  onComplete={handleWizardComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer references to school terms & regulations */}
          <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400 font-mono font-semibold flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2025 Kiddies Town ECD & Academy. All Rights Reserved. Compliant with POPI Act Guidelines.</p>
            <p className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors">
              <Facebook className="w-3.5 h-3.5" />
              <a href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Follow Kiddies Town on Facebook
              </a>
            </p>
          </footer>
        </main>
      </div>

      {/* Global Interactive Success Alert Floating Indicator */}
      {noticeAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-slate-100 px-5 py-4 rounded-xl shadow-xl border border-slate-800 flex items-start gap-3.5 max-w-sm">
          <span className="p-1.5 bg-slate-800 text-slate-300 rounded-lg">
            <Award className="w-5 h-5 text-indigo-400" />
          </span>
          <div>
            <h5 className="font-extrabold text-xs text-white">System Notice Dispatched</h5>
            <p className="text-[11px] mt-1 text-slate-400 leading-relaxed font-semibold">{noticeAlert.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
