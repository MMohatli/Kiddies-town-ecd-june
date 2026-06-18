import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Users, User, Shield, CheckCircle2, AlertCircle, Key, Sparkles, Smile, UserPlus, LogIn, ChevronRight } from 'lucide-react';
import KiddiesTownLogo from './KiddiesTownLogo';
import FloatingBalloons from './FloatingBalloons';

interface LoginPageProps {
  initialRole?: 'parent' | 'admin' | 'teacher';
  onLoginSuccess: (user: { role: 'parent' | 'admin' | 'teacher'; name: string; email: string }) => void;
  onCancel: () => void;
}

export default function LoginPage({ initialRole = 'parent', onLoginSuccess, onCancel }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'admin' | 'teacher'>(initialRole);
  
  // Registration and Authentication inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Demo preflight accounts
  const rolePresets = {
    parent: {
      name: "Sarah Mbeki",
      email: "parent@kiddiestown.co.za",
      password: "parent",
      roleLabel: "Parent Profile",
      desc: "Sarah M. linked to child Leo Mbeki (Grade R)",
      color: "indigo",
      bgStyle: "bg-indigo-50 border-indigo-200 text-indigo-700",
      accentBg: "bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs"
    },
    teacher: {
      name: "Teacher Anne",
      email: "teacher@kiddiestown.co.za",
      password: "teacher",
      roleLabel: "Classroom Instructor",
      desc: "Anne, lead mentor for Tigers Class (4-5 Years)",
      color: "emerald",
      bgStyle: "bg-emerald-50 border-emerald-200 text-emerald-700",
      accentBg: "bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs"
    },
    admin: {
      name: "Shineon M.",
      email: "admin@kiddiestown.co.za",
      password: "admin",
      roleLabel: "Chief Principal / Board Auditor",
      desc: "Shineon M. with absolute database & regulatory override",
      color: "amber",
      bgStyle: "bg-amber-50 border-amber-200 text-amber-700",
      accentBg: "bg-amber-600 hover:bg-amber-700 font-extrabold text-xs"
    }
  };

  const currentConfig = rolePresets[selectedRole];

  const handleQuickFill = (role: 'parent' | 'admin' | 'teacher') => {
    setSelectedRole(role);
    setEmail(rolePresets[role].email);
    setPassword(rolePresets[role].password);
    setError(null);
    setActiveTab('signin');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Please provide an email or school username");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please key in your security credentials");
      setLoading(false);
      return;
    }

    if (activeTab === 'signup' && !fullName) {
      setError("Please state your Full Name to register your school credentials");
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signin') {
        // Fetch to Real Authentication route in server.ts
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: selectedRole })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setSuccessMessage(`Welcome back, ${data.user.name}!`);
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 1200);
        } else {
          setError(data.error || "The credentials provided do not match the authorized profile.");
          setLoading(false);
        }
      } else {
        // Fetch to Real Registration route in server.ts
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            role: selectedRole, 
            name: fullName 
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccessMessage(`Account created successfully! Welcome, ${data.user.name}.`);
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 1250);
        } else {
          setError(data.error || "Failed to create account. Please try a different email.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError("Unable to complete transaction. Please check your local connection.");
      setLoading(false);
    }
  };

  return (
    <div id="login_screen_container" className="min-h-[85vh] relative overflow-hidden isolate flex items-center justify-center p-2 sm:p-6 select-none">
      <FloatingBalloons count={8} seed={10} />
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 relative">
        
        {/* Splash Accent Wave */}
        <div className={`h-2.5 w-full transition-colors duration-500 bg-${currentConfig.color}-500`} />

        {/* Brand Banner Title */}
        <div className="p-6 md:p-8 text-center bg-slate-50/50">
          <div className="flex justify-center mb-3">
            <div className="relative shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300">
              <KiddiesTownLogo className="w-14 h-14 border-2 border-slate-200 bg-white shadow-md rounded-full" />
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">KIDDIES TOWN PORTAL GATEWAY</h2>
          <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-mono">
            Compliant Academic Access • Ster Park Campus
          </p>

          {/* SIGN IN / SIGN UP TABS SELECTOR */}
          <div className="mt-5 p-1 bg-slate-200/65 rounded-xl grid grid-cols-2 max-w-[280px] mx-auto border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signup' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </button>
          </div>
        </div>

        {/* Main interactive form */}
        <div className="p-6 md:p-8 space-y-5">
          
          {/* SECURE PERSPECTIVE TOGGLE */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-2 px-1">
              Select Your School Role Workspace
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['parent', 'teacher', 'admin'] as const).map((r) => {
                const config = rolePresets[r];
                const isSel = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setError(null);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all cursor-pointer ${
                      isSel 
                        ? `bg-${config.color}-50/90 border-${config.color}-300 text-${config.color}-700 shadow-xs scale-[1.01] ring-2 ring-${config.color}-500/10` 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {r === 'parent' && <User className="w-4.5 h-4.5 mb-1" />}
                    {r === 'teacher' && <Users className="w-4.5 h-4.5 mb-1" />}
                    {r === 'admin' && <Shield className="w-4.5 h-4.5 mb-1" />}
                    <span className="text-[11px] font-extrabold capitalize select-none">{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success_block"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-6 rounded-2xl border text-center ${currentConfig.bgStyle}`}
              >
                <div className="inline-flex p-3 bg-white rounded-full shadow-xs mb-3">
                  <CheckCircle2 className={`w-7 h-7 text-${selectedRole === 'parent' ? 'indigo' : selectedRole === 'teacher' ? 'emerald' : 'amber'}-600 animate-bounce`} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wide">Validation Successful</h4>
                <p className="text-xs font-semibold text-slate-650 mt-1.5">
                  {successMessage} Loading secure academic views...
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form_block"
                onSubmit={handleAuthSubmit}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Full name field when signing up */}
                {activeTab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sipho Nkosi"
                        className="w-full text-xs font-semibold bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-all"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Entry */}
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1">
                    Academic ID / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activeTab === 'signup' ? `Enter new email for ${selectedRole}` : currentConfig.email}
                      className="w-full text-xs font-semibold bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Entry */}
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1 flex justify-between">
                    <span>Authorized Key Code / Password</span>
                    {activeTab === 'signin' && (
                      <span className="text-slate-400 font-semibold font-mono tracking-normal">Pass: "{selectedRole}"</span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs font-semibold bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Alert Warning Box */}
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-rose-700 font-semibold leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Action Block */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full text-center text-slate-550 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-black py-3 px-4 cursor-pointer select-none transition-colors border border-slate-200"
                    disabled={loading}
                  >
                    Return Home
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 text-white rounded-xl text-xs font-black py-3 px-4 transition-all shadow-md shadow-slate-100 cursor-pointer select-none ${currentConfig.accentBg}`}
                  >
                    {loading ? (
                      <span className="w-4.5 h-4.5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>{activeTab === 'signin' ? 'Verify Credentials' : 'Create & Login'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* DEMO ACCOUNTS PRE-FLIGHT SHORTCUTS FOR CONVENIENT USER TESTING */}
        <div className="p-6 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
            <h5 className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-slate-650">
              Quick Preflight Sandbox Accounts (Click to Fill)
            </h5>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {(['parent', 'teacher', 'admin'] as const).map((r) => {
              const preset = rolePresets[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleQuickFill(r)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex justify-between items-center bg-white ${
                    isSelected 
                      ? `border-${preset.color}-300 hover:bg-${preset.color}-50/30 ring-1 ring-${preset.color}-400/20 shadow-xs` 
                      : 'border-slate-200/95 hover:bg-slate-50'
                  }`}
                  title={`Instantly pre-populate and authorize matching inputs for ${preset.name}`}
                >
                  <div className="leading-snug">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[#1f2937]">{preset.name}</span>
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded-sm font-extrabold font-mono uppercase bg-slate-100 text-slate-500 ${
                        r === 'parent' ? 'text-indigo-600 bg-indigo-50/55' : r === 'teacher' ? 'text-emerald-600 bg-emerald-50/55' : 'text-amber-600 bg-amber-50/55'
                      }`}>
                        {r}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-none">
                      {preset.desc}
                    </p>
                  </div>
                  <div className={`p-1.5 bg-${preset.color}-50 text-${preset.color}-600 rounded-lg shrink-0 flex items-center justify-center`}>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
