"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Constants & Utilities ---
const EMAIL_MAX = 254;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function safeTrim(value: string, max = 1024) {
  return value.trim().slice(0, max);
}

// --- Icons ---
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Spinner = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Main Component ---
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Modal outside click handler
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (showForgot && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowForgot(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showForgot]);

  // Validation
  function validateAll() {
    const next: typeof fieldErrors = {};
    const e = safeTrim(email, EMAIL_MAX);
    const p = password;

    if (!e) next.email = "Email address is required.";
    else if (!validateEmail(e)) next.email = "Please enter a valid email address.";
    else if (e.length > EMAIL_MAX) next.email = "Email address is too long.";

    if (!p) next.password = "Password is required.";
    else if (p.length < PASSWORD_MIN) next.password = `Password must be at least ${PASSWORD_MIN} characters.`;
    else if (p.length > PASSWORD_MAX) next.password = "Password is too long.";

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) return;

    setSubmitting(true);
    try {
      const payload = {
        identifier: safeTrim(email, EMAIL_MAX).toLowerCase(),
        password,
      };

      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errMsg = data?.error ?? (resp.status === 401 ? "Invalid email or password." : "Unable to sign in.");
        setServerError(errMsg);
        setSubmitting(false);
        return;
      }

      // Check redirection logic
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next");

      if (data?.user?.role === "admin") {
        router.push(next || "/admin/dashboard");
        return;
      }
      router.push(next || "/dashboard");
    } catch (err) {
      console.error(err);
      setServerError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Pane: Branding / Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1B3A5B] text-white flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A5B] to-[#0F2338]" />
        
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl mb-8 inline-block">
            <div className="relative w-48 h-20">
               <Image src="/logo.webp" alt="GAE Logo" fill className="object-contain brightness-0 invert" priority />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Master Clinical Embryology</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join a global community of professionals. Access curated resources, exclusive workshops, and expert mentorship.
          </p>
        </div>

        <div className="absolute bottom-8 text-slate-400 text-xs">
          © {new Date().getFullYear()} Global Academy of Embryology
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="relative w-40 h-16 mb-4">
              <Image src="/logo.webp" alt="GAE Logo" fill className="object-contain" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center animate-fadeIn">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className={`h-5 w-5 ${fieldErrors.email ? "text-red-400" : "text-slate-400"}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateAll}
                  maxLength={EMAIL_MAX}
                  placeholder="name@company.com"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    fieldErrors.email
                      ? "border-red-300 bg-red-50/50 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 bg-white focus:ring-blue-100 focus:border-[#1B3A5B]"
                  }`}
                />
              </div>
              {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-medium text-[#27B19B] hover:text-[#1e8f7c] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className={`h-5 w-5 ${fieldErrors.password ? "text-red-400" : "text-slate-400"}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validateAll}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    fieldErrors.password
                      ? "border-red-300 bg-red-50/50 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 bg-white focus:ring-blue-100 focus:border-[#1B3A5B]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#1B3A5B] hover:bg-[#142e4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A5B] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#27B19B] hover:text-[#1e8f7c] hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal modalRef={modalRef} onClose={() => setShowForgot(false)} />}
    </div>
  );
}

// --- Modal Component ---
function ForgotPasswordModal({ onClose, modalRef }: { onClose: () => void; modalRef: any }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "no-account" | "error">("idle");
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  useEffect(() => setStatus("idle"), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setServerMsg(null);

    const eTrim = email.trim().toLowerCase();
    if (!eTrim) return setError("Please enter your email.");
    if (!validateEmail(eTrim)) return setError("Invalid email format.");

    setStatus("sending");

    try {
      const resp = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eTrim }),
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.ok) {
        setStatus("sent");
        setServerMsg(data?.message ?? "If an account exists, a reset link has been sent.");
      } else if (resp.status === 404 || /not found|no user/i.test(String(data?.error ?? ""))) {
        setStatus("no-account");
        setServerMsg(data?.error ?? "No account found with that email.");
      } else {
        setStatus("error");
        setServerMsg(data?.error ?? "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerMsg("Network error. Please try again.");
    }
  }

  // Helper to render feedback messages
  const FeedbackMessage = ({ type, children }: { type: 'success' | 'warning' | 'error'; children: React.ReactNode }) => {
    const styles = {
      success: "bg-emerald-50 text-emerald-700 border-emerald-100",
      warning: "bg-amber-50 text-amber-800 border-amber-100",
      error: "bg-red-50 text-red-700 border-red-100"
    };
    return (
      <div className={`p-4 rounded-xl border text-sm mb-4 ${styles[type]}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      
      <div
        ref={modalRef}
        role="dialog"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-modalScale"
      >
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Reset Password</h3>
          <p className="text-slate-500 text-sm mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {status === "sent" && <FeedbackMessage type="success">{serverMsg}</FeedbackMessage>}
          {status === "no-account" && <FeedbackMessage type="warning">{serverMsg}</FeedbackMessage>}
          {status === "error" && <FeedbackMessage type="error">{serverMsg}</FeedbackMessage>}

          {(status === "idle" || status === "sending") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B3A5B] focus:border-transparent transition-shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "sending"}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={status === "sending"}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex-1 px-4 py-2.5 bg-[#1B3A5B] text-white rounded-xl hover:bg-[#142e4a] font-medium transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {status === "sending" ? <Spinner className="w-4 h-4" /> : "Send Link"}
                </button>
              </div>
            </form>
          )}

          {/* Close button for final states */}
          {["sent", "no-account", "error"].includes(status) && (
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#27B19B] hover:bg-[#1e8f7c] text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes modalScale {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalScale { animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}