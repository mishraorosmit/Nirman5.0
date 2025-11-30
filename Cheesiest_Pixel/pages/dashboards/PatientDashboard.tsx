import React, { useEffect, useState } from 'react';
import { User, Appointment, PatientRecord, UserRole } from '../../types';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { Activity, FileText, Pill, Calendar, Loader2, User as UserIcon, Video } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAppointmentsForUser, getPatientRecords } from '../../services/dbService';
import ProfileEditor from '../../components/ProfileEditor';
import PatientTelemedicine from '../../components/patient/PatientTelemedicine';
import { motion, AnimatePresence } from 'framer-motion';

const bpData = [
  { name: 'Jan', systolic: 120, diastolic: 80 },
  { name: 'Feb', systolic: 122, diastolic: 82 },
  { name: 'Mar', systolic: 118, diastolic: 78 },
  { name: 'Apr', systolic: 125, diastolic: 85 },
  { name: 'May', systolic: 121, diastolic: 79 },
];

interface PatientDashboardProps {
  user: User;
  currentView: string;
}

// Dashboard Home View
const DashboardHome: React.FC<{ user: User; appointments: Appointment[]; records: PatientRecord[] }> = ({ user, appointments, records }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Namaste, {user.name}</h1>
          <p className="text-gray-500 dark:text-dark-muted">Your Health ID: <span className="font-mono text-gray-700 dark:text-gray-300">SHA-{user.id.substring(0, 4).toUpperCase()}-9921</span></p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 dark:hover:bg-dark-secondary">Book Appointment</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vitals & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center space-x-2">
              <Activity className="text-primary dark:text-dark-primary" size={20} />
              <span>Blood Pressure Trend</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bpData}>
                  <defs>
                    <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="systolic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSystolic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center space-x-2">
              <FileText className="text-primary dark:text-dark-primary" size={20} />
              <span>Recent Medical Records</span>
            </h3>
            <div className="space-y-4">
              {records.length > 0 ? (
                records.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-dark-border last:border-0">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                      <Pill size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-text">{record.diagnosis}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-muted">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Dr. {record.doctor}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No medical records found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: QR \u0026 Appointments */}
        <div className="space-y-6">
          <QRCodeGenerator
            value={`samhita://patient/${user.id}`}
            label="Scan for Emergency Access"
          />

          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-dark-border last:border-0">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-text">{apt.type} Consultation</p>
                      <p className="text-sm text-gray-500 dark:text-dark-muted">{new Date(apt.time).toLocaleString()}</p>
                      <div className="mt-2 flex gap-2">
                        <button className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded">Reschedule</button>
                        <button className="text-xs border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-3 py-1 rounded">Cancel</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments.</p>
              )}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Heritage Remedy Tip</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300 italic">
              "Warm water with ginger and honey can help soothe a seasonal cough."
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-right">- Source: Sushruta Samhita</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// My Records View
const MyRecordsView: React.FC<{ user: User; records: PatientRecord[] }> = ({ user, records }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Medical Records</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time synced from Firebase</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
          Download All
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Diagnosis</th>
                  <th className="px-6 py-4 text-left">Doctor</th>
                  <th className="px-6 py-4 text-left">Treatment</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{record.diagnosis}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {record.doctor}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        {record.treatmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Ongoing'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400">No medical records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Patient Dashboard Component
const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, currentView }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.id) {
          const [fetchedAppointments, fetchedRecords] = await Promise.all([
            getAppointmentsForUser(user.id, UserRole.PATIENT),
            getPatientRecords(user.id)
          ]);
          setAppointments(fetchedAppointments);
          setRecords(fetchedRecords);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileEditor user={user} />;
      case 'records':
        return <MyRecordsView user={user} records={records} />;
      case 'telemedicine':
        return <PatientTelemedicine />;
      default:
        return <DashboardHome user={user} appointments={appointments} records={records} />;
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

export default PatientDashboard;