"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, PlayCircle, Users } from "lucide-react";

interface Webinar {
  _id: string;
  title: string;
  description?: string;
  dateTime: string;
  imageUrl?: string;
  mentors?: string[];
  registeredCount?: number;
}

interface WebinarCardProps {
  webinar: Webinar;
  past?: boolean;
}

export default function WebinarCard({ webinar, past = false }: WebinarCardProps) {
  const dateObj = new Date(webinar.dateTime);
  
  // Format Date: "Oct 24, 2025"
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  // Format Time: "10:00 AM"
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link 
      href={`/webinars/${webinar._id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ================= IMAGE SECTION ================= */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {webinar.imageUrl ? (
          <img
            src={webinar.imageUrl}
            alt={webinar.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3A5B] to-[#27B19B]">
            <PlayCircle className="text-white opacity-50" size={48} />
          </div>
        )}

        {/* OVERLAY BADGE */}
        <div className="absolute top-4 left-4">
          {past ? (
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Recorded
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#27B19B] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="flex flex-col flex-grow p-6">
        
        {/* Date Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-3">
          <div className="flex items-center gap-1.5 text-[#27B19B]">
            <Calendar size={14} />
            {dateStr}
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {timeStr}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#1B3A5B] mb-3 line-clamp-2 leading-tight group-hover:text-[#27B19B] transition-colors">
          {webinar.title}
        </h3>

        {/* Description Snippet (Optional) */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {webinar.description || "Join us for an insightful session with industry experts..."}
        </p>

        {/* Spacer to push footer to bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          
          {/* Registered Users / Mentor Avatars */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
             {webinar.mentors && webinar.mentors.length > 0 ? (
                <div className="flex -space-x-2">
                  {webinar.mentors.slice(0, 3).map((m, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#1B3A5B]">
                      {m.charAt(0)}
                    </div>
                  ))}
                </div>
             ) : (
               <Users size={16} className="text-gray-400" />
             )}
             <span>{webinar.registeredCount || 0} joined</span>
          </div>

          {/* Call to Action Icon */}
          <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#27B19B] group-hover:bg-[#27B19B] group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* ================= BUTTON SECTION (Bottom) ================= */}
      {!past && (
        <div className="px-6 pb-6 pt-0">
          <button className="w-full py-2.5 rounded-lg bg-[#1B3A5B] text-white font-semibold text-sm hover:bg-[#27B19B] transition-colors shadow-md">
            Register Now
          </button>
        </div>
      )}
      
      {past && (
        <div className="px-6 pb-6 pt-0">
          <button className="w-full py-2.5 rounded-lg border border-[#1B3A5B] text-[#1B3A5B] font-semibold text-sm hover:bg-[#1B3A5B] hover:text-white transition-colors">
            Watch Recording
          </button>
        </div>
      )}
    </Link>
  );
}