import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Calendar as CalIcon, MessageSquare, BookOpen, Clock, Activity, FileText,
  User, CheckCircle2, ChevronRight, Save, Plus, Trash2, Edit
} from 'lucide-react';
import { Learner, WeeklyTheme, ProgressReport, ChatMessage } from '../types';

interface TeacherDashboardProps {
  learners: Learner[];
  themes: WeeklyTheme[];
  reports: ProgressReport[];
  chats: ChatMessage[];
  onUpdateAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Excused') => void;
  onUpdateMilestones: (studentId: string, milestones: { label: string; val: number }[]) => void;
  onSaveReport: (report: ProgressReport) => void;
  onAddTheme: (theme: WeeklyTheme) => void;
  onSendMessage: (txt: string, parentEmailAddress?: string) => void;
}

export default function TeacherDashboard({
  learners,
  themes,
  reports,
  chats,
  onUpdateAttendance,
  onUpdateMilestones,
  onSaveReport,
  onAddTheme,
  onSendMessage
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'curriculum' | 'milestones' | 'reports' | 'chat'>('attendance');
  const [selectedClass, setSelectedClass] = useState<'Roses' | 'Giraffes' | 'Tigers'>('Tigers');

  // Attendance states
  const [registerSubmitted, setRegisterSubmitted] = useState(false);

  // Curriculum State
  const [themeTitle, setThemeTitle] = useState('Safari Adventures');
  const [themeDesc, setThemeDesc] = useState('Exploring African wildlife and animal tracking.');
  const [newActivity, setNewActivity] = useState('');
  const [themeActivities, setThemeActivities] = useState<string[]>([
    'Lions craft with woolly manes',
    'Identifying animal tracks in muddy prints'
  ]);
  const [themeSuccess, setThemeSuccess] = useState(false);

  // Milestones Editor state
  const [selectedMilestoneStudentId, setSelectedMilestoneStudentId] = useState('student-leo');
  const [socialVal, setSocialVal] = useState(95);
  const [mathVal, setMathVal] = useState(82);
  const [motorVal, setMotorVal] = useState(88);
  const [langVal, setLangVal] = useState(56);
  const [milestonesSuccess, setMilestonesSuccess] = useState(false);

  // Reports Editor states
  const [selectedReportStudentId, setSelectedReportStudentId] = useState('student-leo');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3 | 4>(4);
  const [recordedAbsent, setRecordedAbsent] = useState(0);
  const [remarks, setRemarks] = useState('Leo continues to excel across all activities. He is respectful, highly creative, and fully prepared for grade school challenges.');
  const [indicators, setIndicators] = useState<Record<string, 'A' | 'D' | 'E' | 'N/O' | 'N/A'>>({
    A1: 'A', A2: 'A',
    B1: 'A',
    C1: 'D',
    D1: 'A',
    E1: 'A',
    F1: 'A',
    G1: 'A',
    H1: 'A', H2: 'A', H3: 'A', H4: 'D',
    I1: 'A',
    J1: 'A'
  });
  const [reportSuccess, setReportSuccess] = useState(false);

  // Chat Editor state
  const [chatInput, setChatInput] = useState('');
  const [selectedParentEmail, setSelectedParentEmail] = useState<string>('parent@kiddiestown.co.za');

  // Find all unique parents who have messages in active memory
  const parentThreads = useMemo(() => {
    const map = new Map<string, string>(); // email -> name
    chats.forEach(c => {
      if (c.parentEmail) {
        if (c.sender === 'Parent') {
          map.set(c.parentEmail, c.senderName);
        } else if (!map.has(c.parentEmail)) {
          const fallbackName = c.senderName.replace('Teacher Anne', 'Parent');
          map.set(c.parentEmail, fallbackName.includes('Parent') ? fallbackName : `Family ${c.parentEmail.split('@')[0]}`);
        }
      }
    });
    // Ensure default Sarah Mbeki exists
    if (!map.has('parent@kiddiestown.co.za')) {
      map.set('parent@kiddiestown.co.za', 'Sarah Mbeki');
    }
    return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
  }, [chats]);

  // Filtering students based on selected class
  const classStudents = learners.filter(l => l.classType === selectedClass);

  const handleSubmitRegister = () => {
    setRegisterSubmitted(true);
    setTimeout(() => {
      setRegisterSubmitted(false);
    }, 4000);
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setThemeActivities([...themeActivities, newActivity]);
    setNewActivity('');
  };

  const handleRemoveActivity = (idx: number) => {
    setThemeActivities(themeActivities.filter((_, i) => i !== idx));
  };

  const handleSaveTheme = () => {
    onAddTheme({
      weekNo: themes.length + 1,
      title: themeTitle,
      description: themeDesc,
      activities: themeActivities
    });
    setThemeSuccess(true);
    setTimeout(() => {
      setThemeSuccess(false);
    }, 3000);
  };

  const handleSaveMilestones = () => {
    onUpdateMilestones(selectedMilestoneStudentId, [
      { label: 'Social & Emotional', val: socialVal },
      { label: 'Numeracy (D1)', val: mathVal },
      { label: 'Fine Motor Skills (H)', val: motorVal },
      { label: 'Language / Literacy (C1)', val: langVal }
    ]);
    setMilestonesSuccess(true);
    setTimeout(() => {
      setMilestonesSuccess(false);
    }, 3000);
  };

  const handleUpdateIndicator = (key: string, val: 'A' | 'D' | 'E' | 'N/O' | 'N/A') => {
    setIndicators({ ...indicators, [key]: val });
  };

  const handleSaveReportForm = () => {
    const reportModel: ProgressReport = {
      id: `report-${selectedReportStudentId}-term${selectedTerm}-${Date.now()}`,
      learnerId: selectedReportStudentId,
      academicYear: 2025,
      term: selectedTerm,
      released: true,
      releasedDate: new Date().toISOString().split('T')[0],
      recordedDaysAbsent: recordedAbsent,
      indicators: {
        classroomBehavior: { A1_controlAndSafe: indicators.A1, A2_bathroomIndependent: indicators.A2 },
        communicationSkills: { B1_speaksClearly: indicators.B1 },
        readingWritingSkills: { C1_recognizesLetters: indicators.C1 },
        numbersMathArithmetic: { D1_countsRecognizes: indicators.D1 },
        musicArtSkills: { E1_dancesMusicSings: indicators.E1 },
        socialEmotionalSkills: { F1_sharesAndPlays: indicators.F1 },
        coloursAndShapes: { G1_colorsShapes: indicators.G1 },
        fineMotorSkills: {
          H1_pencilCrayonScissors: indicators.H1,
          H2_blocksPuzzles: indicators.H2,
          H3_bounceKickThrow: indicators.H3,
          H4_buttonsShoesClothes: indicators.H4
        },
        approachesToLearn: { I1_enjoysLearning: indicators.I1 },
        computerSkills: { J1_tabletLaptopVoice: indicators.J1 }
      },
      shortSummary: 'K4',
      teacherComments: remarks,
      teacherName: 'Teacher Anne',
      principalName: 'Mrs. Shineon'
    };

    onSaveReport(reportModel);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
    }, 3500);
  };

  const handleSendChatText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput, selectedParentEmail);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Role Title and class selector */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Teacher Management Portal</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Logged in: Teacher Anne • Lead Instructor Tigers Room</p>
        </div>

        {/* Class switcher buttons */}
        <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-semibold">
          {(['Roses', 'Giraffes', 'Tigers'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {cls} Class
            </button>
          ))}
        </div>
      </div>

      {/* Tabs list inside Teacher Portal */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-lg gap-1 overflow-x-auto self-start shadow-xs">
        {[
          { id: 'attendance', label: 'Mark Attendance', icon: Clock },
          { id: 'curriculum', label: 'Curriculum & Themes', icon: BookOpen },
          { id: 'milestones', label: 'Assess Milestones', icon: Activity },
          { id: 'reports', label: 'Quarterly Reports', icon: FileText },
          { id: 'chat', label: 'Parent Messages', icon: MessageSquare },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-slate-100 text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
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
          {/* TAB 1: ATTENDANCE CHECKLIST */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-5 border-b border-indigo-50 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Daily Attendance Register</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">{selectedClass} Class Room • Today</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                  Pending: {classStudents.filter(s => s.attendanceStatus === 'Pending').length} kids
                </span>
              </div>

              {registerSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-black text-sm">Attendance Register Submitted!</h4>
                  <p className="text-xs text-emerald-700/80 mt-1">
                    The register is now locked and synced with administrative logs. Parents were notified of arrivals automatically.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {classStudents.map((student) => (
                    <div key={student.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                          {student.firstNames[0]}{student.surname[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">{student.firstNames} {student.surname}</p>
                          <p className="text-[10px] text-slate-400 font-medium">DOB: {student.dob}</p>
                        </div>
                      </div>

                      {/* Present/Absent status switch pills */}
                      <div className="flex gap-1.5">
                        {(['Present', 'Absent', 'Excused'] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => onUpdateAttendance(student.id, opt)}
                            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                              student.attendanceStatus === opt
                                ? opt === 'Present'
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                  : opt === 'Absent'
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                  : 'bg-amber-600 border-amber-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSubmitRegister}
                    className="w-full mt-5 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-white font-bold tracking-wide text-xs cursor-pointer"
                  >
                    Submit Daily Register
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRICULUM PUBLISHER */}
          {activeTab === 'curriculum' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-5">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-indigo-50 pb-3 flex items-center gap-2">
                <span>📚</span>
                <span>Weekly Themes & Home Learning Guides</span>
              </h3>

              {themeSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-black text-sm">Weekly Theme Published!</h4>
                  <p className="text-xs text-emerald-700/80 mt-1">Parents will view this educational theme in their dashboard to support home study loops.</p>
                </motion.div>
              ) : (
                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Theme Title</label>
                    <input
                      type="text"
                      value={themeTitle}
                      onChange={(e) => setThemeTitle(e.target.value)}
                      className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Theme Overview Description</label>
                    <textarea
                      value={themeDesc}
                      onChange={(e) => setThemeDesc(e.target.value)}
                      className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-800 h-20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">In-Class Activities Checklist</label>
                    
                    <div className="space-y-2 mt-2">
                      {themeActivities.map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="text-slate-700">{act}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        placeholder="e.g. Clay sculpting lion models..."
                        className="bg-slate-50 border flex-1 px-3.5 py-2 rounded-lg text-slate-800 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddActivity}
                        className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveTheme}
                    className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl cursor-pointer"
                  >
                    Publish Weekly Theme Update
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASSESS MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Dynamic Milestones Tracker</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Adjust learning parameters to feedback into the Parent Portal readiness metrics in real time.</p>
              </div>

              {milestonesSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-black text-sm">Metrics Updated & Saved!</h4>
                  <p className="text-xs text-emerald-700/80 mt-1">New scores are now reflecting dynamically inside parent dashboards.</p>
                </motion.div>
              ) : (
                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Select Learner</label>
                    <select
                      value={selectedMilestoneStudentId}
                      onChange={(e) => setSelectedMilestoneStudentId(e.target.value)}
                      className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-700 focus:outline-hidden"
                    >
                      {learners.map(l => (
                        <option key={l.id} value={l.id}>{l.firstNames} {l.surname}</option>
                      ))}
                    </select>
                  </div>

                  {/* Range parameters */}
                  <div className="space-y-3.5 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-700">Social & Emotional Skills</span>
                        <span className="font-mono text-indigo-600 font-bold">{socialVal}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={socialVal}
                        onChange={(e) => setSocialVal(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-700">Numeracy Indicator (D1)</span>
                        <span className="font-mono text-indigo-600 font-bold">{mathVal}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={mathVal}
                        onChange={(e) => setMathVal(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-700">Fine Motor Control (H)</span>
                        <span className="font-mono text-indigo-600 font-bold">{motorVal}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={motorVal}
                        onChange={(e) => setMotorVal(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-700">Language / Literacy (C1)</span>
                        <span className="font-mono text-indigo-600 font-bold">{langVal}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={langVal}
                        onChange={(e) => setLangVal(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveMilestones}
                    className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl cursor-pointer"
                  >
                    Save & Sync Student Milestones
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUARTERLY REPORTS FOR SYSTEM */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-5">
              <div>
                <span className="text-[10px] font-bold font-mono text-indigo-500 uppercase tracking-widest block mb-0.5">Report Management</span>
                <h3 className="font-extrabold text-slate-800 text-sm">Evaluate Quarterly Academic Performance</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Set learner check rankings corresponding to Kiddies Town ECD specifications.</p>
              </div>

              {reportSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-black text-sm">Report Saved & Released!</h4>
                  <p className="text-xs text-emerald-700/80 mt-1">The report has been compiled and is now viewable by the parent in real-time.</p>
                </motion.div>
              ) : (
                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Learner Name</label>
                      <select
                        value={selectedReportStudentId}
                        onChange={(e) => setSelectedReportStudentId(e.target.value)}
                        className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-700 focus:outline-hidden"
                      >
                        {learners.map(l => (
                          <option key={l.id} value={l.id}>{l.firstNames} {l.surname}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Select Term</label>
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(Number(e.target.value) as any)}
                        className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-700 focus:outline-hidden"
                      >
                        <option value={1}>Term 1 Progress Report</option>
                        <option value={2}>Term 2 Progress Report</option>
                        <option value={3}>Term 3 Progress Report</option>
                        <option value={4}>Term 4 Progress Report</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Recorded Days Absent</label>
                    <input
                      type="number"
                      value={recordedAbsent}
                      onChange={(e) => setRecordedAbsent(Number(e.target.value))}
                      className="bg-slate-50 border w-full px-3 py-2 rounded-lg font-mono text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  {/* Core checklist items rating sliders/selectors */}
                  <div className="border border-slate-150 rounded-xl p-4 space-y-3.5 bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wide border-b border-slate-100 pb-1.5 mb-2">Selected Performance Rankings</h4>
                    
                    {[
                      { key: 'A1', label: 'Walks with reasonable control & safe movements (Classroom Behavior)' },
                      { key: 'B1', label: 'Speaks clearly with peers & teachers (Communication Skills)' },
                      { key: 'C1', label: 'Recognizes letters of alphabets (Reading / Writing)' },
                      { key: 'D1', label: 'Counts, recognizes numbers and quantify (Numeracy)' },
                    ].map((item) => (
                      <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <span className="text-slate-600 text-[11px] leading-tight flex-1 font-medium">{item.label}</span>
                        <div className="flex gap-1">
                          {(['A', 'D', 'E', 'N/O', 'N/A'] as const).map(ind => (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => handleUpdateIndicator(item.key, ind)}
                              className={`w-7 h-7 flex items-center justify-center rounded text-[10px] font-black cursor-pointer leading-none ${
                                indicators[item.key] === ind
                                  ? 'bg-indigo-600 text-white shadow-xs scale-105'
                                  : 'bg-white border text-slate-300'
                              }`}
                            >
                              {ind}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Teacher General Comments</label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="bg-slate-50 border w-full px-3 py-2 rounded-lg text-slate-800 h-20 focus:outline-hidden"
                      placeholder="Comment on developmental achievements or recommended focus areas..."
                    />
                  </div>

                  <button
                    onClick={handleSaveReportForm}
                    className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl cursor-pointer"
                  >
                    Confirm, Compile & Publish Report
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PARENT CHAT WINDOW */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl mx-auto flex flex-col justify-between min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-indigo-50 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Instant Messaging Feed</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Viewing correspondence with: <strong className="text-indigo-600">{parentThreads.find(t => t.email === selectedParentEmail)?.name || 'Parent'}</strong>
                  </p>
                </div>
                
                {/* Parent thread select dropdown */}
                <div className="flex items-center gap-1.5 self-end">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Thread:</span>
                  <select
                    value={selectedParentEmail}
                    onChange={(e) => setSelectedParentEmail(e.target.value)}
                    className="border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 outline-hidden"
                  >
                    {parentThreads.map(t => (
                      <option key={t.email} value={t.email}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat threads */}
              <div className="space-y-4 my-3 h-56 overflow-y-auto pr-1">
                {chats
                  .filter(msg => msg.parentEmail === selectedParentEmail)
                  .map((msg) => {
                    const isMe = msg.sender === 'Teacher';
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
                {chats.filter(msg => msg.parentEmail === selectedParentEmail).length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center font-semibold my-8">
                    No active messages in this folder yet.
                  </p>
                )}
              </div>

              <form onSubmit={handleSendChatText} className="flex gap-2 border-t pt-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Reply direct to ${parentThreads.find(t => t.email === selectedParentEmail)?.name || 'Parent'}...`}
                  className="flex-1 bg-slate-50 border px-3.5 py-2 rounded-xl text-xs text-slate-800 focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-white font-bold text-xs cursor-pointer"
                >
                  Send Reply
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
