"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { signup } from "@/app/auth/actions";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Scale } from "lucide-react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") setIsLogin(false);
    
    const messageParam = searchParams.get("message");
    if (messageParam) setMessage(decodeURIComponent(messageParam));
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (authError) throw authError;

      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", signupName);
      formData.append("email", signupEmail);
      formData.append("password", signupPassword);
      await signup(formData);
      // Action redirects to success
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8">
      {/* Mobile Top Nav */}
      <div className="absolute top-6 left-6 lg:hidden z-50">
        <Link href="/" className="flex items-center gap-2 text-[#1e3a8a]">
          <Scale className="h-8 w-8" />
          <span className="font-bold text-2xl tracking-tight">LegalEagle</span>
        </Link>
      </div>

      <div className="relative w-full max-w-5xl h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden flex shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
        
        {/* Left Side / Right Side Forms Container */}
        <div className="flex w-full h-full relative z-10">
          
          {/* SIGN IN FORM (Left Side) */}
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 bg-white absolute lg:relative transition-all duration-500"
               style={{ 
                 opacity: !isLogin && typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 1,
                 pointerEvents: !isLogin && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'none' : 'auto'
               }}>
            <div className="max-w-md w-full mx-auto">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Welcome Back</h2>
                <p className="text-[#64748b]">Sign in to access your dashboard.</p>
              </div>

              {/* Error/Message */}
              <AnimatePresence>
                {isLogin && message && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">
                    {message}
                  </motion.div>
                )}
                {isLogin && error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email" placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <Input
                  type="password" placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm font-medium text-[#2563eb] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 text-md font-semibold bg-[#0f172a] hover:bg-[#1e293b] mt-2">
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center lg:hidden">
                <p className="text-[#64748b]">Don't have an account?</p>
                <button type="button" onClick={toggleMode} className="text-[#2563eb] font-semibold mt-2">Sign Up instead</button>
              </div>
            </div>
          </div>

          {/* SIGN UP FORM (Right Side) */}
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 bg-white absolute lg:relative transition-all duration-500"
               style={{ 
                 opacity: isLogin && typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 1,
                 pointerEvents: isLogin && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'none' : 'auto'
               }}>
            <div className="max-w-md w-full mx-auto">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Create Account</h2>
                <p className="text-[#64748b]">Join us and simplify your legal analysis.</p>
              </div>

              {/* Error/Message */}
              <AnimatePresence>
                {!isLogin && error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <Input
                  type="email" placeholder="Email Address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <Input
                  type="password" placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <Input
                  type="password" placeholder="Confirm Password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200"
                />
                <Button type="submit" disabled={loading} className="w-full h-12 text-md font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] mt-2">
                  {loading ? "Creating..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-8 text-center lg:hidden">
                <p className="text-[#64748b]">Already have an account?</p>
                <button type="button" onClick={toggleMode} className="text-[#2563eb] font-semibold mt-2">Sign In instead</button>
              </div>
            </div>
          </div>

        </div>

        {/* THE SLIDING OVERLAY PANEL (Desktop Only) */}
        <motion.div 
          initial={false}
          animate={{ x: isLogin ? '0%' : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="hidden lg:flex absolute top-0 right-0 w-1/2 h-full z-30 bg-gradient-to-br from-[#1a3a52] to-[#2563eb] text-white overflow-hidden flex-col justify-center items-center px-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <Link href="/" className="absolute -top-32 left-0 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <Scale className="h-8 w-8" />
              <span className="font-bold text-2xl tracking-tight">LegalEagle</span>
            </Link>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div 
                  key="login-panel"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="w-full max-w-sm"
                >
                  <h2 className="text-4xl font-bold mb-6 text-white">New Here?</h2>
                  <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    Sign up and discover a new level of precision and speed in your legal analysis workflow.
                  </p>
                  <Button type="button" onClick={toggleMode} variant="outline" className="h-12 px-8 rounded-full border-white/40 text-black hover:bg-white/90 transition-all bg-white font-semibold">
                    Create Account
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="signup-panel"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                  className="w-full max-w-sm"
                >
                  <h2 className="text-4xl font-bold mb-6 text-white">One of Us?</h2>
                  <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    If you already have an account, just sign in to pick up right where you left off.
                  </p>
                  <Button type="button" onClick={toggleMode} variant="outline" className="h-12 px-8 rounded-full border-white/40 text-black hover:bg-white/90 transition-all bg-white font-semibold">
                    Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">Loading…</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
