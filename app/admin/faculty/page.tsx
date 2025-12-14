"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export default function FacultyListPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch Faculty
  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("/api/faculty");
        const json = await res.json();
        
        // --- FIX IS HERE ---
        // Check if the API returned { success: true, data: [...] }
        if (json.success && Array.isArray(json.data)) {
          setFaculty(json.data);
        } else if (Array.isArray(json)) {
           // Fallback if you change API to return just the array
           setFaculty(json);
        } else {
          setFaculty([]);
        }
        
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    
    // Optimistic UI update
    const originalData = [...faculty];
    setFaculty(prev => prev.filter(f => f._id !== id)); // Note: MongoDB uses _id, not id

    try {
      const res = await fetch(`/api/faculty/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      alert("Failed to delete faculty member");
      setFaculty(originalData); // Revert on error
    }
  };

  const filteredFaculty = faculty.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Members</h1>
          <p className="text-slate-500 text-sm">Manage doctors and embryologists.</p>
        </div>
        <Link 
          href="/admin/faculty/new" 
          className="bg-[#1B3A5B] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#152e4a] transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> Add Member
        </Link>
      </div>

      {/* Search & Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or specialization..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading faculty...</td></tr>
              ) : filteredFaculty.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No faculty members found.</td></tr>
              ) : (
                filteredFaculty.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                          {member.image ? (
                             <Image src={member.image} alt={member.name} fill className="object-cover" unoptimized />
                             
                             
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-[#1B3A5B] text-white text-xs font-bold">
                               {member.name?.[0]}
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.designation}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {member.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.experience}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/faculty/edit/${member._id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}