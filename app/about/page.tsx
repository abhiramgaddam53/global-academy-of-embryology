// "use client";

// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { 
//   Target, 
//   Eye, 
//   BookOpen, 
//   Microscope, 
//   Award, 
//   Users, 
//   Globe2, 
//   Lightbulb, 
//   ArrowRight 
// } from "lucide-react";
// import Navbar from "@/app/components/Navbar";

// gsap.registerPlugin(ScrollTrigger);

// /* ================= TYPES & DATA ================= */
// const stats = [
//   { label: "Years of Experience", target: 12, suffix: "+" },
//   { label: "Active Members", target: 6200, suffix: "+" },
//   { label: "Countries Reached", target: 48, suffix: "" },
//   { label: "Workshops & Webinars", target: 320, suffix: "+" },
// ];

// const pillars = [
//   {
//     icon: <BookOpen size={32} />,
//     title: "Education & Training",
//     text: "Webinars, workshops, and interactive sessions for continuous professional development.",
//   },
//   {
//     icon: <Microscope size={32} />,
//     title: "Innovation & Research",
//     text: "Encouraging embryologists to adopt cutting-edge tools and evidence-based research.",
//   },
//   {
//     icon: <Award size={32} />,
//     title: "Quality & Standards",
//     text: "Supporting labs in maintaining best practices in andrology, embryology, and compliance.",
//   },
//   {
//     icon: <Users size={32} />,
//     title: "Collaboration",
//     text: "Connecting embryologists, clinicians, and researchers across the globe.",
//   },
// ];

// export default function AboutPage() {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useLayoutEffect(() => {
//     if (!containerRef.current) return;

//     const ctx = gsap.context(() => {
//       // 1. HERO ANIMATION
//       gsap.from(".hero-content", {
//         opacity: 0,
//         y: 50,
//         duration: 1,
//         ease: "power3.out",
//         delay: 0.2,
//       });

//       // 2. IMAGE REVEALS (Story Section)
//       gsap.utils.toArray(".reveal-image").forEach((img: any) => {
//         gsap.from(img, {
//           scale: 0.9,
//           opacity: 0,
//           duration: 1,
//           scrollTrigger: {
//             trigger: img,
//             start: "top 85%",
//           },
//         });
//       });

//       // 3. STATS COUNT UP
//       const statElems = gsap.utils.toArray<HTMLElement>(".stat-number");
//       statElems.forEach((elem) => {
//         const target = Number(elem.dataset.target ?? "0");
//         const obj = { value: 0 };
//         gsap.to(obj, {
//           value: target,
//           duration: 2,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: elem,
//             start: "top 90%",
//             once: true,
//           },
//           onUpdate: () => {
//             elem.innerText = Math.floor(obj.value).toLocaleString();
//           },
//         });
//       });
 
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={containerRef} className="bg-white min-h-screen font-sans selection:bg-[#27B19B] selection:text-white">
//       <Navbar />

//       {/* ================= HERO SECTION ================= */}
//       <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
//         {/* Background Image with Overlay */}
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
//             alt="Laboratory Research" 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-[#1B3A5B]/80 mix-blend-multiply" />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5B] via-transparent to-transparent" />
//         </div>

//         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center hero-content text-white">
//           <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium mb-6">
//             <Globe2 size={16} className="text-[#27B19B]" />
//             Global Academy of Embryology
//           </div>
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
//             Transforming Knowledge <br />
//             <span className="text-[#27B19B]">Into Life.</span>
//           </h1>
//           <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
//             Empowering embryologists, clinicians, and scientists through world-class education, 
//             innovation, and global collaboration to shape the future of ART.
//           </p>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
//           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
//             <div className="w-1 h-2 bg-white rounded-full" />
//           </div>
//         </div>
//       </section>

//       {/* ================= THE STORY (Why & What Drives) ================= */}
//       <section className="py-24 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto space-y-24">
          
//           {/* Row 1: Why GAE */}
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B]">Why We Exist</h2>
//               <div className="w-20 h-1.5 bg-[#27B19B] rounded-full" />
//               <p className="text-gray-600 text-lg leading-relaxed">
//                 The field of embryology is the backbone of assisted reproductive technology (ART). 
//                 Despite its critical role, embryologists often lacked a unified platform globally 
//                 to share knowledge and grow together.
//               </p>
//               <p className="text-gray-600 text-lg leading-relaxed">
//                 <span className="font-semibold text-[#1B3A5B]">GAE was born from a vision:</span> to bring 
//                 embryologists, clinicians, and scientists under one roof to exchange insights, 
//                 encourage continuous learning, and ultimately improve patient outcomes.
//               </p>
//             </div>
//             <div className="relative reveal-image">
//               <div className="absolute -inset-4 bg-[#27B19B]/10 rounded-3xl transform rotate-3" />
//               <img 
//                 src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop" 
//                 alt="Medical Collaboration" 
//                 className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
//               />
//             </div>
//           </div>

//           {/* Row 2: What Drives Us */}
//           <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
//              <div className="relative order-2 lg:order-1 reveal-image">
//                <div className="absolute -inset-4 bg-[#1B3A5B]/10 rounded-3xl transform -rotate-3" />
//                <img 
//                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop" 
//                  alt="Lab Research" 
//                  className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
//                />
//             </div>
//             <div className="space-y-6 order-1 lg:order-2">
//               <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B]">What Drives Us</h2>
//               <div className="w-20 h-1.5 bg-[#27B19B] rounded-full" />
//               <ul className="space-y-4 mt-4">
//                 {[
//                   "A unified global learning ecosystem.",
//                   "Scientific excellence with ethical responsibility.",
//                   "Continuous professional growth and mentorship.",
//                   "Collaboration between labs and researchers."
//                 ].map((item, idx) => (
//                   <li key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
//                      <div className="mt-1 p-1 bg-[#27B19B]/10 rounded-full text-[#27B19B]">
//                         <Lightbulb size={18} />
//                      </div>
//                      <span className="text-gray-700 font-medium">{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= VISION & MISSION ================= */}
//       <section className="bg-[#1B3A5B] text-white py-24 relative overflow-hidden">
//         {/* Abstract Background Shapes */}
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#27B19B] opacity-10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        
//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 relative z-10">
//           {/* Vision */}
//           <div className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors duration-500">
//              <div className="w-14 h-14 bg-[#27B19B] rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-teal-900/50">
//                <Eye size={32} />
//              </div>
//              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
//              <p className="text-blue-100 leading-relaxed text-lg">
//                To be a global knowledge-sharing hub where embryology expertise is nurtured, 
//                strengthened, and advanced for the betterment of reproductive medicine 
//                and patient care worldwide.
//              </p>
//           </div>

//           {/* Mission */}
//           <div className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors duration-500">
//              <div className="w-14 h-14 bg-white text-[#1B3A5B] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
//                <Target size={32} />
//              </div>
//              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
//              <ul className="space-y-3 text-blue-100 text-lg">
//                <li className="flex gap-3"><span className="text-[#27B19B]">•</span> Promote high-quality education & training.</li>
//                <li className="flex gap-3"><span className="text-[#27B19B]">•</span> Bridge the gap between theory & practice.</li>
//                <li className="flex gap-3"><span className="text-[#27B19B]">•</span> Inspire scientific spirit & integrity.</li>
//              </ul>
//           </div>
//         </div>
//       </section>

//       {/* ================= STATS ================= */}
//       <section className="py-20 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             {stats.map((s, idx) => (
//               <div key={idx} className="text-center group">
//                 <h3 className="text-4xl md:text-5xl font-bold text-[#1B3A5B] mb-2 group-hover:text-[#27B19B] transition-colors">
//                   <span className="stat-number" data-target={s.target}>0</span>
//                   {s.suffix}
//                 </h3>
//                 <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= PILLARS ================= */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B] mb-4">The Pillars of GAE</h2>
//             <p className="text-gray-600 text-lg">
//               Education, innovation, quality, and collaboration — the core pillars shaping our contribution.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pillars-grid">
//             {pillars.map((pillar, idx) => (
//               <div key={idx} className="pillar-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
//                 <div className="w-12 h-12 bg-[#1B3A5B]/5 text-[#1B3A5B] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1B3A5B] group-hover:text-white transition-colors">
//                   {pillar.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-[#1B3A5B] mb-3">{pillar.title}</h3>
//                 <p className="text-gray-600 text-sm leading-relaxed">{pillar.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= FOUNDER ================= */}
//       <section className="py-24">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="bg-[#1B3A5B] rounded-3xl overflow-hidden shadow-2xl">
//             <div className="grid md:grid-cols-12">
              
//               {/* Image Side */}
//               <div className="md:col-span-4 lg:col-span-3 bg-gray-200 min-h-[300px] md:min-h-full relative">
//                 <img 
//                   src="/founder.webp" /* Replace with actual founder image */
//                   alt="Dr. Lenin Babu" 
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//               </div>

//               {/* Content Side */}
//               <div className="md:col-span-8 lg:col-span-9 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center">
//                 <div className="text-[#27B19B] font-bold tracking-widest uppercase mb-2">Founder & Director</div>
//                 <h2 className="text-3xl md:text-4xl font-bold mb-6">Dr. Lenin Babu</h2>
//                 <blockquote className="text-xl text-blue-100 italic mb-8 border-l-4 border-[#27B19B] pl-6 leading-relaxed">
//                   "Our goal is to create a legacy of knowledge that transcends borders, ensuring every embryologist has the tools to create life."
//                 </blockquote>
//                 <p className="text-gray-300 mb-8 max-w-2xl">
//                   With over [X] years of experience in clinical embryology, Dr. Babu established GAE to bridge the gap between academic theory and practical application in the IVF laboratory.
//                 </p>
//                 <div className="flex gap-4">
//                   <button className="flex items-center gap-2 text-[#27B19B] hover:text-white transition-colors font-semibold">
//                     Read Full Profile <ArrowRight size={18} />
//                   </button>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= ADVISORY BOARD ================= */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B] mb-4">Advisory Board</h2>
//           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
//             A distinguished panel of experts guiding our scientific and academic direction.
//           </p>

//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
//                 <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
//                   <img 
//                     src={`https://randomuser.me/api/portraits/med/men/${i+10}.jpg`} 
//                     alt="Advisor" 
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <h4 className="font-bold text-lg text-[#1B3A5B]">Dr. Advisor Name</h4>
//                 <p className="text-[#27B19B] text-xs font-bold uppercase tracking-wide mb-2">Scientific Lead</p>
//                 <p className="text-gray-500 text-sm">
//                   Senior Clinical Embryologist with expertise in Cryobiology.
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= FINAL CTA ================= */}
//       <section className="py-24 relative overflow-hidden">
//         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
//           <h2 className="text-3xl md:text-5xl font-bold text-[#1B3A5B] mb-6">
//             Shape the Future of Embryology
//           </h2>
//           <p className="text-gray-600 text-lg mb-10 leading-relaxed">
//             Join a global network of professionals. Participate in webinars, access exclusive resources, and collaborate on groundbreaking research.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a href="/register" className="px-8 py-4 bg-[#27B19B] text-white rounded-full font-bold hover:bg-[#1f9683] transition-colors shadow-lg shadow-teal-500/30">
//               Become a Member
//             </a>
//             <a href="/webinars" className="px-8 py-4 bg-white text-[#1B3A5B] border border-gray-200 rounded-full font-bold hover:border-[#1B3A5B] transition-colors">
//               Explore Events
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Target, 
  Eye, 
  BookOpen, 
  Microscope, 
  Award, 
  Users, 
  Globe, 
  ArrowRight 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ================= DATA ================= */
const stats = [
  { label: "Years of Excellence", target: 12, suffix: "+" },
  { label: "Active Members", target: 6200, suffix: "+" },
  { label: "Global Presence", target: 48, suffix: " Countries" },
  { label: "Scientific Events", target: 320, suffix: "+" },
];

const pillars = [
  {
    icon: <BookOpen size={24} />,
    title: "Education",
    text: "Structured academic pathways bridging theoretical gaps.",
  },
  {
    icon: <Microscope size={24} />,
    title: "Research",
    text: "Pioneering evidence-based embryological advancements.",
  },
  {
    icon: <Award size={24} />,
    title: "Standards",
    text: "Establishing universal protocols for IVF laboratories.",
  },
  {
    icon: <Users size={24} />,
    title: "Fraternity",
    text: "A unified global network of clinical specialists.",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. HERO ANIMATION
      gsap.from(".hero-text", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      });

      // 2. STATS COUNT UP
      const statElems = gsap.utils.toArray<HTMLElement>(".stat-number");
      statElems.forEach((elem) => {
        const target = Number(elem.dataset.target ?? "0");
        const obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            elem.innerText = Math.floor(obj.value).toLocaleString();
          },
        });
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white min-h-screen md:mt-12 font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">

      {/* =========================================
          1. HERO: Cinematic & Authoritative
      ========================================= */}
      <section className="relative h-[70vh]  flex flex-col justify-end pb-16 md:pb-24 overflow-hidden bg-[#020617]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
            alt="Laboratory Research" 
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl border-l-2 border-[#0D9488] pl-6 md:pl-10 hero-text">
            <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-xs font-bold mb-6">
              Our Origin Story
            </p>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              The Heart of <br />
              <span className="text-[#CBD5E1] font-light italic">Science.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light hero-text">
              We are building the infrastructure for the next generation of embryologists. A convergence of ethics, skill, and technology.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          2. STATS STRIP: Clean & Minimal
      ========================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-x border-slate-100">
            {stats.map((s, idx) => (
              <div key={idx} className="py-12 px-4 text-center group hover:bg-[#F8FAFC] transition-colors">
                <h3 className="text-4xl md:text-5xl font-serif text-[#0F172A] mb-2">
                  <span className="stat-number" data-target={s.target}>0</span>
                  <span className="text-[#0D9488] text-2xl align-top">{s.suffix}</span>
                </h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. NARRATIVE: Editorial Style
      ========================================= */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
             
             {/* Sticky Header */}
             <div className="lg:sticky lg:top-24">
               <span className="block text-[#0D9488] font-bold uppercase text-xs tracking-widest mb-4">Why We Exist</span>
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#0F172A] leading-tight mb-8">
                 Bridging the gap <br/> 
                 between <span className="italic text-[#64748B]">theory</span> and <br/>
                 <span className="italic text-[#64748B]">practice.</span>
               </h2>
             </div>
             
             {/* Text Content */}
             <div className="space-y-8 text-lg md:text-xl text-slate-600 font-light leading-relaxed">
               <p>
                 <strong className="text-[#0F172A] font-medium">Embryology is the backbone of ART.</strong> Yet, for decades, the field lacked a unified global platform for standardization.
               </p>
               <p>
                 The Global Academy of Embryology (GAE) was born from a singular vision: to bring embryologists, clinicians, and scientists under one roof. We recognized that while technology advances rapidly, the dissemination of that knowledge remains siloed.
               </p>
               <p>
                 Our mandate is to dismantle these silos. By fostering a culture of continuous mentorship and evidence-based practice, we ensure that patient outcomes are improved not by chance, but by design.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          4. VISION & MISSION: High Contrast
      ========================================= */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
         {/* Background Subtle Effect */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0D9488]/5 rounded-full blur-[120px] pointer-events-none" />

         <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
               
               {/* Vision */}
               <div className="group">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0D9488] transition-colors duration-500">
                     <Eye size={24} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-serif mb-4">Our Vision</h3>
                  <p className="text-slate-400 leading-relaxed font-light text-lg">
                     To be the world’s premier knowledge-sharing hub, where embryological expertise is nurtured, standardized, and advanced for the betterment of reproductive medicine globally.
                  </p>
               </div>

               {/* Mission */}
               <div className="group">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0D9488] transition-colors duration-500">
                     <Target size={24} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-serif mb-4">Our Mission</h3>
                  <ul className="space-y-4 text-slate-400 font-light text-lg">
                     <li className="flex gap-4">
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2.5 shrink-0" />
                        Promote high-quality, standardized education.
                     </li>
                     <li className="flex gap-4">
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2.5 shrink-0" />
                        Cultivate scientific integrity and ethical responsibility.
                     </li>
                     <li className="flex gap-4">
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2.5 shrink-0" />
                        Facilitate global collaboration across labs.
                     </li>
                  </ul>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          5. PILLARS: Grid Layout (Matches Home)
      ========================================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-xl">
               <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] mb-4">The Four Pillars</h2>
               <p className="text-slate-500 font-light">
                 The foundational elements that define our contribution to the scientific community.
               </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="group bg-[#F8FAFC] p-8 border border-slate-100 hover:border-[#0D9488]/30 transition-all duration-300">
                <div className="w-10 h-10 bg-white text-[#0F172A] border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] transition-colors">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-serif text-[#0F172A] mb-3">{pillar.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          6. FOUNDER: Editorial Layout
      ========================================= */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
               
               {/* Image */}
               <div className="md:col-span-5 lg:col-span-4 order-2 md:order-1 relative">
                  <div className="aspect-[3/4] bg-slate-100 relative md:grayscale md:hover:grayscale-0 transition-all duration-700">
                     <Image 
                        src="/founder.webp" 
                        alt="Founder" 
                        fill 
                        className="object-cover"
                        unoptimized
                     />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl border border-slate-100 hidden md:block">
                     <p className="font-serif text-lg text-[#0F172A]">Dr. V.Lenin Babu</p>
                     <p className="text-[#0D9488] text-xs uppercase tracking-wider font-bold mt-1">Founder</p>
                  </div>
               </div>

               {/* Content */}
               <div className="md:col-span-7 lg:col-span-8 order-1 md:order-2 md:pl-12">
                  <span className="text-[#0D9488] font-bold tracking-widest uppercase text-xs mb-4 block">Director's Message</span>
                  <blockquote className="text-3xl md:text-4xl font-serif text-[#0F172A] leading-tight mb-8">
                     "We aim to create a legacy where knowledge transcends borders. Every embryologist deserves the tools to create life with precision."
                  </blockquote>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                     With over two decades of experience in clinical embryology, Dr. Babu established GAE to standardize protocols and provide a platform for continuous professional development in the IVF laboratory.
                  </p>
                  <Link href="/contact" className="inline-flex items-center text-[#0F172A] font-bold uppercase text-xs tracking-widest border-b border-[#0F172A] pb-1 hover:text-[#0D9488] hover:border-[#0D9488] transition-colors">
                     Contact The Director
                  </Link>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          7. ADVISORY BOARD: Clean List
      ========================================= */}
    

      {/* =========================================
          8. CTA: Global Fraternity
      ========================================= */}
      <section className="py-24 bg-white border-t border-slate-200">
         <div className="container mx-auto px-6 text-center max-w-3xl">
            <Globe size={40} className="mx-auto text-[#0F172A] mb-6" strokeWidth={1} />
            <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] mb-6">Shape the Future of Embryology</h2>
            <p className="text-slate-600 text-lg font-light mb-10 leading-relaxed">
              Join a global network of professionals. Participate in webinars, access exclusive resources, and collaborate on groundbreaking research.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="px-10 py-4 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1E293B] transition-colors shadow-lg">
                  Become a Member
               </Link>
               <Link href="/webinars" className="px-10 py-4 bg-white border border-slate-200 text-[#0F172A] text-xs font-bold uppercase tracking-widest hover:border-[#0F172A] transition-colors">
                  Explore Events
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}