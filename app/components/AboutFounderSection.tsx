"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, FileText, ArrowRight } from "lucide-react";

export default function AboutFounderSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-white border-t border-slate-100 relative">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-start">
               
               {/* --- IMAGE COLUMN (Now stays perfectly aligned) --- */}
               <div className="md:col-span-5 lg:col-span-4 order-2 md:order-1 relative sticky top-24">
                  <div className="aspect-square  bg-slate-100 relative md:grayscale md:hover:grayscale-0 transition-all duration-700">
                     <Image 
                        src="/founder.webp" 
                        alt="Dr. V. Lenin Babu" 
                        fill 
                        className="object-cover"
                        unoptimized
                     />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl border border-slate-100 hidden md:block">
                     <p className="font-serif text-lg text-[#0F172A]">Dr. V. Lenin Babu</p>
                     <p className="text-[#0D9488] text-xs uppercase tracking-wider font-bold mt-1">Founder - GAE</p>
                  </div>
               </div>

               {/* --- TEXT COLUMN (Preview Only) --- */}
               <div className="md:col-span-7 lg:col-span-8 order-1 md:order-2 md:pl-12">
                  <span className="text-[#0D9488] font-bold tracking-widest uppercase text-xs mb-6 block">Founder's Message</span>
                  
                  {/* The Hook Quote */}
                  <blockquote className="text-2xl md:text-3xl font-serif text-[#0F172A] leading-relaxed mb-8 italic">
                     "Embryology is the silent backbone of Assisted Reproductive Technology—where precision, science, ethics and responsibility converge to create life."
                  </blockquote>

                  {/* Short Teaser Paragraph */}
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                     Welcome to the Global Academy of Embryology. As an embryologist, I strongly believe that continuous learning, strong fundamentals, and ethical laboratory practices are the true drivers of successful ART outcomes.
                  </p>

                  {/* READ MORE BUTTON */}
                  <div className="flex flex-wrap gap-6 items-center">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-[#0D9488] transition-colors"
                    >
                        Read Full Message <FileText size={16} />
                    </button>

                    <Link href="/contact" className="inline-flex items-center text-[#0F172A] font-bold uppercase text-xs tracking-widest border-b border-[#0F172A] pb-1 hover:text-[#0D9488] hover:border-[#0D9488] transition-colors">
                        Contact The Director
                    </Link>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          FULL MESSAGE MODAL (Popup)
      ========================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h3 className="font-serif text-2xl text-[#0F172A]">Founder's Address</h3>
                        <p className="text-slate-500 text-sm">Dr. V. Lenin Babu</p>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-slate-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                    <div className="prose prose-slate max-w-none text-slate-600 font-light leading-relaxed space-y-6">
                        <p>Welcome to the Global Academy of Embryology.</p>
                        <p>Embryology is the silent backbone of Assisted Reproductive Technology - where precision, science, ethics and responsibility converge to create life. As an embryologist, I strongly believe that continuous learning, strong fundamentals, and ethical laboratory practices are the true drivers of successful ART outcomes.</p>
                        <p>During my own learning journey in embryology, knowledge was primarily passed from seniors to juniors through observation, discussion, and hands-on experience. Structured online learning platforms were not available, and access to quality training largely depended on the mentorship and environment one was exposed to.</p>
                        <p>Today, while information is abundantly available online, there remains a growing need for credible, structured, and clinically relevant embryology education. This evolution in learning, along with the importance of preserving traditional mentorship, became a key inspiration behind the establishment of the Global Academy of Embryology.</p>
                        <p>The Global Academy of Embryology was founded with a clear purpose—to create a dedicated cloud-based academic platform by embryologists, for embryologists. Through this initiative, we aim to support and educate budding embryologists by connecting them with pioneers and experienced professionals in the fraternity, ensuring guided, evidence-based and practice-oriented learning.</p>
                        <p>Our vision is to bridge the gap between theoretical knowledge and real-world laboratory practice. Through webinars, structured academic programs, case-based discussions, updates on ART laws, and practical scientific insights, we strive to empower embryologists at every stage of their professional journey—from students and interns to senior laboratory leaders.</p>
                        
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-[#0F172A] mb-4 text-sm uppercase tracking-widest">We are committed to promoting:</h4>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {["Evidence-based embryology", "Standardized laboratory practices", "Ethical and legal awareness in ART", "Continuous skill enhancement"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 bg-[#0D9488] rounded-full" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p>The launch of our website on the occasion of our second webinar marks an important milestone in this journey. This platform is envisioned as a growing hub for learning, collaboration and professional development for the global embryology community.</p>
                        <p>I warmly invite you to be part of this academic movement - to learn, share, grow and contribute to shaping the future of embryology together.</p>
                        <p className="font-serif text-[#0F172A] text-xl italic">"Let us elevate embryology through knowledge, integrity and excellence."</p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <p className="text-slate-400 text-sm">Warm regards,</p>
                        <p className="text-[#0F172A] font-bold text-xl font-serif mt-1">Dr. V. Lenin Babu</p>
                        <p className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">Founder - GAE</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-slate-500 hover:text-[#0F172A] text-sm font-medium"
                    >
                        Close Message
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}