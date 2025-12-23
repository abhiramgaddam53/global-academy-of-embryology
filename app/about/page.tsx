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
import AboutFounderSection from "../components/AboutFounderSection";
import Leadership from "../components/LeaderShip";

gsap.registerPlugin(ScrollTrigger);

/* ================= DATA ================= */
const stats = [
  { label: "Years of Excellence", target: 2, suffix: "+" },
  { label: "Active Members", target: 1000, suffix: "+" },
  { label: "Global Presence", target: 1, suffix: " Countries" },
  { label: "Scientific Events", target: 2, suffix: "+" },
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
     <AboutFounderSection/>
     <Leadership></Leadership>   

      {/* =========================================
          7. CTA: Global Fraternity
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