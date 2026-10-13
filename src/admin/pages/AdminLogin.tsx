import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';
import logo from '../../assets/logo.webp';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    KeyRound,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const { isAuthenticated, login } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Destination after login (if redirected from a protected route)
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    // If user is already authenticated, redirect immediately
    useEffect(() => {
        if (isAuthenticated && !loginSuccess) {
            navigate(fromPath, { replace: true });
        }
    }, [isAuthenticated, fromPath, navigate, loginSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim()) {
            setError('Please enter your admin username.');
            return;
        }

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setIsLoading(true);

        // Simulate a small, crisp verification delay for tactile feedback
        setTimeout(() => {
            const result = login(username, password);

            if (result.success) {
                setLoginSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    navigate(fromPath, { replace: true });
                }, 400);
            } else {
                setError(result.error || 'Invalid credentials. Please verify your username and password.');
                setIsLoading(false);
            }
        }, 350);
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
            {/* Ambient Background Glow Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Top Minimal Bar */}
            <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-10">
                <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center p-1.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
                        <img
                            src={logo}
                            alt="Uburu Logo"
                            className="w-full h-full object-contain filter drop-shadow-xs"
                        />
                    </div>
                    <div>
                        <span className="font-bold text-white tracking-tight text-xs sm:text-sm">
                            Uburu Admin
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                            Control Panel
                        </span>
                    </div>
                </Link>

                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-800/80 backdrop-blur-xs"
                >
                    <span className="hidden xs:inline sm:inline">Public Website</span>
                    <span className="xs:hidden sm:hidden">Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </Link>
            </header>

            {/* Central Form Container */}
            <main className="flex-1 flex items-center justify-center px-3.5 sm:px-4 py-6 sm:py-8 z-10">
                <div className="w-full max-w-md">
                    {/* Main Card */}
                    <div className="bg-[#141b2d]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-2xl shadow-black/60 relative">
                        {/* Decorative Top Accent Glow Bar */}
                        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

                        {/* Card Header */}
                        <div className="text-center mb-6 sm:mb-7">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner mb-3 sm:mb-4 text-amber-400 ring-4 ring-amber-400/10">
                                <KeyRound className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Admin Portal Sign In
                            </h1>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                Enter your administrator credentials to access the store & catalog dashboard.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <div className="leading-relaxed">{error}</div>
                            </div>
                        )}

                        {/* Success Alert */}
                        {loginSuccess && (
                            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs animate-in fade-in duration-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <div>Credentials verified! Redirecting to dashboard...</div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        placeholder="Enter your username"
                                        autoFocus
                                        required
                                        className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        placeholder="••••"
                                        required
                                        className="w-full pl-10 pr-11 py-3 sm:py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-mono tracking-wider"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-1 text-xs">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-amber-400/30 focus:ring-offset-slate-900 accent-amber-400"
                                    />
                                    <span>Remember this browser session</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || loginSuccess}
                                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : loginSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                                        <span>Authenticated</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Admin Panel</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Footer Notice */}
                        <div className="mt-7 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Authorized administrative personnel only</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Notice */}
            <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500 z-10">
                <p>© {new Date().getFullYear()} Uburu Multi-Motive Organization. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminLogin;
