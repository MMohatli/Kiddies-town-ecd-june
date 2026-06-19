import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, User, ShieldAlert, Truck, Scale, UploadCloud, ChevronRight, 
  ChevronLeft, Sparkles, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import { Learner, ParentProfile, MedicalProfile, TransportDetails, Consents, EnrolmentApplication, ClassType } from '../types';

interface EnrolmentWizardProps {
  onComplete: (app: EnrolmentApplication) => void;
  parentProfile?: ParentProfile;
}

export default function EnrolmentWizard({ onComplete, parentProfile }: EnrolmentWizardProps) {
  const [step, setStep] = useState(1);

  // Success screen state
  const [isSuccess, setIsSuccess] = useState(false);

  // SIGNATURE DRAWING PAD STATES & HANDLERS
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#312e81'; // Deep Indigo ink color

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // STEP STATE REDUCERS
  // Step 1: Child details
  const [enrolmentType, setEnrolmentType] = useState('New Enrolment');
  const [careRequired, setCareRequired] = useState('Full Day');
  const [firstNames, setFirstNames] = useState('');
  const [surname, setSurname] = useState('');
  const [prefName, setPrefName] = useState('');
  const [dob, setDob] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [language, setLanguage] = useState('English');
  const [religion, setReligion] = useState('Christian');
  const [systemClass, setSystemClass] = useState<ClassType | 'N/A'>('N/A');

  // Dynamically assign class based on age derived from DOB
  useEffect(() => {
    if (!dob) {
      setSystemClass('N/A');
      return;
    }
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const estAge = currentYear - birthYear;

    if (estAge <= 3) {
      setSystemClass('Roses');
    } else if (estAge === 4) {
      setSystemClass('Giraffes');
    } else {
      setSystemClass('Tigers');
    }
  }, [dob]);

  // Step 2: Parent details
  const [maritalStatus, setMaritalStatus] = useState('Married');
  const [childLivesWith, setChildLivesWith] = useState('Both Parents');
  
  // Mother states
  const [mName, setMName] = useState('');
  const [mSurname, setMSurname] = useState('');
  const [mId, setMId] = useState('');
  const [mCell, setMCell] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mOcc, setMOcc] = useState('');
  const [mEmp, setMEmp] = useState('');

  // Father states
  const [fName, setFName] = useState('');
  const [fSurname, setFSurname] = useState('');
  const [fId, setFId] = useState('');
  const [fCell, setFCell] = useState('');
  const [fEmail, setFEmail] = useState('');

  const [address, setAddress] = useState('');

  // Prefill Parent Profile details from logged-in session info
  useEffect(() => {
    if (parentProfile) {
      if (parentProfile.maritalStatus) setMaritalStatus(parentProfile.maritalStatus);
      if (parentProfile.childLivesWith) setChildLivesWith(parentProfile.childLivesWith);
      if (parentProfile.address) setAddress(parentProfile.address);
      
      if (parentProfile.mother) {
        if (parentProfile.mother.firstNames) setMName(parentProfile.mother.firstNames);
        if (parentProfile.mother.surname) setMSurname(parentProfile.mother.surname);
        if (parentProfile.mother.idNumber) setMId(parentProfile.mother.idNumber);
        if (parentProfile.mother.cellNo) setMCell(parentProfile.mother.cellNo);
        if (parentProfile.mother.email) setMEmail(parentProfile.mother.email);
        if (parentProfile.mother.occupation) setMOcc(parentProfile.mother.occupation);
        if (parentProfile.mother.employer) setMEmp(parentProfile.mother.employer);
      }
      
      if (parentProfile.father) {
        if (parentProfile.father.firstNames) setFName(parentProfile.father.firstNames);
        if (parentProfile.father.surname) setFSurname(parentProfile.father.surname);
        if (parentProfile.father.idNumber) setFId(parentProfile.father.idNumber);
        if (parentProfile.father.cellNo) setFCell(parentProfile.father.cellNo);
        if (parentProfile.father.email) setFEmail(parentProfile.father.email);
      }
    }
  }, [parentProfile]);

  // LISTEN TO DEMO CONSOLE AUTOFILL TRIGGER (HIGH FIDELITY PRESENTATION METHOD)
  useEffect(() => {
    const handleAutofillWizard = (e: Event) => {
      const customEvent = e as CustomEvent;
      const data = customEvent.detail || {};
      if (data.firstNames) setFirstNames(data.firstNames);
      if (data.surname) setSurname(data.surname);
      if (data.dob) setDob(data.dob);
      if (data.idNumber) setIdNumber(data.idNumber);
      if (data.prefName) setPrefName(data.prefName);
      if (data.gender) setGender(data.gender);
      if (data.language) setLanguage(data.language);
      if (data.religion) setReligion(data.religion);

      if (data.mName) setMName(data.mName);
      if (data.mSurname) setMSurname(data.mSurname);
      if (data.mId) setMId(data.mId);
      if (data.mCell) setMCell(data.mCell);
      if (data.mEmail) setMEmail(data.mEmail);
      if (data.mOcc) setMOcc(data.mOcc);
      if (data.mEmp) setMEmp(data.mEmp);

      if (data.fName) setFName(data.fName);
      if (data.fSurname) setFSurname(data.fSurname);
      if (data.fId) setFId(data.fId);
      if (data.fCell) setFCell(data.fCell);

      if (data.signerName) {
        setSignerName(data.signerName);
        // Draw elegant mockup signature on canvas
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = 'italic bold 28px "Georgia", "Playfair Display", serif';
              ctx.fillStyle = '#1e1b4b'; // dark ink
              ctx.fillText(data.signerName, 30, 55);
              // Dynamic line decoration
              ctx.beginPath();
              ctx.strokeStyle = '#4f46e5';
              ctx.lineWidth = 2;
              ctx.moveTo(25, 68);
              ctx.quadraticCurveTo(80, 75, 150, 68);
              ctx.quadraticCurveTo(200, 58, canvas.width - 30, 72);
              ctx.stroke();
            }
          }
        }, 300);
      }
      
      setUploadedBirth(true);
      setUploadedImmun(true);
      setUploadedIds(true);
      setUploadedResidence(true);
      setEmergencyConsent(true);
      setSignIndemnity(true);
      setSignFinance(true);
      setSignPopi(true);
      setStep(5); // Instantly jump to consent step to showcase drawing signature
    };

    window.addEventListener('autofill-enrolment-wizard', handleAutofillWizard);
    return () => window.removeEventListener('autofill-enrolment-wizard', handleAutofillWizard);
  }, []);

  // Step 3: Medical profile
  const [familyDoc, setFamilyDoc] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [hasAsthma, setHasAsthma] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasEpilepsy, setHasEpilepsy] = useState(false);
  const [hasMurmur, setHasMurmur] = useState(false);
  const [allergiesText, setAllergiesText] = useState('');
  const [emergencyConsent, setEmergencyConsent] = useState(false);

  // Step 4: Aftercare Logistics
  const [isTransportNeeded, setIsTransportNeeded] = useState(false);
  const [pickUpPoint, setPickUpPoint] = useState('');
  const [pickUpTime, setPickUpTime] = useState('07:00 AM');
  const [dropOffPerson, setDropOffPerson] = useState('');
  const [collectPerson, setCollectPerson] = useState('');

  // Step 5: Consents & Signature
  const [signIndemnity, setSignIndemnity] = useState(false);
  const [signPopi, setSignPopi] = useState(false);
  const [signFinance, setSignFinance] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState(2500);
  const [paymentDay, setPaymentDay] = useState<'15th' | '20th' | '25th' | '31st'>('15th');
  const [signerName, setSignerName] = useState('');

  // Step 6: Documents Mock uploaded
  const [uploadedBirth, setUploadedBirth] = useState(false);
  const [uploadedImmun, setUploadedImmun] = useState(false);
  const [uploadedIds, setUploadedIds] = useState(false);
  const [uploadedResidence, setUploadedResidence] = useState(false);

  const handleSubmitWizard = () => {
    const finalApp: EnrolmentApplication = {
      id: 'enrol-new-' + Date.now(),
      childParticulars: {
        id: 'student-new-' + Date.now(),
        surname: surname || 'Unknown',
        firstNames: firstNames || 'Unknown',
        preferredName: prefName || firstNames || 'Unknown',
        dob: dob || '2020-01-01',
        idNumber: idNumber || '1203095345082',
        gender: gender,
        homeLanguage: language,
        religion: religion,
        classType: systemClass === 'N/A' ? 'Tigers' : systemClass,
        attendanceStatus: 'Pending'
      },
      parentParticulars: {
        name: `${mName || 'Parent'} ${mSurname || ''}`,
        email: mEmail,
        phone: mCell,
        address: address,
        maritalStatus: maritalStatus,
        childLivesWith: childLivesWith
      },
      medicalProfile: {
        familyDoctor: familyDoc,
        doctorPhone: docPhone,
        diabetes: hasDiabetes,
        asthma: hasAsthma,
        epilepsy: hasEpilepsy,
        cardiacMurmur: hasMurmur,
        lifeThreateningAllergies: allergiesText,
        emergencyConsent: emergencyConsent
      },
      transportDetails: {
        needed: isTransportNeeded,
        pickUpPoint: pickUpPoint,
        pickUpTime: pickUpTime,
        dropOffPerson: dropOffPerson,
        collectPerson: collectPerson,
        otherAuthorizedCollectors: []
      },
      consents: {
        indemnitySigned: signIndemnity,
        popiActSigned: signPopi,
        financialAgreementSigned: signFinance,
        monthlyAmount: monthlyAmount,
        paymentDay: paymentDay,
        monthlyPayerSignatureName: signerName
      },
      uploadedFiles: {
        birthCertificate: uploadedBirth,
        immunisationCard: uploadedImmun,
        parentIds: uploadedIds,
        proofOfResidence: uploadedResidence
      },
      step: 6,
      status: 'In Review',
      dateApplied: new Date().toISOString().split('T')[0]
    };

    onComplete(finalApp);
    setIsSuccess(true);
  };

  const stepsList = [
    { no: 1, label: 'Child Particulars' },
    { no: 2, label: 'Parent Details' },
    { no: 3, label: 'Medical Profile' },
    { no: 4, label: 'Logistics' },
    { no: 5, label: 'Consents' },
    { no: 6, label: 'Upload & Review' }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
      
      {/* SUCCESS SCREEN */}
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Application Filed Successfully!</h2>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-md mx-auto mt-2.5">
            Thank you for enrolling at Kiddies Town ECD & Academy. Your registration has been dispatched to the school board. You will receive an SMS and email notification upon approval.
          </p>

          <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 max-w-sm mx-auto text-left text-xs font-medium text-slate-600 space-y-2">
            <p className="font-bold text-indigo-950 text-center text-sm mb-2">Registration Overview</p>
            <p>Learner Name: <span className="font-bold text-slate-800">{firstNames} {surname}</span></p>
            <p>Allocated Class: <span className="font-bold text-indigo-700">{systemClass} Room</span></p>
            <p>Parent Contact: <span className="font-mono text-slate-800">{mCell || fCell}</span></p>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              // reset fields
              setFirstNames('');
              setSurname('');
              setDob('');
            }}
            className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold tracking-wide rounded-xl text-xs cursor-pointer"
          >
            Register Another Child
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 mb-8 text-center sm:text-left">
            <span className="text-[10px] font-bold font-mono text-indigo-600 tracking-widest uppercase bg-slate-100 px-2.5 py-1 rounded">
              School Enrolment Wizard
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-3">Kiddies Town Enrolment Form</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Please fill in all sections below to submit an application for your child.</p>
          </div>

          {/* Stepper Dots Indicators */}
          <div className="flex justify-between items-center gap-1.5 mb-10 overflow-x-auto pb-4 sm:pb-0">
            {stepsList.map((s) => {
              const isActive = s.no === step;
              const isCompleted = s.no < step;
              return (
                <div key={s.no} className="flex items-center gap-1.5 shrink-0 select-none">
                  <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 text-white stroke-[3.5]" /> : s.no}
                  </div>
                  <span className={`text-[11px] font-bold hidden md:block ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 font-semibold'
                  }`}>
                    {s.label}
                  </span>
                  {s.no < 6 && <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />}
                </div>
              );
            })}
          </div>

          {/* RENDERING SEPARATE STEPS INLINED FOR COMPACT EXQUISITE CODE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="space-y-6 text-xs font-semibold text-slate-600"
            >
              {/* STEP 1: CHILD PARTICULARS */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">1. Child Particulars</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Allocates class type automatically based on derived birthday age.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Enrolment Type</label>
                      <select
                        value={enrolmentType}
                        onChange={(e) => setEnrolmentType(e.target.value)}
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
                      >
                        <option value="New Enrolment">New Enrolment</option>
                        <option value="Re-Enrolment">Re-Enrolment / Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Care Required</label>
                      <select
                        value={careRequired}
                        onChange={(e) => setCareRequired(e.target.value)}
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
                      >
                        <option value="Full Day">Full Day program (R2,500/mo)</option>
                        <option value="Half Day">Half Day program (R2,200/mo to 13:00)</option>
                        <option value="Aftercare Only">Aftercare Only (R950/mo with snacks)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">First Names (As birth certificate)</label>
                      <input
                        type="text" value={firstNames} onChange={(e) => setFirstNames(e.target.value)}
                        placeholder="e.g. Leo Thabo"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Surname / Family Surname</label>
                      <input
                        type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
                        placeholder="Mbeki"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Preferred Name / Nickname</label>
                      <input
                        type="text" value={prefName} onChange={(e) => setPrefName(e.target.value)}
                        placeholder="What should we call the child?"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                      <input
                        type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Child ID Number / Passport</label>
                      <input
                        type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="13-digit National ID"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Home Language</label>
                      <input
                        type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
                        placeholder="e.g. Setswana / English"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Religion</label>
                      <input
                        type="text" value={religion} onChange={(e) => setReligion(e.target.value)}
                        placeholder="e.g. None / Christian"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Class assignment preview block */}
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between gap-4 mt-6">
                    <div>
                      <p className="font-bold text-indigo-950 text-xs">Derived System Class Assignment</p>
                      <p className="text-[11px] mt-0.5 text-indigo-600 font-semibold font-mono">
                        {systemClass === 'N/A' ? 'Awaiting Date of Birth...' : `Allocated: ${systemClass} Class Group`}
                      </p>
                    </div>
                    <span className="text-2xl">
                      {systemClass === 'Roses' ? '🌹' : systemClass === 'Giraffes' ? '🦒' : systemClass === 'Tigers' ? '🐯' : '👶'}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: PARENT / GUARDIAN COMPILATIONS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">2. Parent / Guardian Particulars</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Emergency point information required for background. Both parents if applicable.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marital Status of Parents</label>
                      <input
                        type="text" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}
                        placeholder="e.g. Married, Single, Divorced"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Child Lives With</label>
                      <input
                        type="text" value={childLivesWith} onChange={(e) => setChildLivesWith(e.target.value)}
                        placeholder="e.g. Both Parents, Mother"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Mother particulars block */}
                  <div className="border border-slate-150 rounded-2xl p-4.5 bg-slate-50/50">
                    <h4 className="font-extrabold text-xs text-indigo-950 mb-3 border-b pb-1">Mother's Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">First Names</label>
                        <input
                          type="text" value={mName} onChange={(e) => setMName(e.target.value)}
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Surname</label>
                        <input
                          type="text" value={mSurname} onChange={(e) => setMSurname(e.target.value)}
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cell Number</label>
                        <input
                          type="text" value={mCell} onChange={(e) => setMCell(e.target.value)}
                          placeholder="e.g. 081 545 3500"
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">National ID Number</label>
                        <input
                          type="text" value={mId} onChange={(e) => setMId(e.target.value)}
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 font-mono focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</label>
                        <input
                          type="email" value={mEmail} onChange={(e) => setMEmail(e.target.value)}
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Employer / Work Company</label>
                        <input
                          type="text" value={mEmp} onChange={(e) => setMEmp(e.target.value)}
                          className="bg-white border w-full px-2.5 py-1.5 rounded-lg text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Residential Physical Address</label>
                    <input
                      type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 7 Grimm Street, Ster Park, Polokwane"
                      className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: MEDICAL PROFILE */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">3. Medical Profile & Emergencies</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Important details to verify health and safety. Epipen guides and inhaler logs.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Family Doctor Name</label>
                      <input
                        type="text" value={familyDoc} onChange={(e) => setFamilyDoc(e.target.value)}
                        placeholder="Dr. Melusi Khoza"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Contact Phone</label>
                      <input
                        type="text" value={docPhone} onChange={(e) => setDocPhone(e.target.value)}
                        placeholder="e.g. 015 023 1111"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Health checks list checkboxes */}
                  <div className="p-4.5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-3">
                    <h4 className="font-extrabold text-xs text-indigo-950 border-b pb-1 mb-2">Health Conditions</h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox" checked={hasDiabetes} onChange={(e) => setHasDiabetes(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 rounded"
                        />
                        <span>Diabetes</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox" checked={hasAsthma} onChange={(e) => setHasAsthma(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 rounded"
                        />
                        <span>Asthma</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox" checked={hasEpilepsy} onChange={(e) => setHasEpilepsy(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 rounded"
                        />
                        <span>Epilepsy</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox" checked={hasMurmur} onChange={(e) => setHasMurmur(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 rounded"
                        />
                        <span>Cardiac Murmur</span>
                      </label>
                    </div>

                    <div className="pt-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Life-Threatening Allergies</label>
                      <input
                        type="text" value={allergiesText} onChange={(e) => setAllergiesText(e.target.value)}
                        placeholder="e.g. Peanuts, Shellfish, Bees"
                        className="bg-white border w-full px-3 py-2 rounded-xl text-slate-800 focus:outline-hidden font-semibold"
                      />
                    </div>
                  </div>

                  {/* Emergency consent */}
                  <label className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 cursor-pointer select-none text-rose-900 mt-4 leading-relaxed font-semibold">
                    <input
                      type="checkbox" checked={emergencyConsent} onChange={(e) => setEmergencyConsent(e.target.checked)}
                      className="w-5 h-5 accent-rose-700 rounded mt-0.5 shrink-0"
                    />
                    <span className="text-xs">
                      I/We hereby grant consent for emergency medical treatment by staff members if the family physician is unavailable.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 4: TRANSPORT LOGISTICS */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">4. Pickup Logistics & Transport</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Select if you need of the Kiddies Town shuttle service (Arranged CBD/Ster Park pick ups).</p>
                  </div>

                  {/* Transport need trigger */}
                  <div className="p-4.5 border rounded-2xl space-y-3.5 bg-slate-50/50">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-extrabold text-indigo-950 select-none">
                      <input
                        type="checkbox" checked={isTransportNeeded} onChange={(e) => setIsTransportNeeded(e.target.checked)}
                        className="w-5 h-5 accent-indigo-600 rounded"
                      />
                      <span>Transport Service Needed? (Weekly pick-ups)</span>
                    </label>

                    {isTransportNeeded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/50"
                      >
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pick-up Zone / Point</label>
                          <input
                            type="text" value={pickUpPoint} onChange={(e) => setPickUpPoint(e.target.value)}
                            placeholder="e.g. 15 Hospital Road"
                            className="bg-white border w-full px-3 py-2 rounded-xl text-slate-800 focus:outline-hidden"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Desired Pick-up Time</label>
                          <input
                            type="text" value={pickUpTime} onChange={(e) => setPickUpTime(e.target.value)}
                            placeholder="07:00 AM"
                            className="bg-white border w-full px-3 py-2 rounded-xl text-slate-808 font-mono focus:outline-hidden"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Who will drop off child?</label>
                      <input
                        type="text" value={dropOffPerson} onChange={(e) => setDropOffPerson(e.target.value)}
                        placeholder="e.g. Mother"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Who will collect child?</label>
                      <input
                        type="text" value={collectPerson} onChange={(e) => setCollectPerson(e.target.value)}
                        placeholder="e.g. Uncle Thabo"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CONSENTS & SIGNATURES */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">5. Consents & Agreements</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Please read the financial and indemnity policies carefully before registering.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
                      <input
                        type="checkbox" checked={signIndemnity} onChange={(e) => setSignIndemnity(e.target.checked)}
                        className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
                      />
                      <span>
                        <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">Indemnity Agreement:</strong>
                        I/We grant permission for my child to participate in out-of-school excursions and play on school grounds under supervised care guidelines.
                      </span>
                    </label>

                    <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
                      <input
                        type="checkbox" checked={signPopi} onChange={(e) => setSignPopi(e.target.checked)}
                        className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
                      />
                      <span>
                        <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">POPI Act Agreement:</strong>
                        I/We grant permission to take pictures or capture videos for educational portfolio displays. No photos will be sold.
                      </span>
                    </label>

                    <label className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl flex items-start gap-2.5 cursor-pointer select-none leading-relaxed text-slate-600">
                      <input
                        type="checkbox" checked={signFinance} onChange={(e) => setSignFinance(e.target.checked)}
                        className="w-4.5 h-4.5 accent-indigo-600 rounded mt-0.5 shrink-0"
                      />
                      <span>
                        <strong className="text-indigo-950 block text-[11px] font-extrabold mb-0.5">Financial Agreement:</strong>
                        I recognize the registration fee of R600 is non-refundable. Monthly fees are payable before the 3rd of each month. In Late payments beyond 7th, late penalties of R250 occur.
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Payment Date</label>
                      <select
                        value={paymentDay}
                        onChange={(e) => setPaymentDay(e.target.value as any)}
                        className="bg-slate-50 border w-full px-3 py-2.5 border-slate-200 rounded-xl text-slate-705 focus:outline-hidden font-semibold"
                      >
                        <option value="15th">15th of each month</option>
                        <option value="20th">20th of each month</option>
                        <option value="25th">25th of each month</option>
                        <option value="31st">31st of each month</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Authorized Signature Name</label>
                      <input
                        type="text" value={signerName} onChange={(e) => setSignerName(e.target.value)}
                        placeholder="e.g. Sarah Mbeki"
                        className="bg-slate-50 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-808 font-bold focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* HIGH FIDELITY CANVAS SIGNATURE INTEGRATION */}
                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Interactive Hand-drawn Digital Signature
                      </label>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-xs font-bold text-indigo-650 hover:text-red-500 font-mono transition-all cursor-pointer select-none"
                      >
                        [ Clear Signature Pad ]
                      </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden" style={{ height: '110px' }}>
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={110}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full cursor-crosshair block absolute top-0 left-0 z-10"
                        id="wizard-signature-canvas"
                      />
                      {!signerName && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[11px] font-medium leading-normal text-center select-none p-4">
                          Draw your signature here with your cursor or finger / Or use the Presentation Console to prefill
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 font-medium">This hand-drawn digital signature is secure and bound to school records for POPI auditing compliance.</p>
                  </div>
                </div>
              )}

              {/* STEP 6: FILE UPLOADS & FINAL REVIEW */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-50 pb-2">
                    <h3 className="text-sm font-extrabold text-indigo-950">6. Required Document Uploads & Review</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Please upload certified copies to complete the registration review cycle.</p>
                  </div>

                  {/* Upload grid boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { state: uploadedBirth, setter: setUploadedBirth, label: "Child's Birth Certificate", file: 'birth_cert.pdf' },
                      { state: uploadedImmun, setter: setUploadedImmun, label: "Child's Immunisation Card", file: 'immun_card.pdf' },
                      { state: uploadedIds, setter: setUploadedIds, label: "Certified Parent ID Documents", file: 'parent_ids.pdf' },
                      { state: uploadedResidence, setter: setUploadedResidence, label: "Proof of Residential Address", file: 'proof_residence.pdf' }
                    ].map((up, idx) => (
                      <div
                        key={idx}
                        onClick={() => up.setter(!up.state)}
                        className={`p-4 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center select-none cursor-pointer transition-all ${
                          up.state
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <UploadCloud className={`w-8 h-8 ${up.state ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <p className="font-bold text-[11px] mt-1.5">{up.label}</p>
                        {up.state ? (
                          <span className="text-[9px] font-mono mt-1 font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3.5]" /> File: {up.file} (Ready)
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400 mt-1">Click to mock upload file</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Final Review table info summary specs */}
                  <div className="bg-slate-50 border p-4 rounded-xl mt-6">
                    <h4 className="font-extrabold text-xs text-indigo-950 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1">
                      <span>📌</span> Final Registration Review
                    </h4>
                    <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-medium text-slate-600">
                      <p>Learner Name: <span className="text-slate-900 font-black">{firstNames || 'N/A'} {surname}</span></p>
                      <p>Class Allocation: <span className="text-indigo-700 font-bold">{systemClass} Room</span></p>
                      <p>Family ID / Passport: <span className="font-mono text-slate-800">{idNumber || 'Awaiting'}</span></p>
                      <p>Parent Signer Ref: <span className="text-slate-900 font-bold">{signerName || 'N/A'}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Buttons control */}
          <div className="flex justify-between items-center mt-10 border-t border-slate-100 pt-6">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              className={`px-4.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              PreviousStep
            </button>

            {step < 6 ? (
              <button
                onClick={() => {
                  // To facilitate smooth validation
                  if (step === 1 && (!firstNames || !surname || !dob)) {
                    alert('Please complete First Names, Surname and DOB fields.');
                    return;
                  }
                  setStep(prev => prev + 1);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                Continue to Next Details
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitWizard}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-black tracking-wide rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                SUBMIT APPLICATION
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
