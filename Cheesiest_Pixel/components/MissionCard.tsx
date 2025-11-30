import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Activity, User, PenTool, Megaphone, Share2, Terminal, Sparkles, Fingerprint } from 'lucide-react';

const MissionCard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Animation Frame Ref
  const requestRef = useRef<number>(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cardBounds = useRef({ width: 0, height: 0, left: 0, top: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    if (cardBounds.current.width === 0) {
        const rect = cardRef.current.getBoundingClientRect();
        cardBounds.current = rect;
    }
    
    mousePosition.current = { x: e.clientX, y: e.clientY };
    
    if (!requestRef.current) {
       requestRef.current = requestAnimationFrame(animate);
    }
  };

  const animate = () => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = mousePosition.current.x - rect.left;
    const y = mousePosition.current.y - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smoother tilt range mimicking Apple Wallet
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    
    requestRef.current = 0;
  };

  const handleMouseEnter = () => {
    setIsActive(true);
    setIsHovering(true);
    if (cardRef.current) {
        cardBounds.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false); 
    
    if (cardRef.current) {
        cardRef.current.style.setProperty('--rotate-x', '0deg');
        cardRef.current.style.setProperty('--rotate-y', '0deg');
    }
    
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
    }

    setTimeout(() => {
        setIsActive(false);
    }, 250);
  };
  
  useEffect(() => {
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }
  }, []);

  const team = [
    { name: 'Orosmit Mishra', role: 'Project Manager', icon: User, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { name: 'Abhinab Jena', role: 'Backend Developer', icon: Terminal, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Dhrubjyoti Mahapatra', role: 'UI/UX Developer', icon: PenTool, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { name: 'Smruti Shikha Nag', role: 'Promotional Lead', icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Alankrita', role: 'Social Media Lead', icon: Share2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="flex justify-center items-center py-20 w-full perspective-1000">
       <style>{`
         .mission-card {
            --mouse-x: 50%;
            --mouse-y: 50%;
            --rotate-x: 0deg;
            --rotate-y: 0deg;
            
            transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
            transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), 
                        height 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
                        transform var(--transform-duration, 0.3s) cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform, width, height;
            transform-style: preserve-3d;
         }
         
         .sheen {
            background: radial-gradient(
                800px circle at var(--mouse-x) var(--mouse-y), 
                rgba(255, 255, 255, 0.15), 
                transparent 40%
            );
            mix-blend-mode: overlay;
            pointer-events: none;
            will-change: background;
         }
       `}</style>

       <div 
         ref={cardRef}
         style={{ '--transform-duration': isHovering ? '0.1s' : '0.6s' } as React.CSSProperties}
         className={`mission-card relative glass-panel-apple rounded-[2.5rem] overflow-hidden flex flex-col items-center 
             ${isActive ? 'w-[90vw] max-w-4xl min-h-[500px] p-10 bg-black/90' : 'w-[340px] h-[440px] p-8 hover:shadow-apple-hover bg-black/80'}`}
         onMouseMove={handleMouseMove}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
       >
          {/* Reactive Sheen */}
          <div className="absolute inset-0 sheen opacity-100" />
          
          {/* Header / Collapsed View */}
          <div className={`relative z-10 flex flex-col items-center justify-center w-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isActive ? 'h-auto mt-0 mb-8 scale-90 md:flex-row md:justify-between md:scale-100 md:mb-10 md:border-b md:border-white/10 md:pb-6' : 'h-full'}`}>
              
              <div className={`flex items-center gap-5 transition-all duration-700 ${isActive ? 'flex-row' : 'flex-col'}`}>
                  <div className={`relative transition-all duration-700 ${isActive ? 'w-14 h-14' : 'w-24 h-24 mb-6'}`}>
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse-slow"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-[#1C1C1E] to-black rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                        <Activity size={isActive ? 28 : 48} className="text-primary" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className={`${isActive ? 'text-left' : 'text-center'}`}>
                    <h3 className={`font-display font-bold text-white transition-all duration-700 ${isActive ? 'text-2xl' : 'text-4xl'}`}>
                        Samhita<span className="text-primary">Fusion</span>
                    </h3>
                    <p className={`text-slate-400 font-mono text-xs tracking-[0.3em] uppercase mt-2 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        {isActive ? 'System Architecture' : 'Hover to Initialize'}
                    </p>
                  </div>
              </div>
              
              <div className={`hidden md:flex items-center gap-2 transition-opacity duration-700 ${isActive ? 'opacity-100 delay-200' : 'opacity-0'}`}>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                  <span className="text-xs font-mono font-bold text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
              </div>
          </div>

          {/* Expanded Content */}
          <div className={`relative z-10 w-full flex-1 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isActive ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10 absolute pointer-events-none'}`}>
              
              <div className="grid md:grid-cols-2 gap-10 h-full">
                  {/* Left: Mission Statement */}
                  <div className="flex flex-col space-y-6">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md relative overflow-hidden group hover:bg-white/10 transition-colors">
                         <div className="absolute -top-4 -right-4 text-white opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform rotate-12 scale-150 pointer-events-none">
                            <Fingerprint size={140} />
                         </div>

                         <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                             <Sparkles className="text-amber-400" size={14}/> 
                             Core Directive
                         </h4>
                         
                         <p className="text-slate-300 leading-relaxed font-light text-base">
                             To synthesize <strong className="text-white font-medium">Ayurvedic Wisdom</strong> with <strong className="text-primary font-medium">AI Precision</strong>. 
                             <br /><br />
                             We are architecting the digital nervous system for integrated healthcare, ensuring ancient knowledge is preserved through modern validation.
                         </p>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          <span>Origin: Bhubaneswar, OD</span>
                          <span>Est. 2024</span>
                      </div>
                  </div>

                  {/* Right: Team Grid */}
                  <div className="glass-panel bg-black/40 border-none p-5 rounded-3xl">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Neural Team</h4>
                      
                      <div className="space-y-2.5 overflow-y-auto pr-1 custom-scrollbar max-h-[260px]">
                          {team.map((member, idx) => (
                              <div 
                                key={idx} 
                                className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 cursor-default"
                                style={{ transitionDelay: `${idx * 50}ms` }}
                              >
                                  <div className={`w-10 h-10 rounded-xl ${member.bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                                      <member.icon size={18} className={member.color} />
                                  </div>
                                  <div className="flex-1">
                                      <h5 className="text-slate-200 font-bold text-sm group-hover:text-white transition-colors">{member.name}</h5>
                                      <p className={`text-[10px] font-mono uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity`}>{member.role}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

       </div>
    </div>
  );
};

export default MissionCard;