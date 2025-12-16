"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Video, 
  Award, 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  User,
  Download,
  Loader2,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Dr. Alex Doe", id: "GAE-2025-88" });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1B3A5B]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER (Minimal) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0F172A]">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
             Account Active
           </span>
        </div>
      </div>

      {/* 2. THE "NEXT UP" SECTION (Priority) */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Focus Card: Upcoming Webinar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#27B19B]" /> {/* Accent Line */}
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#27B19B]/10 text-[#27B19B]">
                 <Video size={16} />
               </span>
               <span className="text-xs font-bold text-[#27B19B] uppercase tracking-widest">Next Live Session</span>
            </div>
            <span className="text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Tomorrow
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 group-hover:text-[#27B19B] transition-colors">
            Advanced ICSI Techniques
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl leading-relaxed">
            A specialized session covering micromanipulation protocols. Syllabus materials are ready for review.
          </p>

          <div className="flex flex-wrap gap-4 items-center pt-6 border-t border-slate-100">
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} /> Feb 12, 2025
             </div>
             <div className="w-1 h-1 bg-slate-300 rounded-full" />
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} /> 10:00 AM - 12:00 PM
             </div>
             
             <div className="flex-1 text-right">
                <Link href="/dashboard/webinars" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A5B] hover:underline">
                   View Session Details <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </div>

        {/* Profile / Status Card */}
        <div className="bg-[#1B3A5B] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/5 rounded-full blur-2xl" />

           <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-serif mb-4 border border-white/20">
                 {user.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold">Student Profile</h3>
              <p className="text-blue-200 text-sm opacity-80">{user.id}</p>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                 <span className="text-blue-200">Webinars</span>
                 <span className="font-bold">12 Registered</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                 <span className="text-blue-200">Certificates</span>
                 <span className="font-bold">5 Earned</span>
              </div>
              <Link href="/dashboard/profile" className="block w-full py-2.5 bg-[#27B19B] hover:bg-[#219784] text-center rounded-lg text-sm font-bold transition-colors mt-4">
                 Edit Profile
              </Link>
           </div>
        </div>
      </div>

      {/* 3. SECONDARY GRID (History & Downloads) */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* List: Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-[#0F172A]">Recent History</h3>
             <Link href="/dashboard/webinars" className="text-sm text-slate-500 hover:text-[#1B3A5B]">View All</Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                   <CheckCircle2 size={18} />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-slate-900 truncate">Cryopreservation Basics</h4>
                   <p className="text-xs text-slate-500">Completed Jan 15</p>
                </div>
                <button className="text-xs font-medium text-[#1B3A5B] hover:underline">Watch Replay</button>
              </div>
            ))}
             <Link href="/dashboard/webinars" className="block p-3 text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
               Show More
             </Link>
          </div>
        </div>

        {/* List: Certificates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-[#0F172A]">Certificates</h3>
             <Link href="/dashboard/certificates" className="text-sm text-slate-500 hover:text-[#1B3A5B]">Manage</Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
             {[1, 2].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                   <Award size={18} />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-slate-900 truncate">IVF Ethics & Law</h4>
                   <p className="text-xs text-slate-500">Issued Dec 20, 2024</p>
                </div>
                <button className="p-2 text-slate-300 group-hover:text-[#1B3A5B] transition-colors">
                   <Download size={18} />
                </button>
              </div>
            ))}
             <Link href="/dashboard/certificates" className="block p-3 text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
               View All
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { 
//   Video, 
//   Award, 
//   User, 
//   ArrowRight, 
//   CalendarDays, 
//   Clock, 
//   CheckCircle2, 
//   Download,
//   Loader2
// } from "lucide-react";

// export default function UserDashboardPage() {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({ name: "", email: "" });
//   const [stats, setStats] = useState({ webinars: 0, certificates: 0, nextEvent: "" });

//   // Mock Data Fetch
//   useEffect(() => {
//     setTimeout(() => {
//       setUser({ name: "Dr. Alex Doe", email: "alex@example.com" });
//       setStats({ 
//         webinars: 4, 
//         certificates: 2, 
//         nextEvent: "Tomorrow, 10:00 AM" 
//       });
//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-96 flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#1B3A5B]" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
      
//       {/* 1. Header with Greeting */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">
//             Welcome back, <span className="text-[#27B19B]">{user.name}</span>
//           </h1>
//           <p className="text-slate-500 mt-1">Here is an overview of your learning progress.</p>
//         </div>
//         <div className="text-right hidden md:block">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student ID</p>
//             <p className="text-slate-700 font-mono">GAE-2024-8821</p>
//         </div>
//       </div>

//       {/* 2. Quick Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
//         {/* My Webinars Card */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
//           <div className="flex justify-between items-start">
//             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//               <Video size={24} />
//             </div>
//             {/* You can link this to a full list page if needed */}
//             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered</span>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-bold text-slate-900">{stats.webinars}</h3>
//             <p className="text-slate-500 text-sm">Upcoming Sessions</p>
//           </div>
//         </div>

//         {/* Certificates Card */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
//           <div className="flex justify-between items-start">
//              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
//               <Award size={24} />
//             </div>
//              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earned</span>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-bold text-slate-900">{stats.certificates}</h3>
//             <p className="text-slate-500 text-sm">Credentials Issued</p>
//           </div>
//         </div>

//         {/* Next Event Card */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
//           <div className="flex justify-between items-start">
//              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//               <CalendarDays size={24} />
//             </div>
//              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Up Next</span>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-lg font-bold text-slate-900 truncate">Tomorrow</h3>
//             <p className="text-slate-500 text-sm">10:00 AM EST</p>
//           </div>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
//           <div className="flex justify-between items-start">
//              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
//               <User size={24} />
//             </div>
//              <Link href="/dashboard/profile" className="text-sm font-medium text-violet-600 hover:underline">
//               Edit
//             </Link>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-lg font-bold text-slate-900">Active</h3>
//             <p className="text-slate-500 text-sm">Account Status</p>
//           </div>
//         </div>

//       </div>

//       {/* 3. Main Content Split */}
//       <div className="grid md:grid-cols-2 gap-6">
        
//         {/* LEFT: Featured Webinar (Navy Card) */}
//         <div className="bg-[#1B3A5B] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px]">
//           <div className="relative z-10">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27B19B]/20 text-[#27B19B] text-xs font-bold uppercase tracking-widest border border-[#27B19B]/30 mb-4">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#27B19B] animate-pulse"/> Live Tomorrow
//             </div>
//             <h3 className="text-2xl font-serif font-bold mb-2">Advanced ICSI Techniques</h3>
//             <div className="flex items-center gap-4 text-blue-100 text-sm mb-6">
//                <span className="flex items-center gap-1.5"><CalendarDays size={14}/> Feb 12, 2025</span>
//                <span className="flex items-center gap-1.5"><Clock size={14}/> 10:00 AM</span>
//             </div>
//             <p className="text-blue-100/80 text-sm mb-8 max-w-sm leading-relaxed">
//               Join Dr. Smith for a deep dive into modern micromanipulation protocols. Preparation materials are available now.
//             </p>
//           </div>
          
//           <div className="relative z-10">
//             <Link 
//               href="/webinars/icsi-techniques" 
//               className="inline-flex items-center gap-2 bg-[#27B19B] hover:bg-[#1fa88e] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20"
//             >
//               Go to Session <ArrowRight size={18} />
//             </Link>
//           </div>

//           {/* Decorative Circle */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#27B19B] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
//         </div>

//         {/* RIGHT: Recent Certificates (White Card) */}
//         <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-bold text-slate-900">Recent Certificates</h3>
//                 <Link href="/dashboard/certificates" className="text-sm font-medium text-slate-500 hover:text-[#1B3A5B]">View All</Link>
//             </div>
            
//             <div className="space-y-3 flex-1">
//                 {/* Certificate Item 1 */}
//                 <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 group border border-slate-100 hover:border-slate-200 transition-all">
//                     <div className="flex items-center gap-4">
//                         <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
//                             <Award size={20} />
//                         </div>
//                         <div>
//                             <h4 className="font-bold text-slate-700 group-hover:text-slate-900 text-sm">Cryopreservation Basics</h4>
//                             <p className="text-xs text-slate-400">Issued: Jan 15, 2025</p>
//                         </div>
//                     </div>
//                     <button className="p-2 text-slate-300 hover:text-[#1B3A5B] transition-colors" title="Download">
//                         <Download size={18} />
//                     </button>
//                 </div>

//                 {/* Certificate Item 2 */}
//                 <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 group border border-slate-100 hover:border-slate-200 transition-all">
//                     <div className="flex items-center gap-4">
//                         <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
//                             <Award size={20} />
//                         </div>
//                         <div>
//                             <h4 className="font-bold text-slate-700 group-hover:text-slate-900 text-sm">Ethics in IVF</h4>
//                             <p className="text-xs text-slate-400">Issued: Dec 20, 2024</p>
//                         </div>
//                     </div>
//                     <button className="p-2 text-slate-300 hover:text-[#1B3A5B] transition-colors" title="Download">
//                         <Download size={18} />
//                     </button>
//                 </div>
                
//                 {/* View More Link */}
//                 <div className="pt-2">
//                     <Link href="/dashboard/certificates" className="flex items-center gap-2 text-sm font-bold text-[#1B3A5B] hover:text-[#27B19B] transition-colors justify-center p-3 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 hover:border-[#27B19B]/30">
//                         View all certificates <ArrowRight size={14} />
//                     </Link>
//                 </div>
//             </div>
//         </div>
//       </div>

//       {/* 4. Registered Webinars List (Full Width) */}
//       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//              <h3 className="text-lg font-bold text-slate-900">Your Registered Webinars</h3>
//              <button className="text-sm font-medium text-slate-500 hover:text-[#1B3A5B]">History</button>
//         </div>
//         <div className="divide-y divide-slate-100">
//            {/* Row 1 */}
//            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
//               <div className="flex items-start gap-4">
//                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
//                     <Video size={24} />
//                  </div>
//                  <div>
//                     <div className="flex items-center gap-2 mb-1">
//                         <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Upcoming</span>
//                         <span className="text-xs text-slate-400">• Online</span>
//                     </div>
//                     <h4 className="font-bold text-slate-900 text-base">Advanced ICSI Techniques</h4>
//                     <p className="text-sm text-slate-500 mt-0.5">Feb 12, 2025 • 10:00 AM - 12:00 PM</p>
//                  </div>
//               </div>
//               <div className="flex gap-3 sm:self-center">
//                  <button className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:border-slate-300">
//                     View Details
//                  </button>
//               </div>
//            </div>

//            {/* Row 2 */}
//            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
//               <div className="flex items-start gap-4">
//                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
//                     <CheckCircle2 size={24} />
//                  </div>
//                  <div>
//                     <div className="flex items-center gap-2 mb-1">
//                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Completed</span>
//                     </div>
//                     <h4 className="font-bold text-slate-900 text-base">Cryopreservation Basics</h4>
//                     <p className="text-sm text-slate-500 mt-0.5">Jan 15, 2025 • Recorded Session</p>
//                  </div>
//               </div>
//               <div className="flex gap-3 sm:self-center">
//                  <button className="px-5 py-2.5 rounded-lg bg-[#1B3A5B] text-white font-medium text-sm hover:bg-[#152e4a] flex items-center gap-2">
//                     <Video size={14} /> Watch
//                  </button>
//               </div>
//            </div>
//         </div>
//       </div>

//     </div>
//   );
// }