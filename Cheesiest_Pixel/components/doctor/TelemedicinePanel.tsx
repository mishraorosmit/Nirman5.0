import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, PhoneOff, Mic, MicOff, VideoOff, Calendar, Clock, Activity } from 'lucide-react';

const TelemedicinePanel: React.FC = () => {
  const [activeCall, setActiveCall] = useState<boolean>(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  if (activeCall) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col"
      >
        {/* Main Video Area */}
        <div className="flex-1 relative overflow-hidden">
           {/* Patient Feed (Simulated) */}
           <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
              alt="Patient Video" 
              className="w-full h-full object-cover opacity-90"
           />
           
           {/* Overlay UI */}
           <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg text-white border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-sm">REC 04:22</span>
           </div>

           {/* Self View PIP */}
           <div className="absolute top-6 right-6 w-48 h-36 bg-slate-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <img 
                 src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop"
                 className="w-full h-full object-cover"
                 alt="Doctor Self View"
              />
           </div>

           {/* Side Panel - Patient Data Overlay */}
           <div className="absolute left-6 bottom-32 w-72 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white space-y-4">
               <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Patient</h4>
                  <p className="font-bold text-lg">Sarah Khan</p>
               </div>
               <div className="grid grid-cols-2 gap-2">
                   <div className="bg-white/10 p-2 rounded-lg">
                       <p className="text-[10px] text-slate-300">Heart Rate</p>
                       <p className="font-mono font-bold text-emerald-400">78 bpm</p>
                   </div>
                   <div className="bg-white/10 p-2 rounded-lg">
                       <p className="text-[10px] text-slate-300">BP</p>
                       <p className="font-mono font-bold text-blue-400">120/80</p>
                   </div>
               </div>
           </div>
        </div>

        {/* Control Bar */}
        <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6">
            <button 
                onClick={() => setMicOn(!micOn)}
                className={`p-4 rounded-full transition-all ${micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500'}`}
            >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            
            <button 
                onClick={() => setActiveCall(false)}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-2"
            >
                <PhoneOff size={24} /> End Call
            </button>

            <button 
                onClick={() => setCamOn(!camOn)}
                className={`p-4 rounded-full transition-all ${camOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500'}`}
            >
                {camOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Telemedicine Portal</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your virtual appointments and join secure video consultations.</p>
       </div>

       <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 flex flex-col md:flex-row gap-8">
           
           {/* Upcoming List */}
           <div className="flex-1 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                     <Calendar size={20} className="text-primary"/> Today's Schedule
                  </h3>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">3 Pending</span>
               </div>

               <div className="space-y-4">
                  {[
                      { name: 'Sarah Khan', time: '10:00 AM', type: 'Follow-up', status: 'Live Now' },
                      { name: 'Amit Verma', time: '11:30 AM', type: 'Consultation', status: 'Upcoming' },
                      { name: 'Priya Patel', time: '02:00 PM', type: 'Report Review', status: 'Upcoming' },
                  ].map((apt, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                  {apt.name[0]}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">{apt.name}</h4>
                                  <p className="text-xs text-slate-500 flex items-center gap-2">
                                      <Clock size={12}/> {apt.time} • {apt.type}
                                  </p>
                              </div>
                          </div>
                          
                          {apt.status === 'Live Now' ? (
                              <button 
                                onClick={() => setActiveCall(true)}
                                className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 hover:scale-105 transition-transform flex items-center gap-2 animate-pulse"
                              >
                                  <Video size={16} /> Join
                              </button>
                          ) : (
                              <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">
                                  Wait
                              </button>
                          )}
                      </div>
                  ))}
               </div>
           </div>

           {/* Preview / Instructions */}
           <div className="w-full md:w-80 bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                       <Activity size={24} className="text-emerald-400" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">System Ready</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">
                       Your camera and microphone are optimized. Connection quality is excellent.
                   </p>
               </div>

               <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/5">
                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Check</h4>
                   <div className="space-y-2">
                       <div className="flex items-center justify-between text-sm">
                           <span>Microphone</span>
                           <span className="text-green-400">Active</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                           <span>Camera</span>
                           <span className="text-green-400">Active</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                           <span>Bandwidth</span>
                           <span className="text-green-400">120 Mbps</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default TelemedicinePanel;