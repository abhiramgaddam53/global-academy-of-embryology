// "use client";

// import { use, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { ChevronLeft, Loader2, Save, LayoutDashboard, X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// export default function EditWebinarPage({ params }: { params: Promise<{ id: string }> }) {
//   const router = useRouter();
  
//   // Unwrap params
//   const { id } = use(params);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
  
//   const [isDirty, setIsDirty] = useState(false);
//   const [initialData, setInitialData] = useState<any>(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     dateTime: "",
//     mentors: "",
//     imageUrl: "",
//     webinarLink: "",
//     recordedLink: ""
//   });

//   // 1. Fetch Data
//   useEffect(() => {
//     async function fetchWebinar() {
//       try {
//         const res = await fetch(`/api/webinars/${id}`);
//         if (!res.ok) throw new Error(`Error: ${res.status}`);

//         const json = await res.json();
        
//         // Handle API response structure
//         const data = json._id ? json : (json.webinar || json.data);

//         if (data && data._id) {
//           const dateStr = data.dateTime ? new Date(data.dateTime).toISOString().slice(0, 16) : "";
          
//           const loadedData = {
//             title: data.title || "",
//             description: data.description || "",
//             dateTime: dateStr,
//             mentors: Array.isArray(data.mentors) ? data.mentors.join(", ") : (data.mentors || ""),
//             imageUrl: data.imageUrl || "",
//             // FIX: Check for 'webinarLink', 'link', or 'url' to ensure data loads
//             webinarLink: data.webinarLink || data.link || data.url || "",
//             recordedLink: data.recordedLink || ""
//           };

//           setFormData(loadedData);
//           setInitialData(loadedData);
//         } else {
//           setError("Webinar data not found in response");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to load webinar details");
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     if (id) fetchWebinar();
//   }, [id]);

//   // 2. Track Changes
//   useEffect(() => {
//     if (!initialData) return;
//     const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
//     setIsDirty(isChanged);
//   }, [formData, initialData]);

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // 3. Navigation Guards
//   const handleCancel = () => {
//     if (isDirty) {
//       if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
//         router.push("/admin/webinars");
//       }
//     } else {
//       router.push("/admin/webinars");
//     }
//   };

//   const handleDashboard = () => {
//     if (isDirty) {
//       if (confirm("You have unsaved changes. Go to Dashboard anyway?")) {
//         router.push("/admin");
//       }
//     } else {
//       router.push("/admin");
//     }
//   };

//   // 4. Upload Handler (Updated with Folder)
//   async function uploadImage(e: any) {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       // FIX: Send folder hint to backend
//       form.append("folder", "Webinar-photos"); 

//       const res = await fetch("/api/upload", { method: "POST", body: form });
//       if (!res.ok) throw new Error();
      
//       const data = await res.json();
//       setFormData(prev => ({ ...prev, imageUrl: data.url }));
//     } catch {
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   }

//   // 5. Submit Handler
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     const mentorsArray = formData.mentors.split(",").map(m => m.trim()).filter(Boolean);

//     try {
//       const res = await fetch(`/api/webinars/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, mentors: mentorsArray }),
//       });

//       if (!res.ok) throw new Error("Failed to update");
      
//       setIsDirty(false); 
//       router.push("/admin/webinars");
//     } catch (err) {
//       setError("Update failed. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) return <div className="h-96 flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;

//   return (
//     <div className="max-w-3xl mx-auto pb-10">
      
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={handleCancel}
//             type="button"
//             className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
//             title="Back to Webinars"
//           >
//             <ChevronLeft size={20} />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-[#1B3A5B]">Edit Webinar</h1>
//             <p className="text-slate-500 text-sm">Update session details.</p>
//           </div>
//         </div>

//         <button 
//           onClick={handleDashboard}
//           type="button"
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#1B3A5B] transition-colors"
//         >
//           <LayoutDashboard size={16} />
//           Dashboard
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
        
//         {isDirty && (
//           <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
//             <span>⚠️ You have unsaved changes.</span>
//             <div className="flex gap-3">
//                <button type="button" onClick={() => setFormData(initialData)} className="underline hover:text-amber-900">Reset</button>
//             </div>
//           </div>
//         )}

//         {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
//           <div className="grid gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Title *</label>
//               <input
//                 value={formData.title}
//                 onChange={e => handleChange("title", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 value={formData.description}
//                 onChange={e => handleChange("description", e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none resize-none"
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
//               <input
//                 type="datetime-local"
//                 value={formData.dateTime}
//                 onChange={e => handleChange("dateTime", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mentors</label>
//               <input
//                 value={formData.mentors}
//                 onChange={e => handleChange("mentors", e.target.value)}
//                 placeholder="Comma separated names"
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Live Link <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="url"
//                 value={formData.webinarLink}
//                 onChange={e => handleChange("webinarLink", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Recorded Link <span className="text-gray-400 text-xs">(Optional)</span>
//               </label>
//               <input
//                 type="url"
//                 value={formData.recordedLink}
//                 onChange={e => handleChange("recordedLink", e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
//               />
//             </div>
//           </div>

//           <div className="pt-4 border-t border-slate-100">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
//             <div className="flex gap-4 items-start">
//                {formData.imageUrl && (
//                 <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
//                   <Image 
//                     src={formData.imageUrl} 
//                     alt="Preview" 
//                     fill 
//                     className="object-cover" 
//                     unoptimized 
//                   />
//                 </div>
//                )}
//                <div className="flex-1">
//                  <input
//                   type="file"
//                   accept="image/*"
//                   onChange={uploadImage}
//                   disabled={uploading}
//                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1B3A5B]/10 file:text-[#1B3A5B] hover:file:bg-[#1B3A5B]/20"
//                 />
//                 <p className="text-xs text-slate-400 mt-1 pl-2">
//                   {uploading ? "Uploading to Webinar-photos..." : "Uploads to 'Webinar-photos' folder"}
//                 </p>
//                </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center pt-4">
//            <button
//              type="button"
//              onClick={handleCancel}
//              className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
//            >
//              <X size={18} />
//              Stop & Cancel
//            </button>

//            <button
//             type="submit"
//             disabled={submitting || uploading}
//             className="px-8 py-3 rounded-xl bg-[#27B19B] text-white font-semibold hover:bg-[#219e8c] transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#27B19B]/20"
//           >
//             {submitting ? (
//               <><Loader2 className="animate-spin" /> Saving...</>
//             ) : (
//               <><Save size={20} /> Save Changes</>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, LayoutDashboard, X, FileBadge, UploadCloud, Eye, QrCode } from "lucide-react";
import Image from "next/image";
// ✅ Import the Preview Component
import CertificatePreviewModal from "@/app/components/CertificatePreviewModal"; 

export default function EditWebinarPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ New State for Modal
  const [showPreview, setShowPreview] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: "",
    mentors: "",
    imageUrl: "",
    webinarLink: "",
    recordedLink: "",
    // Certificate Fields
    certificateTemplate: "",
    certNameX: 300,
    certNameY: 300,
    certDateX: 300,
    certDateY: 200,
    // ✅ New QR Fields
    certQrX: 100,
    certQrY: 100,
  });

  // 1. Fetch Data
  useEffect(() => {
    async function fetchWebinar() {
      try {
        const res = await fetch(`/api/webinars/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const json = await res.json();
        // Handle different API response structures
        const data = json._id ? json : (json.webinar || json.data);

        // 🔍 DEBUG: Check this in your browser console (F12)
        console.log("🔥 FETCHED WEBINAR DATA:", data);
        console.log("📜 CERTIFICATE LAYOUT:", data.certificateLayout);

        if (data && data._id) {
          const dateStr = data.dateTime ? new Date(data.dateTime).toISOString().slice(0, 16) : "";
          
          // ✅ SAFE MAPPING: Extract layout safely to avoid crashes
          const layout = data.certificateLayout || {};
          
          const loadedData = {
            title: data.title || "",
            description: data.description || "",
            dateTime: dateStr,
            mentors: Array.isArray(data.mentors) ? data.mentors.join(", ") : (data.mentors || ""),
            imageUrl: data.imageUrl || "",
            webinarLink: data.webinarLink || data.link || data.url || "",
            recordedLink: data.recordedLink || "",
            
            // Map Certificate Data (Nested -> Flat)
            certificateTemplate: data.certificateTemplate || "",
            
            // We use '??' (nullish coalescing) so 0 is considered a valid number, but undefined/null uses default
            certNameX: layout.name?.x ?? 300,
            certNameY: layout.name?.y ?? 300,
            
            certDateX: layout.date?.x ?? 300,
            certDateY: layout.date?.y ?? 200,
            
            // Map QR Data (Default to 100 if missing)
            certQrX: layout.qr?.x ?? 100,
            certQrY: layout.qr?.y ?? 100,
          };

          setFormData(loadedData);
          setInitialData(loadedData);
        } else {
          setError("Webinar data not found in response");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load webinar details");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchWebinar();
  }, [id]);

  // 2. Track Changes
  useEffect(() => {
    if (!initialData) return;
    const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
    setIsDirty(isChanged);
  }, [formData, initialData]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 3. Navigation Guards
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

  // 4. Generic Upload Handler
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "certificate") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "cover") setUploadingImage(true);
    else setUploadingCert(true);

    try {
      const form = new FormData();
      form.append("file", file);
      // Determine folder based on type
      form.append("folder", type === "cover" ? "webinars" : "certificates");

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      
      if (type === "cover") {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        setFormData(prev => ({ ...prev, certificateTemplate: data.url }));
      }
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      if (type === "cover") setUploadingImage(false);
      else setUploadingCert(false);
    }
  }

  // 5. Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const mentorsArray = formData.mentors.split(",").map(m => m.trim()).filter(Boolean);

    // Reconstruct nested object for DB
    const payload = {
      ...formData,
      mentors: mentorsArray,
      certificateLayout: {
        name: { 
          x: Number(formData.certNameX), 
          y: Number(formData.certNameY), 
          size: 40 
        },
        date: { 
          x: Number(formData.certDateX), 
          y: Number(formData.certDateY), 
          size: 30 
        },
        // ✅ Add QR Data to Payload
        qr: {
          x: Number(formData.certQrX),
          y: Number(formData.certQrY),
          size: 120 // Default size
        }
      }
    };

    // Clean up flat fields before sending so we don't send garbage to the API
    // @ts-ignore
    delete payload.certNameX; delete payload.certNameY;
    // @ts-ignore
    delete payload.certDateX; delete payload.certDateY;
    // @ts-ignore
    delete payload.certQrX; delete payload.certQrY;

    try {
      const res = await fetch(`/api/webinars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");
      
      setIsDirty(false); 
      router.push("/admin/webinars");
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="h-96 flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* ✅ PREVIEW MODAL INTEGRATION */}
      <CertificatePreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        certificateUrl={formData.certificateTemplate}
        layout={{
          nameX: Number(formData.certNameX),
          nameY: Number(formData.certNameY),
          dateX: Number(formData.certDateX),
          dateY: Number(formData.certDateY),
          qrX: Number(formData.certQrX), // Pass QR coords
          qrY: Number(formData.certQrY)
        }}
      />

      {/* Header */}
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
            <h1 className="text-2xl font-bold text-[#1B3A5B]">Edit Webinar</h1>
            <p className="text-slate-500 text-sm">Update session details & certificates.</p>
          </div>
        </div>

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
        
        {isDirty && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>⚠️ You have unsaved changes.</span>
            <div className="flex gap-3">
               <button type="button" onClick={() => setFormData(initialData)} className="underline hover:text-amber-900">Reset</button>
            </div>
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* SECTION 1: WEBINAR DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Session Details</h2>
          
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Title *</label>
              <input
                value={formData.title}
                onChange={e => handleChange("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none resize-none"
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentors</label>
              <input
                value={formData.mentors}
                onChange={e => handleChange("mentors", e.target.value)}
                placeholder="Comma separated names"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.webinarLink}
                onChange={e => handleChange("webinarLink", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recorded Link <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.recordedLink}
                onChange={e => handleChange("recordedLink", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#27B19B] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <div className="flex gap-4 items-start">
               {formData.imageUrl && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <Image 
                    src={formData.imageUrl} 
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
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1B3A5B]/10 file:text-[#1B3A5B] hover:file:bg-[#1B3A5B]/20"
                />
                <p className="text-xs text-slate-400 mt-1 pl-2">
                  {uploadingImage ? "Uploading..." : "Uploads to 'Webinars' folder"}
                </p>
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
            {formData.certificateTemplate && (
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
                    {formData.certificateTemplate ? (
                       <Image 
                         src={formData.certificateTemplate} 
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
              </label>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                 {/* Name Position */}
                 <div>
                    <span className="text-xs font-bold text-[#1B3A5B] uppercase tracking-wider block mb-2">Student Name Position</span>
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

                 {/* Date Position */} 
                 <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-[#1B3A5B] uppercase tracking-wider block mb-2">Issue Date Position</span>
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

                 {/* ✅ QR Code Position (NEW) */}
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
            disabled={submitting || uploadingImage || uploadingCert}
            className="px-8 py-3 rounded-xl bg-[#27B19B] text-white font-semibold hover:bg-[#219e8c] transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#27B19B]/20"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={20} /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}