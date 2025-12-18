"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Video, FileBadge, ArrowRight, Plus, Mail, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    webinars: 0,
    faculty: 0,
    certificates: 0,
    inquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Manage your content, messages, and view system status.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Webinars Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Video size={24} />
            </div>
            <Link href="/admin/webinars/new" className="text-sm font-medium text-blue-600 hover:underline">
              + New
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <Loader2 className="animate-spin text-slate-300" size={24} />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900">{stats.webinars}</h3>
            )}
            <p className="text-slate-500 text-sm">Upcoming Webinars</p>
          </div>
        </div>

        {/* Faculty Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users size={24} />
            </div>
            <Link href="/admin/faculty/new" className="text-sm font-medium text-emerald-600 hover:underline">
              + New
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <Loader2 className="animate-spin text-slate-300" size={24} />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900">{stats.faculty}</h3>
            )}
            <p className="text-slate-500 text-sm">Faculty Members</p>
          </div>
        </div>

        {/* Certificates Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FileBadge size={24} />
            </div>
             <Link href="/admin/certificates" className="text-sm font-medium text-amber-600 hover:underline">
              Manage
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <Loader2 className="animate-spin text-slate-300" size={24} />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900">{stats.certificates}</h3>
            )}
            <p className="text-slate-500 text-sm">Certificates Issued</p>
          </div>
        </div>

        {/* Inquiries Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
              <Mail size={24} />
            </div>
             <Link href="/admin/contact" className="text-sm font-medium text-violet-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4">
            {loading ? (
              <Loader2 className="animate-spin text-slate-300" size={24} />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900">{stats.inquiries}</h3>
            )}
            <p className="text-slate-500 text-sm">New Inquiries</p>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Branding / Main Action */}
        <div className="bg-[#1B3A5B] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Manage Certificates</h3>
            <p className="text-blue-100 mb-6 max-w-sm">
              Upload templates and configure coordinates for automated certificate generation.
            </p>
            <Link 
              href="/admin/certificates" 
              className="inline-flex items-center gap-2 bg-[#27B19B] hover:bg-[#1fa88e] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md"
            >
              Go to Certificates <ArrowRight size={18} />
            </Link>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Shortcuts List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Shortcuts</h3>
            <div className="space-y-3">
                <Link href="/admin/webinars/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-slate-200 transition-all">
                    <span className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Plus size={16}/></div>
                        Create New Webinar
                    </span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600" />
                </Link>
                
                <Link href="/admin/faculty/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-slate-200 transition-all">
                    <span className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
                         <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Plus size={16}/></div>
                        Add Faculty Member
                    </span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600" />
                </Link>

                <Link href="/admin/contact" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-slate-200 transition-all">
                    <span className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
                         <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg"><Mail size={16}/></div>
                        Check Inbox
                    </span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}