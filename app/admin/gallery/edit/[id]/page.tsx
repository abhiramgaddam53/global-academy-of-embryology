"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, Trash2, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: ""
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    async function fetchGalleryItem() {
      try {
        const res = await fetch(`/api/gallery/${id}`);
        
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        const data = json._id ? json : (json.data || json.item);

        if (data) {
          setFormData({
            title: data.title || "",
            category: data.category || "",
            imageUrl: data.imageUrl || ""
          });
        } else {
          router.push("/admin/gallery");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchGalleryItem();
  }, [id, router]);

  // 2. Handle Image Upload
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

  // 3. Delete Handler
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/gallery");
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // 4. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/admin/gallery");
      } else {
        alert("Error updating gallery item");
      }
    } catch(err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/gallery" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Gallery Image</h1>
            <p className="text-slate-500 text-sm">Update caption or replace photo.</p>
          </div>
        </div>
        
        <button 
          onClick={handleDelete}
          type="button"
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          title="Delete Image"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo</label>
            
            <div className="relative w-full h-64 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group">
              {uploading ? (
                <div className="flex flex-col items-center text-slate-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <span className="text-sm">Uploading replacement...</span>
                </div>
              ) : formData.imageUrl ? (
                <>
                  <Image 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    fill 
                    className="object-contain"
                    unoptimized
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium flex items-center gap-2">
                      <ImageIcon size={18} /> Replace Image
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-slate-400">No Image Found</div>
              )}

              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
            {saving ? (
              <><Loader2 className="animate-spin" size={18} /> Updating...</>
            ) : (
              <><Save size={18} /> Update Gallery</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}