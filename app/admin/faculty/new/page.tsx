"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddFacultyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    specialization: "",
    experience: "",
    education: "",
    bio: "",
    image: "/founder.webp", // Default placeholder
    email: "",
    achievements: [""]
  });

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addAchievementField = () => {
    setFormData({ ...formData, achievements: [...formData.achievements, ""] });
  };

  const removeAchievementField = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    // Send the folder hint to the backend
    uploadData.append("folder", "faculty-photos");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image: data.url });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/admin/faculty");
      } else {
        alert("Error creating faculty member");
      }
    } catch(err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/faculty" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Faculty Member</h1>
          <p className="text-slate-500 text-sm">Create a new profile for the team.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
          
          {/* Image Upload Section */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative group">
              {uploading ? (
                <Loader2 className="animate-spin text-slate-400" size={24} />
              ) : formData.image !== "/founder.webp" ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="text-slate-400" size={24} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#27B19B]/10 file:text-[#27B19B] hover:file:bg-[#27B19B]/20"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {uploading ? "Uploading to faculty-photos..." : "Upload a photo directly."}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email"
                required
                value={formData.email || " " }
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Designation</label>
              <input 
                required
                value={formData.designation || " " }
                onChange={e => setFormData({...formData, designation: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="Senior Embryologist"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Specialization</label>
              <input 
                required
                value={formData.specialization || " " }
                onChange={e => setFormData({...formData, specialization: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="IVF, Andrology..."
              />
            </div>
          </div>
          
           <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Experience</label>
              <input 
                value={formData.experience || 0 }
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="10+ Years"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Education</label>
              <input 
                value={formData.education || " " }
                onChange={e => setFormData({...formData, education: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="PhD, MSc..."
              />
            </div>
           </div>
        </div>

        {/* Bio & Achievements */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">Detailed Profile</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Biography</label>
            <textarea 
              rows={4}
              value={formData.bio ||  " " }
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none resize-none"
              placeholder="Dr. John has over 15 years of experience..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-slate-700">Achievements</label>
               <button type="button" onClick={addAchievementField} className="text-xs text-[#1B3A5B] font-semibold hover:underline">+ Add Another</button>
            </div>
            {formData.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2 items-center">
                 <input 
                  value={ach}
                  onChange={e => handleAchievementChange(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                  placeholder="Awarded Best Embryologist 2023"
                />
                {formData.achievements.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeAchievementField(i)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link 
            href="/admin/faculty"
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 rounded-xl bg-[#27B19B] text-white font-medium hover:bg-[#1fa88e] transition-colors shadow-lg shadow-[#27B19B]/20 flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? "Saving..." : <><Save size={18} /> Save Faculty</>}
          </button>
        </div>

      </form>
    </div>
  );
}