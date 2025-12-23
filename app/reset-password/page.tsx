 

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

function validatePassword(p: string) {
  return p.length >= PASSWORD_MIN && p.length <= PASSWORD_MAX;
}

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If no token is present, show error immediately
  if (!token) {
    return (
      <div className="text-center text-red-600 text-xl font-medium">
        Invalid or missing reset token.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError(`Password must be ${PASSWORD_MIN}+ characters.`);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.error || "Unable to reset password.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <h1 className="text-2xl font-semibold text-[#1B3A5B] mb-3">
        Reset your password
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Choose a new password for your account.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-100 px-4 py-2 rounded-md">
          Password reset successful! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NEW PASSWORD */}
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27B19B]/40"
              placeholder="Enter new password"
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                password.length < 4
                  ? "w-[20%] bg-red-400"
                  : password.length < 8
                  ? "w-[50%] bg-yellow-400"
                  : "w-full bg-green-500"
              }`}
            />
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm mb-1">Re-enter Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27B19B]/40"
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || success}
          className="w-full bg-[#27B19B] text-white rounded-lg py-3 font-medium hover:brightness-95 transition disabled:opacity-60"
        >
          {submitting ? "Updating…" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

// ✅ Main Page Component Wrapped in Suspense
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-12 px-4">
      <Suspense 
        fallback={
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="animate-spin text-[#1B3A5B]" size={32} />
             <p className="text-slate-500">Loading...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}