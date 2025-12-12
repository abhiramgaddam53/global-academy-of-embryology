// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff } from "lucide-react";

// const EMAIL_MAX = 254;
// const NAME_MAX = 60;
// const QUAL_MAX = 120;
// const CLINIC_MAX = 120;
// const ADDR_MAX = 500;
// const DESIGN_MAX = 80;
// const MOBILE_MAX = 15;
// const PASSWORD_MIN = 6;
// const PASSWORD_MAX = 128;
// const EXP_MAX = 80;

// function validateEmail(email: string) {
//   return /^\S+@\S+\.\S+$/.test(email);
// }
// function validateMobile(mobile: string) {
//   const digits = mobile.replace(/\D/g, "");
//   return digits.length >= 7 && digits.length <= 15;
// }
// function safeTrim(v: string, max = 1000) {
//   return v.trim().slice(0, max);
// }

// export default function RegisterPage() {
//   const router = useRouter();
//   const [step, setStep] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
//   const [serverError, setServerError] = useState<string | null>(null);

//   // PERSONAL
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");

//   // PASSWORDS  
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // PROFESSIONAL
//   const [qualification, setQualification] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [clinicName, setClinicName] = useState("");
//   const [address, setAddress] = useState("");
//   const [workExp, setWorkExp] = useState("");

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // 🔍 Validate Step 1
//   function validatePersonal() {
//     const next: Record<string, string> = {};

//     const f = safeTrim(firstName, NAME_MAX);
//     const l = safeTrim(lastName, NAME_MAX);
//     const e = safeTrim(email.toLowerCase(), EMAIL_MAX);
//     const m = safeTrim(mobile, MOBILE_MAX);

//     if (!f) next.firstName = "First name is required.";
//     if (!l) next.lastName = "Last name is required.";

//     if (!dob) next.dob = "Date of birth is required.";

//     if (!m) next.mobile = "Mobile number is required.";
//     else if (!validateMobile(m)) next.mobile = "Enter a valid mobile number.";

//     if (!e) next.email = "Email is required.";
//     else if (!validateEmail(e)) next.email = "Enter a valid email address.";

//     // PASSWORD VALIDATION
//     if (!password) next.password = "Password is required.";
//     else if (password.length < PASSWORD_MIN)
//       next.password = `Password must be ≥ ${PASSWORD_MIN} characters.`;

//     if (!confirmPassword) next.confirmPassword = "Please re-enter your password.";
//     else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";

//     setErrors(next);
//     return Object.keys(next).length === 0;
//   }

//   // 🔍 Validate Step 2 (Professional)
//   function validateProfessional() {
//     const next: Record<string, string> = {};

//     const qual = safeTrim(qualification, QUAL_MAX);
//     const des = safeTrim(designation, DESIGN_MAX);
//     const clinic = safeTrim(clinicName, CLINIC_MAX);
//     const addr = safeTrim(address, ADDR_MAX);
//     const exp = safeTrim(workExp, 6);

//     if (!qual) next.qualification = "Qualification is required.";
//     if (!des) next.designation = "Designation is required.";
//     if (!clinic) next.clinicName = "Clinic/Organisation is required.";
//     if (!addr) next.address = "Address is required.";

//     if (!exp) next.workExp = "Work experience is required.";
//     else {
//       const n = Number(exp);
//       if (Number.isNaN(n) || n < 0 || n > EXP_MAX)
//         next.workExp = "Enter a valid number of years.";
//     }

//     setErrors((prev) => ({ ...prev, ...next }));
//     return Object.keys(next).length === 0;
//   }

//   async function handleNext(e?: React.FormEvent) {
//     e?.preventDefault();
//     setServerError(null);

//     if (step === 0) {
//       if (!validatePersonal()) return;
//       setStep(1);
//       return;
//     }

//     if (step === 1) {
//       if (!validateProfessional()) return;
//       await submitRegistration();
//     }
//   }

//   async function submitRegistration() {
//     setSubmitting(true);
//     setServerError(null);

//     const payload = {
//       name: `${firstName.trim()} ${lastName.trim()}`,
//       dob,
//       mobile,
//       email: email.toLowerCase(),
//       password,
//       qualification,
//       designation,
//       clinicName,
//       address,
//       workExp: Number(workExp),
//     };

//     try {
//       const resp = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await resp.json();
//       if (!resp.ok) {
//         setServerError(data.error || "Unable to register. Try again later.");
//         setSubmitting(false);
//         return;
//       }

//       router.push("/login?registered=1");
//     } catch {
//       setServerError("Network error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-12 px-4">
//       <div className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-lg border border-gray-100">

//         {/* HEADER */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-14 h-14 relative">
//             <Image src="/logo.webp" alt="GAE" fill className="object-contain" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold text-[#1B3A5B]">Create an account</h1>
//             <p className="text-sm text-gray-500">Enter your personal & professional details</p>
//           </div>
//         </div>

//         {/* SERVER ERROR */}
//         {serverError && (
//           <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-2">
//             {serverError}
//           </div>
//         )}

//         <form onSubmit={handleNext} className="space-y-6">
//           {step === 0 ? (
//             <>
//               <h2 className="text-lg font-medium text-[#0F172A]">Personal details</h2>

//               {/* GRID */}
//               <div className="grid md:grid-cols-2 gap-4">

//                 {/* FIRST NAME */}
//                 <div>
//                   <label className="block text-sm">First name</label>
//                   <input
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
//                 </div>

//                 {/* LAST NAME */}
//                 <div>
//                   <label className="block text-sm">Last name</label>
//                   <input
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
//                 </div>

//                 {/* DOB */}
//                 <div>
//                   <label className="block text-sm">Date of birth</label>
//                   <input
//                     type="date"
//                     value={dob}
//                     onChange={(e) => setDob(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
//                 </div>

//                 {/* MOBILE */}
//                 <div>
//                   <label className="block text-sm">Mobile number</label>
//                   <input
//                     value={mobile}
//                     onChange={(e) => setMobile(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile}</p>}
//                 </div>

//                 {/* EMAIL */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm">Email address</label>
//                   <input
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
//                 </div>

//                 {/* PASSWORD */}
//                 <div className="relative md:col-span-2">
//                   <label className="block text-sm">Password</label>

//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border pr-12"
//                   />

//                   <button
//                     type="button"
//                     className="absolute right-3 top-10 text-gray-500"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>

//                   {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
//                 </div>

//                 {/* CONFIRM PASSWORD */}
//                 <div className="relative md:col-span-2">
//                   <label className="block text-sm">Re-enter password</label>

//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border pr-12"
//                   />

//                   <button
//                     type="button"
//                     className="absolute right-3 top-10 text-gray-500"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>

//                   {errors.confirmPassword && (
//                     <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
//                   )}
//                 </div>
//               </div>

//               {/* NEXT BUTTON */}
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className="mt-6 w-full px-5 py-3 rounded-lg bg-[#27B19B] text-white font-medium"
//               >
//                 Next →
//               </button>
//             </>
//           ) : (
//             <>
//               <h2 className="text-lg font-medium text-[#0F172A]">Professional details</h2>

//               <div className="grid md:grid-cols-2 gap-4">

//                 <div className="md:col-span-2">
//                   <label className="block text-sm">Qualification</label>
//                   <input
//                     value={qualification}
//                     onChange={(e) => setQualification(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.qualification && <p className="text-red-600 text-sm">{errors.qualification}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm">Designation</label>
//                   <input
//                     value={designation}
//                     onChange={(e) => setDesignation(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.designation && <p className="text-red-600 text-sm">{errors.designation}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm">Clinic / Organisation</label>
//                   <input
//                     value={clinicName}
//                     onChange={(e) => setClinicName(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.clinicName && <p className="text-red-600 text-sm">{errors.clinicName}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm">Work experience (years)</label>
//                   <input
//                     value={workExp}
//                     onChange={(e) => setWorkExp(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.workExp && <p className="text-red-600 text-sm">{errors.workExp}</p>}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm">Address</label>
//                   <textarea
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     rows={4}
//                     className="w-full px-4 py-3 rounded-lg border"
//                   />
//                   {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
//                 </div>
//               </div>

//               {/* BUTTONS */}
//               <div className="flex justify-between mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setStep(0)}
//                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
//                 >
//                   ← Back
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="px-5 py-3 rounded-lg bg-[#1B3A5B] text-white font-medium disabled:opacity-60"
//                 >
//                   {submitting ? "Creating…" : "Create account"}
//                 </button>
//               </div>
//             </>
//           )}
//         </form>

//         <p className="text-center text-sm text-gray-500 mt-6">
//           Already registered?{" "}
//           <Link href="/login" className="text-[#1B3A5B] underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }
// app/register/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // PERSONAL
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // PASSWORDS
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // PROFESSIONAL
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [workExp, setWorkExp] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔍 Validate Step 1
  function validatePersonal() {
    const next: Record<string, string> = {};

    const f = safeTrim(firstName, NAME_MAX);
    const l = safeTrim(lastName, NAME_MAX);
    const e = safeTrim(email.toLowerCase(), EMAIL_MAX);
    const m = safeTrim(mobile, MOBILE_MAX);

    if (!f) next.firstName = "First name is required.";
    if (!l) next.lastName = "Last name is required.";

    if (!dob) next.dob = "Date of birth is required.";

    if (!m) next.mobile = "Mobile number is required.";
    else if (!validateMobile(m)) next.mobile = "Enter a valid mobile number.";

    if (!e) next.email = "Email is required.";
    else if (!validateEmail(e)) next.email = "Enter a valid email address.";

    // PASSWORD VALIDATION
    if (!password) next.password = "Password is required.";
    else if (password.length < PASSWORD_MIN)
      next.password = `Password must be ≥ ${PASSWORD_MIN} characters.`;
    else if (password.length > PASSWORD_MAX)
      next.password = `Password must be ≤ ${PASSWORD_MAX} characters.`;

    if (!confirmPassword) next.confirmPassword = "Please re-enter your password.";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // 🔍 Validate Step 2 (Professional)
  function validateProfessional() {
    const next: Record<string, string> = {};

    const qual = safeTrim(qualification, QUAL_MAX);
    const des = safeTrim(designation, DESIGN_MAX);
    const clinic = safeTrim(clinicName, CLINIC_MAX);
    const addr = safeTrim(address, ADDR_MAX);
    const exp = safeTrim(workExp, 6);

    if (!qual) next.qualification = "Qualification is required.";
    if (!des) next.designation = "Designation is required.";
    if (!clinic) next.clinicName = "Clinic/Organisation is required.";
    if (!addr) next.address = "Address is required.";

    if (!exp) next.workExp = "Work experience is required.";
    else {
      const n = Number(exp);
      if (Number.isNaN(n) || n < 0 || n > EXP_MAX)
        next.workExp = "Enter a valid number of years.";
    }

    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

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
        setServerError(data.error || "Unable to register. Try again later.");
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-40 h-17 md:w-60 md:h-20 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.webp" alt="GAE" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#1B3A5B]">Create an account</h1>
            <p className="text-sm text-gray-500">Personal details → Professional details — quick registration</p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${step === 0 ? "bg-[#27B19B] text-white" : "bg-gray-100 text-gray-700"}`}>1. Personal</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${step === 1 ? "bg-[#27B19B] text-white" : "bg-gray-100 text-gray-700"}`}>2. Professional</div>
            <div className="ml-auto text-xs text-gray-500">{step === 0 ? "Step 1 of 2" : "Step 2 of 2"}</div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${step === 0 ? "w-[45%] bg-[#27B19B]" : "w-full bg-[#27B19B]"}`} />
          </div>
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-2">
            {serverError}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-6">
          {step === 0 ? (
            <>
              <h2 className="text-lg font-medium text-[#0F172A]">Personal details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* FIRST NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="First name"
                    maxLength={NAME_MAX}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* LAST NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="Last name"
                    maxLength={NAME_MAX}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.dob ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    aria-invalid={!!errors.dob}
                  />
                  {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
                </div>

                {/* MOBILE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.mobile ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="+91 98765 43210"
                    maxLength={MOBILE_MAX}
                    aria-invalid={!!errors.mobile}
                  />
                  {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
                </div>

                {/* EMAIL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="you@business.com"
                    maxLength={EMAIL_MAX}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 pr-12 ${errors.password ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="Choose a strong password"
                    maxLength={PASSWORD_MAX}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3  mt-4 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 pr-12 ${errors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="Confirm password"
                    maxLength={PASSWORD_MAX}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3  mt-4 text-gray-500"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div />
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#27B19B] text-white font-semibold hover:brightness-95 transition"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-[#0F172A]">Professional details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.qualification ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="e.g. MSc Clinical Embryology"
                    maxLength={QUAL_MAX}
                    aria-invalid={!!errors.qualification}
                  />
                  {errors.qualification && <p className="text-red-600 text-sm mt-1">{errors.qualification}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.designation ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="e.g. Senior Embryologist"
                    maxLength={DESIGN_MAX}
                    aria-invalid={!!errors.designation}
                  />
                  {errors.designation && <p className="text-red-600 text-sm mt-1">{errors.designation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic / Organisation Name </label>
                  <input
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.clinicName ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="Clinic or hospital name"
                    maxLength={CLINIC_MAX}
                    aria-invalid={!!errors.clinicName}
                  />
                  {errors.clinicName && <p className="text-red-600 text-sm mt-1">{errors.clinicName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work experience (years)</label>
                  <input
                    value={workExp}
                    onChange={(e) => setWorkExp(e.target.value.replace(/[^\d.]/g, ""))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.workExp ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="e.g. 10"
                    maxLength={4}
                    aria-invalid={!!errors.workExp}
                  />
                  {errors.workExp && <p className="text-red-600 text-sm mt-1">{errors.workExp}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.address ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#27B19B]/30"}`}
                    placeholder="Full clinic or home address"
                    maxLength={ADDR_MAX}
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-3 rounded-xl bg-[#1B3A5B] text-white font-medium hover:brightness-95 transition disabled:opacity-60"
                  >
                    {submitting ? "Creating…" : "Create account"}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-[#1B3A5B] underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
