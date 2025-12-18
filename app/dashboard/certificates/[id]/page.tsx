"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { Loader2, Download, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CertificateDownloadPage() {
  const params = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    fetchCertificateData();
  }, []);

  const fetchCertificateData = async () => {
    try {
      // 1. Fetch Data
      const res = await fetch(`/api/dashboard/certificate/${params.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load certificate");
      
      console.log("🔥 API DATA RECEIVED:", data); // Check console for this!
      setCertData(data);

      // 2. Start Drawing (Pass data directly to avoid State delay)
      generateCanvas(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const generateCanvas = async (data: any) => {
    const { template, layout, details } = data;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Load Template Image via Proxy
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `/api/proxy?url=${encodeURIComponent(template)}`;

    img.onload = async () => {
      console.log("✅ Background Template Loaded");
      
      // Set Canvas Size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw Background
      ctx.drawImage(img, 0, 0);

      // --- DRAW NAME ---
      // We check if data exists, otherwise warn in console
      if (layout.name && details.studentName) {
        console.log("✍️ Drawing Name:", details.studentName);
        ctx.font = `bold ${layout.name.size}px serif`;
        ctx.fillStyle = layout.name.color || "#000000";
        ctx.textAlign = "center"; 
        ctx.fillText(details.studentName, layout.name.x, layout.name.y);
      } else {
        console.warn("⚠️ Skipping Name: Missing layout or student name");
      }

      // --- DRAW DATE ---
      if (layout.date && details.date) {
        console.log("✍️ Drawing Date:", details.date);
        ctx.font = `${layout.date.size}px sans-serif`;
        ctx.fillStyle = layout.date.color || "#000000";
        ctx.textAlign = "center";
        ctx.fillText(details.date, layout.date.x, layout.date.y);
      }

      // --- DRAW QR CODE ---
      // Fix: Check for 'qr', 'Qr', 'QR' to match whatever is in DB
      const qrLayout = layout.qr || layout.Qr || layout.QR;

      if (qrLayout) {
        console.log("⚙️ Generating QR Code...");
        try {
          const verifyUrl = `${window.location.origin}/verify/${details.certificateId}`;
          
          // Generate QR Data URL
          const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });
          
          const qrImg = new Image();
          qrImg.src = qrDataUrl;

          // 🛑 CRITICAL: We MUST wait for this before saving
          qrImg.onload = () => {
            console.log("✅ QR Loaded. Drawing at:", qrLayout.x, qrLayout.y);
            ctx.drawImage(qrImg, qrLayout.x, qrLayout.y, qrLayout.size, qrLayout.size);
            
            // FINISH & SAVE
            finalizeImage(canvas);
          };

        } catch (e) {
          console.error("❌ QR Error:", e);
          finalizeImage(canvas); // Save even if QR fails
        }
      } else {
         console.warn("⚠️ No QR Layout found in DB");
         finalizeImage(canvas);
      }
    };

    img.onerror = () => {
      setError("Failed to load certificate template image.");
      setLoading(false);
    };
  };

  const finalizeImage = (canvas: HTMLCanvasElement) => {
    const finalImage = canvas.toDataURL("image/png");
    setGeneratedImage(finalImage);
    setLoading(false);
  };

  const downloadCertificate = () => {
    if (!generatedImage || !certData) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `Certificate-${certData.details.studentName}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-[#1B3A5B]" size={48} />
        <p className="text-slate-500 font-medium">Generating your certificate...</p>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-red-100">
           <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
           <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
           <p className="text-slate-500 mb-6">{error}</p>
           <button onClick={() => window.close()} className="text-sm font-bold text-slate-400 hover:text-slate-600">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl w-full mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
           <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <CheckCircle2 size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Verified Certificate</span>
           </div>
           <h1 className="text-2xl font-serif font-bold text-slate-900">
             {certData?.details?.webinarTitle}
           </h1>
           <p className="text-slate-500 text-sm">Issued to <span className="font-bold text-slate-700">{certData?.details?.studentName}</span></p>
         </div>

         <button 
           onClick={downloadCertificate}
           className="bg-[#1B3A5B] hover:bg-[#152e4a] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
         >
           <Download size={20} />
           Download PNG
         </button>
      </div>

      {/* Preview Area */}
      <div className="max-w-4xl w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
         {generatedImage ? (
           <img src={generatedImage} alt="Certificate Preview" className="w-full h-auto rounded border border-slate-100" />
         ) : (
           <div className="h-96 flex items-center justify-center text-slate-300">Preview Unavailable</div>
         )}
      </div>

      {/* Hidden Canvas - Required for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}