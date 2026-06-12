import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Heart, Star, BookOpen, Clock, Phone, 
  MapPin, ChevronRight, Award, Compass, Users, CheckCircle, 
  Facebook, ArrowRight, ShieldAlert, GraduationCap, ChevronDown, Check, Info
} from 'lucide-react';
import KiddiesTownLogo from './KiddiesTownLogo';

interface LandingPageProps {
  onSelectRole: (role: 'parent' | 'admin' | 'teacher' | 'enrolment') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'tigers' | 'giraffes' | 'roses'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'grad' | 'fun' | 'art' | 'play'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number;
    category: string;
    title: string;
    description: string;
    longDesc: string;
    image: string;
    link: string;
  } | null>(null);

  const galleryPhotos = [
    {
      id: 1,
      category: 'grad',
      title: 'Grade R Graduation Ceremony',
      description: 'Our proud Grade R graduates (Tigers Class) wearing gowns and receiving certificates of level completion.',
      longDesc: 'Each November, we host our beautiful annual Year-End Graduation Day. Our little graduates celebrate stepping confidently into primary school. Watch them receive their awards, sing class songs, and salute early milestones.',
      image: 'https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 2,
      category: 'fun',
      title: 'Annual Ster Park Fun Walk & Picnic',
      description: 'Strengthening community bonds with parents and children under a beautiful, colorful balloon arch.',
      longDesc: 'The Kiddies Town 3km Fun Walk brings together over 150 parents, friends, and community sponsors for a scenic stroll in local Ster Park. Features include balloon structures, a face painting arena, and fresh morning fruit bowls.',
      image: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 3,
      category: 'art',
      title: 'Creative Art & Clay Finger Sciences',
      description: 'Enriching motor coordination and sensory exploration in our young Roses & Giraffes toddlers.',
      longDesc: 'Our dedicated early clay, sand play, and non-toxic paint workshops encourage child-guided tactile exploration. These interactive tasks support robust logic grids and pattern creation.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 4,
      category: 'play',
      title: 'Safe Ster Park Outdoor Play Gyms',
      description: 'Laughter, safe slides, and social interactive play under shaded, child-compliant play mats.',
      longDesc: 'Kiddies Town provides state-of-the-art jungle gyms and soft underfoot rubberized turf. Continuous active adult oversight is guaranteed by Teacher Anne and our core ECD care teams.',
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 5,
      category: 'art',
      title: 'Sensory Sandbox Archaeology',
      description: 'Syllabus-aligned sandbox treasure hunting to develop focus and teamwork among classmates.',
      longDesc: 'We introduce simple geology, geometry shapes, and mini-paleontology block matching in our sandbox arrays. It develops social collaboration and vocabulary skills.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 6,
      category: 'play',
      title: 'Toddlers Musical Sing-Along',
      description: 'Mastering phonetic structures and English vocabulary via xylophones and daily ring play circles.',
      longDesc: 'Rhythm and vocal games form the foundation of language learning. Our toddlers develop acoustic memory, focus, and pitch coordination with miniature percussion toys.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    }
  ];

  const filteredGallery = galleryCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === galleryCategory);

  const classesData = [
    {
      id: 'roses',
      name: 'Roses Nursery Group',
      ages: '1 - 2 Years Old',
      color: 'bg-rose-50 text-rose-700 border-rose-100',
      badgeColor: 'bg-rose-500',
      pillText: 'Nursery & Infant Care',
      focus: 'Fine motor skills, emotional anchoring, sensory play, language initiation',
      desc: 'Our Roses group provides an exceptionally warm, secure, and nurturing nest. We focus on child-led sensory development, safe crawling spaces, tactile objects, and cognitive sound associations.',
      activities: ['Tactile sand & water plays', 'Soft block construction', 'Daily read-aloud circles', 'Nursery rhyming exercises'],
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=65&ixlib=rb-4.0.3'
    },
    {
      id: 'giraffes',
      name: 'Giraffes Toddler Class',
      ages: '2 - 3 Years Old',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
      badgeColor: 'bg-amber-500',
      pillText: 'Interactive Exploration',
      focus: 'Expressive speech, cooperative games, shape & color sorting, toilet independence',
      desc: 'The Giraffes class is tailored for rapid exploration and social play! Children enjoy creative finger painting, puzzle matching, and early physical coordination milestones in our dedicated play gyms.',
      activities: ['Shape-sorting puzzles', 'Fine arts finger-painting', 'Guided nature trails', 'Cooperative outdoor game cycles'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=65&ixlib=rb-4.0.3'
    },
    {
      id: 'tigers',
      name: 'Tigers Grade R Prep',
      ages: '4 - 5 Years Old',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-110',
      badgeColor: 'bg-emerald-500',
      pillText: 'Grade R Readiness',
      focus: 'Emergent numeracy, structured phonics, science sandbox exploration, social confidence',
      desc: 'The Tigers classroom guides our oldest learners seamlessly into primary school readiness. Following strict South African CAPS guidelines, learners develop early writing patterns, basic maths, and robust reasoning.',
      activities: ['Emergent phonics matching', 'Sandbox archaeology digs', 'Early math sorting cycles', 'Basic coding blocks & patterns'],
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=65&ixlib=rb-4.0.3'
    }
  ];

  const filteredClasses = activeTab === 'all' 
    ? classesData 
    : classesData.filter(c => c.id === activeTab);

  const testimonials = [
    {
      text: "The Kiddies Town shuttle service is a lifesaver. My husband and I both work in Polokwane CBD, and knowing the driver picks up Thabo right on schedule makes working so stress-free.",
      author: "Nthabiseng Zulu",
      role: "High School Teacher & Mother",
      tag: "Verified Parent"
    },
    {
      text: "Seeing Leo's daily milestone charts and progress reports update in real-time has completely changed how involved we feel. We aren't just dropping him off; we are learning alongside him.",
      author: "Sarah Mbeki",
      role: "Public Service Administrator & Mother",
      tag: "Verified Parent"
    },
    {
      text: "Our child was extremely shy before joining the Giraffes class. After just three months of block construction, finger sciences, and care, her physical confidence is through the roof!",
      author: "Kabelo Molefe",
      role: "Local Banker & Father",
      tag: "Verified Parent"
    }
  ];

  const faqs = [
    {
      q: "Where is Kiddies Town located and what areas do you service?",
      a: "Our beautiful central campus is in Ster Park, Polokwane. We provide an integrated daily shuttle service that covers Polokwane CBD, Ster Park, Flora Park, and immediate surrounding suburbs."
    },
    {
      q: "Are you registered and compliant with South African ECD frameworks?",
      a: "Yes! Kiddies Town is fully registered with the Department of Basic Education (DBE). Our curriculum strictly aligns with the National Early Learning and Development Standards (NELDS) and CAPS Grade R preparation structures. We are also POPI Act compliant."
    },
    {
      q: "How can I apply for admission?",
      a: "You can apply right from this website! Simply click on the 'Apply Online' button or access the Admissions application wizard role from our navigation. It's a quick 6-step online form, with secure upload fields for immunization records and birth certificates."
    },
    {
      q: "What are the standard operational hours?",
      a: "We open every weekday from 07:00 AM to 05:30 PM. Breakfast, healthy morning fruit bowls, a warm balanced lunch, and afternoon snacks are prepared by our school dietitian and included in the base tuition."
    },
    {
      q: "How does the Parent Portal help me stay informed?",
      a: "Our integrated parent portal provides live message feeds directly to Teacher Anne and staff, offline-resilient payment history with digital receipts, automated alerts when school fee statements are due, and detailed progress reports with milestone score evaluations."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Announcement Banner */}
      <div className="bg-indigo-950 text-indigo-100/90 text-center py-2 px-4 text-xs font-semibold tracking-wider font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>GRADUATION CEREMONY & ANNUAL CONCERT: 15 NOVEMBER • TICKETS NOW AVAILABLE IN PARCEL PORTAL!</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-200">
        {/* Soft Background Gradients */}
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-radial-gradient from-indigo-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                DSD & DBE Standard Compliant ECD Center
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-indigo-950 leading-tight tracking-tight">
                Nurturing minds,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-amber-500 to-rose-500">
                  building futures
                </span> <br />
                from first steps.
              </h1>

              <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
                Kiddies Town ECD & Academy is Ster Park’s premier early learning environment. We blend professional play-based CAPS curricula with safe, accredited daily CBD transport and real-time parent tracking.
              </p>

              {/* Comprehensive Entrance CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-parent-portal-cta"
                  onClick={() => onSelectRole('parent')}
                  className="bg-indigo-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-900 transition-all shadow-md shadow-indigo-100 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                >
                  Enter Parent Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="btn-enrol-cta"
                  onClick={() => onSelectRole('enrolment')}
                  className="bg-rose-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Apply Online (Wizard)
                </button>
                <button
                  id="btn-teacher-cta"
                  onClick={() => onSelectRole('teacher')}
                  className="bg-slate-100 text-slate-700 border border-slate-200 font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Teacher Log
                </button>
              </div>

              {/* Small credentials lines */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-100 max-w-md">
                <div>
                  <h4 className="text-xl font-bold text-indigo-950 font-mono">100%</h4>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">NELDS Syllabus</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-950 font-mono">Age 1-5</h4>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Toddler Prep</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-950 font-mono">Ster Park</h4>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Central Polokwane</p>
                </div>
              </div>
            </div>

            {/* Right Graphic Card Column */}
            <div className="lg:col-span-5 relative">
              {/* Decorative items behind card */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-amber-200 rounded-full mix-blend-multiply filter blur-sm opacity-50 animate-bounce" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-200 rounded-full mix-blend-multiply filter blur-sm opacity-50" />
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-tr-3xl rounded-bl-3xl flex items-center justify-center font-black text-xs text-indigo-200 font-mono">
                  ★ STATE-OF-THE-ART
                </div>

                <div className="flex items-center gap-3.5 border-b border-slate-200 pb-5 mb-5">
                  <KiddiesTownLogo className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-100 p-0.5" />
                  <div>
                    <h3 className="text-base font-black text-indigo-950 leading-tight">Town Portal Experience</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Secure Cloud Synchronization</p>
                  </div>
                </div>

                {/* Simulated App Roster Panel */}
                <div className="space-y-3.5">
                  <div className="p-3 bg-white/90 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <span className="text-[11px] font-bold text-indigo-950 block">Leo Mbeki Roster Status</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Arrived safely with CBD Shuttle</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">07:45 AM</span>
                  </div>

                  <div className="p-3 bg-white/90 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <div>
                        <span className="text-[11px] font-bold text-indigo-950 block">Curriculum Focus: Week 25</span>
                        <span className="text-[10px] text-indigo-600 block font-semibold mt-0.5">"Ocean Life Exploration"</span>
                      </div>
                    </div>
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 bg-white/90 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div>
                        <span className="text-[11px] font-bold text-indigo-950 block">Monthly Statements & Accounts</span>
                        <span className="text-[10px] text-amber-700 block font-semibold mt-0.5">Secure auto-calculated POPI statements</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">Paid</span>
                  </div>
                </div>

                {/* Principal Message snippet */}
                <div className="mt-5 p-3.5 bg-indigo-50 border border-indigo-150 rounded-xl text-[11px] text-indigo-950 leading-relaxed font-medium">
                  <span className="font-extrabold text-xs block text-indigo-900 mb-1">💻 Developer Interactive Staging</span>
                  You are evaluating the live staging system. Toggle different perspectives in the sidebar or buttons above to test parent progress maps, admissions wizards, or administrative controls.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Play-Based Age Classes Area */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200" id="classes-group">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <span className="text-rose-500 font-bold text-xs uppercase tracking-widest font-mono">Our Educational Framework</span>
            <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Accredited Child Development Groups</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We group children into age-specific developmental tiers that accommodate their physical, social, cognitive and motor skill milestones safely.
            </p>

            {/* In-page Tab Filter */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5">
              {[
                { id: 'all', label: 'All Age Groups' },
                { id: 'roses', label: 'Roses (Age 1-2)' },
                { id: 'giraffes', label: 'Giraffes (Age 2-3)' },
                { id: 'tigers', label: 'Tigers (Age 4-5)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${activeTab === tab.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                {/* Class Image Preview */}
                <div className="h-44 relative bg-slate-200 overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-indigo-900/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {item.ages}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className={`inline-block px-2.5 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider rounded-md border ${item.color} mb-2`}>
                        {item.pillText}
                      </div>
                      <h3 className="text-lg font-black text-indigo-950 leading-tight">{item.name}</h3>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Weekly Activities Include:</span>
                      <div className="space-y-1.5">
                        {item.activities.map((act, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">CAPS & NELDS Aligned</span>
                    <button 
                      onClick={() => onSelectRole('enrolment')}
                      className="text-xs font-bold text-indigo-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      Enrol online &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-widest font-mono">Designed For Parents</span>
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Kiddies Town Portal Integration</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We believe premium childcare goes hand-in-hand with absolute operational transparency. Our multi-role workspace connects parents, teachers, and school managers effortlessly.
              </p>
            </div>
            <div className="lg:col-span-6 lg:justify-self-end flex flex-wrap gap-2">
              <button 
                onClick={() => onSelectRole('parent')} 
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-lg border border-indigo-100 transition-colors cursor-pointer"
              >
                Inspect Parent View
              </button>
              <button 
                onClick={() => onSelectRole('admin')} 
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-lg border border-amber-100 transition-colors cursor-pointer"
              >
                Inspect Principal Dashboard
              </button>
            </div>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* Box 1: Shuttle */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  🚍
                </div>
                <div>
                  <h3 className="text-base font-bold text-indigo-950">Accredited Shuttle Transport</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    Daily pick-up scheduled directly across Polokwane CBD and Ster Park. Keeps commuters secure, safe, and synchronized.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>Ster Park • CBD Hub</span>
                <span>Arranged pickup</span>
              </div>
            </div>

            {/* Box 2: Reports */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  📊
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-base font-bold text-indigo-950">Dynamic Progress Reports</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">
                      Our teachers update social development, vocabulary, fine motor milestones, and creative arts scores each term.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>FINE MOTOR SCORING</span>
                      <span className="text-emerald-600">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">"Excellent finger paint coordination (Leo Mbeki)."</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>PDF Downloadable & Printable</span>
                <span>Milestone Audited</span>
              </div>
            </div>

            {/* Box 3: POPI Compliance */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  🔒
                </div>
                <div>
                  <h3 className="text-base font-bold text-indigo-950">Strict South African POPI Act Compliance</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    Your family data, birth certificates, medical records, and digital statements are protected with state-of-the-art secure database protocols. We do not expose children's photos or personal directories to indices or non-authenticated guests.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>RSA POPIA compliant</span>
                <span>Active Shield Protected</span>
              </div>
            </div>

            {/* Box 4: Financial Statement */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <h3 className="text-base font-bold text-indigo-950">Account Statements & Real-time receipts</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    Instantly monitor school fee arrears, log manual banking transfers, download valid educational receipts, and receive immediate principal notifications.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>Transparent billing</span>
                <span>Offline Buffers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Photo Gallery & Highlights */}
      <section className="py-16 lg:py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 text-left">
            <div className="space-y-3">
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest font-mono">📸 Community Highlights Gallery</span>
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Kiddies Town Photo Showcase</h2>
              <p className="text-slate-500 text-sm max-w-xl">
                Witness daily growth, graduations, family events, and creative sandbox moments captured on campus. Hover and click any card to view detailed milestone descriptions or check official community posts.
              </p>
            </div>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 shrink-0 self-start md:self-end">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'grad', label: '🎓 Graduations' },
                { id: 'fun', label: '🎈 Fun Walks' },
                { id: 'art', label: '🎨 Art Classes' },
                { id: 'play', label: '🧸 Playground' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setGalleryCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    galleryCategory === cat.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-zoom-in group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img 
                    src={photo.image} 
                    alt={photo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Pill Overlaid */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-indigo-950/80 text-white font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {photo.category === 'grad' && 'Graduation'}
                      {photo.category === 'fun' && 'Annual Walk'}
                      {photo.category === 'art' && 'Finger Arts'}
                      {photo.category === 'play' && 'Playground'}
                    </span>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/95 text-indigo-950 text-xs font-bold px-4 py-2 rounded-xl shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Click to Expand Photo
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-indigo-950 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{photo.title}</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{photo.description}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Staging highlight #{photo.id}</span>
                    <span className="text-indigo-600 hover:underline">Read details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Official Photos Link / Call to Action Box for Facebook SK=photos */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-100/60 rounded-2xl border border-blue-150 flex flex-col md:flex-row items-center justify-between gap-5 text-left">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 fill-blue-600 text-blue-600 shrink-0" />
                <span>Looking for the extensive, original photo albums?</span>
              </h4>
              <p className="text-blue-900/80 text-xs max-w-2xl leading-relaxed">
                Our main, authentic photo database is hosted directly on our Facebook community page. Click to browse hundreds of graduation, concert, fun walk, birthday parties, and classroom play pictures from 2022 to present!
              </p>
            </div>
            
            <a 
              href="https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md text-center w-full md:w-auto shrink-0 cursor-pointer block text-sm"
            >
              Browse Facebook Photo Albums &rarr;
            </a>
          </div>
        </div>

        {/* Photoviewer Modal Overlay */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-200 shadow-2xl relative">
              
              {/* Close Button top-right */}
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-indigo-950/70 hover:bg-indigo-950 text-white p-2 rounded-full transition-all cursor-pointer z-10 font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="aspect-video bg-slate-900 relative">
                <img 
                  src={selectedPhoto.image} 
                  alt={selectedPhoto.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-lg">
                    {selectedPhoto.category === 'grad' && '🎓 Graduation Category'}
                    {selectedPhoto.category === 'fun' && '🎈 Annual Fun Walk'}
                    {selectedPhoto.category === 'art' && '🎨 Nursery Art Class'}
                    {selectedPhoto.category === 'play' && '🧸 Slide & Playground'}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <h3 className="text-xl font-black text-indigo-950 tracking-tight leading-tight">{selectedPhoto.title}</h3>
                
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  {selectedPhoto.longDesc}
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 font-semibold space-y-2">
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Compliance & Privacy Notice</span>
                  </p>
                  <p className="leading-relaxed">
                    This beautiful showcase utilizes high-grade, contextual illustrative imagery to display program features. For extensive actual parents-group photos and updates, visit our secure POPIA-audited Facebook posts.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <a 
                    href={selectedPhoto.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <Facebook className="w-4 h-4 fill-white" />
                    <span>View original album on facebook</span>
                  </a>
                  
                  <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest font-mono">Parent Reviews</span>
            <h2 className="text-3xl font-black text-indigo-950 tracking-tight">What Our Families Say</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Real parent reviews taken directly from community responses and Facebook page highlights.
              Our community is built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-950">{test.author}</h4>
                    <p className="text-[10px] text-slate-400 font-mono font-semibold">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a 
              href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-blue-50/70 hover:bg-blue-150/70 border border-blue-150 text-blue-800 text-xs font-bold font-mono tracking-wider transition-colors"
            >
              <Facebook className="w-4 h-4 fill-blue-600 text-blue-600 shrink-0" />
              <span>FOLLOW OUR COMMUNITY ON FACEBOOK &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest font-mono">Answers At Hand</span>
            <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Kiddies Town Admissions & Rulings FAQ</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We compile answers to the most common questions raised by parents during the application process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i} 
                  className="bg-slate-50 border border-slate-200 rounded-xl transition-all"
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-indigo-950 hover:text-indigo-700 text-xs md:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-200/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-indigo-100 text-xs font-mono font-semibold uppercase tracking-wider">
            ★ ADMISSIONS OPEN FOR TERM 3 2026
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Give your child a premium, accredited start in Polokwane.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Ready to secure a desk in our Tigers, Giraffes, or Roses groups? Connect with Sarah Mbeki, Teacher Anne, or administrativePrincipal Shineon in the staging dashboards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectRole('enrolment')}
              className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Open Steps Application Wizard
            </button>
            <button
              onClick={() => onSelectRole('parent')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border border-white/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Test Parent Experience
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-semibold font-mono">
            📍 Central ster-park Polokwane Campus | ☎ Phone Support: 015 023 0600
          </p>
        </div>
      </section>
    </div>
  );
}
