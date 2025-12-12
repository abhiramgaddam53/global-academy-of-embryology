// // app/login/page.tsx
// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const EMAIL_MAX = 254;
// const PASSWORD_MIN = 6;
// const PASSWORD_MAX = 128;

// function validateEmail(email: string) {
//   return /^\S+@\S+\.\S+$/.test(email);
// }

// function safeTrim(value: string, max = 1024) {
//   return value.trim().slice(0, max);
// }

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [showForgot, setShowForgot] = useState(false);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // Close forgot modal on outside click
//   useEffect(() => {
//     function onClick(e: MouseEvent) {
//       if (showForgot && modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         setShowForgot(false);
//       }
//     }
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, [showForgot]);

//   // client-side validation
//   function validateAll() {
//     const next: typeof fieldErrors = {};
//     const e = safeTrim(email, EMAIL_MAX);
//     const p = password;

//     if (!e) next.email = "Email is required.";
//     else if (!validateEmail(e)) next.email = "Enter a valid email.";
//     else if (e.length > EMAIL_MAX) next.email = `Email must be ≤ ${EMAIL_MAX} characters.`;

//     if (!p) next.password = "Password is required.";
//     else if (p.length < PASSWORD_MIN) next.password = `Password must be at least ${PASSWORD_MIN} characters.`;
//     else if (p.length > PASSWORD_MAX) next.password = `Password must be ≤ ${PASSWORD_MAX} characters.`;

//     setFieldErrors(next);
//     return Object.keys(next).length === 0;
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setServerError(null);

//     if (!validateAll()) return;

//     setSubmitting(true);
//     try {
//       const payload = {
//         identifier: safeTrim(email, EMAIL_MAX).toLowerCase(),
//         password,
//       };

//       const resp = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // IMPORTANT: for JWT cookie
//         body: JSON.stringify(payload),
//       });

//       const data = await resp.json();

//       if (!resp.ok) {
//         const errMsg =
//           data?.error ??
//           (resp.status === 401 ? "Invalid email or password." : "Unable to sign in. Try again later.");

//         setServerError(errMsg);
//         setSubmitting(false);
//         return;
//       }

//       // login success (server returns user role in data?.user?.role)
//       const role = data?.user?.role;

//       if (role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       setServerError("Network error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-16 px-4">
//       <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
//         {/* Left: Large branding panel */}
//         <div className="hidden md:flex flex-col items-center justify-center gap-6 px-8">
//           <div className="flex flex-col items-center gap-4 transform transition-all duration-300">
//             {/* Large, rectangular logo container adjusted to your logo aspect */}
//             <div className="w-56 h-28 relative rounded-2xl overflow-hidden shadow-lg bg-white p-3 flex items-center justify-center">
//               <Image src="/logo.webp" alt="GAE logo" fill className="object-contain" />
//             </div>

//             {/* Name under the logo */}
//             <div className="text-center">
//               <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B3A5B] leading-tight">
//                 Global Academy of Embryology
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">Transforming Knowledge into Life</p>
//             </div>
//           </div>

//           <div className="mt-6 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100">
//             <h3 className="text-2xl font-semibold text-[#1B3A5B] mb-3">Welcome back</h3>
//             <p className="text-sm text-gray-600">
//               Sign in to access your member dashboard, webinars, and learning resources.
//             </p>
//             <ul className="mt-5 space-y-2 text-sm text-gray-600">
//               <li>• Curated embryology content & toolkits</li>
//               <li>• Members-only workshops</li>
//               <li>• Personalized training programs</li>
//             </ul>
//           </div>

//           <div className="mt-auto text-sm text-gray-500">
//             Need help? <a className="underline" href="mailto:support@example.com">support@example.com</a>
//           </div>
//         </div>

//         {/* Right: Login card */}
//         <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
//           <div className="flex flex-col items-center mb-6">
//             <div className="w-36 h-16 relative md:block hidden mb-4">
//               {/* small decorative logo above heading on large screens */}
//               <Image src="/logo.webp" alt="GAE logo small" fill className="object-contain" />
//             </div>

//             <h1 className="text-3xl font-bold text-[#1B3A5B]">Sign in</h1>
//             <p className="text-sm text-gray-500 mt-2">Use your business email to sign in to the GAE portal.</p>
//           </div>

//           {serverError && (
//             <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">
//               {serverError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onBlur={validateAll}
//                 maxLength={EMAIL_MAX}
//                 placeholder="you@business.com"
//                 className={`w-full px-5 py-4 rounded-xl text-lg border transition-shadow focus:outline-none ${
//                   fieldErrors.email
//                     ? "border-red-400 shadow-sm focus:shadow-red-50"
//                     : "border-gray-200 focus:shadow-md focus:shadow-sky-50"
//                 }`}
//                 aria-invalid={!!fieldErrors.email}
//                 aria-describedby={fieldErrors.email ? "email-error" : undefined}
//               />
//               {fieldErrors.email && (
//                 <div id="email-error" role="alert" className="mt-2 text-sm text-red-600">
//                   {fieldErrors.email}
//                 </div>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label htmlFor="password" className="text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowForgot(true)}
//                   className="text-sm text-[#1B3A5B] underline"
//                 >
//                   Forgot?
//                 </button>
//               </div>

//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onBlur={validateAll}
//                 minLength={PASSWORD_MIN}
//                 maxLength={PASSWORD_MAX}
//                 placeholder="Enter your password"
//                 className={`w-full px-5 py-4 rounded-xl text-lg border transition-shadow focus:outline-none ${
//                   fieldErrors.password
//                     ? "border-red-400 shadow-sm focus:shadow-red-50"
//                     : "border-gray-200 focus:shadow-md focus:shadow-sky-50"
//                 }`}
//                 aria-invalid={!!fieldErrors.password}
//                 aria-describedby={fieldErrors.password ? "password-error" : undefined}
//               />
//               {fieldErrors.password && (
//                 <div id="password-error" role="alert" className="mt-2 text-sm text-red-600">
//                   {fieldErrors.password}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#27B19B] text-white text-lg font-semibold hover:brightness-95 transition disabled:opacity-60"
//               >
//                 {submitting ? "Signing in…" : "Sign in"}
//               </button>
//             </div>

//             <div className="text-center text-sm text-gray-500">
//               Don’t have an account?{" "}
//               <Link href="/register" className="text-[#1B3A5B] underline">
//                 Create one
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Forgot Password Modal */}
//       {showForgot && <ForgotPasswordModal modalRef={modalRef} onClose={() => setShowForgot(false)} />}
//     </main>
//   );
// }

// function ForgotPasswordModal({ onClose, modalRef }: { onClose: () => void; modalRef: any }) {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [sent, setSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const eTrim = safeTrim(email, EMAIL_MAX);

//     if (!eTrim) return setError("Enter your email.");
//     if (!validateEmail(eTrim)) return setError("Enter a valid email.");

//     setError(null);
//     setLoading(true);

//     try {
//       const resp = await fetch("/api/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: eTrim }),
//       });

//       if (!resp.ok) {
//         setError("Unable to send reset link. Try again.");
//         setLoading(false);
//         return;
//       }

//       setSent(true);
//       setTimeout(() => {
//         setLoading(false);
//         onClose();
//       }, 1000);
//     } catch (err) {
//       console.error(err);
//       setError("Network error. Please try again.");
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

//       <div
//         ref={modalRef}
//         role="dialog"
//         aria-modal="true"
//         aria-label="Reset password"
//         className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-modalIn"
//       >
//         <h3 className="text-lg font-semibold text-[#1B3A5B]">Reset password</h3>
//         <p className="text-sm text-gray-600 mt-1 mb-4">Enter your email to receive a reset link.</p>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="email"
//             placeholder="you@business.com"
//             className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27B19B]/40"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           {error && <p className="text-red-600 text-sm">{error}</p>}

//           <div className="flex items-center justify-between gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 rounded-lg bg-[#1B3A5B] text-white text-sm"
//             >
//               {loading ? "Sending…" : sent ? "Sent ✓" : "Send reset link"}
//             </button>
//             <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:underline">
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//       <style jsx>{`
//         @keyframes modalIn {
//           from {
//             opacity: 0;
//             transform: translateY(6px) scale(0.995);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-modalIn {
//           animation: modalIn 220ms ease;
//         }
//       `}</style>
//     </div>
//   );
// }

// app/login/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EMAIL_MAX = 254;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function safeTrim(value: string, max = 1024) {
  return value.trim().slice(0, max);
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close forgot modal on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (showForgot && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowForgot(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showForgot]);

  // client-side validation
  function validateAll() {
    const next: typeof fieldErrors = {};
    const e = safeTrim(email, EMAIL_MAX);
    const p = password;

    if (!e) next.email = "Email is required.";
    else if (!validateEmail(e)) next.email = "Enter a valid email.";
    else if (e.length > EMAIL_MAX) next.email = `Email must be ≤ ${EMAIL_MAX} characters.`;

    if (!p) next.password = "Password is required.";
    else if (p.length < PASSWORD_MIN) next.password = `Password must be at least ${PASSWORD_MIN} characters.`;
    else if (p.length > PASSWORD_MAX) next.password = `Password must be ≤ ${PASSWORD_MAX} characters.`;

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
        credentials: "include", // IMPORTANT: for JWT cookie
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errMsg =
          data?.error ??
          (resp.status === 401 ? "Invalid email or password." : "Unable to sign in. Try again later.");

        setServerError(errMsg);
        setSubmitting(false);
        return;
      }

      // login success (server returns user role in data?.user?.role)
      const role = data?.user?.role;

          // Check if user came from a protected page
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next");

      // Admin override: admin must always go to admin dashboard
      if (data?.user?.role === "admin") {
        router.push(next || "/admin/dashboard");
        return;
      }

      // Normal user
      router.push(next || "/dashboard");
    } catch (err) {
      console.error(err);
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Branding panel - single good spot for brand */}
        <aside className="hidden md:flex flex-col items-start justify-center gap-6 px-8">
          <div className="flex items-start gap-4">
            <div className="w-90 h-30 relative rounded-2xl overflow-hidden bg-white p-3 shadow">
              <Image src="/logo.webp" alt="GAE logo" fill className="object-contain" />
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B3A5B] leading-tight">
              Global Academy of Embryology
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md">Transforming Knowledge into Life — member resources, workshops, and curated learning for embryology professionals.</p>
          </div>

          <div className="mt-6 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold text-[#1B3A5B] mb-3">Welcome back</h3>
            <p className="text-sm text-gray-600">Sign in to access your member dashboard and upcoming events.</p>
            <ul className="mt-4 space-y-1 text-sm text-gray-600">
              <li>• Curated embryology content</li>
              <li>• Members-only workshops</li>
              <li>• Training & mentorship</li>
            </ul>
          </div>
        </aside>

        {/* Right: Login card (no repeated logo/brand name here) */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-[#1B3A5B]">Sign in</h1>
            <p className="text-sm text-gray-500 mt-2">Use your business email to sign in to the GAE portal.</p>
          </div>

          {serverError && (
            <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateAll}
                maxLength={EMAIL_MAX}
                placeholder="you@business.com"
                className={`w-full px-5 py-4 rounded-xl text-lg border transition-shadow focus:outline-none ${
                  fieldErrors.email
                    ? "border-red-400 shadow-sm focus:shadow-red-50"
                    : "border-gray-200 focus:shadow-md focus:shadow-sky-50"
                }`}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <div id="email-error" role="alert" className="mt-2 text-sm text-red-600">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#1B3A5B] underline"
                >
                  Forgot?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validateAll}
                minLength={PASSWORD_MIN}
                maxLength={PASSWORD_MAX}
                placeholder="Enter your password"
                className={`w-full px-5 py-4 rounded-xl text-lg border transition-shadow focus:outline-none ${
                  fieldErrors.password
                    ? "border-red-400 shadow-sm focus:shadow-red-50"
                    : "border-gray-200 focus:shadow-md focus:shadow-sky-50"
                }`}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              {fieldErrors.password && (
                <div id="password-error" role="alert" className="mt-2 text-sm text-red-600">
                  {fieldErrors.password}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#27B19B] text-white text-lg font-semibold hover:brightness-95 transition disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link href="/register" className="text-[#1B3A5B] underline">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal
          modalRef={modalRef}
          onClose={() => setShowForgot(false)}
        />
      )}
    </main>
  );
}
 
 //  ForgotPasswordModal   

function ForgotPasswordModal({ onClose, modalRef }: { onClose: () => void; modalRef: any }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] =
    useState<null | "idle" | "sending" | "sent" | "no-account" | "error">(null);

  const [serverMsg, setServerMsg] = useState<string | null>(null);

  useEffect(() => setStatus("idle"), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setServerMsg(null);

    const eTrim = email.trim().toLowerCase();
    if (!eTrim) {
      setError("Please enter your email.");
      return;
    }
    if (!validateEmail(eTrim)) {
      setError("Enter a valid email address.");
      return;
    }

    setStatus("sending");

    try {
      const resp = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eTrim }),
      });

      const data = await resp.json().catch(() => ({}));

      // SPECIFIC — only success or 404/no-account
      if (resp.ok) {
        setStatus("sent");
        setServerMsg(
          data?.message ??
            "If an account exists for this email, a reset link has been sent."
        );
        return;
      }

      // If backend indicates explicitly the user doesn't exist
      if (
        resp.status === 404 ||
        /not found|no user|no account/i.test(String(data?.error ?? ""))
      ) {
        setStatus("no-account");
        setServerMsg(data?.error ?? "No account found with that email.");
        return;
      }

      // Any other server error
      setStatus("error");
      setServerMsg(
        data?.error ?? "Something went wrong. Please try again later."
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Reset password"
        className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-modalIn"
      >
        <h3 className="text-lg font-semibold text-[#1B3A5B]">
          Reset password
        </h3>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Enter your email and we’ll send instructions to reset your password.
        </p>

        {/* SUCCESS */}
        {status === "sent" && (
          <div className="mb-4 text-green-700 bg-green-50 border border-green-100 rounded-md px-4 py-2">
            {serverMsg}
          </div>
        )}

        {/* NO ACCOUNT */}
        {status === "no-account" && (
          <div className="mb-4 text-yellow-800 bg-yellow-50 border border-yellow-100 rounded-md px-4 py-2">
            {serverMsg}
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="mb-4 text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">
            {serverMsg}
          </div>
        )}

        {/* INPUT FORM (only visible when not sent or no-account or error) */}
        {status === "idle" || status === "sending" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="you@business.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27B19B]/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="px-4 py-2 bg-[#1B3A5B] text-white rounded-lg w-full"
            >
              {status === "sending" ? "Sending…" : "Send reset link"}
            </button>
          </form>
        ) : null}

        {/* FINAL ACTION BUTTON */}
        {status !== "idle" && status !== "sending" && (
          <div className="mt-4 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#27B19B] text-white text-sm"
            >
              OK
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.995);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modalIn {
          animation: modalIn 220ms ease;
        }
      `}</style>
    </div>
  );
}
