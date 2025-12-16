"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock, 
  Video, 
  PlayCircle, 
  Search,
  Filter,
  ArrowRight
} from "lucide-react";

// Mock Data
const WEBINARS = [
  {
    id: 1,
    title: "Advanced ICSI Techniques",
    date: "Feb 12, 2025",
    time: "10:00 AM - 12:00 PM EST",
    status: "upcoming",
    category: "Clinical",
    image: "/images/icsi.jpg" // You can use placeholders
  },
  {
    id: 2,
    title: "AI in Embryo Selection",
    date: "Feb 18, 2025",
    time: "02:00 PM - 04:00 PM EST",
    status: "upcoming",
    category: "Technology",
    image: "/images/ai-ivf.jpg"
  },
  {
    id: 3,
    title: "Cryopreservation Basics",
    date: "Jan 15, 2025",
    time: "Recorded Session",
    status: "past",
    category: "Lab Skills",
    image: "/images/cryo.jpg"
  },
  {
    id: 4,
    title: "Ethics in Assisted Reproduction",
    date: "Dec 20, 2024",
    time: "Recorded Session",
    status: "past",
    category: "Ethics",
    image: "/images/ethics.jpg"
  }
];

export default function UserWebinarsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState("");

  // Filter Logic
  const filteredWebinars = WEBINARS.filter(w => {
    const matchesTab = activeTab === "upcoming" ? w.status === "upcoming" : w.status === "past";
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
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
            <div key={webinar.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              
              {/* Card Image / Placeholder */}
              <div className="h-48 bg-slate-200 relative flex items-center justify-center">
                 {/* Replace with <Image /> if you have real images */}
                 <Video size={40} className="text-slate-400" />
                 
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
                <div className="mt-auto pt-4 border-t border-slate-100">
                   {webinar.status === "upcoming" ? (
                     <Link href={`/dashboard/webinars/${webinar.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1B3A5B] text-white rounded-xl font-bold text-sm hover:bg-[#152e4a] transition-colors">
                        Go to Session <ArrowRight size={16} />
                     </Link>
                   ) : (
                     <Link href={`/dashboard/webinars/${webinar.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                        <PlayCircle size={16} /> Watch Recording
                     </Link>
                   )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-400">No webinars found in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
}