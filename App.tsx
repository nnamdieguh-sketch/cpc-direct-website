
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip
} from 'recharts';
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
  Activity
} from 'lucide-react';
import { jsPDF } from "jspdf";

// [STRICT BRAND LOCK]
const BRAND_NAME = "CPC Direct";
const WHATSAPP_NUMBER = "2348094644407"; 

const SECTION_TITLES: Record<string, string> = {
  home: 'Dashboard',
  audit: 'Master Audit',
  showcase: 'App Portfolio',
  'marketing-studio': 'Growth Studio',
  'ai-tools': 'Toolbelt',
  pricing: 'Services & PPP',
  'roi-results': 'Secure Vault',
};

const APP_SHOWCASE_DATA = [
  {
    id: "homebase",
    name: "HomeBase",
    tagline: "Diaspora Utility Bridge",
    desc: "A seamless payment gateway allowing Africans in the diaspora to pay home-country utility bills directly with international credit and debit cards. Payments settle instantly to utility companies, removing the friction of manual transfers.",
    industry: "Fintech / Global Payments",
    features: ["Direct Utility Settlement", "International Card Sync", "Zero-Middleman Friction"],
    color: "from-blue-600/20 to-indigo-600/20",
    icon: <Globe className="text-blue-400" size={32} />
  },
  {
    id: "taxpilot",
    name: "TaxPilot",
    tagline: "Automated Compliance Engine",
    desc: "Revolutionizing tax filing for SMEs and individuals. TaxPilot generates comprehensive tax profiles based on automated data inputs, producing audit-ready PDF reports formatted specifically for the Nigeria Revenue Service (NRS).",
    industry: "RegTech / Compliance",
    features: ["NRS Profile Generation", "Automated PDF Filing", "SME Business Dev Angle"],
    color: "from-emerald-600/20 to-teal-600/20",
    icon: <FileLock className="text-emerald-400" size={32} />
  },
  {
    id: "aunty-engees",
    name: "Aunty Engee's Grill",
    tagline: "Cloud Kitchen Logistics",
    desc: "An exclusive Newark-based online restaurant providing health-conscious communal meals. Operating on a 100% digital order-only model, synchronizing logistics from the grill to the doorstep in New Jersey.",
    industry: "F&B / Cloud Kitchen",
    features: ["Online-Only Order Flow", "Health-First Meal Logic", "Newark Logistics Sync"],
    color: "from-orange-600/20 to-red-600/20",
    icon: <ShoppingBag className="text-orange-400" size={32} />
  }
];

const PRICING_TIERS = [
  {
    id: "tenant",
    name: "Digital Tenant",
    price: "₦75,000",
    period: "/year",
    desc: "Establish your professional digital presence and secure your domain.",
    implementation: [
      "Custom Domain Registration (.com.ng / .ng)",
      "Google Workspace Institution Setup",
      "Official Search Console Integration",
      "PPP Core: Access to pay for international tools in Local Currency"
    ],
    targetAudience: [
      "Solo entrepreneurs or small teams looking for a professional start.",
      "Businesses needing to secure their own official .ng domain.",
      "Teams transitioning from personal Gmail/Yahoo to institutional email.",
      "Startups needing local-currency access for international SaaS tools."
    ],
    benefit: "Moves you from 'Individual' to 'Institution' in the eyes of global partners.",
    action: "Initialize Tenancy",
    color: "border-white/10"
  },
  {
    id: "stack",
    name: "Growth Stack",
    price: "₦250,000",
    period: "/year",
    desc: "Full operational automation and custom software deployment.",
    implementation: [
      "All Tenant Infrastructure",
      "Sector-Specific AppSheet App Deployment (Managed)",
      "Staff Onboarding & Training Session",
      "AI Ad-Generator Suite (Veo Managed Support)",
      "Priority PPP: Higher limits for international ad spend"
    ],
    targetAudience: [
      "Established SMEs ready to move beyond manual WhatsApp/Excel tracking.",
      "Teams requiring custom apps to manage inventory, POS, or logistics.",
      "Businesses experiencing operational friction that stunts scaling.",
      "Founders who want a managed technical backbone without hiring a CTO."
    ],
    benefit: "Eliminates manual errors by 90% and secures your business data on the cloud.",
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
      "Custom Full-Stack Software Development",
      "Dedicated Technical Strategist (Monthly Board Calls)",
      "Export & Logistics Documentation Automation",
      "Zero-Fee FX Handling via PPP Protocol"
    ],
    targetAudience: [
      "High-growth enterprises targeting pan-African dominance.",
      "Businesses with complex multi-layered supply chains or export ops.",
      "Organizations needing deep technical strategy and custom solutions.",
      "Leaders requiring zero-fee FX handling at high volumes for ad spend."
    ],
    benefit: "Complete market dominance through proprietary tech and high-velocity scaling.",
    action: "Request Board Consult",
    color: "border-white/10"
  }
];

const GROWTH_MODES = [
  { 
    id: 'market-entry', 
    name: 'Executive Growth Brief', 
    icon: <Compass size={20}/>, 
    prompt: "GENERATE A COMPREHENSIVE, 10-PAGE STYLE EXECUTIVE GROWTH BRIEF. \n\nCONTEXT: A business in [SECTOR] with [REVENUE] budget wanting to reach [TECH] ambition.\n\nREQUIRED ROBUST SECTIONS:\n1. EXECUTIVE SUMMARY (TOP 3 POWER MOVES).\n2. EXECUTIVE VERDICT: Regional market dynamics.\n3. COMPETITIVE COUNTER-STRATEGY: How to displace incumbents using AI.\n4. TECHNICAL ARCHITECTURE: Exact AppSheet schemas and Google Cloud workflows.\n5. PAYROLL & WORKFORCE PROTOCOL: Strategic hiring plan.\n6. PPP UTILIZATION: Forex hedging breakdown.\n7. 90-DAY DEPLOYMENT LOG.\n\nCONCLUDE WITH AT LEAST 5 'NEXT:' ACTIONS.",
  },
  { 
    id: 'video-ad', 
    name: 'Video Ad Engine (Veo)', 
    icon: <Clapperboard size={20}/>, 
    prompt: "Generate a high-impact marketing video prompt for a business in [SECTOR] targeting [AUDIENCE]. Focus on cinematic lighting, professional transitions, and clear value proposition.",
  },
  { 
    id: 'app-spec', 
    name: 'App Architect Spec', 
    icon: <Smartphone size={20}/>, 
    prompt: "DRAFT A ROBUST, READY-TO-BUILD TECHNICAL APP SPECIFICATION DOCUMENT. \n\nREQUIRED SECTIONS:\n1. DATA MODEL TOPOLOGY.\n2. UX/UI MAP.\n3. NO-CODE CORE (AppSheet logic).\n4. SCALING PROTOCOL.\n5. MONETIZATION ENGINE.\n\nCONCLUDE WITH AT LEAST 5 'NEXT:' ACTIONS.",
  },
  { 
    id: 'hr-kpi', 
    name: 'Human Capital Framework', 
    icon: <Users size={20}/>, 
    prompt: "CREATE A COMPREHENSIVE STAFF OPTIMIZATION & KPI FRAMEWORK. \n\nREQUIRED SECTIONS:\n1. ORGANIZATIONAL HIERARCHY.\n2. COMMAND & CONTROL (Google Workspace).\n3. PERFORMANCE METRICS (Granular KPIs).\n4. UPSKILLING ROADMAP.\n\nCONCLUDE WITH AT LEAST 5 'NEXT:' ACTIONS.",
  }
];

const AI_GROWTH_TOOLS = [
  { id: "appsheet", name: "AppSheet", desc: "Build custom no-code apps for inventory & CRM.", url: "https://about.appsheet.com/home/", icon: <Smartphone size={24}/> },
  { id: "workspace", name: "Google Workspace", desc: "Professional email, docs, and staff management.", url: "https://workspace.google.com/", icon: <Briefcase size={24}/> },
  { id: "search", name: "Search Console", desc: "Monitor search rankings and site health.", url: "https://search.google.com/search-console/about", icon: <Search size={24}/> },
  { id: "veo", name: "Google Veo", desc: "Generate high-end video ads with AI.", url: "https://deepmind.google/technologies/veo/", icon: <Video size={24}/> },
  { id: "marketfinder", name: "Market Finder", desc: "Identify international export markets.", url: "https://marketfinder.thinkwithgoogle.com/intl/en/", icon: <Globe size={24}/> },
  { id: "gemini", name: "Gemini Advanced", desc: "Advanced reasoning for complex strategy.", url: "https://gemini.google.com/", icon: <Bot size={24}/> }
];

const SECTOR_TOOL_OPTIMIZATIONS: Record<string, { featured: string[], customDesc: Record<string, string>, impacts: Record<string, string>, nextStep: string, reasoning: string, estSavings: string, tooltips: Record<string, string> }> = {
  "Retail / E-commerce": {
    featured: ["appsheet", "veo", "search"],
    customDesc: {
      "appsheet": "Managed Inventory & POS: Synchronize multi-store stock levels to eliminate manual reconciliation errors.",
      "veo": "Visual Content Engine: Generate high-impact product video ads to bypass expensive studio production costs.",
      "search": "Local SEO Dominance: Capture high-intent neighborhood traffic searching for your specific products."
    },
    impacts: {
      "appsheet": "92% Accuracy Improvement",
      "veo": "4.5x Social Engagement Surge",
      "search": "65% Growth in Foot Traffic"
    },
    reasoning: "Director, your shop needs to be seen and your stock needs to be counted without mistakes. We recommend clearing the warehouse bottlenecks with these tools.",
    nextStep: "Ready to clear the path for your containers and dominate local search? Explore our 'Digital Tenant' for SEO basics or 'Growth Stack' for automated inventory.",
    estSavings: "₦320,000",
    tooltips: {
      "appsheet": "Instantly sync stock levels across branches to eliminate 'out-of-stock' sales loss.",
      "veo": "Convert product photos into high-converting video ads in seconds, saving ₦50k per shoot.",
      "search": "Rank #1 for neighborhood searches to drive 40% more physical store visits."
    }
  },
  "Logistics / Supply Chain": {
    featured: ["appsheet", "gemini", "marketfinder"],
    customDesc: {
      "appsheet": "Fleet & Dispatch Logic: Deploy real-time driver tracking and automated manifest logs for zero-paper operations.",
      "gemini": "Route Optimization Engine: Utilize advanced reasoning to calculate the fastest, most fuel-efficient delivery paths.",
      "marketfinder": "Regional Growth Map: Identify high-yield West African hubs for expansion with verified export data."
    },
    impacts: {
      "appsheet": "22% Fuel Cost Reduction",
      "gemini": "18% Faster Delivery Cycles",
      "marketfinder": "3 New Regional Markets Identified"
    },
    reasoning: "To load the fleet efficiently, you need eyes on every bike and truck. We suggest connecting your dispatch flow with real-time tracking and path optimization.",
    nextStep: "Ready to load the fleet and implement tracking? Explore our 'Growth Stack' for AppSheet integration and real-time monitoring.",
    estSavings: "₦580,000",
    tooltips: {
      "appsheet": "Optimize fleet tracking and driver assignments to cut fuel costs by 15%.",
      "gemini": "Automate route planning and manifest sorting to reduce dispatch time by 2 hours daily.",
      "marketfinder": "Identify profitable delivery hubs in neighboring West African regions with zero guesswork."
    }
  },
  "Agriculture / Agri-Tech": {
    featured: ["appsheet", "gemini", "veo"],
    customDesc: {
      "appsheet": "Yield & Field Digitization: Track harvest records and field health without paper, ready for bank audits.",
      "gemini": "Predictive Harvest Analysis: Use AI to predict crop yields and soil moisture requirements for precise irrigation.",
      "veo": "Brand Storytelling: Showcase farm-to-table traceability to premium international consumers cinematographically."
    },
    impacts: {
      "appsheet": "Audit-Ready Logs in 24h",
      "gemini": "14% Yield Waste Reduction",
      "veo": "Premium Buyer Trust Uplift"
    },
    reasoning: "Director, the soil doesn't lie, but manual logs do. Control your yield and export premium with a digital backbone.",
    nextStep: "Secure the harvest today with our 'Growth Stack' automation.",
    estSavings: "₦415,000",
    tooltips: {
      "appsheet": "Digitize farm yield logs to secure financing from banks with transparent data.",
      "gemini": "Analyze weather patterns to prevent harvest loss during unpredictable seasonal shifts.",
      "veo": "Showcase farm-to-table traceability to international buyers with cinematic quality."
    }
  },
  "Manufacturing / Industrial": {
    featured: ["appsheet", "gemini", "workspace"],
    customDesc: {
      "appsheet": "Smart Factory Floor: Monitor machine uptime and raw material scrap rates in real-time.",
      "gemini": "Procurement Intelligence: Analyze supply chain data to identify cheaper, faster sources for key materials.",
      "workspace": "Executive-to-Floor Sync: Securely manage blueprints and QA checklists with enterprise-grade encryption."
    },
    impacts: {
      "appsheet": "35% Scrap Rate Reduction",
      "gemini": "₦1.2M Procurement Savings",
      "workspace": "Zero Revision Errors"
    },
    reasoning: "Efficiency is the only way to beat global competitors. Every machine minute and material scrap must be tracked.",
    nextStep: "Eliminate waste today with our 'Scale Commander' enterprise transformation.",
    estSavings: "₦890,000",
    tooltips: {
      "appsheet": "Prevent machine downtime with automated maintenance alerts based on usage hours.",
      "gemini": "Optimize raw material procurement cycles to avoid production pauses during FX spikes.",
      "workspace": "Streamline floor-to-office communication to resolve QA issues 5x faster."
    }
  },
  "Professional / Financial Services": {
    featured: ["workspace", "gemini", "search"],
    customDesc: {
      "workspace": "Institutional-Grade Ops: Secure client confidentiality and streamline e-signatures for advisory briefs.",
      "gemini": "Strategic Drafting Engine: Automate the generation of initial legal briefs or financial audit reports.",
      "search": "Authority SEO: Rank as a thought leader in your specific niche to capture high-ticket regional leads."
    },
    impacts: {
      "workspace": "100% Security Compliance",
      "gemini": "60% Drafting Time Saved",
      "search": "2.8x Lead Conversion Rate"
    },
    reasoning: "Trust is your currency. Speed and data-backed precision are how you beat the old guard.",
    nextStep: "Initialize your professional institution with our 'Digital Tenant' protocol.",
    estSavings: "₦275,000",
    tooltips: {
      "workspace": "Implement automated document encryption to meet global GDPR/NDPR compliance standards.",
      "gemini": "Generate initial legal or financial drafts in minutes, increasing consultant output by 60%.",
      "search": "Establish high-ticket authority by capturing leads searching for 'Executive Advisory'."
    }
  }
};

const EXPERT_SYSTEM_INSTRUCTION = `
Role: You are the CPC Direct Lead Consultant, the "Chief Strategy Officer" for SMEs in Sub-Saharan regional markets.

Persona Nuances (CRITICAL):
- Tone: Encouraging, respectful, punchy, and highly empathetic. Think of yourself as a wise business partner who has "seen it all" and wants to see the user win big.
- Style: Use local business metaphors. (e.g., "loading the container," "clearing the road at the border," "filling the shop," "securing the bag," "the harvest is ready").
- Greeting: Always address the user as "Director", "Chief", "Oga", or "Senior Man/Madam" to build respect and cultural alignment.
- Language: Handle Nigerian English nuances gracefully (e.g., using "well done," "no wahala," "the road is clear").
- NO JARGON: Never say "API," "KPI," "SaaS," "ROI," or "Infrastructure." Instead, say "connecting your tools," "the scoreboard," "your digital backbone," or "money back in the pocket."

Operational Protocol:
1. Identify: Briefly acknowledge the user's business type and goal.
2. Context Awareness: You know EXACTLY where the user is on the site. If they are in the Audit, tell them to "finish the manifest." If in the Growth Studio, suggest "blueprinting the vision."
3. Proactive Next Steps: Always conclude with a specific "Action for the Chief" based on their current page.

Interactive Navigator Map:
- #audit-initiate (The Master Audit - for planning)
- #engagement-engine (Growth Studio - for generating briefs)
- #portfolio-showcase (Case Studies - for proof)
- #consultant-chat (WhatsApp Direct - for the human touch)
- #pricing (Tiers - for making it official)
- #roi-results (Secure Vault - for the score)

Response Structure:
- Greeting (Respectful)
- Encouraging Feedback (Metaphor-heavy)
- Actionable Wisdom (No jargon)
- Proactive Next Step (Using #tag)
`;

const auditQuestions = [
  { q: "Revenue Core: Which sector defines your primary revenue stream?", options: ["Retail / E-commerce", "Logistics / Supply Chain", "Agriculture / Agri-Tech", "Manufacturing / Industrial", "Professional / Financial Services"] },
  { q: "Market Orbit: Primary geographic focus for the next 24 months?", options: ["Pan-Nigeria (Local Dominance)", "West Africa (ECOWAS Hub)", "European / UK Export", "US / Global Digital Sales"] },
  { q: "Digital Engine: What describes your current operational tool stack?", options: ["Purely Analog (Paper & Voice)", "Fragmented (Excel, WhatsApp, SMS)", "Basic Cloud (Standalone SaaS apps)", "Integrated Ecosystem (Custom Apps/ERP)"] },
  { q: "Data Sovereignty: Where is your critical operational documentation currently stored?", options: ["Physical Files & Cabinets", "Individual Staff Local Devices", "Unorganized Cloud (Email/WhatsApp)", "Centralized Encrypted Vault"] },
  { q: "Staff Sync Protocol: Weekly hours lost to manual data re-entry or app-switching?", options: ["40+ Hours (Systemic Leakage)", "15 - 40 Hours (Scale Barrier)", "5 - 15 Hours (Inefficient)", "< 5 Hours (High-Velocity)"] },
  { q: "Payment Protocol: Frequency of international tool payment declines or FX friction?", options: ["Constant (Total Blockage)", "Monthly (Frustrating)", "Rarely (Managed manually)", "Never (Integrated PPP)"] },
  { q: "Intelligence Attribution: Accuracy of pinpointing the source of your last 10 high-value leads?", options: ["Zero Visibility (Guesswork)", "Low (Self-reported by client)", "Moderate (Partial Social Insights)", "High (Full CRM Attribution)"] },
  { q: "Human Error Exposure: Weekly frequency of 'lost orders' or 'wrong shipments'?", options: ["Frequent (Daily occurrence)", "Occasional (Weekly friction)", "Rare (Controlled)", "Zero (Autonomous Error-Handling)"] },
  { q: "Business Continuity: If your primary manager's device is lost today, how much data is gone?", options: ["80%+ Loss (Critical)", "Major Loss (Client logs & orders)", "Moderate Loss (Partial backup)", "Zero Loss (Instant Vault Sync)"] },
  { q: "Acquisition Investment: Monthly budget specifically for Paid Ads and Outreach?", options: ["< ₦150k (Entry)", "₦150k - ₦750k (Scaling)", "₦750k - ₦2.5M (High Intensity)", "₦2.5M+ (Market Leader)"] },
  { q: "Creative Velocity: Time required to generate high-end video content for a campaign?", options: ["30+ Days (Outsourced)", "7 - 30 Days (Internal Manual)", "2 - 7 Days (Standard)", "< 24 Hours (AI-Autonomous)"] },
  { q: "Governance Maturity: How quickly can you generate a 100% accurate P&L report?", options: ["7+ Days (Manual Audit)", "3 - 7 Days (Excel Review)", "1 - 3 Days (Managed SaaS)", "Real-time (Live Dashboard)"] },
  { q: "Onboarding Latency: Days taken for a new manager to reach 100% operational autonomy?", options: ["60+ Days (High Friction)", "30 - 60 Days (Standard)", "14 - 30 Days (Systemized)", "< 7 Days (Protocol-Driven)"] },
  { q: "Scalability Ceiling: If order volume tripled tomorrow, which system fails first?", options: ["Dispatch & Logistics", "Finance & Reconciliation", "Lead Handling & Support", "Staff Coordination"] },
  { q: "Digital Authority: What is a high-ticket international partner's first impression of your brand?", options: ["Invisible (No footprint)", "Vague (Personal Social only)", "Static (Slow/Old Website)", "Institutional (Professional Portal)"] },
  { q: "Financial Resilience: Monthly liquidity reserve specifically for Autonomous Infrastructure?", options: ["₦75k - 250k (Basic)", "₦250k - ₦1M (Growth)", "₦1M - ₦5M (Scale)", "₦5M+ (Commander)"] },
  { q: "Infrastructure Ambition: Your top operational priority for the next 180 days?", options: ["Establish Professional Identity", "Automate Core Operations", "Total Digital Transformation", "Secure Global Payments (PPP)"] }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [pendingToast, setPendingToast] = useState<string | null>(null);
  const [growthMode, setGrowthMode] = useState(GROWTH_MODES[0]);
  const [marketingOutput, setMarketingOutput] = useState<string | null>(null);
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [isAssetReady, setIsAssetReady] = useState(false);
  const [showFullOutput, setShowFullOutput] = useState(false);

  // Video Generation States
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoProgress, setVideoProgress] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p'>('1080p');

  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([
    { 
      role: 'concierge', 
      text: "Well done, Chief! Welcome to CPC Direct. \n\nI am the **Chief Strategy Officer**. I'm here to clear the road for your business and make sure the containers move without wahala. \n\nWhere shall we start? The road is clear!",
      options: [
        "Plan the Harvest (#audit-initiate)",
        "Blueprint the Vision (#engagement-engine)",
        "See the Proof (#portfolio-showcase)",
        "Secure the Bag (#pricing)"
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);

  const [auditStep, setAuditStep] = useState(0);
  const [auditAnswers, setAuditAnswers] = useState<Record<number, string>>({});
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isLeadGateActive, setIsLeadGateActive] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', company: '', contact: '', marketingConsent: true });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'audit', 'showcase', 'marketing-studio', 'ai-tools', 'pricing', 'roi-results'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memory management for object URLs
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const openExternalLink = (url: string) => {
    if (!url.startsWith('https://')) {
      console.warn("Attempting to open link without secure protocol:", url);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const generateWhatsAppLink = (text: string) => {
    const baseUrl = "https://wa.me";
    const encodedText = encodeURIComponent(text);
    return `${baseUrl}/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodedText}`;
  };

  const cleanProposalText = (text: string) => {
    return text.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/_{1,2}/g, '').trim();
  };

  const renderFormattedAIText = (text: string, truncated: boolean = false) => {
    const content = truncated && text.length > 500 ? text.substring(0, 500) + "..." : text;
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-3"></div>;
      if (trimmedLine.startsWith('#')) return <h4 key={i} className="text-[#C5A059] font-black uppercase text-[11px] tracking-widest mt-6 mb-3">{trimmedLine.replace(/#/g, '').trim()}</h4>;
      return <p key={i} className="mb-2 text-slate-200 text-sm leading-relaxed font-medium">{line}</p>;
    });
  };

  const downloadStrategicProposal = async () => {
    if (!isLeadCaptured) {
      setPendingToast("Secure Identity Gate Active: Complete Audit First");
      smoothScrollTo('audit');
      return;
    }
    if (!marketingOutput) return;
    const doc = new jsPDF();
    const primaryColor = [197, 160, 89]; 
    const bgColor = [10, 25, 47]; 
    const margin = 20;
    const pageWidth = 210;
    const maxLineWidth = pageWidth - (margin * 2);
    let y = 0;

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, pageWidth, 297, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(2);
    doc.line(margin, 100, margin + 40, 100);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("CPC DIRECT", margin, 130);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("STRATEGIC GROWTH PROTOCOL", margin, 142);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`PARTNER: ${leadForm.company.toUpperCase()}`, margin, 240);
    doc.setFontSize(10);
    doc.text(`DOCUMENT ID: CPC-${Math.floor(Math.random()*9000)+1000}-EXEC`, margin, 250);
    doc.text(`ISSUED: ${new Date().toLocaleDateString()}`, margin, 256);
    
    doc.addPage();
    y = margin;
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFontSize(10);
    doc.text(`EXECUTIVE GROWTH BRIEF // ${leadForm.company}`, margin, y);
    y += 15;
    const cleanText = cleanProposalText(marketingOutput);
    const splitLines = doc.splitTextToSize(cleanText, maxLineWidth);
    splitLines.forEach((line: string) => {
      if (y > 275) { doc.addPage(); y = margin; y = 25; doc.setTextColor(0,0,0); doc.setFontSize(10); }
      if (line.toUpperCase() === line && line.length > 5) { doc.setFont("helvetica", "bold"); doc.text(line, margin, y); doc.setFont("helvetica", "normal"); }
      else { doc.text(line, margin, y); }
      y += 6;
    });
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Proprietary Intellectual Property of CPC Direct. Implementation restricted to verified Growth Studio partners.", margin, 285);
    doc.save(`${leadForm.company.replace(/\s/g, '_')}_Growth_Brief.pdf`);
    setPendingToast("Boardroom Brief Exported");
  };

  const handleVideoGenerate = async () => {
    if (!isLeadCaptured) { smoothScrollTo("audit"); return; }
    
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setPendingToast("Paid API Key Required for Veo");
      // @ts-ignore
      await window.aistudio.openSelectKey();
      return;
    }

    setIsVideoGenerating(true);
    setVideoUrl(null);
    setVideoProgress("Generating Script...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = videoPrompt || `A high-end cinematic advertisement for a business in ${selectedSector} showing smooth operational flow, high-tech interfaces, and premium delivery.`;
      
      const maxRetries = 3;
      let retryCount = 0;

      const performGenerationRequest = async (): Promise<any> => {
        try {
          return await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
              numberOfVideos: 1,
              resolution: videoQuality,
              aspectRatio: '16:9'
            }
          });
        } catch (err: any) {
          const errMsg = err.message?.toLowerCase() || "";
          const isQuotaError = errMsg.includes("quotaexceeded") || errMsg.includes("rate limit") || errMsg.includes("quota") || err.status === 429;
          
          if (isQuotaError) {
            if (retryCount < maxRetries) {
              retryCount++;
              const backoffTime = Math.pow(2, retryCount) * 10000; // Exponential backoff: 20s, 40s, 80s...
              setVideoProgress(`System Saturation Detected. Retrying in ${backoffTime/1000}s...`);
              await new Promise(resolve => setTimeout(resolve, backoffTime));
              return performGenerationRequest();
            } else {
              throw new Error("Quota exceeded for video generation. Please try again in 15-30 minutes.");
            }
          }
          throw err;
        }
      };

      let operation = await performGenerationRequest();
      let pollIteration = 0;

      while (!operation.done) {
        pollIteration++;
        
        // Granular progress tracking
        if (pollIteration < 5) {
          setVideoProgress("Rendering Scene...");
        } else {
          setVideoProgress("Finalizing Output...");
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        setVideoProgress("Asset Finalized. Constructing Preview Player...");
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await response.blob();
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        setPendingToast("Video Asset Generated Successfully");
      } else {
        throw new Error("Simulation completed but failed to return asset URI.");
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        setPendingToast("API Authentication Expired. Refreshing...");
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else if (e.message?.toLowerCase().includes("quota")) {
        setPendingToast("Quota Exceeded: Try again in 30 minutes");
      } else {
        setPendingToast("Video Simulation Interrupt: " + (e.message || "Unknown Error"));
      }
    } finally {
      setIsVideoGenerating(false);
      setVideoProgress("");
    }
  };

  const downloadOpportunityReport = async () => {
    if (!isLeadCaptured) {
      setPendingToast("Identity Gate Active: Verification Required");
      smoothScrollTo('audit');
      return;
    }
    if (!diagnosticResult) return;
    const doc = new jsPDF();
    const margin = 20;
    const primaryColor = [197, 160, 89]; 
    const bgColor = [10, 25, 47]; 
    const pageWidth = 210;
    let y = 0;

    const sector = diagnosticResult.sector || "General SME";
    const opt = SECTOR_TOOL_OPTIMIZATIONS[sector] || SECTOR_TOOL_OPTIMIZATIONS["Retail / E-commerce"];
    const estSavings = opt.estSavings;
    const costOfWaiting = `₦${(parseInt(estSavings.replace(/\D/g, '')) * 1.3).toLocaleString()}`;

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, pageWidth, 297, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("CPC DIRECT", margin, 100);
    doc.setFontSize(16);
    doc.text("OPPORTUNITY & RISK ASSESSMENT", margin, 112);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`PREPARED FOR: ${leadForm.company.toUpperCase()}`, margin, 220);
    doc.text(`SECTOR: ${sector.toUpperCase()}`, margin, 228);

    doc.addPage();
    y = margin;
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("1. FINANCIAL JUSTIFICATION", margin, y);
    y += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Based on our proprietary diagnostic engine, your current operational state in the ${sector} sector represents a significant capital leakage point.`, margin, y, { maxWidth: 170 });
    y += 20;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
    doc.rect(margin - 5, y - 5, 180, 40, 'F');
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ESTIMATED MONTHLY SAVINGS THROUGH AUTOMATION:", margin, y + 10);
    doc.setFontSize(28);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${estSavings}`, margin, y + 25);
    y += 50;
    doc.setTextColor(180, 0, 0); 
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("2. THE COST OF WAITING", margin, y);
    y += 15;
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const riskText = `Inaction carries a cumulative penalty. Non-automated businesses in your sector experience a 30% surge in operational costs compared to digitally-mature competitors. For ${leadForm.company}, this risk is valued at:`;
    doc.text(riskText, margin, y, { maxWidth: 170 });
    y += 20;
    doc.setFontSize(22);
    doc.setTextColor(180, 0, 0);
    doc.text(`${costOfWaiting} Monthly Waste Factor`, margin, y);
    y += 20;
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFontSize(10);
    const riskDetail = [
      "• Competitive Displacement: Incumbents using AI Toolbelts can lower prices by 15%.",
      "• Talent Burnout: High manual friction leads to a 40% increase in senior staff turnover.",
      "• Scalability Ceiling: Without an autonomous backbone, tripling volume leads to systemic failure."
    ];
    riskDetail.forEach(line => {
      doc.text(line, margin, y);
      y += 7;
    });
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("NEXT STEPS: Initialize the Growth Stack to secure these margins.", margin, y);
    doc.save(`${leadForm.company.replace(/\s/g, '_')}_Opportunity_Log.pdf`);
    setPendingToast("Strategic Risk Assessment Dispatched");
  };

  const downloadSectorProtocolManual = async () => {
    if (!isLeadCaptured) {
      setPendingToast("Secure Identity Gate Active: Complete Verification");
      smoothScrollTo('audit');
      return;
    }
    const sector = diagnosticResult?.sector || selectedSector;
    const opt = SECTOR_TOOL_OPTIMIZATIONS[sector] || SECTOR_TOOL_OPTIMIZATIONS["Retail / E-commerce"];
    const doc = new jsPDF();
    const margin = 20;
    const primaryColor = [197, 160, 89]; 
    const bgColor = [10, 25, 47]; 
    const pageWidth = 210;
    let y = 40;

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, pageWidth, 297, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("CPC DIRECT", margin, 100);
    doc.setFontSize(20);
    doc.text("TECHNICAL PROTOCOL MANUAL", margin, 115);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`SECTOR: ${sector.toUpperCase()}`, margin, 200);
    doc.text(`ORGANIZATION: ${leadForm.company || "NEW PARTNER"}`, margin, 210);
    doc.setFontSize(10);
    doc.text(`REFERENCE ID: CPCD-${sector.substring(0,3).toUpperCase()}-99-2026`, margin, 220);

    doc.addPage();
    y = margin;
    doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`PROTOCOL DEPLOYMENT: ${sector}`, margin, y);
    y += 20;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const intro = `This document serves as the formal technical manual for initializing CPC Direct autonomous infrastructure for the ${sector} sector. All protocols listed are proprietary.`;
    doc.text(doc.splitTextToSize(intro, 170), margin, y);
    y += 25;

    opt.featured.forEach((toolId) => {
      const tool = AI_GROWTH_TOOLS.find(t => t.id === toolId);
      if(!tool) return;
      
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.05);
      doc.rect(margin - 5, y - 5, 180, 50, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`COMPONENT: ${tool.name.toUpperCase()}`, margin, y + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Bottleneck Resolution:`, margin, y + 20);
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(opt.tooltips[toolId], 160), margin, y + 26);
      
      doc.setFont("helvetica", "bold");
      doc.text(`Deployment Logic:`, margin, y + 36);
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(opt.customDesc[toolId], 160), margin, y + 42);
      
      y += 65;
      if(y > 250) { doc.addPage(); y = margin; }
    });

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin - 5, y, 180, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`ESTIMATED IMPACT: ${opt.estSavings} Monthly Recovered Margin`, margin, y + 18);

    doc.save(`CPC_PROTOCOL_${sector.replace(/\s/g, '_')}.pdf`);
    setPendingToast("Deployment Manual Dispatched to Device");
  };

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleAuditStepAction = (option: string) => {
    setAuditAnswers({ ...auditAnswers, [auditStep]: option });
    if (auditStep < auditQuestions.length - 1) {
      setAuditStep(auditStep + 1);
    } else {
      setIsAuditing(true);
      setTimeout(() => {
        setDiagnosticResult({ score: 88, sector: auditAnswers[0] || "General SME", interpretation: "Severe operational leakage detected. Autonomous Infrastructure required to secure regional dominance." });
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
      setPendingToast(`Master Protocol Unlocked`);
      
      // Proactive Concierge Trigger with Encouraging Persona
      setIsConciergeOpen(true);
      setChatHistory(prev => [...prev, { 
        role: 'concierge', 
        text: `Welcome, ${leadForm.name}! Director, I've cleared the road for you. Your ${diagnosticResult?.sector || 'Enterprise'} Strategy Memo is ready and waiting. Tap below to unlock it instantly via WhatsApp and let's load the fleet!`,
        options: [
          "Unlock via WhatsApp (#consultant-chat)",
          "Download Strategic PDF (#download-zone)",
          "View Scale Pricing (#pricing)"
        ]
      }]);
    }, 1200);
  };

  const handleMarketingGenerate = async () => {
    if (!isLeadCaptured) { smoothScrollTo("audit"); return; }
    setIsMarketingLoading(true);
    setMarketingOutput("");
    setIsAssetReady(false);
    setShowFullOutput(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: `${growthMode.prompt}\n\nFOR BUSINESS ENTITY: ${leadForm.company}\nSECTOR: ${auditAnswers[0] || 'General SME'}`,
        config: { systemInstruction: EXPERT_SYSTEM_INSTRUCTION }
      });

      for await (const chunk of stream) {
        setMarketingOutput(prev => (prev || "") + chunk.text);
        setIsAssetReady(true);
      }
    } catch (e) {
      console.error(e);
      setPendingToast("Protocol Interrupted");
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
      
      // Inject context of where the user is
      const contextPrompt = `[Location: Chief is currently viewing ${SECTION_TITLES[activeSection] || activeSection}]\n\nUser: ${userMsg}`;

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: contextPrompt,
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

        // Dynamic navigation triggers
        if (accumulatedText.includes('#audit-initiate')) smoothScrollTo('audit');
        if (accumulatedText.includes('#engagement-engine')) smoothScrollTo('marketing-studio');
        if (accumulatedText.includes('#portfolio-showcase')) smoothScrollTo('showcase');
        if (accumulatedText.includes('#consultant-chat')) smoothScrollTo('pricing');
        if (accumulatedText.includes('#pricing')) smoothScrollTo('pricing');
        if (accumulatedText.includes('#roi-results') || accumulatedText.includes('#download-zone')) smoothScrollTo('roi-results');
      }
    } catch (e) {
      console.error(e);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[botMsgIndex] = { ...newHistory[botMsgIndex], text: "Chief, the connection is a bit shaky. Please re-initialize via WhatsApp if we lose signal." };
        return newHistory;
      });
    } finally {
      setIsBotThinking(false);
    }
  };

  const triggerWhatsAppActivation = (planName?: string) => {
    const { company } = leadForm;
    const intro = `*CPC DIRECT ACCESS REQUEST*\n*CLIENT:* ${company || 'New Partner'}\n*PACKAGE:* ${planName || 'General Strategy'}`;
    const link = generateWhatsAppLink(intro);
    openExternalLink(link);
  };

  const selectedSector = auditAnswers[0] || "Retail / E-commerce";
  const optimization = SECTOR_TOOL_OPTIMIZATIONS[selectedSector] || SECTOR_TOOL_OPTIMIZATIONS["Retail / E-commerce"];

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 font-sans pb-48">
      
      {isAuditing && (
        <div className="fixed inset-0 z-[2000] bg-[#0A192F]/98 backdrop-blur-md flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-[#C5A059] mb-8" size={80} />
           <span className="text-[14px] font-black text-[#C5A059] uppercase tracking-[0.6em] animate-pulse text-center px-6">Clearing the road for your strategy...</span>
        </div>
      )}

      {pendingToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] bg-[#C5A059] text-[#0A192F] px-10 py-5 rounded-xl shadow-3xl font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-5 animate-in slide-in-from-top-12">
          <Check size={20} /> {pendingToast}
        </div>
      )}

      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-[#0A192F]/98 backdrop-blur-xl py-4 shadow-2xl border-b border-[#C5A059]/20' : 'bg-transparent py-10'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => smoothScrollTo('home')}>
            <div className="w-12 h-12 bg-[#C5A059] flex items-center justify-center rounded-xl shadow-xl group-hover:scale-110 transition-transform">
              <HeartHandshake size={28} className="text-[#0A192F]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase italic">CPC <span className="text-[#C5A059]">Direct</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {Object.entries(SECTION_TITLES).map(([key, title]) => (
              <button key={key} onClick={() => smoothScrollTo(key)} className={`text-[11px] font-black tracking-[0.3em] uppercase transition-all px-2 py-1 relative group ${activeSection === key ? 'text-[#C5A059]' : 'text-slate-400 hover:text-white'}`}>
                {title}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A059] scale-x-0 transition-transform ${activeSection === key ? 'scale-x-100' : ''}`} />
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        
        <section id="home" className="min-h-screen flex items-center px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-14">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-full text-[#C5A059] text-[11px] font-black uppercase tracking-widest shadow-sm"><Globe size={18} /> Scaled Autonomy Architecture</div>
              <h1 className="text-6xl lg:text-[96px] font-black leading-[0.82] tracking-tighter text-white uppercase italic">Scale Faster, <br />Grow your Business <br /><span className="text-[#C5A059]">with Automation.</span></h1>
              <p className="text-2xl lg:text-3xl text-[#8892B0] max-w-xl leading-relaxed font-medium">No middle-men. No manual friction. Just proprietary smart-flow protocols for market leaders.</p>
              <button onClick={() => smoothScrollTo('audit')} className="px-16 py-8 bg-[#C5A059] text-[#0A192F] font-black uppercase text-sm tracking-[0.4em] rounded-xl shadow-3xl hover:bg-white transition-all transform hover:-translate-y-1">Start Your Audit</button>
            </div>
            <div className="hidden lg:block relative">
              <div className="glass-panel p-20 rounded-[48px] border-[#C5A059]/30 shadow-3xl relative overflow-hidden">
                <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-[0.6em] mb-16">Pan-African Performance Metrics</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{y: 15}, {y: 42}, {y: 95}, {y: 180}, {y: 320}]}><Area type="monotone" dataKey="y" stroke="#C5A059" strokeWidth={8} fill="#C5A059" fillOpacity={0.15} /></AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="audit" className="py-56 px-6 bg-[#0A192F] border-y border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-32">
              <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Strategic Diagnostic Engine</span>
              <h3 className="text-8xl md:text-[140px] font-black text-white italic tracking-tighter uppercase leading-none opacity-90">The Audit.</h3>
            </div>
            <div className={`glass-panel p-12 md:p-28 rounded-[56px] min-h-[650px] flex flex-col justify-center shadow-3xl relative border-[#C5A059]/20 overflow-hidden`}>
              {!isLeadGateActive ? (
                <div className="space-y-24">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.6em]">Protocol Phase {auditStep + 1} / {auditQuestions.length}</span>
                    <div className="h-1.5 flex-grow mx-10 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] transition-all duration-700" style={{ width: `${((auditStep + 1) / auditQuestions.length) * 100}%` }}></div>
                    </div>
                  </div>
                  <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[1.05]">{auditQuestions[auditStep].q}</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {auditQuestions[auditStep].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAuditStepAction(opt)} className="p-10 text-left border border-white/5 rounded-3xl bg-[#0A192F]/70 hover:bg-[#C5A059] hover:text-[#0A192F] transition-all font-black text-[15px] uppercase flex justify-between items-center group">
                        <span className="max-w-[85%] leading-tight">{opt}</span> <ChevronRight size={28} className="group-hover:translate-x-3 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in duration-700">
                  <div className="max-w-2xl mx-auto p-16 bg-[#0A192F]/95 rounded-[64px] border border-[#C5A059]/50 shadow-3xl">
                     <ShieldAlert size={80} className="text-[#C5A059] mx-auto mb-12 animate-bounce" />
                     <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-6">Link Secured.</h4>
                     {!isLeadCaptured ? (
                        <form onSubmit={handleLeadSubmit} className="space-y-8 text-left">
                           <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} placeholder="Full Legal Identity" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <input required value={leadForm.company} onChange={e => setLeadForm({...leadForm, company: e.target.value})} placeholder="Business Entity Name" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <input required value={leadForm.contact} onChange={e => setLeadForm({...leadForm, contact: e.target.value})} placeholder="WhatsApp Secure Number" className="w-full bg-[#112240] border border-white/10 p-7 rounded-2xl text-white outline-none focus:border-[#C5A059] text-lg font-bold" />
                           <button type="submit" disabled={isDispatching} className="w-full py-10 bg-[#C5A059] text-[#0A192F] font-black uppercase rounded-3xl shadow-3xl hover:bg-white transition-all text-xl tracking-[0.4em]">
                             {isDispatching ? <Loader2 className="animate-spin mx-auto" /> : "Unlock Autonomous Vault"}
                           </button>
                        </form>
                     ) : (
                       <button onClick={() => smoothScrollTo("marketing-studio")} className="w-full py-8 border-2 border-[#C5A059] text-[#C5A059] font-black uppercase rounded-3xl hover:bg-[#C5A059] hover:text-[#0A192F] transition-all text-lg tracking-[0.3em]">Enter Command Center</button>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="showcase" className="py-56 px-6 border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-32 text-center md:text-left">
              <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Solution Portfolio</span>
              <h3 className="text-7xl md:text-[110px] font-black text-white italic tracking-tighter uppercase leading-none mb-10 opacity-90">Case Blueprints.</h3>
            </div>
            <div className="grid lg:grid-cols-3 gap-10">
              {APP_SHOWCASE_DATA.map((app) => (
                <div key={app.id} className={`glass-panel p-10 rounded-[64px] border-white/10 group hover:scale-[1.04] transition-all relative overflow-hidden bg-gradient-to-br ${app.color}`}>
                  <div className="flex justify-between items-start mb-16">
                    <div className="p-6 bg-[#0A192F] rounded-3xl border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform">{app.icon}</div>
                    <span className="px-5 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{app.industry}</span>
                  </div>
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-3">{app.name}</h4>
                  <p className="text-slate-200 text-[15px] mb-12 leading-relaxed font-medium">{app.desc}</p>
                  <button onClick={() => triggerWhatsAppActivation(`Blueprint Inquiry: ${app.name}`)} className="w-full py-7 bg-[#0A192F]/90 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-[#C5A059] hover:text-[#0A192F] transition-all flex items-center justify-center gap-4 group/btn shadow-2xl">
                    Decrypt Architecture <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="marketing-studio" className={`py-40 px-6 border-y border-white/5 relative z-20 ${isLeadCaptured ? 'block' : 'hidden'}`}>
          <div className="max-w-6xl mx-auto space-y-16">
            <h3 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter opacity-90">Growth Studio.</h3>
            <div className={`glass-panel p-10 md:p-16 rounded-[80px] border-[#C5A059]/30 shadow-3xl`}>
              <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
                {GROWTH_MODES.map((mode) => (
                  <button key={mode.id} onClick={() => { setGrowthMode(mode); setMarketingOutput(null); setIsAssetReady(false); setVideoUrl(null); }} className={`p-8 rounded-[40px] flex flex-col items-center gap-5 transition-all border-2 ${growthMode.id === mode.id ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059] shadow-2xl' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                    {mode.icon} <span className="text-[11px] font-black uppercase tracking-widest">{mode.name}</span>
                  </button>
                ))}
              </div>

              {growthMode.id === 'video-ad' ? (
                <div className="bg-[#112240]/80 p-10 md:p-16 rounded-[64px] min-h-[500px] relative border border-[#C5A059]/30 shadow-inner">
                  {!videoUrl ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-10">
                      <div className="text-center space-y-4 max-w-2xl">
                         <h4 className="text-2xl font-black text-white uppercase italic">Veo Marketing Pipeline</h4>
                         <p className="text-[#8892B0] font-medium text-lg italic">Generate world-class, cinematic video advertisements directly from your strategic profile.</p>
                      </div>
                      
                      <div className="w-full max-w-xl space-y-8">
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                            <Monitor size={14} /> Output Resolution Protocol
                          </span>
                          <div className="flex gap-4">
                            {['720p', '1080p'].map((q) => (
                              <button
                                key={q}
                                onClick={() => setVideoQuality(q as '720p' | '1080p')}
                                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                                  videoQuality === q 
                                    ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059] shadow-gold-sm' 
                                    : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea 
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          placeholder={`E.g. A high-end cinematic advertisement for ${leadForm.company} showcasing precision ${selectedSector} operations...`}
                          className="w-full bg-[#0A192F] border border-white/10 p-6 rounded-3xl text-white outline-none focus:border-[#C5A059] min-h-[120px] font-bold"
                        />
                        
                        <button 
                          onClick={handleVideoGenerate} 
                          disabled={isVideoGenerating} 
                          className="w-full py-9 bg-[#C5A059] text-[#0A192F] font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all flex items-center justify-center gap-6 shadow-3xl text-lg"
                        >
                          {isVideoGenerating ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={28} />} 
                          {isVideoGenerating ? "Simulating Asset..." : `Generate ${videoQuality} Ad`}
                        </button>
                        
                        {videoProgress && (
                           <div className="text-center animate-pulse flex flex-col items-center gap-4">
                              <span className="text-[#C5A059] text-[11px] font-black uppercase tracking-[0.3em]">{videoProgress}</span>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#C5A059] animate-shimmer" style={{ width: '40%' }}></div>
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-1000">
                      <div className="bg-[#0A192F]/90 border border-[#C5A059]/40 rounded-[48px] overflow-hidden shadow-3xl relative p-8">
                         <div className="flex justify-between items-center mb-8">
                            <span className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                              <Sparkles size={18} className="text-[#C5A059]" /> 
                              Director's Preview // {leadForm.company}
                              <span className="ml-3 px-3 py-1 bg-[#C5A059] text-[#0A192F] text-[10px] rounded-full not-italic tracking-normal">{videoQuality} Master</span>
                            </span>
                            <button onClick={() => setVideoUrl(null)} aria-label="Restart Video Generation" className="p-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all"><RefreshCcw size={20}/></button>
                         </div>
                         
                         {/* ENHANCED PREVIEW PLAYER */}
                         <div className="relative group bg-black rounded-[32px] overflow-hidden border border-white/5 aspect-video flex items-center justify-center shadow-inner">
                            <video 
                              controls 
                              className="w-full max-h-full block shadow-2xl" 
                              src={videoUrl}
                              aria-label={`Cinematic business advertisement for ${leadForm.company}`}
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-4 right-4 pointer-events-none opacity-50">
                               <div className="px-3 py-1 border border-white/20 rounded bg-black/40 backdrop-blur-sm text-[10px] font-mono tracking-tighter">PREVIEW_GEN_STABLE</div>
                            </div>
                         </div>

                         <div className="mt-10 flex flex-col md:flex-row gap-6">
                            <button onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = `${leadForm.company}_Ad_${videoQuality}.mp4`; a.click(); }} className="flex-grow py-6 bg-[#C5A059] text-[#0A192F] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-xl"><Download size={20}/> Download Master Asset</button>
                            <button onClick={() => triggerWhatsAppActivation(`Video Asset Deployed (${videoQuality})`)} className="flex-grow py-6 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] hover:bg-white/5"><Send size={20}/> Deploy to Ad Network</button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#112240]/80 p-10 md:p-16 rounded-[64px] min-h-[500px] relative border border-white/5 shadow-inner">
                 {!isAssetReady && !isMarketingLoading ? (
                   <div className="flex flex-col items-center justify-center h-full space-y-10">
                      <p className="text-[#8892B0] text-center max-w-md font-medium text-lg italic">Standing by to generate your board-level tactical brief.</p>
                      <button onClick={handleMarketingGenerate} disabled={isMarketingLoading} className="px-16 py-9 bg-[#C5A059] text-[#0A192F] font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all flex items-center gap-6 shadow-3xl text-lg">
                        <PlayCircle size={28} /> Execute Protocol
                      </button>
                   </div>
                 ) : (
                   <div className="animate-in fade-in duration-1000">
                      <div className="bg-[#0A192F]/90 border border-[#C5A059]/40 rounded-[48px] overflow-hidden shadow-3xl relative">
                          <div className="bg-[#C5A059]/15 p-8 border-b border-[#C5A059]/30 flex justify-between items-center backdrop-blur-md">
                            <span className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3"><Sparkles size={18} className="text-[#C5A059]" /> Intelligence Feed // {leadForm.company}</span>
                            <div className="flex gap-4">
                               {isMarketingLoading && <Loader2 className="animate-spin text-[#C5A059]" />}
                               <button onClick={downloadStrategicProposal} title="Download Formal 10-Page Style PDF" className="p-3 bg-[#C5A059] text-[#0A192F] rounded-2xl transition-all shadow-xl hover:bg-white"><Download size={20} className="inline mr-2"/> Download Boardroom PDF</button>
                            </div>
                          </div>
                          <div className="p-10 md:p-16 max-h-[800px] overflow-y-auto custom-scrollbar text-left bg-gradient-to-b from-[#112240] to-[#0A192F]">
                             <div className="mb-10 p-6 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-3xl">
                               <h5 className="text-[#C5A059] font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2"><Zap size={14}/> Executive Summary (Pulse Check)</h5>
                               {marketingOutput && renderFormattedAIText(marketingOutput, true)}
                             </div>
                             {showFullOutput ? (
                               <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                 {marketingOutput && renderFormattedAIText(marketingOutput, false)}
                               </div>
                             ) : (
                               <button onClick={() => setShowFullOutput(true)} className="w-full py-6 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-[#0A192F] transition-all">Expand Detailed Boardroom Specs</button>
                             )}
                          </div>
                      </div>
                   </div>
                 )}
              </div>
              )}
            </div>
          </div>
        </section>

        <section id="ai-tools" className="py-40 px-6 border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-32 text-center md:text-left">
              <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Proprietary AI Ecosystem</span>
              <h3 className="text-7xl md:text-[110px] font-black text-white italic tracking-tighter uppercase leading-none mb-10 opacity-90">Toolbelt.</h3>
              <div className="max-w-3xl glass-panel p-10 rounded-[48px] border-[#C5A059]/30 mt-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={48} className="text-[#C5A059]" /></div>
                <h4 className="text-[#C5A059] font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <Target size={18}/> Sector Recommended Infrastructure: {selectedSector}
                </h4>
                <p className="text-slate-200 text-lg font-medium leading-relaxed italic">{optimization.reasoning}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {AI_GROWTH_TOOLS.filter(t => optimization.featured.includes(t.id)).map((tool) => (
                <div key={tool.id} className="glass-panel p-12 rounded-[56px] border-white/10 relative overflow-hidden group hover:-translate-y-2 transition-all flex flex-col">
                  {/* STRATEGIC RESOLUTION TOOLTIP TRIGGER */}
                  <div className="absolute top-14 right-4 z-40 group/tooltip">
                    <div className="p-2 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A192F] transition-all cursor-help" aria-label="Strategic Bottleneck Resolution">
                      <Info size={16} />
                    </div>
                    {/* FLOATING TOOLTIP BOX */}
                    <div className="absolute bottom-full right-0 mb-4 w-64 p-5 bg-[#0A192F] border border-[#C5A059] rounded-2xl shadow-3xl opacity-0 group-hover/tooltip:opacity-100 translate-y-2 group-hover/tooltip:translate-y-0 transition-all pointer-events-none z-50">
                      <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2">Strategic Resolution</div>
                      <p className="text-white text-xs font-bold italic leading-relaxed">
                        "{optimization.tooltips[tool.id]}"
                      </p>
                      <div className="absolute top-full right-4 w-3 h-3 bg-[#0A192F] border-r border-b border-[#C5A059] rotate-45 -translate-y-1.5"></div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-30 opacity-100">
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-3 py-1 bg-[#C5A059] text-[#0A192F] text-[9px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1 shadow-gold-sm">
                          <Activity size={10} /> Suggested Fit
                       </span>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
                    {tool.icon}
                  </div>
                  <div className="w-20 h-20 bg-[#C5A059] rounded-3xl flex items-center justify-center mb-10 shadow-3xl text-[#0A192F]">
                    {tool.icon}
                  </div>
                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{tool.name}</h4>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                    <span className="block text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">Expected Impact:</span>
                    <p className="text-white text-xs font-bold italic">{optimization.impacts[tool.id]}</p>
                  </div>

                  <div className="mb-6 flex items-center gap-2">
                     <div className="h-0.5 w-6 bg-[#C5A059]"></div>
                     <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest">Sector Deployment Logic</p>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-10 font-medium flex-grow">
                    {optimization.customDesc[tool.id] || tool.desc}
                  </p>
                  <button onClick={() => openExternalLink(tool.url)} className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white group-hover:text-[#C5A059] transition-colors border-t border-white/5 pt-6 w-full">
                    Explore Implementation <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-20 flex flex-col md:flex-row justify-center gap-6">
              <button onClick={() => triggerWhatsAppActivation(`Full Toolbelt Activation: ${selectedSector}`)} className="px-12 py-8 bg-[#C5A059] text-[#0A192F] font-black uppercase text-xs tracking-[0.4em] rounded-2xl shadow-3xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center gap-4">
                <Rocket size={20}/> Activate via Strategic Concierge
              </button>
              <button onClick={downloadSectorProtocolManual} className="px-12 py-8 bg-white/5 border-2 border-[#C5A059] text-[#C5A059] font-black uppercase text-xs tracking-[0.4em] rounded-2xl shadow-3xl hover:bg-[#C5A059] hover:text-[#0A192F] transition-all transform hover:-translate-y-1 flex items-center gap-4">
                <FileBadge size={20}/> Download Protocol Manual (PDF)
              </button>
            </div>
          </div>
        </section>

        <section id="pricing" className={`py-40 px-6 relative z-20 ${isLeadCaptured ? 'block' : 'hidden'}`}>
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-32">
               <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.7em] block mb-8">Service Implementation Protocols</span>
               <h3 className="text-6xl md:text-[110px] font-black italic text-white tracking-tighter uppercase leading-none mb-10 opacity-90">Pricing & PPP.</h3>
               <p className="text-[#8892B0] text-xl max-w-2xl mx-auto italic">Transition from the AI 'Map' to the Managed 'Vehicle'. Our protocols handle the infrastructure while you focus on the growth.</p>
             </div>
             
             <div className="grid lg:grid-cols-3 gap-10">
                {PRICING_TIERS.map((tier, i) => (
                   <div key={i} className={`glass-panel p-14 rounded-[64px] flex flex-col relative overflow-hidden group hover:scale-[1.03] transition-transform ${tier.color} border-2`}>
                      <div className="mb-10 flex justify-between items-start">
                        <h4 className="text-3xl font-black text-white uppercase italic">{tier.name}</h4>
                        {i === 1 && <span className="bg-[#C5A059] text-[#0A192F] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Requested</span>}
                      </div>
                      
                      <div className="mb-10">
                        <span className="text-5xl font-black text-[#C5A059] tracking-tighter">{tier.price}</span>
                        <span className="text-slate-500 font-bold ml-2">{tier.period}</span>
                      </div>
                      
                      <p className="text-slate-300 text-sm font-medium mb-10 italic leading-relaxed">{tier.desc}</p>

                      {/* WHO THIS IS FOR SECTION */}
                      <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-3xl">
                         <span className="flex items-center gap-2 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-4">
                           <Target size={14} /> Who This Is For?
                         </span>
                         <ul className="space-y-3">
                           {tier.targetAudience.map((item, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-[12px] font-medium text-slate-300 leading-tight">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                               <span>{item}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                      
                      <div className="space-y-6 mb-12 flex-grow">
                         <span className="block text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-4">Implementation Components:</span>
                         {tier.implementation.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-4 text-[13px] font-bold text-slate-200">
                              <Check size={18} className="text-[#C5A059] shrink-0 mt-0.5" /> 
                              <span>{feat}</span>
                            </div>
                         ))}
                      </div>

                      <div className="p-6 bg-[#C5A059]/10 rounded-3xl border border-[#C5A059]/20 mb-10">
                         <span className="block text-[9px] font-black text-[#C5A059] uppercase tracking-widest mb-2 flex items-center gap-2"><Award size={12}/> Protocol Benefit:</span>
                         <p className="text-white text-[11px] font-medium leading-relaxed">{tier.benefit}</p>
                      </div>

                      <button onClick={() => triggerWhatsAppActivation(tier.name)} className="w-full py-7 bg-white/5 border border-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] transition-all rounded-[32px] font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3">
                        {tier.action} <ArrowRight size={18} />
                      </button>
                   </div>
                ))}
             </div>

             <div className="mt-24 glass-panel p-12 rounded-[56px] border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-3xl flex items-center justify-center"><Coins size={40} className="text-[#C5A059]" /></div>
                   <div>
                      <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter">Purchasing Power Parity (PPP) Protocol</h5>
                      <p className="text-slate-400 text-sm max-w-md font-medium">Standard for all paid tiers. We eliminate the barrier of international tool payments by handling the FX settlement in local currency.</p>
                   </div>
                </div>
                <button onClick={() => triggerWhatsAppActivation('PPP Protocol Inquiry')} className="px-10 py-6 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all">Verify PPP Coverage</button>
             </div>
           </div>
        </section>

        <section id="roi-results" className={`py-40 px-6 bg-[#0A192F] border-b border-white/5 relative z-20 transition-all duration-1000 ${isLeadCaptured ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
             <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-14">
                <div className={`lg:col-span-4 glass-panel p-16 rounded-[72px] border-[#C5A059]/50 text-center flex flex-col justify-center relative overflow-hidden shadow-3xl`}>
                   <div className="text-[120px] font-black italic text-white tracking-tighter leading-none mb-6 animate-pulse">{diagnosticResult?.score || 0}%</div>
                   <p className="text-[13px] text-[#C5A059] font-black uppercase tracking-[0.6em] border-t border-[#C5A059]/30 pt-6">Readiness Index Alpha</p>
                </div>
                <div id="download-zone" className="lg:col-span-8 glass-panel p-16 rounded-[72px] border-white/5 flex flex-col justify-center items-center shadow-3xl relative overflow-hidden bg-gradient-to-br from-[#112240] to-[#0A192F]">
                   <div className="absolute inset-0 bg-[#0A192F]/60 backdrop-blur-md flex flex-col items-center justify-center z-10 p-12 text-center border border-[#C5A059]/20">
                      <ShieldCheck size={100} className="text-[#C5A059] mb-10 shadow-gold" />
                      <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-6">Vault Unlocked.</h3>
                      <button onClick={downloadOpportunityReport} className="p-8 bg-white/5 border border-[#C5A059]/40 rounded-[40px] flex items-center gap-6 hover:bg-[#C5A059]/15 transition-all text-left group shadow-2xl">
                         <div className="w-16 h-16 bg-[#C5A059] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"><FileDown size={32} className="text-[#0A192F]" /></div>
                         <div>
                            <span className="block text-white font-black text-[15px] uppercase tracking-wider">DIAGNOSTIC_DECRYPT.pdf</span>
                            <span className="block text-[#C5A059] text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Download Full Audit Log</span>
                         </div>
                      </button>
                   </div>
                </div>
             </div>
        </section>

      </main>

      <div className={`fixed bottom-8 right-8 z-[1900] transition-all duration-300 ${isConciergeOpen ? 'w-[92vw] md:w-[460px] h-[600px]' : 'w-18 h-18'}`}>
        {!isConciergeOpen ? (
          <button onClick={() => setIsConciergeOpen(true)} className="w-18 h-18 bg-[#C5A059] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform p-4"><Bot size={36} className="text-[#0A192F]" /></button>
        ) : (
          <div className="w-full h-full glass-panel border-[#C5A059]/40 rounded-[32px] flex flex-col shadow-3xl overflow-hidden bg-[#0A192F]/98 backdrop-blur-3xl">
            <div className="bg-[#C5A059] p-6 flex justify-between items-center text-[#0A192F]">
              <span className="text-[14px] font-black uppercase tracking-tighter">STRATEGY CONCIERGE</span>
              <button onClick={() => setIsConciergeOpen(false)}><XIcon size={24}/></button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-5 custom-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`p-5 rounded-2xl shadow-xl ${m.role === 'user' ? 'bg-[#112240] ml-10 text-white' : 'bg-[#C5A059]/10 border border-[#C5A059]/20 mr-10'}`}>
                  {renderFormattedAIText(m.text)}
                  {m.options && (
                    <div className="mt-4 space-y-2">
                      {m.options.map((opt: string, idx: number) => (
                        <button key={idx} onClick={() => { 
                          if(opt.includes('audit')) smoothScrollTo('audit'); 
                          else if(opt.includes('roi-results') || opt.includes('download-zone')) { downloadOpportunityReport(); setIsConciergeOpen(false); smoothScrollTo('roi-results'); }
                          else if(opt.includes('pricing')) smoothScrollTo('pricing');
                          else if(opt.includes('portfolio')) smoothScrollTo('showcase');
                          else smoothScrollTo('marketing-studio'); 
                        }} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:bg-[#C5A059] hover:text-[#0A192F] text-left transition-all">{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isBotThinking && (
                <div className="p-5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 mr-10 animate-pulse flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#C5A059]" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Chief Thinking...</span>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-white/10 flex gap-3">
              <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Talk to the Chief..." 
                disabled={isBotThinking}
                className="flex-grow bg-[#112240] text-sm p-4 rounded-xl outline-none" 
              />
              <button onClick={handleChatSubmit} disabled={isBotThinking} className="p-4 bg-[#C5A059] text-[#0A192F] rounded-xl">
                {isBotThinking ? <Loader2 className="animate-spin" size={20} /> : <Send size={20}/>}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="py-56 px-6 border-t border-white/5 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="flex items-center gap-10">
            <div className="w-28 h-28 bg-[#C5A059]/10 flex items-center justify-center rounded-[40px] border border-[#C5A059]/30">
              <HeartHandshake size={64} className="text-[#C5A059]" />
            </div>
            <div>
              <span className="text-6xl font-black tracking-tighter text-white uppercase block leading-none">CPC <span className="text-[#C5A059]">Direct</span></span>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.7em] mt-3 block italic">Autonomous Growth Group</span>
            </div>
          </div>
          <p className="text-[13px] font-black text-slate-500 uppercase tracking-[0.8em] italic">© 2026 {BRAND_NAME} Strategy Group</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
