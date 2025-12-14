"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, LayoutDashboard, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewWebinarPage() {
  const router = useRouter();
  
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Track dirty state
  const [isDirty, setIsDirty] = useState(false);

  // Initial Empty State
  const initialFormState = {
    title: "",
    description: "",
    dateTime: "",
    mentors: "",
    webinarLink: "",
    recordedLink: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. Detect Changes
  useEffect(() => {
    const isChanged = 
      JSON.stringify(formData) !== JSON.stringify(initialFormState) || 
      imageUrl !== "";
      
    setIsDirty(isChanged);
  }, [formData, imageUrl]);

  // Handle Input Changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 2. Navigation Guards
  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router.push("/admin/webinars");
      }
    } else {
      router.push("/admin/webinars");
    }
  };

  const handleDashboard = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Go to Dashboard anyway?")) {
        router.push("/admin");
      }
    } else {
      router.push("/admin");
    }
  };

  // 3. Upload Handler
  async function uploadImage(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to upload image");

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: any) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // 4. Submit Handler
  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!imageUrl) {
      setError("Please upload an image first");
      return;
    }

    // Process mentors
    const mentorsArray = formData.mentors
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const body = {
      ...formData,
      mentors: mentorsArray,
      imageUrl: imageUrl, 
    };

    setSubmitting(true);

    try {
      const res = await fetch("/api/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create webinar");

      // Reset dirty state on success
      setIsDirty(false);
      router.push("/admin/webinars");
    } catch (err: any) {
      setError(err.message || "Failed to create webinar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCancel}
            type="button"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            title="Back to Webinars"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1B3A5B]">Create New Webinar</h1>
            <p className="text-slate-500 text-sm">Schedule a new session for students.</p>
          </div>
        </div>

        {/* Dashboard Link */}
        <button 
          onClick={handleDashboard}
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#1B3A5B] transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>⚠️ You have unsaved changes.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Basic Info */}
          <div className="grid md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Title *</label>
              <input
                value={formData.title}
                onChange={e => handleChange("title", e.target.value)}
                placeholder="e.g. Advanced IVF Techniques"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange("description", e.target.value)}
                placeholder="What will be covered in this session?"
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={e => handleChange("dateTime", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentors</label>
              <input
                value={formData.mentors}
                onChange={e => handleChange("mentors", e.target.value)}
                placeholder="Comma separated (e.g. Dr. John, Dr. Jane)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Webinar Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.webinarLink}
                onChange={e => handleChange("webinarLink", e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recorded Video Link <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.recordedLink}
                onChange={e => handleChange("recordedLink", e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image *</label>
            <div className="flex items-start gap-4">
              {imageUrl && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <Image 
                       src={ imageUrl} 
                       alt="Preview" 
                       fill 
                       className="object-cover" 
                       unoptimized 
                      />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1B3A5B]/10 file:text-[#1B3A5B] hover:file:bg-[#1B3A5B]/20 transition-colors"
                  required={!imageUrl} 
                />
                {uploading && <p className="mt-2 text-xs text-blue-600 font-medium">Uploading image...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
           {/* Explicit Cancel Button */}
           <button
             type="button"
             onClick={handleCancel}
             className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
           >
             <X size={18} />
             Stop & Cancel
           </button>

           <button
            type="submit"
            disabled={submitting || uploading || !imageUrl}
            className="px-8 py-3 rounded-xl bg-[#27B19B] text-white font-semibold hover:bg-[#219e8c] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#27B19B]/20"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={20} /> Creating...</>
            ) : (
              <><Save size={20} /> Create Webinar</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}