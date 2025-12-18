"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock, 
  Video, 
  PlayCircle, 
  Search,
  ArrowRight,
  Loader2,
  Award,
  Download
} from "lucide-react";

export default function UserWebinarsPage() {
  const [loading, setLoading] = useState(true);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchWebinars() {
      try {
        // 👇 FIXED URL HERE
        const res = await fetch("/api/dashboard/webinars"); 
        
        if (res.ok) {
          const data = await res.json();
          setWebinars(data);
        } else {
          console.error("API Error:", res.status);
        }
      } catch (error) {
        console.error("Failed to load webinars", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWebinars();
  }, []);

  // Filter Logic
  const filteredWebinars = webinars.filter(w => {
    const matchesTab = activeTab === "upcoming" ? w.status === "upcoming" : w.status === "past";
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin text-[#1B3A5B]" size={40} />
        <p>Loading your sessions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0F172A]">My Webinars</h1>
          <p className="text-slate-500 mt-1">Access your live sessions and learning archives.</p>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm w-full sm:w-64 focus:outline-none focus:border-[#1B3A5B]"
            />
          </div>
          
          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "upcoming" ? "bg-white text-[#1B3A5B] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "past" ? "bg-white text-[#1B3A5B] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.length > 0 ? (
          filteredWebinars.map((webinar) => (
            <div key={webinar._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              
              {/* Card Image */}
              <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                 {webinar.image ? (
                   <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <Video size={40} className="text-slate-300" />
                 )}
                 
                 {/* Badge */}
                 <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1B3A5B]">
                      {webinar.category}
                    </span>
                 </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-serif font-bold text-lg text-[#0F172A] group-hover:text-[#27B19B] transition-colors line-clamp-2">
                     {webinar.title}
                   </h3>
                </div>

                <div className="space-y-2 mb-6">
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={16} className="text-[#27B19B]" />
                      {webinar.date}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={16} className="text-[#27B19B]" />
                      {webinar.time}
                   </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                   
                   {webinar.status === "upcoming" ? (
                     // UPCOMING: Join Button
                     <Link href={`/webinars/${webinar._id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1B3A5B] text-white rounded-xl font-bold text-sm hover:bg-[#152e4a] transition-colors">
                        Go to Session <ArrowRight size={16} />
                     </Link>
                   ) : (
                     // PAST: Recording + Certificate
                     <>
                        <Link 
                          href={`/dashboard/webinars/${webinar._id}`} 
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl font-bold text-sm transition-colors ${webinar.hasCertificate ? 'bg-white text-slate-700 hover:bg-slate-50' : 'bg-[#1B3A5B] text-white hover:bg-[#152e4a]'}`}
                        >
                          <PlayCircle size={16} /> {webinar.hasCertificate ? "Recording" : "Watch Recording"}
                        </Link>

                        {/* Certificate Button (Only if eligible) */}
                        {webinar.hasCertificate && (
                           <Link 
                              href={`/dashboard/certificates/${webinar._id}`} 
                              target="_blank"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors"
                           >
                              <Award size={16} /> Get Certificate
                           </Link>
                        )}
                     </>
                   )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <div className="mx-auto w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                <Search className="text-slate-400" />
             </div>
             <p className="text-slate-500 font-medium">No {activeTab} webinars found.</p>
             <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

    </div>
  );
}