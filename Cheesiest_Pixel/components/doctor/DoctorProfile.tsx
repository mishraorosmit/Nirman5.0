import React, { useState } from 'react';
import { User } from '../../types';
import { Camera, Save, Mail, Briefcase, MapPin, Award, Loader2, ShieldCheck, Phone, Globe, Clock, Star, Edit3, Calendar, User as UserIcon, Activity } from 'lucide-react';
import { MockDatabase } from '../../services/mockDatabase';
import { motion } from 'framer-motion';
import ProfileEditor from '../ProfileEditor';

interface DoctorProfileProps {
    user: User;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: '+91 98765 43210',
        specialization: 'Integrated Medicine',
        hospital: 'Apollo Hospitals, Bhubaneswar',
        experience: '12 Years',
        qualification: 'MBBS, MD (Ayurveda)',
        languages: 'English, Hindi, Odia',
        bio: 'Senior Consultant specializing in combining Ayurvedic principles with modern diagnostics for chronic disease management. Passionate about holistic recovery and preventive cardiology.',
        website: 'www.dr-anjali.health'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate DB update
        await MockDatabase.updateDoctorProfile(user.id, { name: formData.name, email: formData.email });
        setIsSaving(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    // Internal Input Component for consistent premium styling
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
        <div className="min-h-screen pb-10">

            {/* Hero Banner - Optimized Image and removed heavy hover scale for performance */}
            <div className="relative h-64 md:h-80 w-full rounded-b-[3rem] md:rounded-[3rem] overflow-hidden shadow-lg mx-auto max-w-[98%] mt-2 will-change-transform translate-z-0">
                <img
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1200&auto=format&fit=crop"
                    alt="Medical Background"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-24 left-8 md:left-12 text-white z-0 opacity-80">
                    <h2 className="text-3xl font-display font-bold">Doctor Profile</h2>
                    <p className="text-white/80 text-sm mt-1 max-w-md">Manage your public presence, clinic settings, and patient availability protocols.</p>
                </div>
            </div>

            {/* Main Content Container - Pull up to overlap banner */}
            <div className="relative max-w-6xl mx-auto px-4 -mt-20 z-10 pb-20">

                {/* Profile Header Card - Reduced Blur for Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="glass-panel-apple bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/50 dark:border-white/10 will-change-transform"
                >
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                        {/* Avatar Area */}
                        <div className="flex-shrink-0 relative mx-auto md:mx-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative bg-slate-100">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute -bottom-3 -right-3 p-3 bg-primary text-white rounded-2xl shadow-lg hover:bg-blue-600 transition-all border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-95">
                                <Camera size={18} />
                            </button>
                        </div>

                        {/* Header Info */}
                        <div className="flex-1 w-full pt-2 text-center md:text-left">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                                        {formData.name}
                                        <ShieldCheck className="text-blue-500 fill-blue-500/10" size={24} />
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{formData.qualification}</p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                        <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-900/30">
                                            {formData.specialization}
                                        </span>
                                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1">
                                            <Award size={14} /> {formData.experience} Exp
                                        </span>
                                        <span className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wide border border-purple-100 dark:border-purple-900/30 flex items-center gap-1">
                                            <MapPin size={14} /> {formData.hospital}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full lg:w-auto mt-2 lg:mt-0 justify-center">
                                    <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${success ? 'bg-emerald-500 shadow-emerald-500/30' : 'btn-futuristic hover:scale-105 active:scale-95'}`}
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : success ? <ShieldCheck size={20} /> : <Save size={20} />}
                                        {isSaving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* Left Column: Core Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 will-change-transform"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-500 shadow-sm">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
                                    <p className="text-sm text-slate-500 font-medium">Update your bio and personal details here.</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">About Me</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-slate-700 dark:text-slate-300 leading-relaxed resize-none transition-all shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput
                                        label="Full Name"
                                        icon={UserIcon}
                                        value={formData.name}
                                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <ProfileInput
                                        label="Qualification"
                                        icon={Award}
                                        value={formData.qualification}
                                        onChange={(e: any) => setFormData({ ...formData, qualification: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput
                                        label="Experience"
                                        icon={Clock}
                                        value={formData.experience}
                                        onChange={(e: any) => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                    <ProfileInput
                                        label="Languages"
                                        icon={Globe}
                                        value={formData.languages}
                                        onChange={(e: any) => setFormData({ ...formData, languages: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 will-change-transform"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3.5 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-500 shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact & Clinic</h3>
                                    <p className="text-sm text-slate-500 font-medium">Publicly visible contact information.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileInput
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <ProfileInput
                                    label="Phone Number"
                                    icon={Phone}
                                    value={formData.phone}
                                    onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <div className="md:col-span-2">
                                    <ProfileInput
                                        label="Hospital / Clinic Address"
                                        icon={MapPin}
                                        value={formData.hospital}
                                        onChange={(e: any) => setFormData({ ...formData, hospital: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="space-y-8">
                        {/* Stats Widget */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl will-change-transform"
                        >
                            {/* Background decorations */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <Activity className="text-emerald-400" /> Performance
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
                                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                                            <Star size={16} fill="currentColor" /> 4.9
                                        </div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rating</div>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
                                        <div className="text-white font-bold text-lg mb-1">1.2k+</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Patients</div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-300 font-medium">Profile Completion</span>
                                        <span className="text-sm font-bold text-emerald-400">85%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Availability Widget */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 will-change-transform"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={20} className="text-primary" /> Availability
                                </h3>
                                <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Edit</button>
                            </div>

                            <div className="space-y-3">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                    <div key={day} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default group">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{day}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 group-hover:border-primary/30 transition-colors">09:00 - 17:00</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Profile Editor */}
                        <ProfileEditor user={user} />

                        {/* License Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 will-change-transform"
                        >
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-emerald-500">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">Verified Practitioner</p>
                                <p className="text-xs text-slate-500 mt-1">License validated via NMC API.</p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default DoctorProfile;