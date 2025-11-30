import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { UserRole } from '../types';
import PublicNavbar from '../components/PublicNavbar';
import HolographicBackground from '../components/HolographicBackground';
import KnowledgeGraph from '../components/KnowledgeGraph';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import CountUp from '../components/CountUp';
import { Link } from 'react-router-dom';
import { 
  FileText, UploadCloud, Search, Siren, 
  ArrowRight, Activity, ChevronDown, Sparkles, Database,
  Stethoscope, Users, FlaskConical, ShieldCheck, Zap
} from 'lucide-react';

interface LandingProps {
  onLoginClick: (role: UserRole) => void;
}

// --- Helper Components ---

const SpotlightCard: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
}> = ({ children, onClick, className = "", glowColor = "rgba(0, 122, 255, 0.4)" }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!divRef.current || !glowRef.current || !borderRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glowRef.current.style.opacity = '1';
      glowRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, ${glowColor}, transparent 100%)`;
      
      borderRef.current.style.opacity = '1';
      borderRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.8), transparent 100%)`;
    };

    const handleMouseLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = '0';
      if (borderRef.current) borderRef.current.style.opacity = '0';
    };

    const el = divRef.current;
    if (el) {
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
        if (el) {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
  }, [glowColor]);

  return (
    <div
      ref={divRef}
      onClick={onClick}
      className={`glass-panel-apple glass-card-hover rounded-[2.5rem] relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Reactive Border */}
      <div 
        ref={borderRef}
        className="pointer-events-none absolute -inset-[1px] opacity-0 transition-opacity duration-300 z-0 mix-blend-overlay"
        style={{ zIndex: 0 }}
      />
      
      {/* Inner Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 mix-blend-soft-light z-0"
      />
      
      {/* Content */}
      <div className="relative h-full z-10 bg-white/5 dark:bg-black/5 backdrop-blur-[2px]">{children}</div>
    </div>
  );
};

const ResearchWidget: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-24">
      <div className="glass-panel-apple glass-card-hover rounded-[2.5rem] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border border-white/60 dark:border-white/20 shadow-2xl">
        
        {/* Animated Background Elements inside widget */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex items-start gap-6 z-10 relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-neon-blue ring-4 ring-white/10">
             <Database size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
              Research Hub
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
              </span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-md leading-relaxed">
              Real-time clinical streams, integrated whitepapers, and global metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 z-10">
           <div className="hidden md:block text-right border-r border-slate-300 dark:border-white/10 pr-8">
              <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tighter">
                <CountUp end={14.2} decimals={1} suffix="k" duration={2} />
              </div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Papers Indexed</div>
           </div>
           
           <Link to="/research">
             <button className="btn-futuristic px-10 py-5 rounded-full font-bold text-sm flex items-center gap-3 overflow-hidden group hover:scale-105 active:scale-95 transition-all">
                <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase">
                   Access Live Data <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </span>
             </button>
           </Link>
        </div>
      </div>
    </div>
  );
};

const RoleCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  role: UserRole;
  colorClass: string;
  onClick: () => void;
}> = ({ title, description, icon: Icon, role, colorClass, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col items-start text-left p-8 rounded-[2.5rem] glass-panel-apple glass-card-hover w-full h-full border-t border-white/50 dark:border-white/10 hover:border-primary/50 transition-colors"
  >
    {/* Hover Gradient Border */}
    <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-lg ${colorClass.includes('teal') ? 'bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400' : colorClass.includes('blue') ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : colorClass.includes('purple') ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'}`}>
      <Icon size={32} />
    </div>
    
    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 opacity-90">{description}</p>
    
    <div className="mt-auto w-full">
        <span className="block w-full py-4 text-center text-xs font-bold uppercase tracking-widest rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
           Enter Portal
        </span>
    </div>
  </button>
);


const Landing: React.FC<LandingProps> = ({ onLoginClick }) => {
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Optimized Parallax Effect
  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = x * -20; 
      targetY = y * -20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08; 
      currentY += (targetY - currentY) * 0.08;
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-slate-900 dark:text-dark-text bg-transparent selection:bg-primary/30">
      
      {/* 3D Reactive Background */}
      <HolographicBackground />
      
      <PublicNavbar onLoginClick={onLoginClick} />

      {/* Hero Section - ENHANCED VISIBILITY */}
      <header className="relative z-10 min-h-[90vh] flex flex-col justify-center items-center px-6 pt-24 perspective-1000">
        
        {/* Subtle HUD Elements - Futuristic Decor */}
        <div className="absolute top-32 left-10 hidden xl:block opacity-60 pointer-events-none animate-float-fast">
            <div className="glass-panel-apple px-5 py-4 rounded-2xl flex flex-col gap-4 font-mono text-[10px] text-slate-600 dark:text-slate-300 tracking-[0.2em] border border-white/40 dark:border-white/10 shadow-lg">
                <span className="flex items-center gap-3"><div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_#34C759]"/> SYS.DIAGNOSTIC</span>
                <span className="flex items-center gap-3"><div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75 shadow-[0_0_10px_#007AFF]"/> NET.SECURE</span>
                <span className="flex items-center gap-3"><div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-150 shadow-[0_0_10px_#5856D6]"/> AI.ACTIVE</span>
            </div>
        </div>

        {/* Parallax Content Wrapper */}
        <div 
          ref={heroContentRef}
          className="text-center max-w-6xl mx-auto mb-12 relative will-change-transform"
        >
           
           {/* Status Badge */}
           <ScrollReveal>
             <div className="inline-flex items-center space-x-3 glass-panel-apple rounded-full pl-2 pr-6 py-2 mb-10 transition-all hover:scale-105 mx-auto border border-white/50 dark:border-white/20 shadow-lg hover:shadow-neon-teal cursor-default">
                 <div className="bg-white dark:bg-white/10 p-1.5 rounded-full shadow-inner">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                 </div>
                 <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tracking-widest uppercase">System Online</span>
             </div>
           </ScrollReveal>

           {/* Title - Increased Contrast */}
           <ScrollReveal delay={200}>
             <h1 className="text-7xl md:text-9xl font-display font-bold mb-8 tracking-tighter leading-[0.95] drop-shadow-2xl">
               <span className="block text-slate-900 dark:text-white drop-shadow-sm">
                 PRECISION
               </span>
               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary pb-4 relative animate-gradient-x">
                 MEDICINE
                 <Sparkles className="absolute -top-6 -right-12 text-secondary w-16 h-16 animate-pulse-slow opacity-80 hidden md:block filter drop-shadow-[0_0_10px_rgba(52,199,89,0.5)]" />
               </span>
             </h1>
           </ScrollReveal>
           
           <ScrollReveal delay={400}>
             <p className="text-xl md:text-3xl text-slate-700 dark:text-slate-200 mb-14 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md">
               Merging <span className="font-semibold text-slate-900 dark:text-white">Ayurvedic Wisdom</span> with <span className="font-semibold text-slate-900 dark:text-white">AI Diagnostics</span>. 
               An intelligent ecosystem for the future of care.
             </p>
           </ScrollReveal>

           {/* Modern Buttons - HIGH VISIBILITY UPGRADE */}
           <ScrollReveal delay={600}>
             <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
                <button 
                  onClick={() => onLoginClick(UserRole.DOCTOR)}
                  className="btn-futuristic px-12 py-6 rounded-full font-bold text-base md:text-lg flex items-center justify-center gap-3 tracking-widest uppercase group hover:scale-105 active:scale-95 transition-all"
                >
                  Doctor Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => onLoginClick(UserRole.RESEARCHER)}
                  className="btn-futuristic-secondary px-12 py-6 rounded-full font-bold text-base md:text-lg flex items-center justify-center gap-3 tracking-widest uppercase group shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                   Research Portal <FlaskConical size={20} className="group-hover:rotate-12 transition-transform"/>
                </button>
             </div>
           </ScrollReveal>
        </div>
      </header>

      {/* Features Grid - Bento Box Style */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 h-auto lg:h-[650px]">
            
            {/* Main Feature - Large */}
            <ScrollReveal className="md:col-span-2 lg:col-span-2 h-full">
              <SpotlightCard className="h-full p-10 md:p-12 flex flex-col justify-between group bg-white/40 dark:bg-white/5" glowColor="rgba(0, 122, 255, 0.5)">
                <div className="relative z-10">
                   <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">Differential Diagnosis AI</h3>
                   <p className="text-xl text-slate-700 dark:text-slate-200 max-w-lg leading-relaxed font-light">
                      Our proprietary neural engine cross-references patient symptoms against 5,000+ years of Ayurvedic manuscripts and modern pathology databases simultaneously to pinpoint root causes.
                   </p>
                </div>
                
                <div className="mt-12 relative h-72 w-full bg-slate-50 dark:bg-black/40 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-inner group-hover:shadow-neon-blue transition-shadow duration-500">
                    {/* Mock Interface - Animated */}
                    <div className="absolute inset-5 bg-white dark:bg-slate-900/90 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col">
                        <div className="flex gap-2 mb-4">
                           <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                           <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="space-y-4 flex-1">
                           <div className="h-3 bg-slate-100 dark:bg-white/10 rounded-full w-3/4 overflow-hidden relative">
                              <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
                           </div>
                           <div className="h-3 bg-slate-100 dark:bg-white/10 rounded-full w-1/2 overflow-hidden relative delay-100">
                              <div className="absolute top-0 left-0 h-full bg-teal-500 w-2/3 animate-[progress_2.5s_ease-in-out_infinite]"></div>
                           </div>
                           <div className="h-3 bg-slate-100 dark:bg-white/10 rounded-full w-5/6 overflow-hidden relative delay-200">
                               <div className="absolute top-0 left-0 h-full bg-purple-500 w-1/3 animate-[progress_3s_ease-in-out_infinite]"></div>
                           </div>
                           
                           <div className="mt-auto flex gap-3">
                              <div className="h-10 w-28 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                  <div className="w-16 h-1.5 bg-blue-200 dark:bg-blue-700 rounded-full"></div>
                              </div>
                              <div className="h-10 w-28 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center border border-green-100 dark:border-green-800">
                                  <div className="w-16 h-1.5 bg-green-200 dark:bg-green-700 rounded-full"></div>
                              </div>
                           </div>
                        </div>
                        <style>{`
                            @keyframes progress {
                                0% { width: 0%; opacity: 0.5; }
                                50% { width: 100%; opacity: 1; }
                                100% { width: 0%; opacity: 0.5; }
                            }
                        `}</style>
                    </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Side Feature - Stacked */}
            <div className="flex flex-col gap-8 h-full">
               <ScrollReveal delay={200} className="flex-1">
                 <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-center" glowColor="rgba(52, 199, 89, 0.4)">
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-secondary mb-6 shadow-sm ring-1 ring-green-500/20">
                       <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Blockchain Vitals</h3>
                    <p className="text-base text-slate-600 dark:text-slate-300">Immutable patient records secured by permissioned ledger technology.</p>
                 </SpotlightCard>
               </ScrollReveal>
               
               <ScrollReveal delay={400} className="flex-1">
                 <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-center" glowColor="rgba(255, 149, 0, 0.4)">
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 mb-6 shadow-sm ring-1 ring-orange-500/20">
                       <UploadCloud size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Tele-Ayurveda</h3>
                    <p className="text-base text-slate-600 dark:text-slate-300">High-fidelity video consults optimized for low-bandwidth rural connections.</p>
                 </SpotlightCard>
               </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <ScrollReveal>
           <h2 className="text-5xl md:text-6xl font-display font-bold text-center mb-20 text-slate-900 dark:text-white leading-tight">
             Select Your <span className="text-primary">Interface</span>
           </h2>
         </ScrollReveal>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-auto lg:h-[420px]">
           {[
             { role: UserRole.PATIENT, icon: Users, title: 'Patient', desc: 'Manage your health records, appointments, and view AI insights.', color: 'from-blue-400/30 to-blue-600/30' },
             { role: UserRole.DOCTOR, icon: Stethoscope, title: 'Doctor', desc: 'Diagnose patients, prescribe treatments, and track outcomes.', color: 'from-teal-400/30 to-teal-600/30' },
             { role: UserRole.RESEARCHER, icon: FlaskConical, title: 'Researcher', desc: 'Analyze global health trends and publish findings.', color: 'from-purple-400/30 to-purple-600/30' },
             { role: UserRole.ADMIN, icon: Siren, title: 'Admin', desc: 'Manage facility operations and user compliance.', color: 'from-orange-400/30 to-orange-600/30' },
           ].map((item, idx) => (
             <ScrollReveal key={item.role} delay={idx * 100} className="h-full">
               <RoleCard 
                 role={item.role}
                 icon={item.icon}
                 title={item.title}
                 description={item.desc}
                 colorClass={item.color}
                 onClick={() => onLoginClick(item.role)}
               />
             </ScrollReveal>
           ))}
         </div>
      </section>

      <KnowledgeGraph />
      <ResearchWidget />
      <Footer />
    </div>
  );
};

export default Landing;