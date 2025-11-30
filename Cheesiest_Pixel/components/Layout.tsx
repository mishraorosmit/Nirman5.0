import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Menu, X, Home, FileText, User as UserIcon, 
  Settings, LogOut, Activity, FlaskConical, 
  Stethoscope, ShieldAlert, Video, ChevronRight, Power
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  if (!user) {
    return <>{children}</>; 
  }

  const getNavItems = (role: UserRole) => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'profile', label: 'Profile', icon: UserIcon },
    ];

    switch (role) {
      case UserRole.PATIENT:
        return [
          ...common,
          { id: 'records', label: 'My Records', icon: FileText },
          { id: 'telemedicine', label: 'Telemedicine', icon: Video },
        ];
      case UserRole.DOCTOR:
        return [
          ...common,
          { id: 'patients', label: 'My Patients', icon: UserIcon },
          { id: 'diagnosis', label: 'AI Diagnosis', icon: Activity },
          { id: 'telemedicine', label: 'Telemedicine', icon: Video },
        ];
      case UserRole.RESEARCHER:
        return [
          ...common,
          { id: 'analytics', label: 'Comparative Analytics', icon: FlaskConical },
          { id: 'cohorts', label: 'Cohorts', icon: UserIcon },
        ];
      case UserRole.ADMIN:
        return [
          ...common,
          { id: 'users', label: 'User Management', icon: UserIcon },
          { id: 'compliance', label: 'Compliance', icon: ShieldAlert },
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row text-slate-900 dark:text-dark-text font-sans">
      
      {/* Background Underlay */}
      <div className="fixed inset-0 bg-[#F5F5F7] dark:bg-black -z-50 transition-colors duration-500"></div>
      
      {/* Ambient Gradient Orbs for Glass Effect */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-40 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header - Apple Glass */}
      <div className="md:hidden glass-panel-apple sticky top-0 z-40 flex justify-between items-center px-4 py-3 shadow-sm border-b border-white/40 dark:border-white/5">
        <div className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
          <Activity size={24} />
          <span className="text-slate-900 dark:text-white">Samhita<span className="text-primary">Fusion</span></span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar - Floating Island Style (Apple iPadOS look) */}
      <aside className={`
        fixed inset-y-4 left-4 z-50 w-72 rounded-[2rem]
        glass-panel-apple
        transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        md:relative md:inset-0 md:translate-x-0 md:rounded-none md:border-r md:border-y-0 md:border-l-0 md:bg-transparent md:backdrop-blur-none md:shadow-none
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-[120%] md:translate-x-0'}
      `}>
         {/* Desktop-only glass background container */}
         <div className="hidden md:block absolute inset-y-4 left-4 right-0 rounded-[2.5rem] glass-panel-apple -z-10 border border-white/50 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50"></div>

        <div className="flex flex-col h-full md:py-8 md:pl-8 md:pr-4">
          
          {/* Header & User Profile Widget */}
          <div className="p-8 md:p-4 pb-8">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-apple-glow animate-pulse-slow">
                 <Activity size={22} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Samhita<span className="text-primary">Fusion</span>
              </span>
            </div>

            {/* Reactive User Card */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="relative overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/40 dark:border-white/10 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-4 relative z-10">
                 <div className="relative">
                     <img src={user.avatar} alt="User" className="w-12 h-12 rounded-2xl border border-white/30 dark:border-white/10 object-cover shadow-sm" />
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></div>
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm truncate text-slate-900 dark:text-white group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">{user.role}</p>
                 </div>
                 <ChevronRight size={16} className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </motion.div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <div key={item.id} className="relative group/nav">
                  {/* Active Background Slide */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover Background Slide */}
                  {!isActive && hoveredNav === item.id && (
                    <motion.div
                       layoutId="hover-nav-bg"
                       className="absolute inset-0 bg-slate-100 dark:bg-white/10 rounded-2xl"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.2 }}
                    />
                  )}

                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsSidebarOpen(false);
                    }}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 z-10 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-transparent text-slate-500 dark:text-slate-400 group-hover/nav:text-primary group-hover/nav:bg-white/50 dark:group-hover/nav:bg-white/5 group-hover/nav:scale-110'
                      }`}>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    
                    <span className={`text-sm font-bold tracking-wide transition-all ${isActive ? 'translate-x-1' : ''}`}>
                       {item.label}
                    </span>
                    
                    {isActive && (
                       <motion.div 
                          layoutId="active-dot" 
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                       />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Footer Controls */}
          <div className="p-6 mx-2 mt-4 space-y-4">
             <div className="flex items-center justify-between px-2 bg-white/40 dark:bg-white/5 p-2 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Theme</span>
                <ThemeToggle />
             </div>
            
            <button 
              onClick={onLogout}
              className="group w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 font-bold text-sm border border-transparent hover:shadow-lg hover:shadow-red-500/30 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <Power size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-6 md:p-8 lg:p-10 relative">
         <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {children}
         </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;