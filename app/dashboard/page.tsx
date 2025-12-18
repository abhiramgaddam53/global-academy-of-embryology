"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Video, 
  Award, 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  Download,
  Loader2,
  CheckCircle2,
  FileX
} from "lucide-react";

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col gap-4 items-center justify-center text-[#1B3A5B]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!data) return <div>Error loading data.</div>;

  const { user, nextUp, history, certificates } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
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

      {/* 2. THE "NEXT UP" SECTION */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Focus Card: Upcoming Webinar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-center">
          {nextUp ? (
            <>
              <div className="absolute top-0 left-0 w-1 h-full bg-[#27B19B]" /> 
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                   <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#27B19B]/10 text-[#27B19B]">
                     <Video size={16} />
                   </span>
                   <span className="text-xs font-bold text-[#27B19B] uppercase tracking-widest">Next Live Session</span>
                </div>
                <span className="text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  Upcoming
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 hover:text-[#27B19B] transition-colors">
                {nextUp.title}
              </h2>
              <p className="text-slate-600 mb-8 max-w-xl leading-relaxed line-clamp-2">
                Get ready for your next session. Join 10 minutes early to check your audio and video settings.
              </p>

              <div className="flex flex-wrap gap-4 items-center pt-6 border-t border-slate-100 mt-auto">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={16} /> {new Date(nextUp.date).toLocaleDateString()}
                 </div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} /> {new Date(nextUp.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
                 
                 <div className="flex-1 text-right">
                    <Link href={`/webinars/${nextUp._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A5B] hover:underline">
                       View Details <ArrowRight size={16} />
                    </Link>
                 </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Video size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Upcoming Sessions</h3>
              <p className="text-slate-500 mb-6">You are not registered for any upcoming webinars.</p>
              <Link href="/webinars" className="inline-block px-6 py-2 bg-[#1B3A5B] text-white rounded-lg text-sm font-bold hover:bg-[#152e4a]">
                Browse Webinars
              </Link>
            </div>
          )}
        </div>

        {/* Profile / Stats Card */}
        <div className="bg-[#1B3A5B] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
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
                 <span className="text-blue-200">Total Registered</span>
                 <span className="font-bold">{user.stats.registered}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                 <span className="text-blue-200">Certificates Earned</span>
                 <span className="font-bold">{user.stats.certificates}</span>
              </div>
           </div>
        </div>
      </div>

      {/* 3. SECONDARY GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-[#0F172A]">Recent History</h3>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {history.length > 0 ? (
              history.map((item: any) => (
                <div key={item._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                     <CheckCircle2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                     <p className="text-xs text-slate-500">Ended {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">No history found.</div>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-[#0F172A]">Certificates</h3>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
             {certificates.length > 0 ? (
               certificates.map((cert: any) => (
                <div key={cert._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                     <Award size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-bold text-slate-900 truncate">{cert.title}</h4>
                     <p className="text-xs text-slate-500">Ready for download</p>
                  </div>
                  
                  {/* Link to the Download/View Page */}
                  <Link 
                    href={`/certificate/${cert._id}`} 
                    target="_blank"
                    className="p-2 text-slate-300 hover:text-[#1B3A5B] hover:bg-slate-100 rounded transition-colors"
                    title="Download Certificate"
                  >
                     <Download size={18} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <FileX size={24} className="mb-2 opacity-30" />
                <p className="text-sm">No certificates yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

 