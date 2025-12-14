"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, Trash2, Plus, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    specialization: "",
    experience: "",
    education: "",
    bio: "",
    image: "",
    email: "",
    achievements: [""]
  });

  // 1. Fetch Existing Data on Mount
  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch(`/api/faculty/${id}`);
        
        if (!res.ok) {
             console.error("API Error Status:", res.status);
             throw new Error("Failed to fetch");
        }

        const json = await res.json();
        
        // FIX: Check for direct object (_id) OR nested data structure
        const data = json._id ? json : (json.data || json.faculty);

        if (data && data._id) {
          setFormData({
            name: data.name || "",
            designation: data.designation || "",
            specialization: data.specialization || "",
            experience: data.experience || "",
            education: data.education || "",
            bio: data.bio || "",
            image: data.image || "",
            email: data.email || "",
            // Ensure achievements is always an array
            achievements: (data.achievements && data.achievements.length > 0) 
              ? data.achievements 
              : [""]
          });
        } else {
          alert("Faculty member not found in database");
          router.push("/admin/faculty");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchFaculty();
  }, [id, router]);

  // 2. Handlers
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

  // 3. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/faculty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const json = await res.json();

      if (res.ok) {
        router.push("/admin/faculty");
      } else {
        alert(json.error || "Error updating faculty member");
      }
    } catch(err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading faculty details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/faculty" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Faculty Member</h1>
          <p className="text-slate-500 text-sm">Update profile details for {formData.name}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
          
          {/* Image Upload Section */}
          <div className="flex items-center gap-6 mb-4">
             <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 group">
                {uploading ? (
                  <Loader2 className="animate-spin text-slate-400" size={24} />
                ) : formData.image ? (
                   <Image 
                     src={formData.image} 
                     alt="Preview" 
                     fill 
                     className="object-cover"
                     unoptimized
                   />
                ) : (
                   <Upload className="text-slate-400" size={24} />
                )}
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-700">Profile Photo</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#27B19B]/10 file:text-[#27B19B] hover:file:bg-[#27B19B]/20"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {uploading ? "Uploading to faculty-photos..." : "Uploads to 'faculty-photos' in S3"}
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
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Designation</label>
              <input 
                required
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Specialization</label>
              <input 
                required
                value={formData.specialization}
                onChange={e => setFormData({...formData, specialization: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>
          
           <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Experience</label>
              <input 
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Education</label>
              <input 
                value={formData.education}
                onChange={e => setFormData({...formData, education: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
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
              rows={5}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-slate-700">Achievements</label>
               <button type="button" onClick={addAchievementField} className="text-xs text-[#1B3A5B] font-semibold hover:underline flex items-center gap-1">
                 <Plus size={14} /> Add Another
               </button>
            </div>
            {formData.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2">
                 <input 
                  value={ach}
                  onChange={e => handleAchievementChange(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                  placeholder="Achievement or Award"
                />
                {formData.achievements.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeAchievementField(i)}
                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
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
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Updating...
              </>
            ) : (
              <>
                <Save size={18} /> Update Faculty
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}