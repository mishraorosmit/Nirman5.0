import React, { useState, useEffect, useRef } from 'react';
import { MockDatabase, PatientData, ChatMessage } from '../../services/mockDatabase';
import { Search, User, Activity, FileText, Send, ChevronRight, Clock, MoreVertical, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorPatientsProps {
  doctorId: string;
}

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ doctorId }) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat'>('overview');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPatients = async () => {
      const data = await MockDatabase.getPatientsForDoctor(doctorId);
      setPatients(data);
    };
    loadPatients();
  }, [doctorId]);

  useEffect(() => {
    if (selectedPatient) {
      const loadChat = async () => {
        const history = await MockDatabase.getChatHistory(selectedPatient.id);
        setChatHistory(history);
      };
      loadChat();
    }
  }, [selectedPatient]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedPatient) return;
    
    // Optimistic Update
    const tempMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: doctorId,
      text: inputMessage,
      timestamp: new Date(),
      isDoctor: true
    };
    setChatHistory(prev => [...prev, tempMsg]);
    setInputMessage('');

    await MockDatabase.sendChatMessage(selectedPatient.id, tempMsg.text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row h-[85vh] lg:h-[calc(100vh-120px)] gap-6"
    >
      {/* Patient List Sidebar */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shadow-sm h-1/3 lg:h-full">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
           <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-700 dark:text-white" 
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
           {patients.map(patient => (
             <div 
               key={patient.id}
               onClick={() => { setSelectedPatient(patient); setActiveTab('overview'); }}
               className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${selectedPatient?.id === patient.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white dark:bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
             >
                <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full border-2 border-white/20" />
                <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-sm truncate">{patient.name}</h4>
                   <p className={`text-xs truncate ${selectedPatient?.id === patient.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-500'}`}>{patient.condition}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      patient.status === 'Critical' ? 'bg-red-500/20 text-red-500' : 
                      patient.status === 'Recovering' ? 'bg-green-500/20 text-green-500' : 
                      'bg-blue-500/20 text-blue-500'
                   } ${selectedPatient?.id === patient.id ? 'bg-white/20 text-white' : ''}`}>
                      {patient.status}
                   </span>
                   <span className={`text-[10px] ${selectedPatient?.id === patient.id ? 'text-blue-100' : 'text-slate-400'}`}>{patient.lastVisit}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Detail Area */}
      <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shadow-sm relative h-2/3 lg:h-full">
        {selectedPatient ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 sticky top-0">
               <div className="flex items-center gap-4">
                  <img src={selectedPatient.avatar} className="w-14 h-14 rounded-2xl shadow-sm" alt="Patient" />
                  <div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedPatient.name}</h2>
                     <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {selectedPatient.gender}, {selectedPatient.age} yrs • ID: #{selectedPatient.id.toUpperCase()}
                     </p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"><Phone size={20} /></button>
                  <button className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Video size={20} /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"><MoreVertical size={20} /></button>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
               <button 
                 onClick={() => setActiveTab('overview')}
                 className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
               >
                 Patient Overview
               </button>
               <button 
                 onClick={() => setActiveTab('chat')}
                 className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
               >
                 Messages
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-black/20 p-6 relative">
               <AnimatePresence mode='wait'>
                 {activeTab === 'overview' ? (
                   <motion.div 
                     key="overview"
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                   >
                      {/* Vitals Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                         {Object.entries(selectedPatient.vitals).map(([key, val], idx) => (
                            <div key={key} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                               <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">{key}</p>
                               <p className="text-xl font-mono font-bold text-slate-800 dark:text-white">{val}</p>
                            </div>
                         ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                               <Activity size={18} className="text-primary"/> Medical History
                            </h3>
                            <ul className="space-y-3">
                               {selectedPatient.history.map((item, i) => (
                                 <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                                    {item}
                                 </li>
                               ))}
                            </ul>
                         </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                               <FileText size={18} className="text-secondary"/> Recent Files
                            </h3>
                            <div className="space-y-2">
                               <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FileText size={16} /></div>
                                     <span className="text-sm font-medium dark:text-slate-200">Blood_Work_Oct.pdf</span>
                                  </div>
                                  <ChevronRight size={16} className="text-slate-400" />
                               </div>
                               <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity size={16} /></div>
                                     <span className="text-sm font-medium dark:text-slate-200">ECG_Report_v2.jpg</span>
                                  </div>
                                  <ChevronRight size={16} className="text-slate-400" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="chat"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col h-full"
                   >
                      <div className="flex-1 space-y-4 pb-20">
                         {chatHistory.map(msg => (
                            <div key={msg.id} className={`flex ${msg.isDoctor ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                                  msg.isDoctor 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
                               }`}>
                                  <p>{msg.text}</p>
                                  <p className={`text-[10px] mt-1 opacity-70 ${msg.isDoctor ? 'text-blue-100' : 'text-slate-400'}`}>
                                     {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                               </div>
                            </div>
                         ))}
                         <div ref={chatEndRef} />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Chat Input (Only Visible on Chat Tab) */}
            {activeTab === 'chat' && (
               <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute bottom-0 w-full z-20">
                  <div className="flex items-center gap-2">
                     <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..." 
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-white text-sm"
                     />
                     <button 
                        onClick={handleSendMessage}
                        className="p-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/30"
                     >
                        <Send size={18} />
                     </button>
                  </div>
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-slate-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Select a Patient</h3>
             <p className="text-slate-500">View records, history, and start a conversation.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorPatients;