// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function WebinarListPage() {
//   const [webinars, setWebinars] = useState([]);

//   useEffect(() => {
//     fetch("/api/webinars")
//       .then(res => res.json())
//       .then(setWebinars);
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-[#1B3A5B]">Webinars</h2>

//         <Link
//           href="/admin/webinars/new"
//           className="px-4 py-2 rounded-md bg-[#27B19B] text-white hover:bg-[#219e8c] transition"
//         >
//           + Create Webinar
//         </Link>
//       </div>

//       <div className="space-y-4">
//         {webinars.map((w: any) => (
//           <div
//             key={w._id}
//             className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-between"
//           >
//             <div>
//               <h3 className="text-lg font-semibold">{w.title}</h3>
//               <p className="text-sm text-gray-600">{new Date(w.dateTime).toLocaleString()}</p>
//             </div>

//             <Link
//               href={`/admin/webinars/${w._id}`}
//               className="text-[#27B19B] hover:underline"
//             >
//               Edit →
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Calendar, 
  MoreVertical, 
  Users, 
  Video, 
  Clock, 
  Loader2,
  Trash2,
  Edit
} from "lucide-react";

interface Webinar {
  _id: string;
  title: string;
  dateTime: string;
  isStarted: boolean;
  registeredCount?: number; // Backend might send this
  registrations?: any[];    // Or this array
}

export default function AdminWebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const res = await fetch("/api/webinars");
      const data = await res.json();
      // Ensure we sort by newest first
      setWebinars(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;
    
    try {
      const res = await fetch(`/api/webinars/${id}`, { method: "DELETE" });
      if (res.ok) {
        setWebinars(webinars.filter((w) => w._id !== id));
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const filteredWebinars = webinars.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Webinars</h1>
          <p className="text-slate-500 mt-1">Create, edit, and track webinar performance.</p>
        </div>
        <Link 
          href="/admin/webinars/new" 
          className="flex items-center gap-2 bg-[#1B3A5B] hover:bg-[#152e4a] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> Create Webinar
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search webinars..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B3A5B] transition-colors"
        />
      </div>

      {/* List View */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredWebinars.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No webinars found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredWebinars.map((webinar) => {
              const eventDate = new Date(webinar.dateTime);
              const isPast = new Date() > eventDate;
              // Calculate count safely based on what backend sends
              const count = webinar.registeredCount ?? webinar.registrations?.length ?? 0;

              return (
                <div key={webinar._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPast ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {isPast ? "Completed" : "Upcoming"}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar size={12} />
                        {eventDate.toLocaleDateString()}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1B3A5B] transition-colors">
                      {webinar.title}
                    </h3>
                  </div>

                  {/* Right: Stats & Actions */}
                  <div className="flex items-center gap-6 md:gap-8">
                    
                    {/* Registration Count Badge */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                        <Users size={20} className="text-[#27B19B]" />
                        {count}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Registered
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                      <Link 
                        href={`/admin/webinars/${webinar._id}`}
                        className="p-2 text-slate-400 hover:text-[#1B3A5B] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(webinar._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}