
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Activity, FileText, Save, CheckCircle, Loader2 } from 'lucide-react';
import { PatientData, MockDatabase } from '../../services/mockDatabase';

interface PatientUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  onUpdateComplete: () => void;
}

const PatientUpdateModal: React.FC<PatientUpdateModalProps> = ({ isOpen, onClose, doctorId, onUpdateComplete }) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    condition: '',
    status: 'Stable',
    bp: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      const load = async () => {
        const data = await MockDatabase.getPatientsForDoctor(doctorId);
        setPatients(data);
      };
      load();
    }
  }, [isOpen, doctorId]);

  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find(pt => pt.id === selectedPatientId);
      if (p) {
        setFormData({
          condition: p.condition,
          status: p.status,
          bp: p.vitals.bp,
          notes: ''
        });
      }
    }
  }, [selectedPatientId, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setSaving(true);
    
    // Construct updates
    const updates: Partial<PatientData> = {
      condition: formData.condition,
      status: formData.status as any,
      vitals: {
        ...(patients.find(p => p.id === selectedPatientId)?.vitals || { heartRate: '', spO2: '', temp: '' }),
        bp: formData.bp
      }
    };
    
    // In a real app, we would append notes to history, here we just simulate the update
    if(formData.notes) {
        // Logic to append note would go here
    }

    await MockDatabase.updatePatientRecord(selectedPatientId, updates);
    
    setSaving(false);
    onUpdateComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
               <FileText size={20} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 dark:text-white">Update Medical Record</h3>
               <p className="text-xs text-slate-500">Log latest consultation data</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Patient</label>
              <div className="relative">
                 <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <select 
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none appearance-none text-slate-700 dark:text-white text-sm"
                 >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                       <option key={p.id} value={p.id}>{p.name} (ID: {p.id.toUpperCase()})</option>
                    ))}
                 </select>
              </div>
           </div>

           {selectedPatientId && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white text-sm"
                        >
                            <option value="Stable">Stable</option>
                            <option value="Recovering">Recovering</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current BP</label>
                        <input 
                            type="text" 
                            value={formData.bp}
                            onChange={(e) => setFormData({...formData, bp: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis / Condition</label>
                    <input 
                        type="text" 
                        value={formData.condition}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Notes</label>
                    <textarea 
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Add observational notes..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white text-sm resize-none"
                    />
                </div>
             </motion.div>
           )}

           <button 
              type="submit"
              disabled={!selectedPatientId || saving}
              className="w-full py-4 mt-2 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Updating Records...' : 'Save & Update'}
           </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientUpdateModal;
