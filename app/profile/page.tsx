"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Building2,
  Phone,
  Calendar,
  MapPin,
  Pencil,
  CheckCircle2,
  Briefcase,
  FileBadge2,
  GraduationCapIcon,
  Mail,
  Award,
  Clock,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import AnimatedLogoLoader from "../components/AnimatedLogoLoader";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    qualification: "",
    designation: "",
    clinicName: "",
    address: "",
    workExp: "",
    mobile: "",
  });

  // Load user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          setForm({
            name: data.user.name || "",
            dob: data.user.dob || "",
            qualification: data.user.qualification || "",
            designation: data.user.designation || "",
            clinicName: data.user.clinicName || "",
            address: data.user.address || "",
            workExp: data.user.workExp || "",
            mobile: data.user.mobile || "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Redirect if NOT logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/profile");
    }
  }, [loading, user, router]);

  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <AnimatedLogoLoader />
      </main>
    );
  }

  if (!user) return null;

  const updateField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setUser(data.user);
        setEditing(false);
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1B3A5B] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1B3A5B]">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal and professional information</p>
            </div>
            
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#27B19B] text-white font-semibold rounded-lg hover:bg-[#1fa88e] transition-colors"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${
              message.includes("success")
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.includes("success") ? (
                <CheckCircle2 size={20} />
              ) : (
                <X size={20} />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#1B3A5B] text-white flex items-center justify-center text-3xl font-bold mb-4">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-[#1B3A5B]">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.designation}</p>
                <p className="text-sm text-gray-500 mt-2">{user.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <StatItem
                  icon={<Clock className="text-[#27B19B]" size={18} />}
                  label="Experience"
                  value={`${user.workExp} years`}
                />
                <StatItem
                  icon={<Award className="text-[#27B19B]" size={18} />}
                  label="Certificates"
                  value="0"
                />
                <StatItem
                  icon={<GraduationCapIcon className="text-[#27B19B]" size={18} />}
                  label="Webinars"
                  value="0"
                />
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <section className="lg:col-span-2 space-y-6">

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-[#1B3A5B] flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h2>
              </div>

              <div className="p-6">
                {!editing ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoField
                      icon={<User size={16} className="text-gray-400" />}
                      label="Full Name"
                      value={user.name}
                    />
                    <InfoField
                      icon={<Calendar size={16} className="text-gray-400" />}
                      label="Date of Birth"
                      value={new Date(user.dob).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    />
                    <InfoField
                      icon={<Mail size={16} className="text-gray-400" />}
                      label="Email Address"
                      value={user.email}
                    />
                    <InfoField
                      icon={<Phone size={16} className="text-gray-400" />}
                      label="Mobile Number"
                      value={user.mobile}
                    />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-5">
                    <EditField label="Full Name" value={form.name} onChange={(v) => updateField("name", v)} />
                    <EditField label="Date of Birth" type="date" value={form.dob} onChange={(v) => updateField("dob", v)} />
                    <div className="md:col-span-2">
                      <EditField label="Mobile Number" value={form.mobile} onChange={(v) => updateField("mobile", v)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-[#1B3A5B] flex items-center gap-2">
                  <Briefcase size={20} />
                  Professional Details
                </h2>
              </div>

              <div className="p-6">
                {!editing ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoField
                      icon={<GraduationCap size={16} className="text-gray-400" />}
                      label="Qualification"
                      value={user.qualification}
                    />
                    <InfoField
                      icon={<Briefcase size={16} className="text-gray-400" />}
                      label="Designation"
                      value={user.designation}
                    />
                    <InfoField
                      icon={<Building2 size={16} className="text-gray-400" />}
                      label="Clinic/Hospital"
                      value={user.clinicName}
                      full
                    />
                    <InfoField
                      icon={<Clock size={16} className="text-gray-400" />}
                      label="Work Experience"
                      value={`${user.workExp} years`}
                    />
                    <InfoField
                      icon={<MapPin size={16} className="text-gray-400" />}
                      label="Address"
                      value={user.address}
                      full
                    />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-5">
                    <EditField label="Qualification" value={form.qualification} onChange={(v) => updateField("qualification", v)} />
                    <EditField label="Designation" value={form.designation} onChange={(v) => updateField("designation", v)} />
                    <div className="md:col-span-2">
                      <EditField label="Clinic/Hospital Name" value={form.clinicName} onChange={(v) => updateField("clinicName", v)} />
                    </div>
                    <EditField label="Work Experience (years)" type="number" value={form.workExp} onChange={(v) => updateField("workExp", v)} />
                    <div className="md:col-span-2">
                      <EditField label="Address" value={form.address} onChange={(v) => updateField("address", v)} textarea />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <ActivityCard
                icon={<FileBadge2 size={24} className="text-[#27B19B]" />}
                title="Certificates"
                count={0}
                description="Earned certificates"
              />
              <ActivityCard
                icon={<GraduationCapIcon size={24} className="text-[#27B19B]" />}
                title="Webinars"
                count={0}
                description="Attended sessions"
              />
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}

/* ====================== COMPONENTS ====================== */

function StatItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded bg-gray-50">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
  full = false,
}: {
  icon: any;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={`${full ? "md:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#27B19B] focus:ring-2 focus:ring-[#27B19B]/20 outline-none transition-all"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#27B19B] focus:ring-2 focus:ring-[#27B19B]/20 outline-none transition-all"
        />
      )}
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  count,
  description,
}: {
  icon: any;
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gray-50">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#1B3A5B]">{title}</h3>
          <p className="text-2xl font-bold text-[#27B19B] mt-1">{count}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
