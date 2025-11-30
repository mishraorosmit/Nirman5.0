import React, { useState, useEffect } from 'react';
import { X, Database, User, Key, ArrowRight, ShieldCheck, Loader2, Lock, UserPlus, Mail } from 'lucide-react';
import { UserRole } from '../types';
import { login, signup } from '../services/authService';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    role: UserRole | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, role }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [step, setStep] = useState<'idle' | 'verifying' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStep('idle');
            setIsAuthenticating(false);
            setError(null);
            setEmail('');
            setPassword('');
            setName('');
            setIsSignup(false);
        }
    }, [isOpen, role]);

    if (!isOpen || !role) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setStep('verifying');
        setError(null);

        try {
            if (isSignup) {
                await signup(name, email, password, role);
            } else {
                await login(email, password);
            }

            setStep('success');
            // Short delay to show success state before actual login
            setTimeout(() => {
                onLogin();
            }, 1000);
        } catch (err: any) {
            console.error("Authentication failed", err);
            setError(err.message || "Authentication failed. Please check your credentials.");
            setIsAuthenticating(false);
            setStep('idle');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700 animate-fade-in-up">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white leading-tight">
                                {isSignup ? 'Create Account' : 'Secure Portal Access'}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Node: {role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isAuthenticating}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 bg-slate-50/50 dark:bg-black/20">
                    {step === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-fade-in-up">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <ShieldCheck size={48} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Access Granted</h4>
                                <p className="text-slate-500 text-sm font-medium">Redirecting to {role.toLowerCase()} dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            {isSignup && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={isSignup}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-700 dark:text-slate-200 font-mono text-sm shadow-sm transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-700 dark:text-slate-200 font-mono text-sm shadow-sm transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-700 dark:text-slate-200 font-mono text-sm shadow-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isAuthenticating}
                                    className="w-full btn-futuristic py-4 rounded-xl font-bold flex items-center justify-center gap-2 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isAuthenticating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Verifying Credentials...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isSignup ? 'Create Account' : 'Authenticate & Enter'}</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Lock size={10} />
                                        <span>256-bit SSL Encryption</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsSignup(!isSignup)}
                                        className="text-primary hover:underline"
                                    >
                                        {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                                    </button>
                                </div>
                                <div className="mt-2 text-center">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const { seedDatabase } = await import('../services/seedDatabase');
                                            seedDatabase();
                                        }}
                                        className="text-[10px] text-slate-300 hover:text-slate-500 underline"
                                    >
                                        (Dev) Seed Database
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Loading Bar at bottom */}
                {isAuthenticating && step !== 'success' && (
                    <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
                        <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;