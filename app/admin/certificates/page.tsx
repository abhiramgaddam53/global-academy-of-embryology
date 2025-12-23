"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileBadge, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  Search,
  Download
} from "lucide-react";

interface CertWebinar {
  _id: string;
  title: string;
  date: string;
  hasTemplate: boolean;
  registeredCount: number;
}

interface Stats {
  totalCertificatesConfigured: number;
  totalIssued: number;
  pendingConfig: number;
}

export default function AdminCertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ stats: Stats; certificates: CertWebinar[] } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter Logic for search bar
  const filteredCerts = data?.certificates.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-slate-500">Failed to load data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Certificates Management</h1>
        <p className="text-slate-500 mt-1">Manage templates and view issuance status for all webinars.</p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Configured */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Configured</p>
            <h3 className="text-2xl font-bold text-slate-900">{data.stats.totalCertificatesConfigured}</h3>
          </div>
        </div>

        {/* Card 2: Missing Template */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Missing Template</p>
            <h3 className="text-2xl font-bold text-slate-900">{data.stats.pendingConfig}</h3>
          </div>
        </div>

         
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Toolbar with Search */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Webinar Certificates</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search webinars..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-64 focus:outline-none focus:border-[#27B19B] focus:ring-1 focus:ring-[#27B19B]"
            />
          </div>
        </div>

        {/* Certificates List */}
        <div className="divide-y divide-slate-100">
          {filteredCerts.length > 0 ? (
            filteredCerts.map((cert) => (
              <div key={cert._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                
                {/* Info Column */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900">{cert.title}</h3>
                    {cert.hasTemplate ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Active
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Not Configured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {new Date(cert.date).toLocaleDateString()} • <span className="font-medium text-slate-700">{cert.registeredCount}</span> Eligible Students
                  </p>
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-3">
                  {/* Configure/Edit Button - Links to Edit Webinar Page */}
                  <Link 
                    href={`/admin/webinars/${cert._id}`} 
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-[#1B3A5B] hover:border-[#1B3A5B] hover:bg-white transition-all shadow-sm"
                  >
                    <Edit size={16} /> Configure
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FileBadge size={48} className="mx-auto mb-4 opacity-20" />
              <p>No webinars found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}