"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building2, 
  MapPin, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
  Check,
  AlertCircle
} from "lucide-react";

// --- Constants ---
const EMAIL_MAX = 254;
const NAME_MAX = 60;
const QUAL_MAX = 120;
const CLINIC_MAX = 120;
const ADDR_MAX = 500;
const DESIGN_MAX = 80;
const MOBILE_MAX = 15;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;
const EXP_MAX = 80;

// --- Helpers ---
function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function validateMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
function safeTrim(v: string, max = 1000) {
  return v.trim().slice(0, max);
}

// --- Component: Input Field ---
// Moved outside to prevent re-rendering/focus loss bugs
const InputField = ({ 
  label, 
  error, 
  icon: Icon, 
  children,
  required = false
}: { 
  label: string, 
  error?: string, 
  icon: any, 
  children: React.ReactNode,
  required?: boolean
}) => (
  <div className="space-y-1.5 w-full">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${error ? "text-red-400" : "text-slate-400 group-focus-within:text-[#27B19B]"}`}>
        <Icon size={18} />
      </div>
      {children}
      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
          <AlertCircle size={18} />
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{error}</p>}
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // --- State: Personal ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // --- State: Passwords ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- State: Professional ---
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [workExp, setWorkExp] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Validation ---
  function validatePersonal() {
    const next: Record<string, string> = {};
    const f = safeTrim(firstName, NAME_MAX);
    const l = safeTrim(lastName, NAME_MAX);
    const e = safeTrim(email.toLowerCase(), EMAIL_MAX);
    const m = safeTrim(mobile, MOBILE_MAX);

    if (!f) next.firstName = "Required";
    if (!l) next.lastName = "Required";
    if (!dob) next.dob = "Required";
    
    if (!m) next.mobile = "Required";
    else if (!validateMobile(m)) next.mobile = "Invalid number";

    if (!e) next.email = "Required";
    else if (!validateEmail(e)) next.email = "Invalid email";

    if (!password) next.password = "Required";
    else if (password.length < PASSWORD_MIN) next.password = `Min ${PASSWORD_MIN} chars`;

    if (!confirmPassword) next.confirmPassword = "Required";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords mismatch";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateProfessional() {
    const next: Record<string, string> = {};
    const qual = safeTrim(qualification, QUAL_MAX);
    const des = safeTrim(designation, DESIGN_MAX);
    const clinic = safeTrim(clinicName, CLINIC_MAX);
    const addr = safeTrim(address, ADDR_MAX);
    const exp = safeTrim(workExp, 6);

    if (!qual) next.qualification = "Required";
    if (!des) next.designation = "Required";
    if (!clinic) next.clinicName = "Required";
    if (!addr) next.address = "Required";

    if (!exp) next.workExp = "Required";
    else {
      const n = Number(exp);
      if (Number.isNaN(n) || n < 0 || n > EXP_MAX) next.workExp = "Invalid";
    }

    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  // --- Handlers ---
  async function handleNext(e?: React.FormEvent) {
    e?.preventDefault();
    setServerError(null);

    if (step === 0) {
      if (!validatePersonal()) return;
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (step === 1) {
      if (!validateProfessional()) return;
      await submitRegistration();
    }
  }

  async function submitRegistration() {
    setSubmitting(true);
    setServerError(null);

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      dob,
      mobile,
      email: email.toLowerCase(),
      password,
      qualification,
      designation,
      clinicName,
      address,
      workExp: Number(workExp),
    };

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setServerError(data.error || "Registration failed.");
        setSubmitting(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Common input styles
  const inputClass = (hasError: boolean) => `
    w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-900 
    placeholder:text-slate-400 transition-all duration-200 outline-none
    ${hasError 
      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
      : "border-slate-200 focus:bg-white focus:border-[#27B19B] focus:ring-4 focus:ring-[#27B19B]/10 hover:border-slate-300"
    }
  `;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Panel - Branding (Fixed Sidebar) */}
      <aside className="hidden lg:flex lg:w-[480px] bg-[#1B3A5B] flex-col justify-between p-12 text-white fixed inset-y-0 left-0 z-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#27B19B] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="block w-48 h-20 relative mb-8 hover:opacity-90 transition-opacity">
            <Image src="/logo.webp" alt="GAE Logo" fill className="object-contain brightness-0 invert" priority />
          </Link>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Begin Your Journey in Clinical Embryology
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Create your professional profile to access world-class resources, workshops, and a global network of experts.
          </p>
        </div>

        {/* Stepper (Vertical) */}
        <div className="relative z-10 space-y-6">
          <div className="group flex items-start gap-4">
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 shrink-0 ${step >= 0 ? 'bg-[#27B19B] border-[#27B19B] text-white' : 'border-white/30 text-white/50'}`}>
              {step > 0 ? <Check size={16} /> : <span className="text-sm font-bold">1</span>}
              {/* Connecting Line */}
              <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/20 -z-10`} />
            </div>
            <div className="pt-1">
              <h3 className={`font-semibold text-sm tracking-wide uppercase ${step === 0 ? 'text-white' : 'text-slate-300'}`}>Personal Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">Identity & Security</p>
            </div>
          </div>

          <div className="group flex items-start gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 shrink-0 ${step >= 1 ? 'bg-[#27B19B] border-[#27B19B] text-white' : 'bg-transparent border-white/30 text-white/50'}`}>
              <span className="text-sm font-bold">2</span>
            </div>
            <div className="pt-1">
              <h3 className={`font-semibold text-sm tracking-wide uppercase ${step === 1 ? 'text-white' : 'text-slate-300'}`}>Professional Profile</h3>
              <p className="text-xs text-slate-400 mt-0.5">Experience & Work</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} Global Academy of Embryology
        </div>
      </aside>

      {/* Right Panel - Scrollable Form */}
      <main className="w-full lg:ml-[480px] flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16">
          <div className="w-full max-w-2xl bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-xl lg:shadow-none p-8 lg:p-0 border lg:border-none border-slate-100">
            
            {/* Mobile Header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="w-40 h-16 relative mx-auto mb-4">
                <Image src="/logo.webp" alt="GAE Logo" fill className="object-contain" />
              </div>
              <h2 className="text-xl font-bold text-[#1B3A5B]">Create Account</h2>
              
              {/* Mobile Stepper */}
              <div className="flex justify-center gap-2 mt-4">
                <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 0 ? 'bg-[#27B19B]' : 'bg-slate-200'}`} />
                <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-[#27B19B]' : 'bg-slate-200'}`} />
              </div>
            </div>

            <div className="hidden lg:block mb-10">
              <h2 className="text-2xl font-bold text-slate-900">
                {step === 0 ? "Personal Information" : "Professional Details"}
              </h2>
              <p className="text-slate-500 mt-1">
                {step === 0 ? "Let's get to know you better." : "Tell us about your work experience."}
              </p>
            </div>

            {serverError && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{serverError}</p>
              </div>
            )}

            <form onSubmit={handleNext} className="space-y-8 animate-in fade-in duration-500">
              {step === 0 ? (
                /* --- STEP 1: PERSONAL --- */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="First Name" error={errors.firstName} icon={User} required>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputClass(!!errors.firstName)}
                        placeholder="John"
                        maxLength={NAME_MAX}
                      />
                    </InputField>
                    <InputField label="Last Name" error={errors.lastName} icon={User} required>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputClass(!!errors.lastName)}
                        placeholder="Doe"
                        maxLength={NAME_MAX}
                      />
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Date of Birth" error={errors.dob} icon={Calendar} required>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`${inputClass(!!errors.dob)} text-slate-600`}
                      />
                    </InputField>
                    <InputField label="Mobile Number" error={errors.mobile} icon={Phone} required>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className={inputClass(!!errors.mobile)}
                        placeholder="+91 98765 43210"
                        maxLength={MOBILE_MAX}
                      />
                    </InputField>
                  </div>

                  <InputField label="Email Address" error={errors.email} icon={Mail} required>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass(!!errors.email)}
                      placeholder="you@company.com"
                      maxLength={EMAIL_MAX}
                    />
                  </InputField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5 w-full">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`${inputClass(!!errors.password)} pr-12`}
                          placeholder="••••••••"
                          maxLength={PASSWORD_MAX}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-1.5 w-full">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Confirm Password <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`${inputClass(!!errors.confirmPassword)} pr-12`}
                          placeholder="••••••••"
                          maxLength={PASSWORD_MAX}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                /* --- STEP 2: PROFESSIONAL --- */
                <div className="space-y-6">
                  <InputField label="Qualification" error={errors.qualification} icon={GraduationCap} required>
                    <input
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className={inputClass(!!errors.qualification)}
                      placeholder="e.g. MSc Clinical Embryology"
                      maxLength={QUAL_MAX}
                    />
                  </InputField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Designation" error={errors.designation} icon={Briefcase} required>
                      <input
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className={inputClass(!!errors.designation)}
                        placeholder="e.g. Senior Embryologist"
                        maxLength={DESIGN_MAX}
                      />
                    </InputField>
                    <InputField label="Experience (Years)" error={errors.workExp} icon={Check} required>
                      <input
                        value={workExp}
                        onChange={(e) => setWorkExp(e.target.value.replace(/[^\d.]/g, ""))}
                        className={inputClass(!!errors.workExp)}
                        placeholder="e.g. 5"
                        maxLength={4}
                      />
                    </InputField>
                  </div>

                  <InputField label="Clinic / Organisation" error={errors.clinicName} icon={Building2} required>
                    <input
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className={inputClass(!!errors.clinicName)}
                      placeholder="Organization Name"
                      maxLength={CLINIC_MAX}
                    />
                  </InputField>

                  <div className="space-y-1.5 w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Address <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400 group-focus-within:text-[#27B19B]">
                        <MapPin size={18} />
                      </div>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className={`${inputClass(!!errors.address)} resize-none`}
                        placeholder="Full street address, City, Zip Code"
                        maxLength={ADDR_MAX}
                      />
                    </div>
                    {errors.address && <p className="text-xs text-red-500 font-medium ml-1">{errors.address}</p>}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 flex items-center justify-between gap-4 border-t border-slate-100">
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                ) : (
                  <div className="text-sm text-slate-400 hidden sm:block">Step 1 of 2</div>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#27B19B] text-white font-semibold hover:bg-[#1e8f7c] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#27B19B]/20 hover:shadow-xl hover:shadow-[#27B19B]/30 hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : step === 0 ? (
                    <>Next Step <ChevronRight size={20} /></>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[#1B3A5B] font-bold hover:text-[#27B19B] transition-colors underline decoration-2 decoration-transparent hover:decoration-current">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}