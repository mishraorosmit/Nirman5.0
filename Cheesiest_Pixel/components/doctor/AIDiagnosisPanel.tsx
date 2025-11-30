
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Sparkles, AlertTriangle, 
  Stethoscope, ChevronRight, RefreshCw, 
  CheckCircle, ScrollText, Microscope
} from 'lucide-react';
import { getDifferentialDiagnosis } from '../../services/geminiService';

// --- Animation Variants ---
const mainTransition = { duration: 0.6, ease: [0.23, 1, 0.32, 1] }; // Quintic Out

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: mainTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    filter: 'blur(8px)',
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

const resultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const AIDiagnosisPanel: React.FC = () => {
  const [stage, setStage] = useState<'IDLE' | 'ANALYZING' | 'RESULTS'>('IDLE');
  const [formData, setFormData] = useState({
    symptoms: '',
    history: '',
    vitals: { bp: '', hr: '', temp: '' }
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleAnalyze = async () => {
    if (!formData.symptoms.trim()) return;

    setStage('ANALYZING');
    setLoadingStep(0);

    // Simulate analysis steps for UX
    const stepsInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500); // Slightly longer for better pacing

    try {
      const promptContext = `
        Vitals: BP ${formData.vitals.bp}, HR ${formData.vitals.hr}, Temp ${formData.vitals.temp}.
        History: ${formData.history}.
      `;
      
      const result = await getDifferentialDiagnosis(formData.symptoms, promptContext);
      
      clearInterval(stepsInterval);
      setLoadingStep(3);
      
      setTimeout(() => {
        setAnalysisResult(result);
        setStage('RESULTS');
      }, 600);

    } catch (error) {
      console.error(error);
      setStage('IDLE');
      clearInterval(stepsInterval);
    }
  };

  const resetDiagnosis = () => {
    setStage('IDLE');
    setAnalysisResult(null);
    setFormData({ symptoms: '', history: '', vitals: { bp: '', hr: '', temp: '' } });
  };

  return (
    <div className="min-h-[600px] w-full max-w-5xl mx-auto perspective-1000">
      <AnimatePresence mode='wait'>
        
        {/* --- IDLE STATE: INPUT FORM --- */}
        {stage === 'IDLE' && (
          <motion.div
            key="input"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-panel-apple bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <Brain className="text-white w-8 h-8 animate-pulse-slow" />
                </div>
                <div>
                   <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Diagnostic Engine</h2>
                   <p className="text-slate-500 dark:text-slate-400">Powered by Samhita Neural Network v2.5</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Main Input */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2 group">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-indigo-500 transition-colors">Patient Symptoms</label>
                       <textarea 
                          value={formData.symptoms}
                          onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                          placeholder="Describe current symptoms in detail..."
                          className="w-full h-40 p-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none text-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all shadow-inner hover:bg-white dark:hover:bg-black/30"
                       />
                    </div>
                    <div className="space-y-2 group">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-indigo-500 transition-colors">Medical History (Optional)</label>
                       <textarea 
                          value={formData.history}
                          onChange={(e) => setFormData({...formData, history: e.target.value})}
                          placeholder="Relevant past conditions, allergies, or medications..."
                          className="w-full h-24 p-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all shadow-inner hover:bg-white dark:hover:bg-black/30"
                       />
                    </div>
                 </div>

                 {/* Vitals Sidebar */}
                 <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                       <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
                          <Activity size={18} /> Current Vitals
                       </h3>
                       <div className="space-y-4">
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                             <label className="text-[10px] font-bold text-slate-400 uppercase">BP (mmHg)</label>
                             <input 
                               type="text" 
                               placeholder="120/80"
                               value={formData.vitals.bp}
                               onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, bp: e.target.value}})}
                               className="w-full bg-transparent outline-none font-mono font-bold text-slate-700 dark:text-white"
                             />
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                             <label className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate (bpm)</label>
                             <input 
                               type="text" 
                               placeholder="72"
                               value={formData.vitals.hr}
                               onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, hr: e.target.value}})}
                               className="w-full bg-transparent outline-none font-mono font-bold text-slate-700 dark:text-white"
                             />
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                             <label className="text-[10px] font-bold text-slate-400 uppercase">Temp (°F)</label>
                             <input 
                               type="text" 
                               placeholder="98.6"
                               value={formData.vitals.temp}
                               onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, temp: e.target.value}})}
                               className="w-full bg-transparent outline-none font-mono font-bold text-slate-700 dark:text-white"
                             />
                          </div>
                       </div>
                    </div>

                    <motion.button 
                       whileHover={{ scale: 1.02, boxShadow: "0 20px 30px -10px rgba(79, 70, 229, 0.4)" }}
                       whileTap={{ scale: 0.98 }}
                       onClick={handleAnalyze}
                       disabled={!formData.symptoms}
                       className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-3xl font-bold shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                       <Sparkles size={20} className="relative z-10" /> 
                       <span className="relative z-10">Initiate Analysis</span>
                    </motion.button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- ANALYZING STATE: ANIMATION --- */}
        {stage === 'ANALYZING' && (
           <motion.div
             key="analyzing"
             variants={containerVariants}
             initial="hidden"
             animate="visible"
             exit="exit"
             className="h-[600px] glass-panel-apple bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] flex flex-col items-center justify-center p-8 relative overflow-hidden"
           >
              {/* Fluid Spinning Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-40">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[500px] h-[500px] border border-indigo-500/30 rounded-full border-t-indigo-500 border-r-transparent" 
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-[400px] h-[400px] border border-violet-500/30 rounded-full border-b-violet-500 border-l-transparent absolute" 
                  />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-[300px] h-[300px] border border-teal-500/30 rounded-full border-l-teal-500 border-t-transparent absolute" 
                  />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 mb-10 relative">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-indigo-500 rounded-full blur-xl"
                    />
                    <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-indigo-100 dark:border-indigo-900 z-10">
                       <Brain size={40} className="text-indigo-500" />
                    </div>
                 </div>

                 <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8"
                 >
                    System Processing
                 </motion.h3>

                 <div className="space-y-4 w-full max-w-sm">
                    {[
                      { label: 'Parsing Symptoms', done: loadingStep >= 0 }, // Starts immediately
                      { label: 'Accessing Medical Corpus', done: loadingStep >= 1 },
                      { label: 'Correlating Vitals & History', done: loadingStep >= 2 },
                      { label: 'Generating Differential', done: loadingStep >= 3 }
                    ].map((step, idx) => (
                       <motion.div 
                         key={idx}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: idx * 0.2 }}
                         className="flex items-center gap-4"
                       >
                          <motion.div 
                             animate={{ 
                                backgroundColor: step.done ? '#10b981' : 'rgba(226, 232, 240, 0.2)',
                                scale: step.done ? [1, 1.2, 1] : 1
                             }}
                             className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${step.done ? 'text-white' : 'text-slate-400 bg-slate-200 dark:bg-slate-700'}`}
                          >
                             {step.done ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-current opacity-50" />}
                          </motion.div>
                          <span className={`text-sm font-medium transition-colors duration-500 ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</span>
                       </motion.div>
                    ))}
                 </div>
              </div>
           </motion.div>
        )}

        {/* --- RESULTS STATE: DASHBOARD --- */}
        {stage === 'RESULTS' && analysisResult && (
           <motion.div
             key="results"
             variants={resultContainerVariants}
             initial="hidden"
             animate="visible"
             exit={{ opacity: 0, y: 20 }}
             className="space-y-6"
           >
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                        <CheckCircle size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Complete</h2>
                        <p className="text-sm text-slate-500">Confidence Score: <span className="font-bold text-emerald-500">92%</span></p>
                     </div>
                  </div>
                  <button 
                     onClick={resetDiagnosis}
                     className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                     <RefreshCw size={16} /> New Scan
                  </button>
              </motion.div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 {/* 1. Primary Diagnosis */}
                 <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel-apple bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
                     <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Stethoscope className="text-indigo-500" /> Differential Diagnosis
                     </h3>
                     <div className="space-y-4">
                        {analysisResult.differentialDiagnosis?.map((diag: string, i: number) => (
                           <motion.div 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                              className="group p-4 rounded-2xl bg-slate-50 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-slate-100 dark:border-slate-800 transition-colors cursor-default"
                           >
                              <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-lg text-slate-800 dark:text-white">{diag}</span>
                                 <span className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {i === 0 ? 'Primary Match' : 'Possible'}
                                 </span>
                              </div>
                              {i === 0 && (
                                 <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: '92%' }}
                                      transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                                      className="h-full bg-indigo-500 rounded-full"
                                    />
                                 </div>
                              )}
                           </motion.div>
                        ))}
                     </div>
                 </motion.div>

                 {/* 2. Integrated Approach (Ayurveda + Modern) */}
                 <motion.div variants={itemVariants} className="glass-panel-apple bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-[2.5rem] p-8 border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden">
                     {/* Decorative background glow */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
                     
                     <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2 relative z-10">
                        <ScrollText className="text-emerald-600" /> Integrated Insight
                     </h3>
                     <div className="prose prose-sm dark:prose-invert relative z-10">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                           {analysisResult.integratedApproach}
                        </p>
                     </div>
                     <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-800/30 relative z-10">
                        <h4 className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 mb-3">Suggested Modalities</h4>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 bg-white/60 dark:bg-black/20 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">Dietary Adjustment</span>
                           <span className="px-3 py-1 bg-white/60 dark:bg-black/20 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">Prakriti Analysis</span>
                        </div>
                     </div>
                 </motion.div>

                 {/* 3. Recommended Tests */}
                 <motion.div variants={itemVariants} className="lg:col-span-1 glass-panel-apple bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
                     <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Microscope className="text-blue-500" /> Recommended Labs
                     </h3>
                     <div className="space-y-3">
                        {analysisResult.suggestedTests?.map((test: string, i: number) => (
                           <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{test}</span>
                              <ChevronRight size={14} className="ml-auto text-slate-400" />
                           </div>
                        ))}
                     </div>
                 </motion.div>

                 {/* 4. Action Bar */}
                 <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel-apple bg-slate-900 dark:bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white dark:text-slate-900">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 dark:bg-slate-900/10 rounded-xl">
                           <AlertTriangle size={24} className="text-amber-400 dark:text-amber-600" />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg">Generate Clinical Report</h3>
                           <p className="text-slate-400 dark:text-slate-500 text-sm">Export findings to patient ID #8821</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button className="px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 font-bold text-sm transition-colors">
                           Save Draft
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105">
                           Confirm Diagnosis
                        </button>
                     </div>
                 </motion.div>

              </div>
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AIDiagnosisPanel;
