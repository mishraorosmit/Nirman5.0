import React, { useState, useEffect } from 'react';
import { User, Appointment, UserRole } from '../../types';
import AIDiagnosisPanel from '../../components/doctor/AIDiagnosisPanel';
import DoctorProfile from '../../components/doctor/DoctorProfile';
import DoctorPatients from '../../components/doctor/DoctorPatients';
import TelemedicinePanel from '../../components/doctor/TelemedicinePanel';
import PatientUpdateModal from '../../components/doctor/PatientUpdateModal';
import { getPatientsForDoctor, getAppointmentsForUser } from '../../services/dbService';
import CountUp from '../../components/CountUp';
import {
  Users, Clock, Calendar, FileText, ArrowUpRight, TrendingUp,
  MoreHorizontal, ChevronRight, Activity, AlertCircle, X,
  Plus, Search, Filter, Bell, Download, Edit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorDashboardProps {
  user: User;
  currentView: string;
}

// --- Enhanced Mock Data (Keep for charts for now or replace later) ---
const weeklyData = [
  { name: 'Mon', patients: 12, prev: 10 },
  { name: 'Tue', patients: 19, prev: 15 },
  { name: 'Wed', patients: 15, prev: 18 },
  { name: 'Thu', patients: 22, prev: 12 },
  { name: 'Fri', patients: 18, prev: 20 },
  { name: 'Sat', patients: 10, prev: 8 },
  { name: 'Sun', patients: 8, prev: 5 },
];

const monthlyData = [
  { name: 'Week 1', patients: 85 },
  { name: 'Week 2', patients: 92 },
  { name: 'Week 3', patients: 78 },
  { name: 'Week 4', patients: 110 },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-apple p-4 rounded-xl shadow-xl border border-white/20 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,122,255,0.5)]"></span>
          <p className="text-lg font-display font-bold text-slate-900 dark:text-white">
            {payload[0].value} <span className="text-xs font-sans font-normal text-slate-500">Visits</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const DashboardHome: React.FC<{ user: User }> = ({ user }) => {
  const [graphView, setGraphView] = useState<'weekly' | 'monthly'>('weekly');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', msg: 'Lab Report Critical', sub: 'Patient #9921 (Amit Verma)' },
    { id: 2, type: 'warning', msg: 'Appointment Conflict', sub: 'Dr. Rao requests reschedule' },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientCount, setPatientCount] = useState(0);

  const data = graphView === 'weekly' ? weeklyData : monthlyData;

  // Live Clock & Overdue Check & Data Fetch
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    const fetchData = async () => {
      try {
        const patients = await getPatientsForDoctor(user.id);
        setPatientCount(patients.length);

        const apts = await getAppointmentsForUser(user.id, UserRole.DOCTOR);
        setAppointments(apts);

        // Check for overdue (mock logic for now as 'lastUpdated' is not on User type yet)
        // In real app, we would check patient records
      } catch (error) {
        console.error("Error fetching doctor dashboard data", error);
      }
    };
    fetchData();

    return () => clearInterval(timer);
  }, [user.id]);

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <PatientUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        doctorId={user.id}
        onUpdateComplete={() => {
          alert("Patient record updated successfully.");
        }}
      />

      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">System Online • Realtime</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{user.name.split(' ')[1] || user.name}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            You have <span className="text-slate-900 dark:text-white font-bold">{alerts.length} urgent alerts</span> and <span className="text-slate-900 dark:text-white font-bold">{appointments.length} appointments</span> today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right mr-2">
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-transform text-slate-600 dark:text-slate-300 relative group">
            <Bell size={20} />
            {alerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>}
          </button>

          <button
            onClick={() => setShowUpdateModal(true)}
            className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </motion.div>

      {/* Interactive Stats Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: 'Today' },
          { label: 'Update Records', value: 'Action', icon: Edit, color: 'text-white', bg: 'bg-indigo-500 shadow-lg shadow-indigo-500/30', trend: 'New', isAction: true },
          { label: 'Total Patients', value: patientCount, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+15%' },
          { label: 'Consult Time', value: 15, suffix: 'm', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: 'Avg' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => stat.isAction && setShowUpdateModal(true)}
            className={`glass-panel-apple p-5 rounded-[2rem] flex flex-col justify-between min-h-[150px] cursor-pointer group relative overflow-hidden ${stat.isAction ? 'bg-indigo-600' : 'bg-white dark:bg-slate-900'}`}
          >
            {/* Hover Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-500 ${stat.isAction ? 'from-white/0 to-white/10' : 'from-white/0 to-white/0 group-hover:from-primary/5 group-hover:to-transparent'}`}></div>

            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                <stat.icon size={22} />
              </div>
              {!stat.isAction && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${stat.trend.includes('+') ? 'bg-green-100 text-green-700 border-green-200' : stat.trend.includes('-') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <div className={`text-3xl font-display font-bold mt-4 flex items-baseline gap-1 ${stat.isAction ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {typeof stat.value === 'number' ? <CountUp end={stat.value} duration={2} /> : stat.value}
                {stat.suffix && <span className="text-lg text-slate-500">{stat.suffix}</span>}
              </div>
              <p className={`text-xs font-bold uppercase tracking-wider mt-1 transition-colors ${stat.isAction ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Clinic Analytics
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time patient visits & consultations</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Download Report">
                <Download size={18} />
              </button>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                {['weekly', 'monthly'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setGraphView(view as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${graphView === view ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Defs removed for build fix, applied inline style workaround if needed or use simple fill */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#007AFF', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#007AFF"
                  strokeWidth={4}
                  fillOpacity={0.2}
                  fill="#007AFF"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Column: AI & Alerts */}
        <div className="flex flex-col gap-6">

          {/* AI Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-900 dark:to-violet-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden min-h-[250px] group cursor-pointer"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm shadow-inner border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                <ArrowUpRight size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Diagnostic AI</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-90">
                Analyze symptoms with <span className="font-bold text-white">99% accuracy</span> using our differential engine.
              </p>
            </div>
            <button className="relative z-10 w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2 group/btn">
              Launch Tool <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </motion.div>

          {/* Interactive Alerts */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" /> Alerts
              </h4>
              {alerts.length > 0 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold animate-pulse">{alerts.length} New</span>}
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-start justify-between gap-3 group"
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-orange-500'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{alert.msg}</p>
                          <p className="text-xs text-slate-500">{alert.sub}</p>
                          {/* Action button for Update alerts */}
                          {alert.msg === 'Update Pending' && (
                            <button onClick={() => setShowUpdateModal(true)} className="text-[10px] text-primary font-bold mt-1 hover:underline">
                              Update Now
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 text-slate-400 text-sm">
                    No new alerts. All clear.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Recent Patients Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Consultations</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search..." className="w-full sm:w-48 pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 whitespace-nowrap">
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Patient</th>
                <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Type</th>
                <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Date</th>
                <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <motion.tr
                    key={apt.id}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className="group border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {apt.patientName ? apt.patientName[0] : 'P'}
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{apt.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-medium">
                        {apt.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500">{new Date(apt.time).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${apt.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setShowUpdateModal(true)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                          Update
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No recent appointments.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, currentView }) => {
  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <DoctorProfile user={user} />;
      case 'patients':
        return <DoctorPatients doctorId={user.id} />;
      case 'diagnosis':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
            <AIDiagnosisPanel />
          </motion.div>
        );
      case 'telemedicine':
        return <TelemedicinePanel />;
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

export default DoctorDashboard;
