"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch Gallery Items
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.success) {
          setItems(json.gallery || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Quick Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image permanently?")) return;

    // Optimistic update
    setItems(items.filter(item => item._id !== id));

    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    } catch (err) {
      alert("Failed to delete item");
      // Revert if failed (optional, but good practice)
      window.location.reload(); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Photo Gallery</h1>
          <p className="text-slate-500 text-sm">Manage campus photos and event highlights.</p>
        </div>
        <Link 
          href="/admin/gallery/add" 
          className="flex items-center gap-2 bg-[#27B19B] hover:bg-[#219e8c] text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#27B19B]/20"
        >
          <Plus size={20} />
          <span>Add Photo</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] focus:ring-2 focus:ring-[#27B19B]/10 outline-none transition-all"
        />
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-slate-900 font-medium">No photos found</h3>
          <p className="text-slate-500 text-sm mt-1">
            {search ? "Try a different search term" : "Start by adding your first photo"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image 
                  src={item.imageUrl} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-900 line-clamp-1 mb-1" title={item.title}>
                  {item.title}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <Link 
                    href={`/admin/gallery/edit/${item._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium hover:bg-[#27B19B]/10 hover:text-[#27B19B] transition-colors"
                  >
                    <Edit2 size={16} /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}