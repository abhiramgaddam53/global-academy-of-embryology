// "use client";

// import { useEffect, useState, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import WebinarCard from "@/app/components/WebinarCard";
// import Navbar from "@/app/components/Navbar";
// import { History, Sparkles, CalendarOff, Layers, Filter } from "lucide-react";

// /* ================= TYPES ================= */
// interface Webinar {
//   _id: string;
//   title: string;
//   dateTime: string;
//   imageUrl?: string;
//   mentors?: string[];
//   registeredCount?: number;
//   description?: string;
// }

// gsap.registerPlugin(ScrollTrigger);

// export default function WebinarsPage() {
//   const [upcoming, setUpcoming] = useState<Webinar[]>([]);
//   const [past, setPast] = useState<Webinar[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
//   const containerRef = useRef<HTMLDivElement>(null);

//   /* ================= FETCH & CATEGORIZE ================= */
//   useEffect(() => {
//     async function fetchWebinars() {
//       try {
//         const res = await fetch("/api/webinars");
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           const now = new Date();

//           const upcomingList = data.filter((w) => new Date(w.dateTime) >= now);
//           const pastList = data.filter((w) => new Date(w.dateTime) < now);

//           upcomingList.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
//           pastList.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

//           setUpcoming(upcomingList);
//           setPast(pastList);
//         }
//       } catch (err) {
//         console.error("Failed to fetch webinars", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchWebinars();
//   }, []);

//   /* ================= ANIMATION ================= */
//   useEffect(() => {
//     // Refresh ScrollTrigger when filter changes to ensure animations replay/adjust
//     if (!loading && containerRef.current) {
//       ScrollTrigger.refresh();
//       const cards = containerRef.current.querySelectorAll(".webinar-card");
      
//       gsap.fromTo(
//         cards,
//         { y: 30, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.5,
//           stagger: 0.05,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: containerRef.current,
//             start: "top 90%",
//           },
//         }
//       );
//     }
//   }, [loading, filter, upcoming, past]);

//   if (loading) return <SkeletonLoader />;

//   return (
//     <div className="min-h-screen bg-gray-50 selection:bg-[#27B19B] selection:text-white">
//       <Navbar />

//       {/* ================= HERO ================= */}
//       <div className="relative bg-[#1B3A5B] pt-32 pb-40 overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#27B19B] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
//         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400 opacity-5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

//         <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
//             <Sparkles size={14} className="text-[#27B19B]" />
//             <span>Premium Knowledge Hub</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
//             Webinars & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27B19B] to-emerald-300">Workshops</span>
//           </h1>
//           <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8">
//             Discover our upcoming live sessions or browse the archive of past events.
//           </p>

//           {/* ================= FILTER TABS ================= */}
//           <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
//             <FilterTab 
//               label="All Events" 
//               isActive={filter === "all"} 
//               onClick={() => setFilter("all")} 
//             />
//             <FilterTab 
//               label="Upcoming" 
//               isActive={filter === "upcoming"} 
//               onClick={() => setFilter("upcoming")} 
//             />
//             <FilterTab 
//               label="Past Recordings" 
//               isActive={filter === "past"} 
//               onClick={() => setFilter("past")} 
//             />
//           </div>
//         </div>
//       </div>

//       {/* ================= CONTENT ================= */}
//       <div ref={containerRef} className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24 space-y-16">
        
//         {/* 1. UPCOMING SECTION */}
//         {(filter === "all" || filter === "upcoming") && (
//           <section>
//             <div className="flex items-center gap-3 mb-6">
//                <Layers size={24} className="text-[#27B19B]" />
//                <h2 className="text-2xl font-bold text-white drop-shadow-md">Upcoming Sessions</h2>
//             </div>

//             {upcoming.length === 0 ? (
//                <EmptyState 
//                  title="No Upcoming Webinars" 
//                  subtitle="Check back later for new live sessions!"
//                />
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {upcoming.map((webinar) => (
//                   <div key={webinar._id} className="webinar-card h-full">
//                     <WebinarCard webinar={webinar} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* 2. PAST SECTION */}
//         {(filter === "all" || filter === "past") && (
//           <section>
//              {/* Styling tweak: If we are in 'all' mode, add spacing and darker header since it sits on white bg */}
//             <div className={`flex items-center gap-3 mb-6 ${filter === "past" ? "text-white drop-shadow-md" : "text-[#1B3A5B] pt-8 border-t border-gray-200"}`}>
//                <History size={24} className={filter === "past" ? "text-[#27B19B]" : "text-[#1B3A5B]"} />
//                <h2 className="text-2xl font-bold">Past Recordings</h2>
//             </div>

//             {past.length === 0 ? (
//                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
//                   <p className="text-gray-500">Archive is currently empty.</p>
//                </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {past.map((webinar) => (
//                   <div key={webinar._id} className="webinar-card h-full">
//                     <WebinarCard webinar={webinar} past />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//       </div>
//     </div>
//   );
// }

// /* ================= COMPONENT HELPERS ================= */

// function FilterTab({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
//         isActive
//           ? "bg-[#27B19B] text-white shadow-lg shadow-teal-900/20"
//           : "text-blue-100 hover:bg-white/5 hover:text-white"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// function EmptyState({ title, subtitle }: { title: string, subtitle: string }) {
//   return (
//     <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-xl">
//       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//         <CalendarOff className="text-gray-400" size={32} />
//       </div>
//       <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//       <p className="text-gray-500">{subtitle}</p>
//     </div>
//   );
// }

// function SkeletonLoader() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="h-[400px] bg-[#1B3A5B]" />
//       <div className="max-w-7xl mx-auto px-6 -mt-32">
//         <div className="grid md:grid-cols-3 gap-8">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="h-80 bg-gray-200 rounded-3xl animate-pulse" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <Navbar />

      {/* ================= HERO: Institutional Style ================= */}
      <div className="relative pt-40 pb-48 overflow-hidden bg-[#020617]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
             src="/hero-bg.webp" 
             alt="Webinar Background" 
             fill
             className="object-cover opacity-30 mix-blend-overlay"
             unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18417f] via-[#0f3162]  to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-xs font-bold mb-6 animate-fade-in">
             Knowledge Hub
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            Scientific <span className="italic font-light text-slate-400">Symposia</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-12">
            Access our archive of clinical embryology lectures, workshops, and expert panel discussions.
          </p>

          {/* ================= FILTER TABS ================= */}
          <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
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
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-24 space-y-20">
        
        {/* 1. UPCOMING SECTION */}
        {(filter === "all" || filter === "upcoming") && (
          <section>
            <div className="flex items-center gap-3 mb-8 pl-2">
               <Layers size={20} className="text-[#2DD4BF]" />
               <h2 className="text-2xl font-serif font-medium text-white drop-shadow-md">Upcoming Sessions</h2>
            </div>

            {upcoming.length === 0 ? (
               <EmptyState 
                 title="No Upcoming Webinars" 
                 subtitle="Check back later for new live sessions!"
                 dark
               />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
             {filter === "all" && <div className="h-px w-full bg-slate-200 mb-16 mt-8" />}

             <div className="flex items-center gap-3 mb-8 pl-2">
               <History size={20} className="text-[#0F172A]" />
               <h2 className="text-2xl font-serif font-medium text-[#0F172A]">Recorded Archive</h2>
            </div>

            {past.length === 0 ? (
               <div className="bg-slate-50 rounded-2xl p-16 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 font-light italic">Archive is currently empty.</p>
               </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
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
    <div className={`${dark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"} backdrop-blur-sm rounded-2xl p-16 text-center border shadow-xl`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${dark ? "bg-white/10" : "bg-slate-100"}`}>
        <CalendarOff className={dark ? "text-slate-400" : "text-slate-400"} size={32} />
      </div>
      <h3 className="text-xl font-serif mb-2">{title}</h3>
      <p className={`font-light ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
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