 
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { X, Loader2, ArrowUpRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface GalleryItem {
//   _id: string;
//   title: string;
//   category: string;
//   imageUrl: string;
// }

// export default function GalleryPage() {
//   const [items, setItems] = useState<GalleryItem[]>([]);
//   const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

//   // Fetch Gallery Data
//   useEffect(() => {
//     async function fetchGallery() {
//       try {
//         const res = await fetch("/api/gallery");
//         const json = await res.json();
//         if (json.success) {
//           setItems(json.gallery || []);
//           setFilteredItems(json.gallery || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch gallery", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchGallery();
//   }, []);

//   // Filter Logic
//   useEffect(() => {
//     if (selectedCategory === "All") {
//       setFilteredItems(items);
//     } else {
//       setFilteredItems(items.filter((item) => item.category === selectedCategory));
//     }
//   }, [selectedCategory, items]);

//   const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

//   return (
//     <section className="min-h-screen relative font-sans bg-[#FAFAFA] text-slate-900 selection:bg-[#0F172A]  selection:text-white">
      
//       {/* Background Decor */}
//       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E0F2F1]/50 to-transparent pointer-events-none" />
//       <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#27B19B]/5 rounded-full blur-3xl pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        
//         {/* Header */}
//         <div className="mb-20 space-y-6 max-w-3xl">
//           <motion.h1 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-5xl md:text-7xl font-bold  tracking-tight text-[#1B3A5B]"
//           >
//             Visual <span className="text-[#27B19B]">Archive.</span>
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="text-lg md:text-xl text-slate-500 leading-relaxed"
//           >
//             Immerse yourself in the vibrant life of our campus. 
//             A curated collection of events, achievements, and everyday moments.
//           </motion.p>
//         </div>

//         {/* Filter Tabs */}
//         <div className="sticky top-4 z-30 mb-12 flex justify-center md:justify-start">
//           <div className="inline-flex flex-wrap gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-sm">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative
//                   ${selectedCategory === cat ? "text-white" : "text-slate-500 hover:text-[#1B3A5B]"}`}
//               >
//                 {selectedCategory === cat && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="absolute inset-0 bg-[#1B3A5B] rounded-full shadow-md"
//                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                   />
//                 )}
//                 <span className="relative z-10">{cat}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Masonry Grid - Optimized */}
//         {loading ? (
//           <div className="flex h-96 items-center justify-center">
//             <Loader2 className="animate-spin text-[#27B19B]" size={40} />
//           </div>
//         ) : filteredItems.length > 0 ? (
//           <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
//              {/* Note: AnimatePresence removed from here to fix Masonry jitter */}
//               {filteredItems.map((item, index) => (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.4, delay: index * 0.05 }}
//                   key={item._id}
//                   className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
//                   onClick={() => setSelectedImage(item)}
//                 >
//                   <div className="relative overflow-hidden">
//                     <Image
//                       src={item.imageUrl}
//                       alt={item.title}
//                       width={800}
//                       height={600}
//                       className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
//                       unoptimized
//                     />
                    
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
//                     {/* Hover Content */}
//                     <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
//                       <div className="flex justify-between items-end">
//                         <div>
//                           <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold tracking-widest text-[#27B19B] bg-white/10 backdrop-blur-sm rounded uppercase border border-white/20">
//                             {item.category}
//                           </span>
//                           <h3 className="text-white text-lg font-semibold leading-tight drop-shadow-md">
//                             {item.title}
//                           </h3>
//                         </div>
//                         <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
//                           <ArrowUpRight size={18} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//           </div>
//         ) : (
//           <div className="py-32 text-center text-slate-400">
//             <p className="text-lg">No photos found in this category.</p>
//           </div>
//         )}
//       </div>

//       {/* Immersive Lightbox - Smooth */}
//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 z-50 bg-[#1B3A5B]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
//             onClick={() => setSelectedImage(null)}
//           >
//             <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50">
//               <X size={24} />
//             </button>

//             <motion.div
//               initial={{ scale: 0.95, opacity: 0, y: 10 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.95, opacity: 0, y: 10 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="relative max-w-6xl w-full flex flex-col items-center"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative w-full h-[65vh] md:h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-black/20">
//                  <Image
//                   src={selectedImage.imageUrl}
//                   alt={selectedImage.title}
//                   fill
//                   className="object-contain"
//                   unoptimized
//                 />
//               </div>
              
//               <div className="mt-6 text-center">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[#27B19B] text-xs font-bold tracking-widest uppercase mb-3">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#27B19B]" />
//                   {selectedImage.category}
//                 </div>
//                 <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
//                   {selectedImage.title}
//                 </h2>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }  

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { X, Loader2, ArrowUpRight, ImageIcon } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "@/app/components/Navbar";

// interface GalleryItem {
//   _id: string;
//   title: string;
//   category: string;
//   imageUrl: string;
// }

// export default function GalleryPage() {
//   const [items, setItems] = useState<GalleryItem[]>([]);
//   const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

//   // Fetch Gallery Data
//   useEffect(() => {
//     async function fetchGallery() {
//       try {
//         const res = await fetch("/api/gallery");
//         const json = await res.json();
//         if (json.success) {
//           setItems(json.gallery || []);
//           setFilteredItems(json.gallery || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch gallery", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchGallery();
//   }, []);

//   // Filter Logic
//   useEffect(() => {
//     if (selectedCategory === "All") {
//       setFilteredItems(items);
//     } else {
//       setFilteredItems(items.filter((item) => item.category === selectedCategory));
//     }
//   }, [selectedCategory, items]);

//   const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
//       <Navbar />

//       {/* ================= HERO SECTION (Institutional Style) ================= */}
//       <section className="relative pt-40 pb-32 overflow-hidden bg-[#020617]">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <Image 
//              src="/hero-bg.webp" 
//              alt="Gallery Background" 
//              fill
//              className="object-cover opacity-40 mix-blend-overlay"
//              unoptimized
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent" />
//         </div>

//         <div className="relative z-10 container mx-auto px-6 text-center">
//           <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-xs font-bold mb-6 animate-fade-in">
//              Visual Archive
//           </p>
//           <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
//             Captured <span className="italic font-light text-slate-400">Moments.</span>
//           </h1>
//           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
//             A curated collection of events, scientific milestones, and the vibrant life within our academy.
//           </p>
//         </div>
//       </section>

//       {/* ================= MAIN CONTENT ================= */}
//       <section className="py-24 bg-[#F8FAFC]">
//         <div className="container mx-auto px-6 -mt-24 relative z-20">
          
//           {/* FILTER TABS */}
//           <div className="flex justify-center mb-16">
//             <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
//                     selectedCategory === cat 
//                       ? "bg-[#0F172A] text-white shadow-md" 
//                       : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* MASONRY GRID */}
//           {loading ? (
//             <div className="min-h-[400px] flex flex-col items-center justify-center">
//               <Loader2 className="animate-spin text-[#0D9488] mb-4" size={40} />
//               <p className="text-slate-500 font-serif italic">Loading archive...</p>
//             </div>
//           ) : filteredItems.length > 0 ? (
//             <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
//                {filteredItems.map((item, index) => (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.4, delay: index * 0.05 }}
//                     key={item._id}
//                     className="break-inside-avoid relative group rounded-none overflow-hidden bg-white cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
//                     onClick={() => setSelectedImage(item)}
//                   >
//                     <div className="relative overflow-hidden">
//                       <Image
//                         src={item.imageUrl}
//                         alt={item.title}
//                         width={800}
//                         height={600}
//                         className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
//                         unoptimized
//                       />
                      
//                       {/* Institutional Overlay - Dark Navy Gradient */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-0 group-hover:opacity-90 transition-all duration-500" />
                      
//                       {/* Hover Content */}
//                       <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
//                         <div className="flex justify-between items-end">
//                           <div>
//                             <span className="inline-block px-2 py-1 mb-3 text-[10px] font-bold tracking-[0.2em] text-[#2DD4BF] border border-[#2DD4BF]/30 uppercase">
//                               {item.category}
//                             </span>
//                             <h3 className="text-white text-xl font-serif leading-tight">
//                               {item.title}
//                             </h3>
//                           </div>
//                           <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#2DD4BF] hover:border-[#2DD4BF] hover:text-[#020617] transition-colors duration-300">
//                             <ArrowUpRight size={20} strokeWidth={1.5} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//             </div>
//           ) : (
//             <div className="bg-white rounded-none p-20 text-center border border-dashed border-slate-300">
//               <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} strokeWidth={1} />
//               <p className="text-slate-500 font-serif text-lg italic">No items found in this collection.</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ================= LIGHTBOX MODAL ================= */}
//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
//             onClick={() => setSelectedImage(null)}
//           >
//             <button className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 text-white hover:bg-[#0D9488] transition-colors z-50">
//               <X size={24} strokeWidth={1.5} />
//             </button>

//             <motion.div
//               initial={{ scale: 0.95, opacity: 0, y: 10 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.95, opacity: 0, y: 10 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="relative max-w-7xl w-full flex flex-col items-center"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative w-full h-[65vh] md:h-[80vh] shadow-2xl bg-[#020617]">
//                  <Image
//                   src={selectedImage.imageUrl}
//                   alt={selectedImage.title}
//                   fill
//                   className="object-contain"
//                   unoptimized
//                 />
//               </div>
              
//               <div className="mt-8 text-center max-w-2xl">
//                 <div className="inline-flex items-center gap-3 mb-4">
//                   <div className="h-px w-8 bg-[#0D9488]"></div>
//                   <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase">
//                     {selectedImage.category}
//                   </span>
//                   <div className="h-px w-8 bg-[#0D9488]"></div>
//                 </div>
//                 <h2 className="text-white text-2xl md:text-3xl font-serif tracking-tight">
//                   {selectedImage.title}
//                 </h2>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Fetch Gallery Data
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.success) {
          setItems(json.gallery || []);
          setFilteredItems(json.gallery || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

  return (
    <section className="min-h-screen relative font-sans bg-[#F8FAFC] text-slate-900 selection:bg-[#0F172A] selection:text-white overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0D9488]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0D9488]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        
        {/* Header */}
        <div className="mb-20 space-y-6 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-serif text-[#0F172A] mb-4"
          >
            Visual <span className="italic text-[#0D9488]">Archive.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed font-light"
          >
            Immerse yourself in the vibrant life of our campus. 
            A curated collection of events, achievements, and everyday moments.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="sticky top-4 z-30 mb-12 flex justify-center md:justify-start">
          <div className="inline-flex flex-wrap gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 relative
                  ${selectedCategory === cat ? "text-white" : "text-slate-500 hover:text-[#0F172A]"}`}
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#0F172A] rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid - Optimized */}
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-[#0D9488]" size={40} />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={item._id}
                  className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Content */}
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold tracking-widest text-[#0D9488] bg-white/10 backdrop-blur-sm rounded uppercase border border-white/20">
                            {item.category}
                          </span>
                          <h3 className="text-white text-xl font-serif leading-tight drop-shadow-md">
                            {item.title}
                          </h3>
                        </div>
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="py-32 text-center text-slate-400">
            <p className="text-lg font-serif italic">No photos found in this category.</p>
          </div>
        )}
      </div>

      {/* Immersive Lightbox - Smooth */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50">
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[65vh] md:h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-black/20">
                 <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[#0D9488] text-[10px] font-bold tracking-widest uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                  {selectedImage.category}
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-serif tracking-tight">
                  {selectedImage.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}