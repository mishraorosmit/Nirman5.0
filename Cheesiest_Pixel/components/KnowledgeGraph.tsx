import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Activity, GitMerge, Cpu, HeartPulse, Microscope, Database, Sparkles, Scan, Zap, Hexagon } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'traditional' | 'modern' | 'integrated';
  icon: any;
  description: string;
  stat: string;
}

const nodes: Node[] = [
  // Traditional (Left) - Warmer positioning
  { id: 'ayurveda', x: 20, y: 30, label: 'Ayurveda', type: 'traditional', icon: Leaf, description: 'Dosha-based constitutional analysis.', stat: '5000yr Data' },
  { id: 'herbs', x: 15, y: 60, label: 'Bio-Actives', type: 'traditional', icon: Database, description: 'Plant pharmacopeia & active compounds.', stat: '12k+ Herbs' },
  { id: 'yoga', x: 28, y: 80, label: 'Somatics', type: 'traditional', icon: HeartPulse, description: 'Autonomic nervous system regulation.', stat: 'Bio-Feedback' },

  // Modern (Right)
  { id: 'allopathy', x: 80, y: 30, label: 'Pathology', type: 'modern', icon: Activity, description: 'Clinical markers and acute care metrics.', stat: 'Real-time' },
  { id: 'genetics', x: 85, y: 60, label: 'Genomics', type: 'modern', icon: Microscope, description: 'Hereditary predispositions & DNA seq.', stat: 'Seq. Analysis' },
  { id: 'ai', x: 72, y: 80, label: 'Neural Net', type: 'modern', icon: Cpu, description: 'Predictive modeling engine.', stat: 'v2.5 Model' },

  // Core (Center)
  { id: 'fusion', x: 50, y: 50, label: 'Samhita Core', type: 'integrated', icon: GitMerge, description: 'Synthesis of subjective & objective truth.', stat: '99.9% Sync' },
];

const links = [
  { source: 'ayurveda', target: 'fusion' },
  { source: 'herbs', target: 'fusion' },
  { source: 'yoga', target: 'fusion' },
  { source: 'allopathy', target: 'fusion' },
  { source: 'genetics', target: 'fusion' },
  { source: 'ai', target: 'fusion' },
  { source: 'herbs', target: 'allopathy' }, // Interdisciplinary
  { source: 'genetics', target: 'ayurveda' }, // Prakriti-Genomics
];

const KnowledgeGraph: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const getNode = (id: string) => nodes.find(n => n.id === id);
  const activeData = activeNode ? getNode(activeNode) : null;

  return (
    <div className="w-full max-w-7xl mx-auto mt-24 mb-32 px-4 md:px-6">
       {/* Header */}
       <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-4 shadow-sm">
             <Scan size={12} /> System Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">
            The Neural Knowledge Mesh
          </h2>
       </div>

      <div className="relative h-[650px] w-full glass-panel-apple rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-white/40 dark:border-white/10 shadow-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-900/60 dark:to-black/60">
        
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
           <svg width="100%" height="100%">
              <defs>
                 <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        {/* Ambient Warm Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Graph Area */}
        <div className="relative flex-1 h-[60%] md:h-full z-10 p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Soft, Warming Gradients */}
              <linearGradient id="grad-traditional" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#86efac" /> {/* Green-300 */}
                 <stop offset="100%" stopColor="#10b981" /> {/* Emerald-500 */}
              </linearGradient>
              
              <linearGradient id="grad-modern" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#93c5fd" /> {/* Blue-300 */}
                 <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
              </linearGradient>
              
              <linearGradient id="grad-integrated" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#c4b5fd" /> {/* Violet-300 */}
                 <stop offset="100%" stopColor="#7c3aed" /> {/* Violet-600 */}
              </linearGradient>

              {/* Link Gradient */}
              <linearGradient id="grad-link-active" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#34d399" />
                 <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>

              {/* Enhanced Glow Filter */}
              <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                 <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                 </feMerge>
              </filter>
            </defs>

            {/* Links */}
            {links.map((link, i) => {
               const s = getNode(link.source)!;
               const t = getNode(link.target)!;
               const isActive = activeNode === link.source || activeNode === link.target;
               const isFusion = link.target === 'fusion';
               
               // Curve control point
               const mx = (s.x + t.x) / 2;
               const my = (s.y + t.y) / 2;
               
               return (
                 <g key={i}>
                    <motion.path
                      d={`M ${s.x} ${s.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                      fill="none"
                      // Use warm slate for inactive, gradient for active
                      stroke={isActive ? "url(#grad-link-active)" : isFusion ? "currentColor" : "currentColor"}
                      strokeWidth={isActive ? 0.6 : 0.15}
                      className={`${isActive ? 'opacity-100' : 'opacity-10 text-slate-500 dark:text-slate-400'}`}
                      initial={false}
                      animate={{ strokeWidth: isActive ? 0.6 : 0.15, opacity: isActive ? 1 : 0.15 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Data Particles - Only visible on 'fusion' links when idle or active */}
                    {isFusion && (
                        <circle r={isActive ? 0.8 : 0.4} fill={isActive ? "#fff" : "url(#grad-link-active)"}>
                           <animateMotion 
                              dur={`${4 + i * 0.8}s`} 
                              repeatCount="indefinite" 
                              path={`M ${s.x} ${s.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                              keyPoints="0;1"
                              keyTimes="0;1"
                           />
                           {isActive && <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />}
                        </circle>
                    )}
                 </g>
               )
            })}

            {/* Nodes */}
            {nodes.map((node) => {
               const isActive = activeNode === node.id;
               const isCore = node.id === 'fusion';
               
               // Determine fill ID
               const fillId = node.type === 'traditional' ? 'url(#grad-traditional)' : 
                              node.type === 'modern' ? 'url(#grad-modern)' : 'url(#grad-integrated)';
               
               return (
                 <g 
                    key={node.id} 
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    onClick={() => setActiveNode(node.id)}
                 >
                    {/* Invisible Interaction Zone */}
                    <circle cx={node.x} cy={node.y} r="10" fill="transparent" />

                    {/* Pulse Ring (Subtle) */}
                    {isActive && (
                       <motion.circle 
                          cx={node.x} cy={node.y} r="7" 
                          fill="none" stroke={node.type === 'traditional' ? '#34d399' : node.type === 'modern' ? '#60a5fa' : '#a78bfa'} 
                          strokeWidth="0.1"
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                       />
                    )}

                    {/* Node Body */}
                    <motion.circle 
                       cx={node.x} cy={node.y} 
                       r={isCore ? 6 : 3.5}
                       fill={isActive ? fillId : isCore ? fillId : '#ffffff'}
                       stroke={isActive ? '#fff' : 'none'}
                       strokeWidth="0.5"
                       className={`${isCore ? '' : 'dark:fill-slate-800'} shadow-lg`}
                       // Apply glow only when active or if it's the core
                       filter={isActive || isCore ? "url(#glow-soft)" : ""}
                       animate={{ 
                           scale: isActive ? 1.2 : 1,
                           fillOpacity: isActive ? 1 : isCore ? 1 : 0.8
                       }}
                       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                    
                    {/* Inner Icon Dot */}
                    {!isActive && !isCore && (
                        <circle 
                            cx={node.x} cy={node.y} r={1} 
                            fill={node.type === 'traditional' ? '#10b981' : node.type === 'modern' ? '#3b82f6' : '#8b5cf6'} 
                            className="opacity-80"
                        />
                    )}

                    {/* Label */}
                    <text 
                       x={node.x} y={node.y + (isCore ? 9 : 7)} 
                       textAnchor="middle" 
                       className={`text-[2.2px] font-bold uppercase tracking-widest fill-slate-600 dark:fill-slate-400 pointer-events-none transition-all duration-300 ${isActive ? 'fill-slate-900 dark:fill-white font-black scale-110' : 'opacity-60'}`}
                       style={{ textShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
                    >
                       {node.label}
                    </text>
                 </g>
               );
            })}
          </svg>
        </div>

        {/* Info Panel Sidebar */}
        <div className="w-full md:w-[320px] bg-white/40 dark:bg-black/20 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/20 dark:border-white/5 p-8 flex flex-col justify-center relative z-20 transition-colors duration-500">
           <AnimatePresence mode='wait'>
             {activeData ? (
                <motion.div 
                   key={activeData.id}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.2 }}
                   className="space-y-6"
                >
                   {/* Icon Container with Soft Gradient Background */}
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-2
                      ${activeData.type === 'traditional' ? 'bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/40 dark:to-green-900/20 text-emerald-600 dark:text-emerald-400' : 
                        activeData.type === 'modern' ? 'bg-gradient-to-br from-blue-100 to-sky-50 dark:from-blue-900/40 dark:to-sky-900/20 text-blue-600 dark:text-blue-400' : 
                        'bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/20 text-purple-600 dark:text-purple-400'}`
                   }>
                      <activeData.icon size={32} />
                   </div>
                   
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${
                              activeData.type === 'traditional' ? 'bg-emerald-500' : 
                              activeData.type === 'modern' ? 'bg-blue-500' : 'bg-purple-500'
                          }`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{activeData.type} Node</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">{activeData.label}</h3>
                   </div>
                   
                   <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {activeData.description}
                   </p>

                   <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                         <Zap size={14} className="text-amber-500" />
                         <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Metric</span>
                      </div>
                      <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-tight">
                         {activeData.stat}
                      </div>
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="flex flex-col items-center text-center opacity-50"
                >
                   <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 animate-pulse-slow">
                        <Hexagon size={32} className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">System Idle</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Hover over nodes to inspect data streams and architecture.</p>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeGraph;