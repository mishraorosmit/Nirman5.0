import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Shield, Zap, Globe, Heart, Star, Sparkles, Building2, 
  Stethoscope, Users, Database, Lock, Activity, Server, Loader2, 
  CreditCard, Smartphone, Building, CheckCircle, ArrowLeft, Printer, ArrowRight, FileText 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import ParticleBackground from '../components/ParticleBackground';
import CountUp from '../components/CountUp';
import { UserRole } from '../types';

interface PricingProps {
  onLoginClick: (role: UserRole) => void;
}

const PRICING_DATA = [
  {
    id: "pat_free",
    category: "Patients",
    title: "Always Free",
    price: "₹0",
    features: ["No charges for signup", "View all records", "Download reports", "QR card access", "Basic reminders"],
    color: "from-emerald-400 to-emerald-600",
    icon: <Heart className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.PATIENT
  },
  {
    id: "doc_starter",
    category: "Individual Doctors",
    title: "Starter Plan",
    price: "Free",
    features: ["Up to 150 patient records", "Basic dashboard", "Visit history", "Simple appointment management", "Community forum access"],
    color: "from-blue-400 to-blue-600",
    icon: <Stethoscope className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.DOCTOR
  },
  {
    id: "doc_pro",
    category: "Individual Doctors",
    title: "Professional",
    price: "₹99",
    suffix: "/mo",
    features: ["Unlimited patient records", "Advanced analytics", "QR health cards for patients", "PDF report export", "Prescription templates", "Priority email support"],
    color: "from-indigo-400 to-indigo-600",
    icon: <Star className="w-5 h-5 text-white" />,
    popular: true,
    role: UserRole.DOCTOR
  },
  {
    id: "clin_basic",
    category: "Clinics",
    title: "Clinic Basic",
    price: "₹499",
    suffix: "/mo",
    features: ["Up to 10 staff accounts", "Shared clinic dashboard", "Appointment calendar", "Bulk CSV import/export", "Role-based access"],
    color: "from-purple-400 to-purple-600",
    icon: <Building2 className="w-5 h-5 text-white" />,
    popular: true,
    role: UserRole.DOCTOR
  },
  {
    id: "clin_plus",
    category: "Clinics",
    title: "Clinic Plus",
    price: "₹1,499",
    suffix: "/mo",
    features: ["Unlimited staff accounts", "Custom branded portal", "Advanced analytics", "Teleconsult slots", "WhatsApp/SMS reminders"],
    color: "from-fuchsia-500 to-pink-600",
    icon: <Sparkles className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.DOCTOR
  },
  {
    id: "res_lite",
    category: "Research",
    title: "Research Lite",
    price: "₹999",
    suffix: "/mo",
    features: ["Access to anonymised datasets", "Filters & cohort builder", "CSV export for analysis", "Trend visualizations", "Basic API Access"],
    color: "from-orange-400 to-orange-600",
    icon: <Globe className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.RESEARCHER
  },
  {
    id: "res_pro",
    category: "Research",
    title: "Research Pro",
    price: "₹2,499",
    suffix: "/mo",
    features: ["Full API access", "Comparative outcome dashboards", "Support for funded projects", "Online onboarding/training", "Publication tools"],
    color: "from-red-500 to-rose-600",
    icon: <Zap className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.RESEARCHER
  },
  {
    id: "ent_hosp",
    category: "Enterprise",
    title: "Hospitals",
    price: "Custom",
    suffix: "",
    features: ["Multi-branch analytics", "Deep integration (HL7/FHIR)", "Custom workflows", "Dedicated support & SLAs", "On-premise options"],
    color: "from-slate-500 to-slate-700",
    icon: <Shield className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.ADMIN
  },
  {
    id: "soc_impact",
    category: "Social Impact",
    title: "Govt / Trust",
    price: "Subsidized",
    suffix: "",
    features: ["Eligible for Free Pro/Clinic Plans", "Verification required", "Equitable access priority", "Full feature set included", "Community support"],
    color: "from-teal-400 to-teal-600",
    icon: <Users className="w-5 h-5 text-white" />,
    popular: false,
    role: UserRole.ADMIN
  }
];

const SystemMetrics = () => {
  const [logIndex, setLogIndex] = useState(0);
  const LIVE_LOGS = [
    "Encrypted record #8921 stored in Vault-A",
    "New practitioner registration: Dr. A. Gupta",
    "AI Model v2.5 inference complete (23ms)",
    "Syncing Ayurveda dataset with WHO-11 standards...",
    "Backup completed successfully.",
    "Real-time vitals stream active for Patient #4421",
    "Tele-consultation session started in Sector-4"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % LIVE_LOGS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-5xl mx-auto mb-20 glass-panel-apple rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 backdrop-blur-3xl"
    >
      <div className="flex-1 grid grid-cols-2 gap-4">
        {[
          { icon: Database, color: "text-primary", label: "Secured Records", value: <CountUp end={2.4} suffix="M+" decimals={1} /> },
          { icon: Server, color: "text-secondary", label: "Uptime", value: <CountUp end={99.99} suffix="%" decimals={2} /> },
          { icon: Lock, color: "text-accent", label: "Encryption", value: "AES-256" },
          { icon: Activity, color: "text-orange-500", label: "Daily AI Scans", value: <CountUp end={50} prefix="~" suffix="k" /> },
        ].map((item, i) => (
          <div key={i} className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/30 dark:border-white/5 flex flex-col justify-center hover:scale-105 transition-transform duration-300 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#1C1C1E] rounded-2xl p-6 font-mono text-xs overflow-hidden relative shadow-inner border border-white/10 group">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-slate-400 font-bold tracking-widest">LIVE SYSTEM FEED</span>
        </div>
        <div className="space-y-3 h-[140px] overflow-hidden flex flex-col justify-end">
          <AnimatePresence mode='popLayout'>
            {LIVE_LOGS.slice(Math.max(0, logIndex - 3), logIndex + 1).map((log, i) => (
              <motion.div 
                key={log + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-400 truncate flex items-center gap-2"
              >
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none" />
      </div>
    </motion.div>
  );
};

const PricingCard: React.FC<{ plan: any; index: number; onSelect: (plan: any) => void; isProcessing: boolean }> = ({ plan, index, onSelect, isProcessing }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative w-full h-full perspective-1000"
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className={`bg-gradient-to-r ${plan.color} text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20`}>
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </span>
        </div>
      )}
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className={`glass-panel-apple h-full p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden transition-all duration-300 ${plan.popular ? 'border-primary/30 dark:border-primary/20 shadow-apple-glow' : ''}`}
      >
         {/* Internal Glow Blob */}
         <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${plan.color} blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 rounded-full pointer-events-none`} />
         
         {/* Content */}
         <div className="relative z-10 flex flex-col items-center text-center mb-8">
             <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {plan.icon}
             </div>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">{plan.category}</h3>
             <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{plan.title}</h2>
             <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1.5">{plan.suffix}</span>
             </div>
         </div>

         <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-8" />

         <div className="flex-1 space-y-4 mb-8">
            {plan.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 group/item">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover/item:border-primary/50 transition-colors`}>
                         <Check size={12} className="text-slate-400 dark:text-slate-500 group-hover/item:text-primary transition-colors" strokeWidth={3}/>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight font-medium">{feature}</span>
                </div>
            ))}
         </div>

         <button 
            onClick={() => onSelect(plan)}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 relative overflow-hidden group/btn mt-auto
              ${plan.popular ? 'btn-futuristic' : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg'}
            `}
         >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Choose Plan {plan.price !== '₹0' && plan.price !== 'Free' && <CreditCard className="w-4 h-4 ml-1 opacity-70"/>}
                    </>
                )}
            </span>
         </button>
      </motion.div>
    </motion.div>
  );
};

const PaymentGateway: React.FC<{ plan: any; onBack: () => void; onComplete: () => void }> = ({ plan, onBack, onComplete }) => {
  const [method, setMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txId = `TXN-${Math.floor(Math.random() * 1000000)}-${Date.now().toString().slice(-4)}`;
      setTransactionId(txId);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  const downloadInvoice = (type: 'CSV' | 'PDF') => {
    alert(`${type} Invoice for Transaction ${transactionId} downloaded.`);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass-panel-apple p-10 rounded-[2.5rem] text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-green-50 dark:ring-green-900/10">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Payment Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
            Your subscription to <span className="font-bold text-primary">{plan?.title || 'Plan'}</span> is now active.
            <br/><span className="font-mono text-xs opacity-70 mt-2 block">Ref: {transactionId}</span>
          </p>
          
          <div className="flex gap-3 mb-8">
            <button onClick={() => downloadInvoice('PDF')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors border border-white/20 dark:border-white/5">
              <Printer className="w-4 h-4" /> Receipt
            </button>
            <button onClick={() => downloadInvoice('CSV')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors border border-white/20 dark:border-white/5">
              <FileText className="w-4 h-4" /> CSV
            </button>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-4 bg-primary hover:bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="pt-8 pb-12 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Plans
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Methods */}
        <div className="flex-1">
           <div className="glass-panel-apple rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-slate-200/50 dark:border-white/5">
                 <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                   <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600"><Lock size={20} /></div>
                   Secure Checkout
                 </h2>
              </div>
              
              <div className="flex flex-col md:flex-row min-h-[450px]">
                 {/* Sidebar Tabs */}
                 <div className="w-full md:w-56 bg-slate-50/50 dark:bg-black/20 p-4 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-white/5">
                    {['CARD', 'UPI', 'NETBANKING'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMethod(m as any)}
                        className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all text-left ${method === m ? 'bg-white dark:bg-white/10 shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}`}
                      >
                        {m === 'CARD' && <CreditCard className="w-4 h-4" />}
                        {m === 'UPI' && <Smartphone className="w-4 h-4" />}
                        {m === 'NETBANKING' && <Building className="w-4 h-4" />}
                        {m === 'CARD' ? 'Credit / Debit' : m === 'UPI' ? 'UPI / QR' : 'Net Banking'}
                      </button>
                    ))}
                 </div>

                 {/* Form Area */}
                 <div className="flex-1 p-8">
                    {method === 'CARD' && (
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                             <div className="relative">
                                <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40" />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</label>
                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CVC</label>
                                <input type="text" placeholder="123" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cardholder Name</label>
                             <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40" />
                          </div>
                       </div>
                    )}

                    {method === 'UPI' && (
                       <div className="text-center py-10 space-y-6">
                          <div className="w-48 h-48 bg-white p-3 mx-auto rounded-2xl shadow-sm border border-slate-100">
                             <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <Smartphone size={48} />
                                <span className="ml-2 font-mono">SCAN QR</span>
                             </div>
                          </div>
                          <p className="text-sm text-slate-500">Scan via GPay, PhonePe, or Paytm</p>
                          <div className="relative">
                             <span className="bg-white dark:bg-[#1e1e20] px-2 text-xs text-slate-400 relative z-10">OR ENTER UPI ID</span>
                             <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-700 -z-0"></div>
                          </div>
                          <input type="text" placeholder="username@upi" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-center text-slate-900 dark:text-white" />
                       </div>
                    )}

                    {method === 'NETBANKING' && (
                        <div className="grid grid-cols-2 gap-4">
                           {['HDFC', 'SBI', 'ICICI', 'Axis'].map(bank => (
                              <button key={bank} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300">
                                 {bank} Bank
                              </button>
                           ))}
                        </div>
                    )}
                 </div>
              </div>
              
              <div className="p-8 bg-slate-50/50 dark:bg-black/20 border-t border-slate-200/50 dark:border-white/5 flex justify-end">
                  <button 
                     onClick={handlePayment}
                     disabled={isProcessing}
                     className="px-10 py-4 btn-futuristic rounded-xl font-bold flex items-center gap-3"
                  >
                     {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                     Pay {plan.price}
                  </button>
              </div>
           </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
           <div className="glass-panel-apple rounded-3xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{plan.title} Plan</span>
                    <span className="font-bold text-slate-900 dark:text-white">{plan.price}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Tax (18% GST)</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{plan.price === 'Free' || plan.price === '₹0' ? '0' : Math.round(parseInt(plan.price.replace(/[^\d]/g, '')) * 0.18)}</span>
                 </div>
                 <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                 <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-primary">
                       {plan.price === 'Free' || plan.price === '₹0' 
                          ? '₹0' 
                          : `₹${parseInt(plan.price.replace(/[^\d]/g, '')) + Math.round(parseInt(plan.price.replace(/[^\d]/g, '')) * 0.18)}`}
                    </span>
                 </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed border border-blue-100 dark:border-blue-900/30">
                 By confirming your subscription, you allow SamhitaFusion to charge your card for future payments in accordance with our terms.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Pricing: React.FC<PricingProps> = ({ onLoginClick }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sans transition-colors duration-700 pb-20 overflow-x-hidden">
      <ParticleBackground />
      <PublicNavbar onLoginClick={onLoginClick} />

      {!selectedPlan ? (
        <>
          {/* Header */}
          <section className="relative pt-40 pb-20 px-6 text-center z-10">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
             >
                <div className="inline-block px-4 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-xs font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6 shadow-sm">
                   Transparent Investment
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                   Simple Plans for <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Complex Care</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                   Choose a plan that fits your scale. From individual practitioners to enterprise hospital networks.
                </p>
             </motion.div>
          </section>

          {/* System Metrics */}
          <section className="px-6 relative z-10">
             <SystemMetrics />
          </section>

          {/* Pricing Grid */}
          <section className="max-w-7xl mx-auto px-6 relative z-10 pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRICING_DATA.map((plan, idx) => (
                   <PricingCard 
                      key={plan.id} 
                      plan={plan} 
                      index={idx}
                      onSelect={setSelectedPlan}
                      isProcessing={false}
                   />
                ))}
             </div>
          </section>
        </>
      ) : (
        <PaymentGateway 
          plan={selectedPlan} 
          onBack={() => setSelectedPlan(null)} 
          onComplete={() => onLoginClick(selectedPlan.role)}
        />
      )}
    </div>
  );
};

export default Pricing;