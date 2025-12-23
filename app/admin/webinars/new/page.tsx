

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, LayoutDashboard, X, FileBadge, UploadCloud, Eye, QrCode } from "lucide-react";
import Image from "next/image";
// ✅ Import the Preview Component (ensure this path matches where you saved it)
import CertificatePreviewModal from "@/app/components/CertificatePreviewModal"; 

export default function NewWebinarPage() {
  const router = useRouter();
  
  // File URLs
  const [imageUrl, setImageUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  // ✅ New State for Modal
  const [showPreview, setShowPreview] = useState(false);

  // Loading States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Track dirty state
  const [isDirty, setIsDirty] = useState(false);

  // Initial Empty State
  const initialFormState = {
    title: "",
    description: "",
    dateTime: "",
    mentors: "",
    webinarLink: "",
    recordedLink: "",
    // Certificate Coordinates (Defaults)
    certNameX: 300,
    certNameY: 300,
    certDateX: 300,
    certDateY: 200,
    // ✅ New QR Defaults
    certQrX: 100,
    certQrY: 100,
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. Detect Changes
  useEffect(() => {
    const isChanged = 
      JSON.stringify(formData) !== JSON.stringify(initialFormState) || 
      imageUrl !== "" ||
      certificateUrl !== "";
      
    setIsDirty(isChanged);
  }, [formData, imageUrl, certificateUrl]);

  // Handle Input Changes
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 2. Navigation Guards
  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router.push("/admin/webinars");
      }
    } else {
      router.push("/admin/webinars");
    }
  };

  const handleDashboard = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Go to Dashboard anyway?")) {
        router.push("/admin");
      }
    } else {
      router.push("/admin");
    }
  };

  // 3. Generic Upload Handler
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "certificate") {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set correct loading state
    if (type === "cover") setUploadingImage(true);
    else setUploadingCert(true);

    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      // Optional: You can pass a folder name if your API supports it
      form.append("folder", type === "cover" ? "webinars" : "certificates"); 

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const data = await res.json();

      if (type === "cover") setImageUrl(data.url);
      else setCertificateUrl(data.url);

    } catch (err: any) {
      console.error(err);
      setError(`Failed to upload ${type}. Please try again.`);
    } finally {
      if (type === "cover") setUploadingImage(false);
      else setUploadingCert(false);
    }
  }

  // 4. Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!imageUrl) {
      setError("Please upload a cover image first");
      return;
    }

    // Process mentors
    const mentorsArray = formData.mentors
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0);

    // Construct Body with Nested Certificate Layout
    const body = {
      title: formData.title,
      description: formData.description,
      dateTime: formData.dateTime,
      mentors: mentorsArray,
      webinarLink: formData.webinarLink,
      recordedLink: formData.recordedLink,
      imageUrl: imageUrl,
      
      // Certificate Data
      certificateTemplate: certificateUrl,
      certificateLayout: {
        name: { 
          x: Number(formData.certNameX), 
          y: Number(formData.certNameY), 
          size: 180 
        },
        date: { 
          x: Number(formData.certDateX), 
          y: Number(formData.certDateY), 
          size: 120 
        },
        // ✅ New QR Data
        qr: {
          x: Number(formData.certQrX),
          y: Number(formData.certQrY),
          size: 500 // Default size
        }
      }
    };

    setSubmitting(true);

    try {
      const res = await fetch("/api/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create webinar");

      // Reset dirty state on success
      setIsDirty(false);
      router.push("/admin/webinars");
    } catch (err: any) {
      setError(err.message || "Failed to create webinar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* ✅ PREVIEW MODAL INTEGRATION */}
      <CertificatePreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        certificateUrl={certificateUrl}
        layout={{
          nameX: Number(formData.certNameX),
          nameY: Number(formData.certNameY),
          dateX: Number(formData.certDateX),
          dateY: Number(formData.certDateY),
          qrX: Number(formData.certQrX), // Pass QR coords
          qrY: Number(formData.certQrY)
        }}
      />

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCancel}
            type="button"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            title="Back to Webinars"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1B3A5B]">Create New Webinar</h1>
            <p className="text-slate-500 text-sm">Schedule a new session & configure certificate.</p>
          </div>
        </div>

        {/* Dashboard Link */}
        <button 
          onClick={handleDashboard}
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#1B3A5B] transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>⚠️ You have unsaved changes.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* SECTION 1: WEBINAR DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Session Details</h2>
          
          <div className="grid md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Title *</label>
              <input
                value={formData.title}
                onChange={e => handleChange("title", e.target.value)}
                placeholder="e.g. Advanced IVF Techniques"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange("description", e.target.value)}
                placeholder="What will be covered in this session?"
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={e => handleChange("dateTime", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentors</label>
              <input
                value={formData.mentors}
                onChange={e => handleChange("mentors", e.target.value)}
                placeholder="Comma separated (e.g. Dr. John, Dr. Jane)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Webinar Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.webinarLink}
                onChange={e => handleChange("webinarLink", e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recorded Video Link <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.recordedLink}
                onChange={e => handleChange("recordedLink", e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#27B19B]/20 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image *</label>
            <div className="flex items-start gap-4">
              {imageUrl && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <Image 
                       src={imageUrl} 
                       alt="Preview" 
                       fill 
                       className="object-cover" 
                       unoptimized 
                      />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "cover")}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1B3A5B]/10 file:text-[#1B3A5B] hover:file:bg-[#1B3A5B]/20 transition-colors"
                  required={!imageUrl} 
                />
                {uploadingImage && <p className="mt-2 text-xs text-blue-600 font-medium animate-pulse">Uploading image...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CERTIFICATE CONFIGURATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
                <FileBadge className="text-[#27B19B]" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Certificate Configuration</h2>
            </div>
            
            {/* ✅ PREVIEW BUTTON */}
            {certificateUrl && (
              <button 
                type="button" 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 text-sm font-bold text-[#1B3A5B] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-200"
              >
                <Eye size={16} /> Preview PDF Layout
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Upload Template */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                1. Upload Blank Template
                <span className="block text-xs text-slate-400 font-normal mt-0.5">Upload a PDF or Image with no text.</span>
              </label>
              
              <div className="flex flex-col gap-3">
                 <div className="relative w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center hover:bg-slate-100 transition-colors">
                    {certificateUrl ? (
                       <Image 
                         src={certificateUrl} 
                         alt="Certificate Template" 
                         fill 
                         className="object-contain p-2" 
                         unoptimized 
                       />
                    ) : (
                       <div className="text-center p-4">
                          <UploadCloud className="mx-auto text-slate-300 mb-2" size={32} />
                          <p className="text-xs text-slate-400">No template uploaded</p>
                       </div>
                    )}
                 </div>

                 <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleUpload(e, "certificate")}
                    disabled={uploadingCert}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1B3A5B]/10 file:text-[#1B3A5B] hover:file:bg-[#1B3A5B]/20"
                  />
                  {uploadingCert && <p className="text-xs text-blue-600 font-medium animate-pulse">Uploading template...</p>}
              </div>
            </div>

            {/* Right: Coordinates */}
            <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-700">
                2. Set Text Coordinates (X, Y)
                <span className="block text-xs text-slate-400 font-normal mt-0.5">
                  Adjust where the elements will be printed. <br/>
                  (0,0 is usually bottom-left for PDFs).
                </span>
              </label>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                 
                 {/* 1. Name Position */}
                 <div>
                    <span className="text-xs font-bold text-[#1B3A5B] uppercase tracking-wider block mb-2">Student Name</span>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs text-slate-500">Position X</label>
                          <input 
                            type="number" 
                            value={formData.certNameX}
                            onChange={(e) => handleChange("certNameX", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                       <div>
                          <label className="text-xs text-slate-500">Position Y</label>
                          <input 
                            type="number" 
                            value={formData.certNameY}
                            onChange={(e) => handleChange("certNameY", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                    </div>
                 </div>

                 {/* 2. Date Position */}
                 <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-[#1B3A5B] uppercase tracking-wider block mb-2">Issue Date</span>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs text-slate-500">Position X</label>
                          <input 
                            type="number" 
                            value={formData.certDateX}
                            onChange={(e) => handleChange("certDateX", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                       <div>
                          <label className="text-xs text-slate-500">Position Y</label>
                          <input 
                            type="number" 
                            value={formData.certDateY}
                            onChange={(e) => handleChange("certDateY", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                    </div>
                 </div>

                 {/* 3. QR Code Position (NEW) */}
                 <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                       <QrCode size={14} className="text-[#1B3A5B]" />
                       <span className="text-xs font-bold text-[#1B3A5B] uppercase tracking-wider">Verification QR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs text-slate-500">Position X</label>
                          <input 
                            type="number" 
                            value={formData.certQrX}
                            onChange={(e) => handleChange("certQrX", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                       <div>
                          <label className="text-xs text-slate-500">Position Y</label>
                          <input 
                            type="number" 
                            value={formData.certQrY}
                            onChange={(e) => handleChange("certQrY", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                       </div>
                    </div>
                 </div>

              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
           {/* Explicit Cancel Button */}
           <button
             type="button"
             onClick={handleCancel}
             className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
           >
             <X size={18} />
             Stop & Cancel
           </button>

           <button
            type="submit"
            disabled={submitting || uploadingImage || uploadingCert || !imageUrl}
            className="px-8 py-3 rounded-xl bg-[#27B19B] text-white font-semibold hover:bg-[#219e8c] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#27B19B]/20"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={20} /> Creating...</>
            ) : (
              <><Save size={20} /> Create Webinar</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}