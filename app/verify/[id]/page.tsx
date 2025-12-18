"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Building2,
  ExternalLink
} from "lucide-react";

// Types
interface CertificateDetails {
  studentName: string;
  webinarTitle: string;
  date: string;
  certificateId: string;
}

interface VerificationResponse {
  valid: boolean;
  data?: CertificateDetails;
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [details, setDetails] = useState<CertificateDetails | null>(null);

  useEffect(() => {
    async function verifyCredential() {
      try {
        // Simulate a slight delay for smooth UX feel
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const res = await fetch(`/api/verify/${params.id}`);
        if (res.ok) {
          const json: VerificationResponse = await res.json();
          setIsValid(json.valid);
          setDetails(json.data || null);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    }
    verifyCredential();
  }, [params.id]);

  // --- Loading State (Minimalist) ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
           <Loader2 className="animate-spin text-[#1B3A5B] mb-4" size={40} />
           <p className="text-slate-700 font-medium">Authenticating Credential...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 md:p-8 relative">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1B3A5B 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-[480px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden z-10 transition-all duration-500 ease-out transform translate-y-0 opacity-100">
        
        {/* --- Header Banner --- */}
        <div className={`relative overflow-hidden py-10 px-8 text-center ${isValid ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white" : "bg-gradient-to-tr from-red-600 to-orange-500 text-white"}`}>
            {/* Abstract shapes in banner */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/noise.png')]"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className={`mb-4 p-3 rounded-full bg-white/20 backdrop-blur-md shadow-sm ${isValid ? 'animate-pulse-slow' : ''}`}>
                    {isValid ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isValid ? "Verified Credential" : "Cannot Verify"}
                </h1>
                <p className="text-white/90 font-medium mt-2 flex items-center gap-2">
                    {isValid ? (
                        <><ShieldCheck size={18} /> Official Record Confirmed</>
                    ) : (
                        "Record not found in database."
                    )}
                </p>
            </div>
        </div>

        {/* --- Content Body --- */}
        <div className="px-8 py-10">
            
          {isValid && details ? (
            // === VALID CONTENT ===
            <div>
               {/* Student Name - Hero Typography */}
               <div className="text-center mb-10">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Presented To</p>
                 <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight">
                   {details.studentName}
                 </h2>
               </div>

               {/* Divider with Seal */}
               <div className="relative h-px bg-slate-200 my-8">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-slate-300">
                     <Award size={20} />
                  </div>
               </div>

               {/* Details List - Clean Layout */}
               <div className="space-y-6">
                  
                  <div className="flex items-start gap-4">
                     <div className="bg-blue-50 p-2.5 rounded-xl text-[#1B3A5B]">
                        <Award size={22} />
                     </div>
                     <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Certification</p>
                        <p className="text-lg font-bold text-slate-800 leading-snug">{details.webinarTitle}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="bg-blue-50 p-2.5 rounded-xl text-[#1B3A5B]">
                        <Calendar size={22} />
                     </div>
                     <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Date of Issue</p>
                        <p className="text-base font-bold text-slate-800">{details.date}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="bg-blue-50 p-2.5 rounded-xl text-[#1B3A5B]">
                        <Building2 size={22} />
                     </div>
                     <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Issuing Authority</p>
                        <p className="text-base font-bold text-slate-800">Global Academy of Embryology</p>
                     </div>
                  </div>

               </div>

               {/* Footer Metadata */}
               <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400 font-mono mb-2">Credential ID: {details.certificateId}</p>
                  <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck size={14} /> Securely Verified via Blockchain API
                  </div>
               </div>
            </div>
          ) : (
            // === INVALID CONTENT ===
            <div className="text-center py-4">
               <p className="text-slate-600 leading-relaxed mb-8">
                 We could not authenticate the credential ID scanned. This may be due to an incorrect URL, a revoked certificate, or a system error.
               </p>
               
               <div className="space-y-4">
                 <button 
                   onClick={() => window.location.reload()}
                   className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                 >
                   Scan QR Code Again
                 </button>
                 
                 <a href="https://gae.com/contact" target="_blank" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B3A5B] text-white rounded-xl font-bold text-sm hover:bg-[#152e4a] transition-colors shadow-lg shadow-blue-900/20">
                   Contact GAE Support <ExternalLink size={16} />
                 </a>
               </div>
            </div>
          )}
          <div className="absolute bottom-6 text-center w-full">
        <p className="text-slate-500/80 text-xs font-medium">
          © 2025 Global Academy of Embryology. All rights reserved.
        </p>
      </div>
        </div>

      </div>

      {/* Page Footer */}
      

    </div>
  );
}