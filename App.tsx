
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { 
  Loader2, Check, 
  ChevronRight, Rocket, Lightbulb,
  TrendingUp, HeartHandshake,
  Smartphone, Target,
  Database,
  Globe, Send,
  ArrowUpRight, ShieldCheck, 
  X as XIcon, MessageCircle,
  Calculator, PhoneCall, Award, Video, BookOpen, Download,
  Menu, AlertTriangle, Layers, Zap, UserPlus, BarChart3, Leaf, Factory, Cpu, Terminal, Code,
  TrendingDown, DollarSign, Clock, Mail, LayoutDashboard, Share2, Copy, Compass, ShieldAlert,
  ArrowRight, ExternalLink, Paperclip, FileText, Bot, ArrowLeft, Store, Users, Briefcase, Truck, Sprout, ShoppingBag, Settings, Headphones,
  Lock, FileLock, Trash2, Timer,
  Youtube, Instagram, Megaphone, PenTool, Hash, PlayCircle, MapPin, Search, CreditCard, Plane, Laptop, GanttChart, Star, Info, HelpCircle, Eye, EyeOff, FileDown, Sparkles,
  ZapOff,
  BriefcaseBusiness,
  Coins,
  MousePointer2,
  FileBadge,
  Clapperboard,
  RefreshCcw,
  Key,
  Monitor,
  Activity,
  Phone,
  Shield
} from 'lucide-react';

// [STRICT BRAND LOCK - LIVE READY]
const BRAND_NAME = "CPC Direct";
const WHATSAPP_NUMBER = "2348094644407"; 
const EMAIL_ADDRESS = "info@cpc-direct.com";
const MOBILE_DISPLAY = "+234 809 464 4407";

// Constants for Persistence
const STORAGE_KEYS = {
  AUDIT_STEP: 'cpc_audit_step',
  AUDIT_ANSWERS: 'cpc_audit_answers',
  LEAD_FORM: 'cpc_lead_form',
  LEAD_CAPTURED: 'cpc_lead_captured',
  CHAT_HISTORY: 'cpc_chat_history',
};

const SECTION_TITLES: Record<string, string> = {
  home: 'Dashboard',
  audit: 'Master Audit',
  showcase: 'App Portfolio',
  'marketing-studio': 'Growth Studio',
  'ai-tools': 'Toolbelt',
  pricing: 'Services & PPP',
  'roi-results': 'Secure Vault',
};

const GROWTH_DATA = {
  revenue: [
    { name: 'Month 1', y: 15.2, label: '₦15.2M' },
    { name: 'Month 2', y: 28.5, label: '₦28.5M' },
    { name: 'Month 3', y: 42.1, label: '₦42.1M' },
    { name: 'Month 4', y: 85.3, label: '₦85.3M' },
    { name: 'Month 5', y: 124.8, label: '₦124.8M' }
  ],
  leads: [
    { name: 'Month 1', y: 45, label: '45 Leads' },
    { name: 'Month 2', y: 110, label: '110 Leads' },
    { name: 'Month 3', y: 230, label: '230 Leads' },
    { name: 'Month 4', y: 480, label: '480 Leads' },
    { name: 'Month 5', y: 615, label: '615 Leads' }
  ],
  conversion: [
    { name: 'Month 1', y: 1.2, label: '1.2%' },
    { name: 'Month 2', y: 2.1, label: '2.1%' },
    { name: 'Month 3', y: 4.8, label: '4.8%' },
    { name: 'Month 4', y: 6.9, label: '6.9%' },
    { name: 'Month 5', y: 9.4, label: '9.4%' }
  ]
};

const PRICING_TIERS = [
  {
    id: "tenant",
    name: "Digital Tenant",
    price: "₦75,000",
    period: "/year",
    desc: "Establish your professional digital presence and secure your domain.",
    implementation: [
      "Custom Domain Registration (.ng)",
      "Google Workspace Setup",
      "Search Console Integration",
      "PPP Core: Pay Local for Global Tools"
    ],
    action: "Initialize Tenancy",
    color: "border-white/10"
  },
  {
    id: "stack",
    name: "Growth Stack",
    price: "₦250,000",
    period: "/year",
    desc: "Full operational automation and managed custom software.",
    implementation: [
      "All Tenant Infrastructure",
      "Managed AppSheet Deployment",
      "Staff Onboarding Session",
      "AI Content Generator Access",
      "Priority PPP Processing"
    ],
    action: "Deploy Growth Stack",
    color: "border-[#C5A059] bg-[#C5A059]/5"
  },
  {
    id: "scale",
    name: "Scale Commander",
    price: "Custom",
    period: "quote",
    desc: "Full-scale enterprise digital transformation and export handling.",
    implementation: [
      "Total Digital Backbone Overhaul",
      "Custom Full-Stack Development",
      "Dedicated Technical Strategist",
      "Documentation Automation",
      "Zero-Fee FX Handling (PPP)"
    ],
    action: "Request Board Consult",
    color: "border-white/10"
  }
];

const GROWTH_MODES = [
  { 
    id: 'market-entry', 
    name: 'Executive Brief', 
    icon: <Compass size={20}/>, 
    prompt: "GENERATE A COMPREHENSIVE EXECUTIVE GROWTH BRIEF. Focus on market entries and AI displacements.",
  },
  { 
    id: 'app-spec', 
    name: 'App Spec', 
    icon: <Smartphone size={20}/>, 
    prompt: "DRAFT A ROBUST TECHNICAL APP SPECIFICATION DOCUMENT for AppSheet deployment.",
  },
  { 
    id: 'hr-kpi', 
    name: 'HR Framework', 
    icon: <Users size={20}/>, 
    prompt: "CREATE A STAFF OPTIMIZATION & KPI FRAMEWORK for managed SME operations.",
  }
];

/**
 * Text formatting helper for AI responses
 */
const renderFormattedAIText = (text: string, summaryMode: boolean = false) => {
  if (!text) return null;
  const lines = text.split('\n');
  const displayLines = summaryMode ? lines.slice(0, 10) : lines;

  return (
    <div className="space-y-4">
      {displayLines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Handle Bold formatting
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        const formatted = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="text-[#C5A059] font-black">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        // Headers formatting
        if (trimmed.startsWith('###')) return <h5 key={i} className="text-base font-black text-white uppercase italic mt-4 mb-1">{formatted}</h5>;
        if (trimmed.startsWith('##')) return <h4 key={i} className="text-lg font-black text-white uppercase italic mt-6 mb-2">{formatted}</h4>;
        if (trimmed.startsWith('#')) return <h3 key={i} className="text-xl font-black text-[#C5A059] uppercase italic mt-8 mb-4">{formatted}</h3>;

        // List item formatting
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-3 pl-2">
              <span className="text-[#C5A059] font-bold">•</span>
              <span className="text-slate-300 font-medium">{formatted}</span>
            </div>
          );
        }

        return <p key={i} className="text-slate-300 font-medium leading-relaxed">{formatted}</p>;
      })}
    </div>
  );
};

const EXPERT_SYSTEM_INSTRUCTION = `
Role: You are the CPC Direct Lead Consultant. You are the "Chief Strategy Officer" for Sub-Saharan SMEs.
Tone: High-level strategist. Professional, punchy, empathetic.
Terminology: Use "Digital Backbone", "Autonomous Infrastructure", "Secure the bag", "Clearing the road".
Greeting: Always address as "Director", "Chief", or "Oga".
Context: You are providing the blueprint for growth.
`;

const auditQuestions = [
  { q: "Revenue Core: Primary revenue sector?", options: ["Retail / E-commerce", "Logistics / Supply Chain", "Agriculture / Agri-Tech", "Manufacturing / Industrial", "Professional / Financial Services"] },
  { q: "Orbit: Primary geographic focus?", options: ["Local / National", "West Africa (ECOWAS)", "Global Export (UK/EU/US)"] },
  { q: "Digital Engine: Current tool stack?", options: ["Purely Analog (Paper)", "Fragmented (Excel/WhatsApp)", "Basic Cloud (Standalone Apps)", "Integrated (Custom Ecosystem)"] },
  { q: "Documentation: Where is data stored?", options: ["Physical Files", "Individual Devices", "Unorganized Cloud", "Encrypted Vault"] },
  { q: "Payments: Frequency of FX friction?", options: ["Constant Blockage", "Monthly Friction", "Managed PPP"] }
];

// Recharts Dynamic Loader
const DynamicAreaChart = (props: { data: any[], metric: string }) => {
  const [Recharts, setRecharts] = useState<any>(null);
  useEffect(() => {
    import('recharts').then(setRecharts);
  }, []);
  
  if (!Recharts) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#C5A059]" /></div>;
  
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } = Recharts;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={props.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis dataKey="name" stroke="#8892B0" fontSize={10} tickLine={false} axisLine={false} dy={10} />
        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
        <Tooltip contentStyle={{ backgroundColor: '#112240', border: '1px solid #C5A05933', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }} itemStyle={{ color: '#C5A059' }} labelStyle={{ color: '#8892B0', marginBottom: '4px' }} formatter={(value: any, name: any, props: any) => [props.payload.label, props.metric]} />
        <Area type="monotone" dataKey="y" stroke="#C5A059" strokeWidth={4} fillOpacity={1} fill="url(#colorGold)" animationDuration={2000} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const App: React.FC = () => {
  // PERSISTENCE
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [pendingToast, setPendingToast] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'leads' | 'conversion'>('revenue');

  const [auditStep, setAuditStep] = useState(() => Number(localStorage.getItem(STORAGE_KEYS.AUDIT_STEP)) || 0);
  const [auditAnswers, setAuditAnswers] = useState<Record<number, string>>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_ANSWERS) || '{}'));
  const [leadForm, setLeadForm] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAD_FORM) || '{"name":"","company":"","contact":"","marketingConsent":true}'));
  const [isLeadCaptured, setIsLeadCaptured] = useState(() => localStorage.getItem(STORAGE_KEYS.LEAD_CAPTURED) === 'true');
  const [chatHistory, setChatHistory] = useState<any[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY) || JSON.stringify([
    { 
      role: 'concierge', 
      text: "Well done, Chief! Welcome to CPC Direct LIVE. I'm here to initialize your digital backbone. Where shall we start?",
      options: ["Plan the Harvest (#audit-initiate)", "Blueprint the Vision (#engagement-engine)", "Secure the Bag (#pricing)"]
    }
  ])));

  // UI STATES
  const [growthMode, setGrowthMode] = useState(GROWTH_MODES[0]);
  const [marketingOutput, setMarketingOutput] = useState<string | null>(null);
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [isAssetReady, setIsAssetReady] = useState(false);
  const [showFullOutput, setShowFullOutput] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isLeadGateActive, setIsLeadGateActive] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // CONCIERGE
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);

  // PERSISTENCE EFFECTS
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT_STEP, auditStep.toString()); }, [auditStep]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT_ANSWERS, JSON.stringify(auditAnswers)); }, [auditAnswers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LEAD_FORM, JSON.stringify(leadForm)); }, [leadForm]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LEAD_CAPTURED, isLeadCaptured.toString()); }, [isLeadCaptured]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory)); }, [chatHistory]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'audit', 'showcase', 'marketing-studio', 'ai-tools', 'pricing', 'roi-results'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top < 200) setActiveSection(section);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerWhatsAppActivation = (context?: string) => {
    const { company, contact } = leadForm;
    // Clean WhatsApp Number (Remove spaces, +, etc)
    const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
    const msg = `*CPC DIRECT LIVE ACTIVATION*\n\nCLIENT: ${company || 'New Partner'}\nCONTACT: ${contact || 'N/A'}\nCONTEXT: ${context || 'General Infrastructure Inquiry'}\n\nOga, I have completed the audit and am ready to deploy. Please clear the road!`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handlePaymentSystemTrigger = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleAuditStepAction = (option: string) => {
    const updatedAnswers = { ...auditAnswers, [auditStep]: option };
    setAuditAnswers(updatedAnswers);
    if (auditStep < auditQuestions.length - 1) {
      setAuditStep(auditStep + 1);
    } else {
      setIsAuditing(true);
      setTimeout(() => {
        setDiagnosticResult({ score: 92, sector: updatedAnswers[0], interpretation: "Critical infrastructure leakage detected." });
        setIsAuditing(false);
        setIsLeadGateActive(true);
      }, 2000);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    setTimeout(() => {
      setIsLeadCaptured(true);
      setIsDispatching(false);
      setPendingToast(`Identity Verified. Vault Unlocked.`);
      setIsConciergeOpen(true);
      setChatHistory(prev => [...prev, { 
        role: 'concierge', 
        text: `Welcome aboard, Director ${leadForm.name}! Your ${auditAnswers[0]} strategy is ready in the Growth Studio. Let's load the fleet!`,
        options: ["Initialize Implementation (#pricing)", "View Tactical Brief (#marketing-studio)"]
      }]);
    }, 1200);
  };

  const handleMarketingGenerate = async () => {
    if (!isLeadCaptured) { smoothScrollTo("audit"); return; }
    setIsMarketingLoading(true);
    setMarketingOutput("");
    setIsAssetReady(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `${growthMode.prompt}\n\nFOR ENTITY: ${leadForm.company}\nSECTOR: ${auditAnswers[0]}`,
        config: { systemInstruction: EXPERT_SYSTEM_INSTRUCTION }
      });
      for await (const chunk of stream) {
        setMarketingOutput(prev => (prev || "") + chunk.text);
        setIsAssetReady(true);
      }
    } catch (e) {
      setGlobalError("Intelligence Bridge Saturated. Contact Oga via WhatsApp.");
    } finally { setIsMarketingLoading(false); }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isBotThinking) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsBotThinking(true);
    setChatHistory(prev => [...prev, { role: 'concierge', text: "" }]);
    const botMsgIndex = chatHistory.length + 1;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `[Current Page: ${activeSection}]\n\nUser: ${userMsg}`,
        config: { systemInstruction: EXPERT_SYSTEM_INSTRUCTION }
      });
      let accumulatedText = "";
      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[botMsgIndex] = { ...newHistory[botMsgIndex], text: accumulatedText };
          return newHistory;
        });
      }
    } catch (e) {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[botMsgIndex] = { role: 'concierge', text: "Director, the signal is weak. Use the WhatsApp button for direct support." };
        return newHistory;
      });
    } finally { setIsBotThinking(false); }
  };

  // Logic to hide chatbot in focused result views
  const isInFocusedView = (activeSection === 'roi-results' || (activeSection === 'marketing-studio' && isAssetReady));

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 font-sans pb-48 selection:bg-[#C5A059] selection:text-[#0A192F]">
      
      {/* SYSTEM STATUS INDICATOR */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#C5A059]/20 z-[2001]">
         <div className="h-full bg-[#C5A059] w-[100%] animate-pulse" />
      </div>

      {/* SETTLEMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
           <div className="max-w-2xl glass-panel p-16 rounded-[48px] border-[#C5A059]/50 text-center space-y-10 animate-slide-up">
              <CreditCard size={80} className="text-[#C5A059] mx-auto" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Initialize Settlement</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed italic">Package: <span className="text-white font-black">{selectedPlan?.name}</span>. Settlement authorized via local currency gateway (PPP Protocol).</p>
              <div className="flex flex-col gap-4">
                 <button onClick={() => triggerWhatsAppActivation(`Plan Settlement: ${selectedPlan?.name}`)} className="w-full py-7 bg-[#C5A059] text-[#0A192F] font-black uppercase rounded-2xl shadow-3xl hover:bg-white transition-all flex items-center justify-center gap-4">
                   <Lock size={24}/> Pay Locally (PPP Gateway)
                 </button>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="w-full py-5 text-slate-500 font-black uppercase tracking-widest text-xs hover:text-white transition-all">Cancel Authorization</button>
              </div>
           </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {pendingToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] bg-[#C5A059] text-[#0A192F] px-10 py-5 rounded-xl shadow-3xl font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-5 animate-in slide-in-from-top-12">
          <Check size={20} /> {pendingToast}
        </div>
      )}

      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-[#0A192F]/98 backdrop-blur-xl py-4 shadow-2xl border-b border-[#C5A059]/20' : 'bg-transparent py-10'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => smoothScrollTo('home')}>
            <div className="w-12 h-12 bg-[#C5A059] flex items-center justify-center rounded-xl shadow-xl group-hover:scale-110 transition-transform">
              <HeartHandshake size={28} className="text-[#0A192F]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase italic">CPC <span className="text-[#C5A059]">Direct</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
             <div className="flex gap-6 border-r border-white/10 pr-10">
                <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8892B0] hover:text-[#C5A059] transition-colors"><Mail size={14}/> {EMAIL_ADDRESS}</a>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8892B0] hover:text-[#C5A059] transition-colors"><Phone size={14}/> {MOBILE_DISPLAY}</a>
             </div>
             {Object.entries(SECTION_TITLES).map(([key, title]) => (
                <button key={key} onClick={() => smoothScrollTo(key)} className={`text-[11px] font-black tracking-[0.3em] uppercase transition-all px-2 py-1 relative group ${activeSection === key ? 'text-[#C5A059]' : 'text-slate-400 hover:text-white'}`}>
                  {title}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A059] scale-x-0 transition-transform ${activeSection === key ? 'scale-x-100' : ''}`} />
                </button>
             ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-24">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex items-center px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-14">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-full text-[#C5A059] text-[11px] font-black uppercase tracking-widest shadow-sm"><Activity size={18} /> Global Status: Operational</div>
              <h1 className="text-6xl lg:text-[96px] font-black leading-[0.82] tracking-tighter text-white uppercase italic">Digital <br />Backbone <br /><span className="text-[#C5A059]">Architecture.</span></h1>
              <p className="text-2xl lg:text-3xl text-[#8892B0] max-w-xl leading-relaxed font-medium">Proprietary smart-flow protocols for Sub-Saharan market leaders. No friction. Only growth.</p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => smoothScrollTo('audit')} className="px-16 py-8 bg-[#C5A059] text-[#0A192F] font-black uppercase text-sm tracking-[0.4em] rounded-xl shadow-3xl hover:bg-white transition-all transform hover:-translate-y-1">Start Master Audit</button>
                <button onClick={() => triggerWhatsAppActivation('Direct Board Consult')} className="px-10 py-8 border border-white/10 text-white font-black uppercase text-sm tracking-[0.4em] rounded-xl hover:bg-white/5 transition-all">Direct Board Consult</button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="glass-panel p-10 md:p-14 rounded-[48px] border-[#C5A059]/30 shadow-3xl relative overflow-hidden min-h-[500px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-[0.6em] mb-2">Sector Velocity</h3>
                    <p className="text-slate-400 text-sm font-medium italic">LIVE Performance Metrics</p>
                  </div>
                  <div className="flex gap-2">
                    {(['revenue', 'leads', 'conversion'] as const).map((m) => (
                      <button key={m} onClick={() => setActiveMetric(m)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${activeMetric === m ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <DynamicAreaChart data={GROWTH_DATA[activeMetric]} metric={activeMetric} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MASTER AUDIT - SPACIOUS VERSION */}
        <section id="audit" className="py-56 px-6 bg-[#0A192F] border-y border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-32">
              <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Diagnostic Protocol</span>
              <h3 className="text-8xl md:text-[140px] font-black text-white italic tracking-tighter uppercase leading-none opacity-90">The Audit.</h3>
            </div>
            <div className={`glass-panel p-12 md:p-24 rounded-[56px] min-h-[700px] flex flex-col justify-center items-center shadow-3xl relative border-[#C5A059]/20 overflow-hidden`}>
              {!isLeadGateActive ? (
                <div className="w-full max-w-4xl space-y-24">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.6em]">PHASE {auditStep + 1} / {auditQuestions.length}</span>
                    <div className="h-1.5 flex-grow mx-10 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] transition-all duration-700" style={{ width: `${((auditStep + 1) / auditQuestions.length) * 100}%` }}></div>
                    </div>
                  </div>
                  <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter text-center leading-[1.1]">{auditQuestions[auditStep].q}</h4>
                  <div className="grid grid-cols-1 gap-6 w-full max-w-2xl mx-auto">
                    {auditQuestions[auditStep].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAuditStepAction(opt)} className="p-10 text-center border border-white/5 rounded-3xl bg-[#0A192F]/70 hover:bg-[#C5A059] hover:text-[#0A192F] transition-all font-black text-[20px] uppercase shadow-2xl group relative overflow-hidden">
                        <span className="relative z-10">{opt}</span>
                        <ChevronRight size={24} className="absolute right-10 opacity-30 group-hover:translate-x-2 transition-transform" />
                      </button>
                    ))}
                  </div>
                  {auditStep > 0 && <button onClick={() => setAuditStep(auditStep - 1)} className="block mx-auto text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline">Back to previous phase</button>}
                </div>
              ) : (
                <div className="text-center animate-in zoom-in duration-700">
                  <div className="max-w-2xl mx-auto p-16 bg-[#0A192F]/95 rounded-[64px] border border-[#C5A059]/50 shadow-3xl">
                     <ShieldAlert size={80} className="text-[#C5A059] mx-auto mb-12 animate-bounce" />
                     <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-6">Identity Gate.</h4>
                     <p className="text-slate-400 mb-10 font-medium">Verify your profile to unlock the Secure Vault.</p>
                     {!isLeadCaptured ? (
                        <form onSubmit={handleLeadSubmit} className="space-y-8 text-left">
                           <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} placeholder="Full Name / Representative" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <input required value={leadForm.company} onChange={e => setLeadForm({...leadForm, company: e.target.value})} placeholder="Company Name" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <input required value={leadForm.contact} onChange={e => setLeadForm({...leadForm, contact: e.target.value})} placeholder="WhatsApp / Mobile Number" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <button type="submit" disabled={isDispatching} className="w-full py-10 bg-[#C5A059] text-[#0A192F] font-black uppercase rounded-3xl shadow-3xl hover:bg-white transition-all text-xl tracking-[0.4em]">
                             {isDispatching ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Unlock Vault"}
                           </button>
                        </form>
                     ) : (
                       <button onClick={() => smoothScrollTo("marketing-studio")} className="w-full py-8 border-2 border-[#C5A059] text-[#C5A059] font-black uppercase rounded-3xl hover:bg-[#C5A059] hover:text-[#0A192F] transition-all text-lg tracking-[0.3em]">Access Strategic Hub</button>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GROWTH STUDIO */}
        <section id="marketing-studio" className={`py-40 px-6 border-y border-white/5 relative z-20 ${isLeadCaptured ? 'block' : 'hidden'}`}>
          <div className="max-w-6xl mx-auto space-y-16">
            <h3 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter opacity-90">Growth Studio.</h3>
            <div className={`glass-panel p-10 md:p-16 rounded-[80px] border-[#C5A059]/30 shadow-3xl`}>
              <div className="grid lg:grid-cols-3 gap-6 mb-16">
                {GROWTH_MODES.map((mode) => (
                  <button key={mode.id} onClick={() => { setGrowthMode(mode); setMarketingOutput(null); setIsAssetReady(false); }} className={`p-8 rounded-[40px] flex flex-col items-center gap-5 transition-all border-2 ${growthMode.id === mode.id ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059] shadow-2xl' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                    {mode.icon} <span className="text-[11px] font-black uppercase tracking-widest">{mode.name}</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#112240]/80 p-10 md:p-16 rounded-[64px] min-h-[500px] relative border border-white/5 shadow-inner">
                 {!isAssetReady && !isMarketingLoading ? (
                   <div className="flex flex-col items-center justify-center h-full space-y-10">
                      <p className="text-[#8892B0] text-center max-w-md font-medium text-xl italic">Ready to generate your board-level <span className="text-white font-bold">{growthMode.name}</span> blueprint for {leadForm.company}.</p>
                      <button onClick={handleMarketingGenerate} disabled={isMarketingLoading} className="px-16 py-9 bg-[#C5A059] text-[#0A192F] font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all flex items-center gap-6 shadow-3xl text-xl">
                        <PlayCircle size={32} /> Execute Protocol
                      </button>
                   </div>
                 ) : (
                   <div className="animate-in fade-in duration-1000">
                      <div className="bg-[#0A192F]/90 border border-[#C5A059]/40 rounded-[48px] overflow-hidden shadow-3xl relative">
                          <div className="bg-[#C5A059]/15 p-8 border-b border-[#C5A059]/30 flex justify-between items-center backdrop-blur-md">
                            <span className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3"><Sparkles size={18} className="text-[#C5A059]" /> Intelligence Feed // {leadForm.company}</span>
                            <div className="flex gap-4">
                               <button onClick={() => triggerWhatsAppActivation(`Studio Strategy: ${growthMode.name}`)} className="p-3 bg-[#C5A059] text-[#0A192F] rounded-2xl transition-all shadow-xl hover:bg-white flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                 <Send size={18}/> Implementation Bridge
                               </button>
                            </div>
                          </div>
                          <div className="p-10 md:p-16 max-h-[800px] overflow-y-auto custom-scrollbar text-left bg-gradient-to-b from-[#112240] to-[#0A192F]">
                             {marketingOutput && renderFormattedAIText(marketingOutput, !showFullOutput)}
                             {!showFullOutput && <button onClick={() => setShowFullOutput(true)} className="w-full mt-10 py-6 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-[#0A192F] transition-all">Expand Detailed Boardroom Specs</button>}
                          </div>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className={`py-40 px-6 relative z-20 ${isLeadCaptured ? 'block' : 'hidden'}`}>
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-32">
               <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Activation Channels</span>
               <h3 className="text-6xl md:text-[110px] font-black italic text-white tracking-tighter uppercase leading-none mb-10 opacity-90">Pricing & PPP.</h3>
               <p className="text-[#8892B0] text-xl max-w-2xl mx-auto">Settlement protocols designed to bypass international FX bottlenecks.</p>
             </div>
             <div className="grid lg:grid-cols-3 gap-10">
                {PRICING_TIERS.map((tier, i) => (
                   <div key={i} className={`glass-panel p-14 rounded-[64px] flex flex-col relative overflow-hidden group hover:scale-[1.03] transition-transform ${tier.color} border-2`}>
                      <h4 className="text-3xl font-black text-white uppercase italic mb-10">{tier.name}</h4>
                      <div className="mb-10">
                        <span className="text-5xl font-black text-[#C5A059] tracking-tighter">{tier.price}</span>
                        <span className="text-slate-500 font-bold ml-2">{tier.period}</span>
                      </div>
                      <p className="text-slate-300 text-sm font-medium mb-10 italic leading-relaxed">{tier.desc}</p>
                      <div className="space-y-6 mb-12 flex-grow">
                         {tier.implementation.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-4 text-[13px] font-bold text-slate-200">
                              <Check size={18} className="text-[#C5A059] shrink-0 mt-0.5" /> <span>{feat}</span>
                            </div>
                         ))}
                      </div>
                      <button onClick={() => handlePaymentSystemTrigger(tier)} className="w-full py-7 bg-white/5 border border-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] transition-all rounded-[32px] font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3">
                        {tier.action} <ArrowRight size={18} />
                      </button>
                   </div>
                ))}
             </div>
           </div>
        </section>

        {/* ROI RESULTS / VAULT */}
        <section id="roi-results" className={`py-40 px-6 bg-[#0A192F] border-b border-white/5 relative z-20 transition-all duration-1000 ${isLeadCaptured ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
             <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-14">
                <div className={`lg:col-span-4 glass-panel p-16 rounded-[72px] border-[#C5A059]/50 text-center flex flex-col justify-center relative overflow-hidden shadow-3xl`}>
                   <div className="text-[120px] font-black italic text-white tracking-tighter leading-none mb-6 animate-pulse">{diagnosticResult?.score || 0}%</div>
                   <p className="text-[13px] text-[#C5A059] font-black uppercase tracking-[0.6em] border-t border-[#C5A059]/30 pt-6">Readiness Index Alpha</p>
                </div>
                <div id="download-zone" className="lg:col-span-8 glass-panel p-16 rounded-[72px] border-white/5 flex flex-col justify-center items-center shadow-3xl relative overflow-hidden bg-gradient-to-br from-[#112240] to-[#0A192F]">
                   <div className="absolute inset-0 bg-[#0A192F]/60 backdrop-blur-md flex flex-col items-center justify-center z-10 p-12 text-center border border-[#C5A059]/20">
                      <Shield size={100} className="text-[#C5A059] mb-10" />
                      <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-6">Vault Unlocked.</h3>
                      <button onClick={() => triggerWhatsAppActivation('Vault Data Decrypt Request')} className="p-8 bg-white/5 border border-[#C5A059]/40 rounded-[40px] flex items-center gap-6 hover:bg-[#C5A059]/15 transition-all text-left group shadow-2xl">
                         <div className="w-16 h-16 bg-[#C5A059] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"><MessageCircle size={32} className="text-[#0A192F]" /></div>
                         <div>
                            <span className="block text-white font-black text-[15px] uppercase tracking-wider">SECURE_BLUEPRINT_IMPLEMENTATION</span>
                            <span className="block text-[#C5A059] text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Finalize via Strategic Concierge</span>
                         </div>
                      </button>
                   </div>
                </div>
             </div>
        </section>

      </main>

      {/* STRATEGY CONCIERGE - HIDDEN IN RESULTS */}
      {!isInFocusedView && (
        <div className={`fixed bottom-8 right-8 z-[1900] transition-all duration-300 ${isConciergeOpen ? 'w-[92vw] md:w-[460px] h-[600px]' : 'w-18 h-18'}`}>
          {!isConciergeOpen ? (
            <button onClick={() => setIsConciergeOpen(true)} className="w-18 h-18 bg-[#C5A059] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform p-4"><Bot size={36} className="text-[#0A192F]" /></button>
          ) : (
            <div className="w-full h-full glass-panel border-[#C5A059]/40 rounded-[32px] flex flex-col shadow-3xl overflow-hidden bg-[#0A192F]/98 backdrop-blur-3xl">
              <div className="bg-[#C5A059] p-6 flex justify-between items-center text-[#0A192F]">
                <span className="text-[14px] font-black uppercase tracking-tighter">STRATEGY CONCIERGE LIVE</span>
                <button onClick={() => setIsConciergeOpen(false)}><XIcon size={24}/></button>
              </div>
              <div className="flex-grow p-6 overflow-y-auto space-y-5 custom-scrollbar bg-[#112240]/50">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`p-5 rounded-2xl shadow-xl ${m.role === 'user' ? 'bg-[#112240] ml-10 text-white' : 'bg-[#C5A059]/10 border border-[#C5A059]/20 mr-10'}`}>
                    {renderFormattedAIText(m.text)}
                    {m.options && (
                      <div className="mt-6 space-y-3">
                         {m.options.map((opt: string, idx: number) => (
                           <button key={idx} onClick={() => { 
                             if(opt.includes('audit')) smoothScrollTo('audit'); 
                             else if(opt.includes('pricing')) smoothScrollTo('pricing');
                             else smoothScrollTo('marketing-studio');
                           }} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:bg-[#C5A059] hover:text-[#0A192F] transition-all text-left">{opt}</button>
                         ))}
                      </div>
                    )}
                  </div>
                ))}
                {isBotThinking && <div className="p-4 bg-white/5 rounded-xl animate-pulse text-xs font-black text-[#C5A059]">CHIEF THINKING...</div>}
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3 bg-[#112240]">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()} placeholder="Ask the CSO..." disabled={isBotThinking} className="flex-grow bg-[#0A192F] border border-white/5 text-sm p-4 rounded-xl outline-none focus:border-[#C5A059] transition-all" />
                <button onClick={handleChatSubmit} disabled={isBotThinking} className="p-4 bg-[#C5A059] text-[#0A192F] rounded-xl hover:bg-white transition-all"><Send size={20}/></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="py-56 px-6 border-t border-white/5 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center gap-10 mb-10">
              <div className="w-20 h-20 bg-[#C5A059]/10 flex items-center justify-center rounded-[30px] border border-[#C5A059]/30">
                <HeartHandshake size={48} className="text-[#C5A059]" />
              </div>
              <div>
                <span className="text-4xl font-black tracking-tighter text-white uppercase block leading-none">CPC <span className="text-[#C5A059]">Direct</span></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.7em] mt-3 block italic">Emerging Market Strategists</span>
              </div>
            </div>
            <p className="text-[#8892B0] text-lg font-medium max-w-md italic mb-10 leading-relaxed">Securing Sub-Saharan SME growth through proprietary digital backbone protocols and autonomous frameworks.</p>
            <div className="flex gap-4">
               <button onClick={() => triggerWhatsAppActivation('Footer Quick Connect')} className="px-8 py-4 bg-[#C5A059] text-[#0A192F] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all">Chat CSO</button>
               <a href={`mailto:${EMAIL_ADDRESS}`} className="px-8 py-4 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"><Mail size={14}/> Email Strategists</a>
            </div>
          </div>
          
          <div className="space-y-8">
             <h5 className="text-[#C5A059] font-black uppercase text-[11px] tracking-[0.4em]">Direct Access</h5>
             <div className="space-y-6 text-slate-300 font-bold italic">
                <a href={`mailto:${EMAIL_ADDRESS}`} className="block hover:text-[#C5A059] transition-colors">{EMAIL_ADDRESS}</a>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="block hover:text-[#C5A059] transition-colors">{MOBILE_DISPLAY}</a>
                <p className="text-slate-600 font-black uppercase tracking-widest text-[9px]">Operational Hubs: Lagos // Accra // Nairobi</p>
             </div>
          </div>

          <div className="space-y-8">
             <h5 className="text-[#C5A059] font-black uppercase text-[11px] tracking-[0.4em]">Settlement Layers</h5>
             <p className="text-slate-400 text-xs leading-relaxed italic">All managed service accounts are authorized via regional local currency gateways to ensure zero FX delay.</p>
             <button onClick={() => smoothScrollTo('pricing')} className="text-[10px] font-black text-[#C5A059] uppercase border-b border-[#C5A059]/20 pb-2 tracking-widest hover:border-[#C5A059] transition-all">Review PPP Coverage</button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 mt-24">
           <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.8em] italic">© 2026 {BRAND_NAME} Group. All Rights Reserved.</p>
           <div className="flex gap-10">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Shield size={12}/> Protocol Verified</span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Autonomous Governance v3.1</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
