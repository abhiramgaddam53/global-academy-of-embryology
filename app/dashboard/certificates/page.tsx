"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Download, ExternalLink, Calendar, CheckCircle2, Loader2, QrCode } from "lucide-react";

interface Certificate {
  webinarId: string;
  certificateId: string;
  title: string;
  issueDate: string;
  instructor: string;
  score: string;
}

export default function UserCertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch("/api/dashboard/certificate");
        if (res.ok) {
          const data = await res.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error("Failed to load certificates", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin text-[#1B3A5B]" size={40} />
        <p>Retrieving credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-serif font-bold text-[#0F172A]">My Credentials</h1>
        <p className="text-slate-500 mt-1">View and download your earned certificates.</p>
      </div>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {certificates.length > 0 ? (
           certificates.map((cert) => (
             <div key={cert.certificateId} className="bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                
                {/* Visual Top Border */}
                <div className="h-2 w-full bg-gradient-to-r from-[#1B3A5B] to-[#27B19B]" />

                <div className="p-8 flex-1 flex flex-col">
                   {/* Icon & ID */}
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shrink-0">
                         <Award size={28} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificate ID</p>
                         <p className="font-mono text-xs text-slate-600 truncate max-w-[100px]" title={cert.certificateId}>
                           {cert.certificateId.substring(0, 8)}...
                         </p>
                      </div>
                   </div>

                   {/* Content */}
                   <div className="mb-8">
                      <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2 group-hover:text-[#27B19B] transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-slate-500">Instructor: {cert.instructor}</p>
                   </div>

                   {/* Meta Data */}
                   <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-auto">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issued On</p>
                         <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Calendar size={14} /> {cert.issueDate}
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                         <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                            <CheckCircle2 size={14} /> {cert.score}
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex gap-3">
                      {/* Download Button - Opens the Generator Page */}
                      <Link 
                        href={`/dashboard/certificates/${cert.webinarId}`}
                        target="_blank"
                        className="flex-1 py-3 bg-[#1B3A5B] text-white rounded-xl font-bold text-sm hover:bg-[#152e4a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                         <Download size={16} /> Download
                      </Link>
                      
                      {/* Verify Button - Opens the Public Verify Page */}
                      <Link 
                        href={`/verify/${cert.certificateId}`}
                        target="_blank"
                        className="px-4 py-3 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-[#1B3A5B] transition-colors" 
                        title="Verify / Share Publicly"
                      >
                         <ExternalLink size={18} />
                      </Link>
                   </div>
                </div>
             </div>
           ))
        ) : (
           <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-200">
                 <Award size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Certificates Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Complete webinars to earn credentials. Once you attend a session, your certificate will appear here.
              </p>
              <Link href="/dashboard/webinars" className="text-[#27B19B] font-bold hover:underline">
                Browse Webinars
              </Link>
           </div>
        )}
      </div>
    </div>
  );
}