"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddGalleryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",       // Caption for the image
    category: "",    // e.g., 'Events', 'Campus', 'Awards'
    imageUrl: "",
  });

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    // Hint for S3 to store in 'gallery-photos' folder
    uploadData.append("folder", "gallery-photos"); 

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, imageUrl: data.url });
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
    if (!formData.imageUrl) {
      alert("Please upload an image");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/admin/gallery");
      } else {
        alert("Error adding to gallery");
      }
    } catch(err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/gallery" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Gallery Image</h1>
          <p className="text-slate-500 text-sm">Upload new photos to the gallery.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo <span className="text-red-500">*</span></label>
            
            <div className={`
              relative w-full h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors
              ${formData.imageUrl ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-[#27B19B] hover:bg-[#27B19B]/5'}
            `}>
              {uploading ? (
                <div className="flex flex-col items-center text-slate-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <span className="text-sm">Uploading to gallery-photos...</span>
                </div>
              ) : formData.imageUrl ? (
                <div className="relative w-full h-full p-2">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      fill 
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  {/* Change Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg m-2">
                    <p className="text-white text-sm font-medium">Click to Change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <div className="p-4 rounded-full bg-slate-100 mb-3">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click to upload image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 10MB</p>
                </div>
              )}

              {/* Hidden Input */}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Caption / Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                placeholder="e.g. Annual Convocation 2025"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none bg-white"
              >
                <option value="">Select Category</option>
                <option value="Events">Events</option>
                <option value="Campus">Campus Life</option>
                <option value="Awards">Awards</option>
                <option value="Workshops">Workshops</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/gallery"
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 rounded-xl bg-[#27B19B] text-white font-medium hover:bg-[#1fa88e] transition-colors shadow-lg shadow-[#27B19B]/20 flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? "Saving..." : <><Save size={18} /> Add to Gallery</>}
          </button>
        </div>

      </form>
    </div>
  );
}