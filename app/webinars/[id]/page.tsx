// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   CalendarDays,
//   Clock,
//   Users,
//   Video,
//   ChevronLeft,
//   PlayCircle,
//   Share2,
//   MapPin,
//   CheckCircle2,
//   AlertCircle,
//   MonitorPlay,
// } from "lucide-react";
// import Navbar from "@/app/components/Navbar";

// /* ================= TYPES ================= */
// interface Webinar {
//   _id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   dateTime: string;
//   mentors: string[]; // Array of names
//   webinarLink?: string;
//   recordedLink?: string;
//   isRegistered: boolean;
//   isStarted: boolean;
//   isPast: boolean;
//   registeredCount: number;
// }

// export default function WebinarDetailsPage() {
//   const { id } = useParams() as { id: string };
//   const router = useRouter();

//   const [webinar, setWebinar] = useState<Webinar | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id) return;

//     fetch(`/api/webinars/${id}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to load webinar");
//         return res.json();
//       })
//       .then((data) => {
//         setWebinar(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Could not load webinar details.");
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <SkeletonLoader />;
//   if (error || !webinar) return <ErrorState message={error || "Webinar not found"} />;

//   const eventDate = new Date(webinar.dateTime);
//   const dateStr = eventDate.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
//   const timeStr = eventDate.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
//       <Navbar />

//       {/* HEADER BACKGROUND */}
//       <div className="bg-[#1B3A5B] text-white pt-24 pb-32 px-6 relative overflow-hidden">
//         {/* Abstract Shapes for modern feel */}
//         <div className="absolute top-0 right-0 w-96 h-96 bg-[#27B19B] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#27B19B] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
//         <div className="max-w-7xl mx-auto relative z-10">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium"
//           >
//             <ChevronLeft size={16} /> Back to Listings
//           </button>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
//             <div className="max-w-4xl">
//               <div className="flex flex-wrap gap-3 mb-4">
//                  {webinar.isPast ? (
//                   <Badge variant="gray">Past Event</Badge>
//                 ) : webinar.isStarted ? (
//                   <Badge variant="red">Live Now</Badge>
//                 ) : (
//                   <Badge variant="teal">Upcoming</Badge>
//                 )}
//                 <Badge variant="outline">{webinar.registeredCount} Registered</Badge>
//               </div>
//               <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
//                 {webinar.title}
//               </h1>
//               <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
//                 <span className="flex items-center gap-2">
//                   <CalendarDays size={18} className="text-[#27B19B]" /> {dateStr}
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <Clock size={18} className="text-[#27B19B]" /> {timeStr}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT GRID */}
//       <main className="max-w-7xl mx-auto px-6 pb-20 -mt-20 relative z-20">
//         <div className="grid lg:grid-cols-12 gap-8">
          
//           {/* LEFT CONTENT (8 cols) */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* IMAGE CARD */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[400px] group">
//               {webinar.imageUrl ? (
//                 <img
//                   src={webinar.imageUrl}
//                   alt={webinar.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-slate-100 flex items-center justify-center">
//                   <Video size={64} className="text-slate-300" />
//                 </div>
//               )}
//             </div>

//             {/* DESCRIPTION */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//               <h3 className="text-xl font-bold text-[#1B3A5B] mb-4 flex items-center gap-2">
//                 <span className="w-1 h-6 bg-[#27B19B] rounded-full"></span>
//                 About this Webinar
//               </h3>
//               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
//                 {webinar.description}
//               </div>
//             </div>

//             {/* SPEAKERS / MENTORS */}
//             {webinar.mentors && webinar.mentors.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//                 <h3 className="text-xl font-bold text-[#1B3A5B] mb-6 flex items-center gap-2">
//                   <span className="w-1 h-6 bg-[#27B19B] rounded-full"></span>
//                   Meet Your Mentors
//                 </h3>
//                 <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   {webinar.mentors.map((mentor, idx) => (
//                     <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#27B19B]/30 transition-colors">
//                       <div className="w-10 h-10 rounded-full bg-[#1B3A5B] text-white flex items-center justify-center font-bold text-sm">
//                         {mentor.charAt(0)}
//                       </div>
//                       <span className="font-medium text-[#1B3A5B]">{mentor}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* RIGHT SIDEBAR (4 cols) - STICKY */}
//           <div className="lg:col-span-4">
//             <div className="sticky top-24 space-y-6">
              
//               {/* ACTION CARD */}
//               <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
//                 <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price</p>
//                     <p className="text-2xl font-bold text-[#1B3A5B]">Free</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Format</p>
//                     <p className="text-sm font-medium text-[#1B3A5B] flex items-center gap-1 justify-end">
//                       <Video size={14} /> Online
//                     </p>
//                   </div>
//                 </div>

//                 {/* LOGIC FOR BUTTONS */}
//                 <div className="space-y-3">
//                   {/* Case 1: RECORDING AVAILABLE (Past) */}
//                   {webinar.isPast && webinar.recordedLink && (
//                     <a
//                       href={webinar.recordedLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B3A5B] hover:bg-[#152e4a] text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-900/10"
//                     >
//                       <PlayCircle size={20} /> Watch Recording
//                     </a>
//                   )}

//                   {/* Case 2: PAST BUT NO RECORDING */}
//                   {webinar.isPast && !webinar.recordedLink && (
//                     <div className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
//                       <Clock size={18} /> Event Ended
//                     </div>
//                   )}

//                   {/* Case 3: LIVE NOW (Join Link) */}
//                   {webinar.isStarted && webinar.webinarLink && (
//                     <a
//                       href={webinar.webinarLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white animate-pulse rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20"
//                     >
//                       <MonitorPlay size={20} /> Join Live Session
//                     </a>
//                   )}

//                   {/* Case 4: UPCOMING - NOT REGISTERED */}
//                   {!webinar.isPast && !webinar.isRegistered && (
//                     <button
//                       onClick={() => router.push(`/login?redirect=/webinars/${webinar._id}`)}
//                       className="w-full flex items-center justify-center gap-2 py-4 bg-[#27B19B] hover:bg-[#229c88] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5"
//                     >
//                       Register for Free
//                     </button>
//                   )}

//                   {/* Case 5: UPCOMING - REGISTERED */}
//                   {!webinar.isPast && webinar.isRegistered && !webinar.isStarted && (
//                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
//                       <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-1">
//                         <CheckCircle2 size={20} /> Registration Confirmed
//                       </div>
//                       <p className="text-xs text-green-600">The link will be active when the event starts.</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Additional Info */}
//                 <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
//                    <div className="flex items-start gap-3">
//                       <MapPin size={18} className="text-[#27B19B] shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-semibold text-[#1B3A5B]">Online Event</p>
//                         <p className="text-xs text-slate-500">Link sent upon registration</p>
//                       </div>
//                    </div>
//                    <div className="flex items-start gap-3">
//                       <Users size={18} className="text-[#27B19B] shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-semibold text-[#1B3A5B]">Limited Seats</p>
//                         <p className="text-xs text-slate-500">{webinar.registeredCount} people attending</p>
//                       </div>
//                    </div>
//                 </div>
//               </div>

//               {/* SHARE CARD */}
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
//                 <p className="text-sm font-medium text-slate-600 mb-4">Share this event with friends</p>
//                 <button 
//                   onClick={() => navigator.clipboard.writeText(window.location.href)}
//                   className="flex items-center gap-2 text-[#1B3A5B] font-semibold hover:text-[#27B19B] transition-colors"
//                 >
//                   <Share2 size={18} /> Copy Link
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= HELPER COMPONENTS ================= */

// function Badge({ children, variant = "gray" }: { children: React.ReactNode, variant?: "gray" | "red" | "teal" | "outline" }) {
//   const styles = {
//     gray: "bg-slate-700/50 text-white backdrop-blur-sm",
//     red: "bg-red-500 text-white animate-pulse",
//     teal: "bg-[#27B19B] text-white",
//     outline: "border border-white/30 text-white backdrop-blur-sm",
//   };

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[variant]}`}>
//       {children}
//     </span>
//   );
// }

// function SkeletonLoader() {
//   return (
//     <div className="min-h-screen bg-slate-50 animate-pulse">
//       <div className="h-80 bg-slate-200 w-full" />
//       <div className="max-w-7xl mx-auto px-6 -mt-20">
//         <div className="grid lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-8 space-y-8">
//             <div className="h-96 bg-slate-200 rounded-2xl w-full" />
//             <div className="h-40 bg-slate-200 rounded-2xl w-full" />
//           </div>
//           <div className="lg:col-span-4">
//             <div className="h-80 bg-slate-200 rounded-2xl w-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ErrorState({ message }: { message: string }) {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
//       <AlertCircle size={48} className="text-red-500 mb-4" />
//       <h2 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h2>
//       <p className="text-slate-500">{message}</p>
//       <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-[#1B3A5B] text-white rounded-lg hover:bg-[#152e4a]">
//         Try Again
//       </button>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Users,
  Video,
  ChevronLeft,
  PlayCircle,
  Share2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MonitorPlay,
  Loader2,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

/* ================= TYPES ================= */
interface Webinar {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateTime: string;
  mentors: string[];
  
  // Links (Controlled by backend visibility rules)
  webinarLink?: string;  
  recordedLink?: string;

  // Status Flags
  isRegistered: boolean;
  isStarted: boolean; 
  isPast: boolean;   
  registeredCount: number;
}

export default function WebinarDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH WEBINAR DATA ================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/webinars/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Webinar not found");
        return res.json();
      })
      .then((data) => {
        setWebinar(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load webinar details.");
        setLoading(false);
      });
  }, [id]);

  /* ================= HANDLE REGISTRATION ================= */
  const handleRegister = async () => {
    if (!webinar) return;
    setRegistering(true);

    try {
      // 1. Call your specific API route: /api/webinar-register/[id]
      const res = await fetch(`/api/webinars-register/${webinar._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // 2. Handle Auth Redirect (401)
      if (res.status === 401) {
        router.push(`/login?redirect=/webinars/${webinar._id}`);
        return;
      }

      // 3. Handle Other Errors
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
      }

      // 4. Success: Update UI immediately
      setWebinar((prev) => 
        prev 
          ? { 
              ...prev, 
              isRegistered: true, 
              registeredCount: prev.registeredCount + 1 
            } 
          : null
      );
      
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  /* ================= RENDER ACTION BUTTON ================= */
  const renderActionButton = () => {
    if (!webinar) return null;

    // 1. WATCH RECORDING (Highest Priority if Link Exists)
    if (webinar.recordedLink) {
      return (
        <a
          href={webinar.recordedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B3A5B] hover:bg-[#152e4a] text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-900/10"
        >
          <PlayCircle size={20} /> Watch Recording
        </a>
      );
    }

    // 2. JOIN LIVE (If Started & Link Exists)
    if (webinar.webinarLink) {
      return (
        <a
          href={webinar.webinarLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white animate-pulse rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20"
        >
          <MonitorPlay size={20} /> Join Live Session
        </a>
      );
    }

    // 3. REGISTERED (Upcoming)
    if (webinar.isRegistered) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-1">
            <CheckCircle2 size={20} /> Registration Confirmed
          </div>
          <p className="text-xs text-green-600">The link will appear here when the event starts.</p>
        </div>
      );
    }

    // 4. EVENT ENDED (No Links Available)
    if (webinar.isPast) {
       return (
        <div className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
          <Clock size={18} /> Event Ended
        </div>
      );
    }

    // 5. REGISTER (Default Action)
    return (
      <button
        onClick={handleRegister}
        disabled={registering}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#27B19B] hover:bg-[#229c88] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {registering ? (
          <><Loader2 className="animate-spin" size={20} /> Registering...</>
        ) : (
          "Register for Free"
        )}
      </button>
    );
  };

  /* ================= UI RENDERING ================= */
  if (loading) return <SkeletonLoader />;
  if (error || !webinar) return <ErrorState message={error} />;

  const eventDate = new Date(webinar.dateTime);
  const dateStr = eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Navbar />

      {/* HEADER */}
      <div className="bg-[#1B3A5B] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#27B19B] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={16} /> Back to Listings
          </button>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-4">
              {webinar.isPast ? <Badge variant="gray">Past Event</Badge> : webinar.isStarted ? <Badge variant="red">Live Now</Badge> : <Badge variant="teal">Upcoming</Badge>}
              <Badge variant="outline">{webinar.registeredCount} Registered</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{webinar.title}</h1>
            <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
              <span className="flex items-center gap-2"><CalendarDays size={18} className="text-[#27B19B]" /> {dateStr}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-[#27B19B]" /> {timeStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 pb-20 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[400px] group">
              {webinar.imageUrl ? (
                <img src={webinar.imageUrl} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Video size={64} className="text-slate-300" /></div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-[#1B3A5B] mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-[#27B19B] rounded-full"></span>About this Webinar</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">{webinar.description}</div>
            </div>

            {webinar.mentors && webinar.mentors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-bold text-[#1B3A5B] mb-6 flex items-center gap-2"><span className="w-1 h-6 bg-[#27B19B] rounded-full"></span>Meet Your Mentors</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {webinar.mentors.map((mentor, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#27B19B]/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#1B3A5B] text-white flex items-center justify-center font-bold text-sm">{mentor.charAt(0)}</div>
                      <span className="font-medium text-[#1B3A5B]">{mentor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                  <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price</p><p className="text-2xl font-bold text-[#1B3A5B]">Free</p></div>
                  <div className="text-right"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Format</p><p className="text-sm font-medium text-[#1B3A5B] flex items-center gap-1 justify-end"><Video size={14} /> Online</p></div>
                </div>

                <div className="space-y-3">{renderActionButton()}</div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                   <div className="flex items-start gap-3"><MapPin size={18} className="text-[#27B19B] shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-[#1B3A5B]">Online Event</p><p className="text-xs text-slate-500">Access link sent upon registration</p></div></div>
                   <div className="flex items-start gap-3"><Users size={18} className="text-[#27B19B] shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-[#1B3A5B]">Global Access</p><p className="text-xs text-slate-500">{webinar.registeredCount} people attending</p></div></div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
                <p className="text-sm font-medium text-slate-600 mb-4">Share this event</p>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex items-center gap-2 text-[#1B3A5B] font-semibold hover:text-[#27B19B] transition-colors"><Share2 size={18} /> Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helpers
function Badge({ children, variant }: { children: React.ReactNode, variant: string }) {
  const styles: any = { gray: "bg-slate-700/50 text-white backdrop-blur-sm", red: "bg-red-500 text-white animate-pulse", teal: "bg-[#27B19B] text-white", outline: "border border-white/30 text-white backdrop-blur-sm" };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[variant]}`}>{children}</span>;
}
function SkeletonLoader() { return <div className="min-h-screen bg-slate-50 animate-pulse"><div className="h-80 bg-slate-200" /></div>; }
function ErrorState({ message }: { message: string }) { return <div className="min-h-screen flex items-center justify-center text-red-500">{message}</div>; }