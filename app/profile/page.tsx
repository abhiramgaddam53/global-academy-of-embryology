 

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  GraduationCap,
  Building2,
  Phone,
  Calendar,
  MapPin,
  Pencil,
  Check,
  Briefcase,
  Mail,
  Clock,
  X,
  Save,
  ChevronLeft,
  Camera,
  ShieldCheck,
  Award,
  Video,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import AnimatedLogoLoader from "../components/AnimatedLogoLoader"; 
import Navbar from "../components/Navbar";

// --- Components ---

const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex items-start gap-4 mb-6 border-b border-gray-100 pb-4">
    <div className="p-2.5 bg-blue-50 text-[#1B3A5B] rounded-lg shrink-0">
      <Icon size={22} />
    </div>
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

const DisplayField = ({ label, value, icon: Icon }: { label: string, value: string | number, icon?: any }) => (
  <div className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#27B19B]/30 hover:bg-[#27B19B]/5 transition-all">
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon size={14} className="text-slate-400 group-hover:text-[#27B19B] transition-colors" />}
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
    <div className="font-medium text-slate-900 break-words">
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </div>
  </div>
);

const EditInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  textarea = false 
}: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  type?: string, 
  textarea?: boolean 
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#27B19B] focus:ring-4 focus:ring-[#27B19B]/10 outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#27B19B] focus:ring-4 focus:ring-[#27B19B]/10 outline-none transition-all"
      />
    )}
  </div>
);

const PasswordInput = ({ label, value, onChange, placeholder }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#27B19B] focus:ring-4 focus:ring-[#27B19B]/10 outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    qualification: "",
    designation: "",
    clinicName: "",
    address: "",
    workExp: "",
    mobile: "",
    image: "", // Stores Base64 string
  });

  // Load User Data
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          resetForm(data.user);
        }
      } catch (e) {
        console.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/profile");
    }
  }, [loading, user, router]);

  const resetForm = (userData: any) => {
    setForm({
      name: userData.name || "",
      dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
      qualification: userData.qualification || "",
      designation: userData.designation || "",
      clinicName: userData.clinicName || "",
      address: userData.address || "",
      workExp: userData.workExp?.toString() || "",
      mobile: userData.mobile || "",
      image: userData.image || "", 
    });
  };

  const handleCancel = () => {
    resetForm(user);
    setEditing(false);
    setMessage(null);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // --- SIMPLE IMAGE UPLOAD (No Crop) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
      setEditing(true); // Automatically allow saving
    };
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
        setMessage({ type: 'success', text: "Profile updated successfully" });
        setUser(data.user);
        setEditing(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || "Failed to update profile" });
      }
    } catch {
      setMessage({ type: 'error', text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  // Password Change Handler
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassMessage(null);

    if (passwordForm.new !== passwordForm.confirm) {
      setPassMessage({ type: 'error', text: "New passwords do not match." });
      return;
    }

    if (passwordForm.new.length < 6) {
      setPassMessage({ type: 'error', text: "Password must be at least 6 characters." });
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPassMessage({ type: 'success', text: "Password changed successfully!" });
        setPasswordForm({ current: "", new: "", confirm: "" });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPassMessage(null);
        }, 2000);
      } else {
        setPassMessage({ type: 'error', text: data.error || "Failed to change password." });
      }
    } catch {
      setPassMessage({ type: 'error', text: "Network error. Please try again." });
    } finally {
      setPassLoading(false);
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center bg-slate-50"><AnimatedLogoLoader /></main>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      {/* --- Password Modal --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPasswordModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <KeyRound size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500">Update your account security</p>
              </div>
            </div>

            {passMessage && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  passMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
              }`}>
                  {passMessage.type === 'success' ? <Check size={18} className="mt-0.5 shrink-0" /> : <ShieldCheck size={18} className="mt-0.5 shrink-0" />}
                  {passMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <PasswordInput 
                label="Current Password" 
                placeholder="Enter current password"
                value={passwordForm.current} 
                onChange={(v: string) => setPasswordForm(p => ({...p, current: v}))} 
              />
              <div className="h-px bg-slate-100 my-2" />
              <PasswordInput 
                label="New Password" 
                placeholder="Enter new password"
                value={passwordForm.new} 
                onChange={(v: string) => setPasswordForm(p => ({...p, new: v}))} 
              />
              <PasswordInput 
                label="Confirm New Password" 
                placeholder="Re-enter new password"
                value={passwordForm.confirm} 
                onChange={(v: string) => setPasswordForm(p => ({...p, confirm: v}))} 
              />

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="flex-1 py-3 bg-[#1B3A5B] text-white font-bold rounded-xl hover:bg-[#152e4a] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative h-64 bg-[#1B3A5B] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#27B19B] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
           <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm text-sm"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid lg:grid-cols-[350px,1fr] gap-8">
          
          {/* Sidebar Card */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative">
              
              {/* Profile Image Area */}
              <div className="pt-10 pb-6 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className="w-32 h-32 rounded-full bg-[#1B3A5B] text-white flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white relative z-10 overflow-hidden">
                    {form.image ? (
                        <Image src={form.image} alt="Profile" fill className="object-cover" />
                    ) : (
                        <span>{form.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload} // Simple upload
                  />
                  <div className="absolute bottom-1 right-1 z-20 bg-white p-2 rounded-full shadow-md text-slate-400 group-hover:text-[#1B3A5B] transition-colors hover:scale-110">
                    <Camera size={18} />
                  </div>
                </div>
                
                <div className="text-center mt-4 px-6">
                  <h1 className="text-2xl font-bold text-slate-900">{form.name || user.name}</h1>
                  <p className="text-[#27B19B] font-medium">{form.designation || user.designation || "Member"}</p>
                  <p className="text-sm text-slate-500 mt-1">{form.clinicName || user.clinicName}</p>
                </div>
              </div>
              
              {/* ... Sidebar Stats ... */}
              <div className="border-t border-slate-100 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-center">
                    <p className="text-2xl font-bold text-[#1B3A5B]">{user.workExp || 0}<span className="text-sm align-top text-slate-400 ml-0.5">+</span></p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Years Exp.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-center">
                    <p className="text-2xl font-bold text-[#1B3A5B]">0</p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Credits</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <Mail size={16} className="text-[#27B19B]" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <Phone size={16} className="text-[#27B19B]" />
                        <span>{user.mobile || "Add mobile"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <MapPin size={16} className="text-[#27B19B]" />
                        <span className="truncate">{user.address || "Add address"}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Sidebar) */}
            <div className="bg-[#1B3A5B] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#27B19B] rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-bold text-lg mb-4 relative z-10">Account Status</h3>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <ShieldCheck size={20} className="text-[#27B19B]" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Profile Active</p>
                        <p className="text-xs text-white/60">Global Member</p>
                    </div>
                </div>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors border border-white/10">
                    View Membership
                </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="font-bold text-slate-900">Profile Settings</h2>
                    <p className="text-sm text-slate-500">Update your personal & professional details</p>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  {!editing && (
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-[#1B3A5B] transition-all"
                    >
                      <Lock size={16} />
                      <span className="hidden sm:inline">Change Password</span>
                    </button>
                  )}

                  {!editing ? (
                      <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3A5B] text-white font-medium rounded-xl hover:bg-[#152e4a] transition-all shadow-md shadow-[#1B3A5B]/20"
                      >
                      <Pencil size={16} />
                      Edit Profile
                      </button>
                  ) : (
                      <>
                      <button
                          onClick={handleCancel}
                          className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#27B19B] text-white font-medium rounded-xl hover:bg-[#1fa88e] transition-all shadow-md shadow-[#27B19B]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                          {saving ? (
                              <>Processing...</>
                          ) : (
                              <>
                              <Save size={18} />
                              Save Changes
                              </>
                          )}
                      </button>
                      </>
                  )}
                </div>
            </div>

            {/* Alert Messages */}
            {message && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-in slide-in-from-top-2 ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                        : 'bg-red-50 border-red-100 text-red-800'
                }`}>
                    {message.type === 'success' ? <Check size={20} className="mt-0.5" /> : <X size={20} className="mt-0.5" />}
                    <div>
                        <p className="font-medium">{message.type === 'success' ? 'Success' : 'Error'}</p>
                        <p className="text-sm opacity-90">{message.text}</p>
                    </div>
                </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Personal Details Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                    <SectionHeader 
                        icon={User} 
                        title="Personal Information" 
                        description="Your basic identity information"
                    />

                    {!editing ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            <DisplayField label="Full Name" value={user.name} icon={User} />
                            <DisplayField 
                                label="Date of Birth" 
                                value={user.dob ? new Date(user.dob).toLocaleDateString() : ""} 
                                icon={Calendar} 
                            />
                            <DisplayField label="Email Address" value={user.email} icon={Mail} />
                            <DisplayField label="Mobile Number" value={user.mobile} icon={Phone} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <EditInput label="Full Name" value={form.name} onChange={(v) => updateField("name", v)} />
                            <EditInput label="Date of Birth" type="date" value={form.dob} onChange={(v) => updateField("dob", v)} />
                            <div className="md:col-span-2">
                                <EditInput label="Mobile Number" value={form.mobile} onChange={(v) => updateField("mobile", v)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Professional Details Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                    <SectionHeader 
                        icon={Briefcase} 
                        title="Professional Profile" 
                        description="Your career and workplace details"
                    />

                    {!editing ? (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <DisplayField label="Qualification" value={user.qualification} icon={GraduationCap} />
                                <DisplayField label="Designation" value={user.designation} icon={Award} />
                            </div>
                            <DisplayField label="Clinic / Hospital" value={user.clinicName} icon={Building2} />
                            <div className="grid md:grid-cols-[1fr,2fr] gap-6">
                                <DisplayField label="Experience" value={user.workExp ? `${user.workExp} Years` : ""} icon={Clock} />
                                <DisplayField label="Address" value={user.address} icon={MapPin} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <EditInput label="Qualification" value={form.qualification} onChange={(v) => updateField("qualification", v)} />
                            <EditInput label="Designation" value={form.designation} onChange={(v) => updateField("designation", v)} />
                            <div className="md:col-span-2">
                                <EditInput label="Clinic / Organisation" value={form.clinicName} onChange={(v) => updateField("clinicName", v)} />
                            </div>
                            <EditInput label="Experience (Years)" type="number" value={form.workExp} onChange={(v) => updateField("workExp", v)} />
                            <div className="md:col-span-2">
                                <EditInput label="Address" value={form.address} onChange={(v) => updateField("address", v)} textarea />
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity Summary (Read Only) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                            <p className="text-sm font-medium text-slate-500">Certificates Earned</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
                            <Video size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                            <p className="text-sm font-medium text-slate-500">Webinars Attended</p>
                        </div>
                    </div>
                </div>

            </form>
          </section>
        </div>
      </div>
    </main>
  );
}