 
"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WebinarCard from "@/app/components/WebinarCard";
import Navbar from "@/app/components/Navbar";
import { History, Sparkles, CalendarOff, Layers, Filter } from "lucide-react";
import Image from "next/image";

/* ================= TYPES ================= */
interface Webinar {
  _id: string;
  title: string;
  dateTime: string;
  imageUrl?: string;
  mentors?: string[];
  registeredCount?: number;
  description?: string;
}

gsap.registerPlugin(ScrollTrigger);

export default function WebinarsPage() {
  const [upcoming, setUpcoming] = useState<Webinar[]>([]);
  const [past, setPast] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  /* ================= FETCH & CATEGORIZE ================= */
  useEffect(() => {
    async function fetchWebinars() {
      try {
        const res = await fetch("/api/webinars");
        const data = await res.json();

        if (Array.isArray(data)) {
          const now = new Date();

          const upcomingList = data.filter((w) => new Date(w.dateTime) >= now);
          const pastList = data.filter((w) => new Date(w.dateTime) < now);

          upcomingList.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
          pastList.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

          setUpcoming(upcomingList);
          setPast(pastList);
        }
      } catch (err) {
        console.error("Failed to fetch webinars", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWebinars();
  }, []);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    if (!loading && containerRef.current) {
      ScrollTrigger.refresh();
      const cards = containerRef.current.querySelectorAll(".webinar-card");
      
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, [loading, filter, upcoming, past]);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
      

      {/* ================= HERO: Institutional Style ================= */}
      {/* Responsive Padding: pt-32/pb-36 on mobile, up to pt-40/pb-48 on desktop */}
      <div className="relative pt-32 pb-36 md:pt-40 md:pb-48 overflow-hidden bg-[#020617]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
             src="/hero-bg.webp" 
             alt="Webinar Background" 
             fill
             className="object-cover opacity-30 mix-blend-overlay"
             unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18417f] via-[#0f3162] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 animate-fade-in">
             Knowledge Hub
          </p>
          
          {/* Responsive Heading Size */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-6 sm:mb-8 tracking-tight leading-tight">
            Scientific <span className="italic font-light text-slate-400">Symposia</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-10 sm:mb-12">
            Access our archive of clinical embryology lectures, workshops, and expert panel discussions.
          </p>

          {/* ================= FILTER TABS ================= */}
          {/* Responsive Container: Wraps on very small screens, adjusts corners */}
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-0 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-full border border-white/10 mx-auto max-w-full">
            <FilterTab 
              label="All Events" 
              isActive={filter === "all"} 
              onClick={() => setFilter("all")} 
            />
            <FilterTab 
              label="Upcoming" 
              isActive={filter === "upcoming"} 
              onClick={() => setFilter("upcoming")} 
            />
            <FilterTab 
              label="Past Recordings" 
              isActive={filter === "past"} 
              onClick={() => setFilter("past")} 
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {/* Responsive Negative Margin: -mt-16 on mobile, -mt-24 on desktop */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 relative z-20 pb-24 space-y-16 md:space-y-20">
        
        {/* 1. UPCOMING SECTION */}
        {(filter === "all" || filter === "upcoming") && (
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8 pl-2">
               <Layers size={20} className="text-[#2DD4BF]" />
               <h2 className="text-xl sm:text-2xl font-serif font-medium text-white drop-shadow-md">Upcoming Sessions</h2>
            </div>

            {upcoming.length === 0 ? (
               <EmptyState 
                 title="No Upcoming Webinars" 
                 subtitle="Check back later for new live sessions!"
                 dark
               />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {upcoming.map((webinar) => (
                  <div key={webinar._id} className="webinar-card h-full">
                    <WebinarCard webinar={webinar} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 2. PAST SECTION */}
        {(filter === "all" || filter === "past") && (
          <section>
             {/* Divider if showing both */}
             {filter === "all" && <div className="h-px w-full bg-slate-200 mb-12 sm:mb-16 mt-8" />}

             <div className="flex items-center gap-3 mb-6 sm:mb-8 pl-2">
               <History size={20} className="text-[#0F172A]" />
               <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#0F172A]">Recorded Archive</h2>
            </div>

            {past.length === 0 ? (
               <div className="bg-slate-50 rounded-2xl p-12 sm:p-16 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 font-light italic">Archive is currently empty.</p>
               </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {past.map((webinar) => (
                  <div key={webinar._id} className="webinar-card h-full">
                    <WebinarCard webinar={webinar} past />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

function FilterTab({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      // Responsive padding: px-4 on mobile, px-8 on desktop
      className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
        isActive
          ? "bg-[#0D9488] text-white shadow-lg"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ title, subtitle, dark }: { title: string, subtitle: string, dark?: boolean }) {
  return (
    <div className={`${dark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"} backdrop-blur-sm rounded-2xl p-12 sm:p-16 text-center border shadow-xl`}>
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${dark ? "bg-white/10" : "bg-slate-100"}`}>
        <CalendarOff className={dark ? "text-slate-400" : "text-slate-400"} size={28} />
      </div>
      <h3 className="text-lg sm:text-xl font-serif mb-2">{title}</h3>
      <p className={`text-sm sm:text-base font-light ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[400px] bg-[#020617]" />
      <div className="max-w-7xl mx-auto px-6 -mt-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}