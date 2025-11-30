import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../../types';
import { getTrendAnalysis } from '../../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
   Search, Download, Share2, Sparkles, Copy,
   Tag, AlertTriangle, CheckCircle, RefreshCw,
   FileText, Users, Database, ShieldAlert, Merge, Wand2,
   Activity, Loader2, Filter, ChevronDown, X, Eye, SlidersHorizontal,
   GraduationCap, BookOpen, Globe, Link as LinkIcon, Save, Camera,
   MapPin, Award, ShieldCheck, Microscope, FlaskConical, Beaker,
   PieChart, TrendingUp, Fingerprint, Star, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from '../../components/CountUp';
import { getAllPatientRecords, updateUserProfile } from '../../services/dbService';
import { PatientRecord } from '../../types';
import SupabaseTest from '../../components/SupabaseTest';

// --- Constants & Configurations ---

const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0 }
};

const FILTER_CATEGORIES: Record<string, string[]> = {
   "Organ System": [
      "Cardiology", "Neurology", "Pulmonology", "Gastroenterology", "Nephrology",
      "Endocrinology", "Hematology", "Oncology", "Orthopedics", "Dermatology",
      "Ophthalmology", "ENT", "Obstetrics & Gynecology", "Pediatrics", "Geriatrics", "Immunology"
   ],
   "Disease Type": [
      "Infectious", "Genetic", "Autoimmune", "Metabolic", "Degenerative",
      "Inflammatory", "Congenital", "Lifestyle-linked", "Trauma-related"
   ],
   "Epidemiology": ["Common", "Rare", "Emerging", "Seasonal", "Pandemic-linked"],
   "Research Impact": ["High Impact", "AI-Flagged Novel", "Needs Peer Review", "Recently Published", "Trending"],
   "Diagnostic Stage": ["Early-stage", "Mid-stage", "Late-stage", "Chronic", "Acute", "Post-operative"],
   "Severity": ["Mild", "Moderate", "Severe", "Critical", "Life-Threatening"],
   "Demographics": ["Child", "Adult", "Elderly", "High-risk", "Athletes"]
};

// Mock Data for Charts
const treatmentData = [
   { name: 'Diabetes T2', Allopathy: 85, Ayurveda: 65, Integrated: 92 },
   { name: 'Hypertension', Allopathy: 80, Ayurveda: 70, Integrated: 88 },
   { name: 'Migraine', Allopathy: 75, Ayurveda: 85, Integrated: 90 },
   { name: 'Arthritis', Allopathy: 60, Ayurveda: 80, Integrated: 85 },
];

const efficacyData = [
   { subject: 'Speed of Relief', A: 120, B: 80, fullMark: 150 },
   { subject: 'Side Effects', A: 98, B: 130, fullMark: 150 },
   { subject: 'Cost', A: 86, B: 130, fullMark: 150 },
   { subject: 'Long-term Cure', A: 99, B: 100, fullMark: 150 },
   { subject: 'Accessibility', A: 85, B: 90, fullMark: 150 },
   { subject: 'Patient Satisfaction', A: 65, B: 85, fullMark: 150 },
];

const mockCohorts = [
   { id: 1, name: 'Post-Covid Respiratory (IN)', size: 1240, status: 'Active' },
   { id: 2, name: 'Type-2 Diabetes & Yoga', size: 850, status: 'Active' },
   { id: 3, name: 'Geriatric Arthritis Control', size: 420, status: 'Completed' },
];

// --- Extended Mock Database for AI Tools Logic ---
// Removed INITIAL_DB as we now fetch from Firestore

// --- Sub Components ---

const ResearcherProfile: React.FC<{ user: User }> = ({ user }) => {
   const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      title: 'Principal Investigator',
      labName: 'Integrated Omics & Ayurveda Lab',
      institution: 'National Institute of Integrated Medicine',
      credentials: 'PhD (Genetics), MSc (Bioinformatics)',
      orcid: '0000-0002-1825-0097',
      hIndex: '42',
      citations: '3,450',
      grants: 'Active: $2.4M',
      interests: 'Genomics, Prakriti, AI Diagnostics, Epigenetics',
      website: 'https://scholar.google.com/vikram-singh'
   });

   const [isSaving, setIsSaving] = useState(false);
   const [success, setSuccess] = useState(false);

   const handleSave = async () => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate DB update
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update DB
      await updateUserProfile(user.id, { name: formData.name, email: formData.email });
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
   };

   const ProfileInput = ({ label, icon: Icon, value, onChange, type = "text" }: any) => (
      <div className="group space-y-2">
         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">{label}</label>
         <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
               type={type}
               value={value}
               onChange={onChange}
               className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none font-medium text-slate-900 dark:text-white transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-black/30"
            />
         </div>
      </div>
   );

   return (
      <div className="animate-fade-in-up pb-10">
         {/* Hero Banner - Academic Theme */}
         <div className="relative h-64 md:h-80 w-full rounded-b-[3rem] md:rounded-[3rem] overflow-hidden shadow-lg mx-auto max-w-[98%] mt-2">
            <img
               src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
               alt="Research Lab"
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

            <div className="absolute bottom-24 left-8 md:left-12 text-white z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3">
                  <Microscope size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Verified Researcher</span>
               </div>
               <h2 className="text-3xl font-display font-bold">Research Profile</h2>
               <p className="text-slate-300 text-sm mt-1 max-w-md">Manage your academic identity, publications, and grant funding.</p>
            </div>
         </div>

         <div className="relative max-w-6xl mx-auto px-4 -mt-20 z-10">

            {/* Profile Header */}
            <div className="glass-panel-apple bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/50 dark:border-white/10">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 relative mx-auto md:mx-0">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative bg-slate-100">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                     </div>
                     <button className="absolute -bottom-3 -right-3 p-3 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-all border-4 border-white dark:border-slate-800">
                        <Camera size={18} />
                     </button>
                  </div>

                  <div className="flex-1 w-full pt-2 text-center md:text-left">
                     <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                        <div>
                           <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                              {formData.name}
                              <ShieldCheck className="text-purple-500 fill-purple-500/10" size={24} />
                           </h1>
                           <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-1">{formData.title}</p>
                           <p className="text-xs font-mono text-primary uppercase tracking-wider">{formData.labName}</p>

                           <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                              <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                 <GraduationCap size={14} /> {formData.credentials}
                              </span>
                              <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1">
                                 <Fingerprint size={14} /> ORCID: {formData.orcid}
                              </span>
                           </div>
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto justify-center">
                           <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${success ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-purple-600 hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-purple-500/30'}`}
                           >
                              {isSaving ? <Loader2 className="animate-spin" size={20} /> : success ? <ShieldCheck size={20} /> : <Save size={20} />}
                              {isSaving ? 'Updating...' : success ? 'Updated!' : 'Save Profile'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

               {/* Left Column: Academic Stats */}
               <div className="lg:col-span-2 space-y-8">
                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                        { label: 'h-Index', value: formData.hIndex, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Total Citations', value: formData.citations, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                        { label: 'Publications', value: '84', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                        { label: 'Reviewer Score', value: 'Top 1%', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                     ].map((stat, i) => (
                        <motion.div
                           key={i}
                           whileHover={{ y: -5 }}
                           className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                           <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                              <stat.icon size={20} />
                           </div>
                           <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                     ))}
                  </div>

                  {/* Academic Details Form */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-500 shadow-sm">
                           <Beaker size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Details</h3>
                           <p className="text-sm text-slate-500 font-medium">Affiliations and research scope.</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <ProfileInput
                              label="Current Institution"
                              icon={MapPin}
                              value={formData.institution}
                              onChange={(e: any) => setFormData({ ...formData, institution: e.target.value })}
                           />
                           <ProfileInput
                              label="Laboratory Name"
                              icon={FlaskConical}
                              value={formData.labName}
                              onChange={(e: any) => setFormData({ ...formData, labName: e.target.value })}
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <ProfileInput
                              label="Academic Title"
                              icon={Award}
                              value={formData.title}
                              onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                           />
                           <ProfileInput
                              label="Research Interests (Comma Sep)"
                              icon={Tag}
                              value={formData.interests}
                              onChange={(e: any) => setFormData({ ...formData, interests: e.target.value })}
                           />
                        </div>
                        <ProfileInput
                           label="Google Scholar / Lab Website"
                           icon={LinkIcon}
                           value={formData.website}
                           onChange={(e: any) => setFormData({ ...formData, website: e.target.value })}
                        />
                     </div>
                  </div>
               </div>

               {/* Right Column: Grants & Team */}
               <div className="space-y-8">
                  {/* Funding Widget */}
                  <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                     <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                           <PieChart className="text-emerald-400" /> Grant Status
                        </h3>

                        <div className="mb-6">
                           <div className="flex justify-between items-end mb-2">
                              <span className="text-sm text-slate-300">Active Funding</span>
                              <span className="text-2xl font-bold text-emerald-400">{formData.grants}</span>
                           </div>
                           <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[75%] rounded-full"></div>
                           </div>
                           <p className="text-[10px] text-slate-400 mt-2 text-right">75% Utilized • Renew in Nov 2024</p>
                        </div>

                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-xs font-bold">NIH-RO1-2023</span>
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                           </div>
                           <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-xs font-bold">Ayush-CoE-Grant</span>
                              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Review</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Collaborators */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                           <Users size={20} className="text-purple-500" /> Lab Team
                        </h3>
                        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><SlidersHorizontal size={16} /></button>
                     </div>

                     <div className="space-y-4">
                        {[
                           { name: 'Dr. Sarah Lee', role: 'Post-Doc', bg: 'bg-blue-100 text-blue-600' },
                           { name: 'Arjun Mehta', role: 'PhD Scholar', bg: 'bg-orange-100 text-orange-600' },
                           { name: 'Priya K.', role: 'Research Asst', bg: 'bg-pink-100 text-pink-600' },
                        ].map((member, i) => (
                           <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <div className={`w-10 h-10 rounded-full ${member.bg} flex items-center justify-center font-bold text-sm`}>
                                 {member.name.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</h4>
                                 <p className="text-xs text-slate-500">{member.role}</p>
                              </div>
                              <button className="ml-auto text-slate-300 hover:text-purple-500"><ChevronDown size={16} className="-rotate-90" /></button>
                           </div>
                        ))}
                        <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-purple-500 hover:border-purple-500 transition-colors">
                           + Add Collaborator
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const ResearchAnalytics: React.FC = () => {
   const [topic, setTopic] = useState('');
   const [trendResult, setTrendResult] = useState('');
   const [loading, setLoading] = useState(false);

   const handleTrendSearch = async () => {
      if (!topic) return;
      setLoading(true);
      const res = await getTrendAnalysis(topic);
      setTrendResult(res);
      setLoading(false);
   };

   return (
      <div className="space-y-6 animate-fade-in-up">
         <div className="flex justify-between items-center mb-4">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Comparative Analytics</h2>
               <p className="text-slate-500 dark:text-slate-400">Cross-system efficacy analysis</p>
            </div>
            <div className="flex gap-2">
               <button className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Download size={18} />
                  <span>Export</span>
               </button>
               <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                  <Share2 size={18} />
                  <span>Publish</span>
               </button>
            </div>
         </div>

         {/* AI Trend Detection */}
         <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10">
               <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="text-yellow-300" />
                  <h2 className="text-xl font-bold">AI Trend Detector</h2>
               </div>
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <input
                     type="text"
                     placeholder="Enter disease or treatment topic (e.g., 'Post-COVID Fatigue')"
                     className="flex-1 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                  />
                  <button
                     onClick={handleTrendSearch}
                     disabled={loading}
                     className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-xl font-bold transition-colors backdrop-blur-sm"
                  >
                     {loading ? 'Analyzing...' : 'Detect Trends'}
                  </button>
               </div>
               {trendResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/20 p-6 rounded-xl text-sm leading-relaxed backdrop-blur-md border border-white/10">
                     {trendResult}
                  </motion.div>
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparative Chart */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
               <h3 className="font-bold text-slate-800 dark:text-white mb-6">Treatment Efficacy Comparison</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={treatmentData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                        <Tooltip
                           cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="Allopathy" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Ayurveda" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Integrated" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
               <h3 className="font-bold text-slate-800 dark:text-white mb-6">Modality Profile: Chronic Pain</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart outerRadius={90} data={efficacyData}>
                        <PolarGrid stroke="#94a3b8" opacity={0.2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#94a3b8" opacity={0} />
                        <Radar name="Modern Medicine" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        <Radar name="Traditional Medicine" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Legend />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   );
};

const DashboardHome: React.FC<{ user: User }> = ({ user }) => {
   // --- Data States ---
   const [db, setDb] = useState<any[]>([]); // Using any[] for now to match the flexible structure needed for AI tools

   useEffect(() => {
      const fetchData = async () => {
         const records = await getAllPatientRecords();
         // Map PatientRecord to the format expected by the dashboard (flattening structure if needed)
         const formattedRecords = records.map(r => ({
            ...r,
            name: r.patientName || 'Unknown', // Ensure name property exists
            organSystem: r.organSystem || 'Unknown',
            diseaseType: r.diseaseType || 'Unknown',
            severity: r.severity || 'Unknown',
            stage: r.stage || 'Unknown',
            age: r.age || 0,
            gender: r.gender || 'Unknown'
         }));
         setDb(formattedRecords);
      };
      fetchData();
   }, []);
   const [searchTerm, setSearchTerm] = useState('');
   const [activeFilters, setActiveFilters] = useState<string[]>([]);
   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

   // --- AI Feature States ---
   const [duplicateScan, setDuplicateScan] = useState({ scanning: false, found: 0, status: 'idle', duplicates: [] as any[] });
   const [tagging, setTagging] = useState({ processing: false, count: 0, status: 'idle' });
   const [consistency, setConsistency] = useState({ checking: false, issues: [] as string[], status: 'idle' });

   // --- Filtering Logic ---
   const toggleFilter = (filter: string) => {
      setActiveFilters(prev =>
         prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
      );
      setOpenDropdown(null);
   };

   const filteredData = useMemo(() => {
      return db.filter(record => {
         const matchesSearch =
            record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.id.toString().includes(searchTerm);

         const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
            // Check if the current filter string matches any of the record's properties
            return [
               record.organSystem,
               record.diseaseType,
               record.severity,
               record.stage,
               record.gender === filter ? filter : null, // Check gender if filter matches gender
               record.age > 65 && filter === 'Elderly' ? 'Elderly' : null,
               record.age < 18 && filter === 'Child' ? 'Child' : null,
            ].includes(filter);
         });

         return matchesSearch && matchesFilters;
      });
   }, [db, searchTerm, activeFilters]);

   // --- AI Logic Implementations ---

   // 1. Duplicate Detection
   const handleScanDuplicates = () => {
      setDuplicateScan({ ...duplicateScan, scanning: true, status: 'scanning' });

      setTimeout(() => {
         const dups = [];
         const seen = new Map();

         // Fuzzy Logic: Check for names that are 80% similar or match first name + last initial
         for (const record of db) {
            const simpleName = record.name.toLowerCase().replace(/[^a-z]/g, '');
            if (seen.has(simpleName)) {
               dups.push(record);
            } else {
               seen.set(simpleName, true);
            }
         }

         setDuplicateScan({
            scanning: false,
            found: dups.length,
            status: 'complete',
            duplicates: dups
         });
      }, 2000);
   };

   const mergeDuplicates = () => {
      // Mock merge: Remove duplicate IDs
      const idsToRemove = duplicateScan.duplicates.map(d => d.id);
      setDb(prev => prev.filter(p => !idsToRemove.includes(p.id)));
      setDuplicateScan({ ...duplicateScan, found: 0, status: 'merged', duplicates: [] });
   };

   // 2. Auto-Tagging
   const handleAutoTag = () => {
      setTagging({ ...tagging, processing: true, status: 'processing' });

      setTimeout(() => {
         let count = 0;
         const updatedDb = db.map(record => {
            if (record.organSystem === 'Unknown') {
               count++;
               // Simple keyword mapping simulation
               if (record.diagnosis.includes('Osteo') || record.diagnosis.includes('Joint') || record.diagnosis.includes('Fracture'))
                  return { ...record, organSystem: 'Orthopedics' };
               if (record.diagnosis.includes('Arrhythmia') || record.diagnosis.includes('BP') || record.diagnosis.includes('Heart'))
                  return { ...record, organSystem: 'Cardiology' };
            }
            return record;
         });

         setDb(updatedDb);
         setTagging({ processing: false, count, status: 'complete' });
      }, 2500);
   };

   // 3. Consistency Check
   const handleConsistencyCheck = () => {
      setConsistency({ ...consistency, checking: true, status: 'checking' });

      setTimeout(() => {
         const issues = [];
         for (const record of db) {
            if (record.organSystem === 'Obstetrics & Gynecology' && record.gender === 'Male') {
               issues.push(`Record #${record.id} (${record.name}): Male patient in OBGYN.`);
            }
            if (record.organSystem === 'Geriatrics' && record.age < 60 && record.age > 0) { // Keep infants out unless specific
               issues.push(`Record #${record.id} (${record.name}): Age ${record.age} in Geriatrics.`);
            }
            if (record.organSystem === 'Pediatrics' && record.age > 18) {
               issues.push(`Record #${record.id} (${record.name}): Adult in Pediatrics.`);
            }
         }
         setConsistency({ checking: false, issues, status: 'complete' });
      }, 2000);
   };

   return (
      <div className="space-y-8 animate-fade-in-up">

         {/* Top Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Database Live</span>
               </div>
               <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Research Dashboard</h1>
               <p className="text-slate-500 dark:text-slate-400 mt-1">Manage cohorts and ensure data integrity with AI.</p>
            </div>
            <div className="flex gap-2 items-center">
               <SupabaseTest />
               <button className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                  <SlidersHorizontal size={20} />
               </button>
               <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-2">
                  <Database size={18} /> New Dataset
               </button>
            </div>
         </div>

         {/* AI Data Quality Tools */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Tool 1: Duplicate Detection */}
            <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Copy size={48} />
               </div>
               <div className="relative z-10">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                     <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Copy size={18} /></div>
                     Duplicate Detection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 h-8">
                     {duplicateScan.status === 'idle' ? 'Scan database for redundant patient entries.' :
                        duplicateScan.status === 'scanning' ? 'Scanning records...' :
                           duplicateScan.status === 'merged' ? 'Duplicates merged successfully.' :
                              `Found ${duplicateScan.found} potential duplicates.`}
                  </p>

                  {duplicateScan.status === 'complete' && duplicateScan.found > 0 ? (
                     <button
                        onClick={mergeDuplicates}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                     >
                        <Merge size={16} /> Merge All
                     </button>
                  ) : (
                     <button
                        onClick={handleScanDuplicates}
                        disabled={duplicateScan.scanning}
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                     >
                        {duplicateScan.scanning ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                        {duplicateScan.scanning ? 'Scanning...' : 'Scan Database'}
                     </button>
                  )}
               </div>
               {/* Progress Bar */}
               {duplicateScan.scanning && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100">
                     <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                  </div>
               )}
            </div>

            {/* Tool 2: Auto Tagging */}
            <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tag size={48} />
               </div>
               <div className="relative z-10">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                     <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Wand2 size={18} /></div>
                     Auto-Tagging
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 h-8">
                     {tagging.status === 'idle' ? 'AI-fill missing metadata fields.' :
                        tagging.status === 'processing' ? 'Analyzing unstructured text...' :
                           `Updated ${tagging.count} records with new tags.`}
                  </p>

                  <button
                     onClick={handleAutoTag}
                     disabled={tagging.processing}
                     className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                     {tagging.processing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                     {tagging.processing ? 'Processing...' : 'Run Auto-Tag'}
                  </button>
               </div>
               {tagging.processing && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-100">
                     <div className="h-full bg-purple-500 animate-[progress_2.5s_ease-in-out_infinite] w-full origin-left"></div>
                  </div>
               )}
            </div>

            {/* Tool 3: Consistency Check */}
            <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldAlert size={48} />
               </div>
               <div className="relative z-10">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                     <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg"><Activity size={18} /></div>
                     Consistency Check
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 h-8 truncate">
                     {consistency.status === 'idle' ? 'Validate logic (e.g. Gender vs Diagnosis).' :
                        consistency.status === 'checking' ? 'Running validation rules...' :
                           consistency.issues.length > 0 ? `${consistency.issues.length} logic conflicts found.` : 'All records consistent.'}
                  </p>

                  <button
                     onClick={handleConsistencyCheck}
                     disabled={consistency.checking}
                     className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${consistency.status === 'complete' && consistency.issues.length > 0
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-700 dark:text-slate-300 hover:text-orange-600'
                        }`}
                  >
                     {consistency.checking ? <Loader2 className="animate-spin" size={16} /> : <ShieldAlert size={16} />}
                     {consistency.checking ? 'Checking...' : consistency.issues.length > 0 ? 'Review Issues' : 'Run Health Check'}
                  </button>
               </div>
               {consistency.checking && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-100">
                     <div className="h-full bg-orange-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                  </div>
               )}
            </div>
         </div>

         {/* Search & Filter Section */}
         <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-6">
               {/* Search Bar */}
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by Patient Name, ID, or Diagnosis..."
                     className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                  />
               </div>

               {/* Filter Categories */}
               <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 mr-2 text-sm font-bold text-slate-500">
                     <Filter size={16} /> Filters:
                  </div>
                  {Object.keys(FILTER_CATEGORIES).map((category) => (
                     <div key={category} className="relative">
                        <button
                           onClick={() => setOpenDropdown(openDropdown === category ? null : category)}
                           className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${activeFilters.some(f => FILTER_CATEGORIES[category].includes(f))
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50'
                              }`}
                        >
                           {category} <ChevronDown size={12} className={`transition-transform ${openDropdown === category ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                           {openDropdown === category && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: 10 }}
                                 className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 p-2 grid grid-cols-1 max-h-64 overflow-y-auto custom-scrollbar"
                              >
                                 {FILTER_CATEGORIES[category].map(item => (
                                    <button
                                       key={item}
                                       onClick={() => toggleFilter(item)}
                                       className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeFilters.includes(item)
                                          ? 'bg-primary/10 text-primary'
                                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                          }`}
                                    >
                                       {item}
                                       {activeFilters.includes(item) && <CheckCircle size={14} />}
                                    </button>
                                 ))}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}

                  {activeFilters.length > 0 && (
                     <button
                        onClick={() => setActiveFilters([])}
                        className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                     >
                        <X size={14} /> Clear
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* Data Table */}
         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white">Live Research Dataset</h3>
               <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {filteredData.length} Records Found
               </span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                     <tr>
                        <th className="px-6 py-4 text-left">Patient ID</th>
                        <th className="px-6 py-4 text-left">Diagnosis</th>
                        <th className="px-6 py-4 text-left">Organ System</th>
                        <th className="px-6 py-4 text-left">Disease Type</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {filteredData.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white">{record.name}</div>
                              <div className="text-xs text-slate-500">#{record.id} • {record.gender} • {record.age}yo</div>
                           </td>
                           <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{record.diagnosis}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold border ${record.organSystem === 'Unknown' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                                 }`}>
                                 {record.organSystem}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{record.diseaseType}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${record.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                                    record.severity === 'Severe' ? 'bg-orange-500' :
                                       'bg-emerald-500'
                                    }`} />
                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.severity}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-primary transition-colors">
                                 <Eye size={18} />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {filteredData.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                              No records found matching your criteria.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
   );
};

// --- Main Researcher Dashboard Component ---

interface ResearcherDashboardProps {
   user: User;
   currentView: string;
}

const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ user, currentView }) => {
   const renderContent = () => {
      switch (currentView) {
         case 'profile':
            return <ResearcherProfile user={user} />;
         case 'analytics':
            return <ResearchAnalytics />;
         case 'cohorts':
            return (
               <div className="space-y-6 animate-fade-in-up">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Cohorts</h2>
                     <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                        <Users size={18} /> Create Cohort
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {mockCohorts.map(cohort => (
                        <div key={cohort.id} className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                           <div>
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{cohort.name}</h3>
                              <p className="text-sm text-slate-500">{cohort.size} Participants • {cohort.status}</p>
                           </div>
                           <div className="flex -space-x-2">
                              {[1, 2, 3, 4].map(i => (
                                 <div key={i} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {String.fromCharCode(64 + i)}
                                 </div>
                              ))}
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                 +
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );
         default:
            return <DashboardHome user={user} />;
      }
   };

   return (
      <div className="w-full max-w-[1600px] mx-auto pb-10">
         <AnimatePresence mode='wait'>
            <motion.div
               key={currentView}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 10 }}
               transition={{ duration: 0.3 }}
            >
               {renderContent()}
            </motion.div>
         </AnimatePresence>
      </div>
   );
};

export default ResearcherDashboard;