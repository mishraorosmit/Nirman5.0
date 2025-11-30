import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Research from './pages/Research';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import ResearcherDashboard from './pages/dashboards/ResearcherDashboard';
import Loader from './components/Loader';
import ClinicoxChat from './components/ClinicoxChat';
import LoginModal from './components/LoginModal';
import { login, logout } from './services/authService';
import { User, UserRole } from './types';
import { ThemeProvider } from './context/ThemeContext';

// --- Transition Loader Component ---
// Handles the visual entrance/exit of the loader overlay based on the parent's isLoading prop.
const TransitionLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [renderState, setRenderState] = useState<'hidden' | 'entering' | 'active' | 'exiting'>('hidden');

  useEffect(() => {
    if (isLoading) {
      setRenderState('entering');
      // Double RAF to ensure the 'entering' class (opacity 0) is fully applied/painted 
      // before switching to 'active' (opacity 1). This eliminates jank.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRenderState('active');
        });
      });
    } else {
      setRenderState('exiting');
      // Match the CSS duration exactly + a tiny buffer
      const timer = setTimeout(() => {
        setRenderState('hidden');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (renderState === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-xl will-change-opacity
            transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${renderState === 'entering' ? 'opacity-0' : ''}
            ${renderState === 'active' ? 'opacity-100' : ''}
            ${renderState === 'exiting' ? 'opacity-0 pointer-events-none' : ''}
        `}
    >
      <Loader />
    </div>
  );
};

// --- Main App Content ---
// Manages User State, Routing, and Transition Coordination
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load

  // Login Modal State
  const [loginModal, setLoginModal] = useState<{ isOpen: boolean, role: UserRole | null }>({
    isOpen: false,
    role: null
  });

  // Sync auth loading with UI loading
  useEffect(() => {
    if (!authLoading) {
      // Minimum loading time for effect
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Handle Route Changes to trigger animation
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(true);
      window.scrollTo(0, 0); // Reset scroll on nav

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Wait for loader animation

      return () => clearTimeout(timer);
    }
  }, [location.pathname, authLoading]);

  // Step 1: User clicks "Enter Portal" - Opens Modal
  const handleLoginRequest = (role: UserRole) => {
    setLoginModal({ isOpen: true, role });
  };

  // Step 2: User confirms in Modal - Executes Login
  const handleLoginConfirm = async () => {
    // Login is handled inside LoginModal now, just close it
    setLoginModal(prev => ({ ...prev, isOpen: false }));
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setCurrentPage('dashboard');
    navigate('/'); // Ensure navigation back to landing on logout
  };

  const renderDashboard = () => {
    if (!user) return <Navigate to="/" />;

    switch (user.role) {
      case UserRole.PATIENT:
        return <PatientDashboard user={user} currentView={currentPage} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={user} currentView={currentPage} />;
      case UserRole.RESEARCHER:
        return <ResearcherDashboard user={user} currentView={currentPage} />;
      case UserRole.ADMIN:
        return <div className="p-10 text-center dark:text-dark-text">Admin Dashboard Placeholder</div>;
      default:
        return <div>Unknown Role</div>;
    }
  };

  if (authLoading) return <Loader />; // Or keep the TransitionLoader active

  return (
    <>
      <TransitionLoader isLoading={isLoading} />

      {/* Login Modal Overlay */}
      <LoginModal
        isOpen={loginModal.isOpen}
        role={loginModal.role}
        onClose={() => setLoginModal(prev => ({ ...prev, isOpen: false }))}
        onLogin={handleLoginConfirm}
      />

      {/* 
         Main Content Wrapper 
         - Hides content when loading (Loader First)
         - Reveals content with animation when loading finishes (Then Page)
         - Removed scale transform to improve IntersectionObserver reliability
      */}
      <div
        className={`min-h-screen transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-opacity
          ${isLoading
            ? 'opacity-0 blur-sm'
            : 'opacity-100 blur-0'
          }
        `}
      >
        <Routes>
          {/* Public Routes - Pass handleLoginRequest to intercept login clicks */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing onLoginClick={handleLoginRequest} />} />
          <Route path="/about" element={<About onLoginClick={handleLoginRequest} />} />
          <Route path="/pricing" element={<Pricing onLoginClick={handleLoginRequest} />} />
          <Route path="/contact" element={<Contact onLoginClick={handleLoginRequest} />} />
          <Route path="/research" element={<Research onLoginClick={handleLoginRequest} />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            user ? (
              <Layout user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage}>
                {renderDashboard()}
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Global Chatbot - Placed outside the transformed div to ensure fixed positioning works correctly */}
      <ClinicoxChat />
    </>
  );
};

// --- Root App ---
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;