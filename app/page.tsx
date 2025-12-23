import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Globe, ChevronRight, Calendar, Microscope, Users } from "lucide-react";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import Faculty from "@/app/models/Faculty";
import Leadership from "./components/LeaderShip";

export const revalidate = 300;  
export const dynamic = "force-dynamic"; 
// --- Data Fetching ---
async function getHomeData() {
  try {
    await connectToDB();

    // Fetch Webinars (Next 3 upcoming)
    const webinars = await Webinar.find({ dateTime: { $gte: new Date() } })
      .sort({ dateTime: 1 })
      .limit(3)
      .lean();

    // Fetch Visionaries  
    const visionaries = await Faculty.find({ 
      designation: { $regex: /Founder|Director|Chairman|President/i } 
    })
    .limit(3)
    .lean();

    return { webinars, visionaries };
  } catch (error) {
    return { webinars: [], visionaries: [] };
  }
}

export default async function HomePage() {
  const { webinars, visionaries } = await getHomeData();

  return (
    <main className="min-h-screen md:mt-20 bg-white text-slate-900 selection:bg-[#0F172A] selection:text-white font-sans">
      
      {/* =========================================
          1. HERO: Authority & Genesis
          (Matches About Page Hero Style)
      ========================================= */}
      <section className="relative h-[92vh] flex flex-col justify-end pb-20 md:pb-32 overflow-hidden bg-[#020617]">
        
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://www.illumefertility.com/hubfs/ditl-embryologist.jpg" 
            alt="Embryology Laboratory"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
            unoptimized
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl border-l-2 border-[#0D9488] pl-6 md:pl-10">
            {/* Badge */}
           
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
              The Science of <br />
              <span className="text-[#CBD5E1] font-light italic">Creation.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light mb-10">
              Unifying global standards in clinical embryology. We are a collective dedicated to the ethical, scientific, and technological advancement of assisted reproduction.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-5">
               <Link 
                  href="/webinars" 
                  className="px-8 py-4 bg-white text-[#0F172A] font-bold uppercase text-xs tracking-widest hover:bg-[#2DD4BF] hover:text-[#0F172A] transition-all duration-300"
               >
                Our Programs
               </Link>
               <Link 
                  href="/about" 
                  className="px-8 py-4 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
               >
                 Our Manifesto
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. MISSION: Guardians of Tomorrow (Fixed)
      ========================================= */}
      <section className="py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
             
             {/* Left: The Statement */}
              
             

             <div className="lg:sticky lg:top-24">
               <span className="block text-[#0D9488] font-bold uppercase text-xs tracking-widest mb-4">Why We Exist</span>
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#0F172A] leading-tight mb-8">
               We are the <br/> 
               guardians of <br/>
                 <span className="italic text-[#64748B]">tomorrow.</span>
               </h2>
             </div>             
             
             {/* Right: The Narrative */}
             <div className="space-y-8 lg:pt-8 text-lg md:text-xl text-slate-600 font-light leading-relaxed">
               <p>
                 <strong className="text-[#0F172A] font-medium">Embryology is not merely a technical skill.</strong> It is a profound responsibility. Every decision made in the laboratory echoes through generations.
               </p>
               <p>
                 Yet, globally, the field is fragmented. Standards vary. Access to elite knowledge is siloed. The GAE was formed to bridge this divide.
               </p>
               <p>
                 We are not just an institute; we are a global body striving to harmonize clinical practices and build a fraternity of ethical leaders.
               </p>
               
               <div className="pt-4">
                 <Link href="/about" className="group inline-flex items-center text-[#0F172A] font-bold uppercase text-xs tracking-widest hover:text-[#0D9488] transition-colors border-b border-[#0F172A] pb-1 hover:border-[#0D9488]">
                    Read Full Vision <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. AGENDA: Upcoming Webinars (Swiss Style)
      ========================================= */}
      <section className="bg-white">
        <div className="container mx-auto px-0 md:px-6">
          
          {/* Section Header */}
          <div className="p-6 md:p-12 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-end gap-4">
             <div>
               <h2 className="text-3xl md:text-5xl font-serif text-[#0F172A]">Symposia Calendar</h2>
               <p className="text-slate-500 mt-2">Knowledge exchange and live scientific discourse.</p>
             </div>
             <Link href="/webinars" className="text-xs font-bold uppercase tracking-widest text-[#0D9488] hover:underline">
               View Full Schedule
             </Link>
          </div>

          {/* List View (Professional) */}
          <div className="divide-y divide-slate-200 border-b border-slate-200">
            {webinars.length > 0 ? webinars.map((webinar: any, i: number) => (
              <div key={webinar._id} className="group relative grid grid-cols-1 md:grid-cols-12 hover:bg-[#F0FDFA] transition-colors">
                 
                 {/* 1. Date */}
                 <div className="md:col-span-3 p-6 md:p-10 flex flex-row md:flex-col items-baseline md:items-start gap-3 border-r-0 md:border-r border-slate-100">
                    <span className="text-3xl md:text-4xl font-serif text-[#0F172A] font-medium">
                      {new Date(webinar.dateTime).getDate()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
                       {new Date(webinar.dateTime).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                 </div>

                 {/* 2. Details */}
                 <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Session</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-[#0F172A] mb-3 group-hover:text-[#0D9488] transition-colors">
                      {webinar.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-light">
                      {webinar.description}
                    </p>
                 </div>

                 {/* 3. Action */}
                 <div className="md:col-span-2 p-6 md:p-10 flex items-center justify-start md:justify-center">
                    <Link href="/webinars" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#0F172A] group-hover:border-[#0F172A] group-hover:text-white transition-all">
                       <ArrowUpRight strokeWidth={1.5} />
                    </Link>
                 </div>
                 
                 {/* Clickable Overlay */}
                 <Link href={`/webinars`} className="absolute inset-0" aria-label="View Details"></Link>
              </div>
            )) : (
              <div className="p-16 text-center text-slate-400 font-serif italic">
                No upcoming symposia currently scheduled.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          4. MESSAGES: Editorial Layout
      ========================================= */}
      <section className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             
             {/* Left: The Letter */}
             <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-10 bg-[#2DD4BF]"></div>
                  <span className="text-[#2DD4BF] font-bold tracking-widest uppercase text-xs">Founder's Message</span>
               </div>
               
               {/* Updated: Using text-lg for better readability of longer text 
                  and maintaining the exact wording provided.
               */}
               <div className="space-y-6 font-serif text-lg md:text-xl leading-relaxed text-slate-200 italic mb-8">
                 <p>
                   "Embryology is the silent backbone of Assisted Reproductive Technology - where precision, science, ethics and responsibility converge to create life. As an embryologist, I strongly believe that continuous learning, strong fundamentals, and ethical laboratory practices are the true drivers of successful ART outcomes."
                 </p>
                 <p>
                   "During my own learning journey in embryology, knowledge was primarily passed from seniors to juniors through observation, discussion, and hands-on experience. Structured online learning platforms were not available, and access to quality training largely depended on the mentorship and environment one was exposed to."
                 </p>
               </div>
               
               <div className="space-y-1 text-slate-400 font-light">
                 <p className="text-white font-medium text-lg">Dr. V. Lenin Babu</p>
                 <p className="text-xs uppercase tracking-wider text-[#2DD4BF] font-bold">Founder - GAE</p>
               </div>

               <div className="mt-8">
                 <Link href="/about" className="px-8 py-3 border border-white/20 hover:bg-white hover:text-[#0F172A] transition-all text-xs font-bold uppercase tracking-widest inline-block">
                   Read Full Letter
                 </Link>
               </div>
             </div> 

             {/* Right: The Image (Clean, Professional) */}
             <div className="relative">
                <div className="aspect-4/5  relative bg-white/5 border border-white/10 p-2">
                   <div className="relative w-full h-full overflow-hidden md:grayscale md:hover:grayscale-0 transition-all duration-700">
                      <Image 
                        src="/founder.webp" 
                        alt="Dr.V.Lenin Babu" 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. GOVERNING COUNCIL: Clean Grid
      ========================================= */}
       <section className="py-24 bg-[#F8FAFC] border-t border-slate-200">
        <div className="container mx-auto px-6">
        <div className="container mx-auto px-6">
  <div className="text-center mb-16 max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] mb-6">
      Visionaries Behind GAE
    </h2>
    
    <p className="text-xl  md:text-2xl font-serif italic text-[#1B3A5B] leading-relaxed relative inline-block">
      <span className="text-[#27B19B] opacity-40 mr-2">"</span>

      <span className="bg-[#42ecd0]/20 " >  This is not just an organization, but a family of embryologists united for a cause.</span>
      <span className="text-[#27B19B] opacity-40 ml-2">"</span>
    </p>
  </div>
</div>

<div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-8">
  {[
    {
      name: "Mr. V. Hemanth",
      role: "Associate Founder",
      desc: "Visionary Leader",
      image: "/Dr_V-Hemanth.webp"
    },
    {
      name: "Mr. Fyzullah Syed",
      role: "Associate Founder",
      desc: "Visionary Leader",
      image: "/Fyzullah-Syed.webp"
    },
    {
      name: "Mr. B. Siddesh",
      role: "Co-Founder",
      desc: "Visionary Leader",
      image: "/B-Siddesh.webp"
    },
    {
      name: "Mr. Balu",
      role: "Co-Founder",
      desc: "Strategic Operations",
      image: "/Dr-Balu.webp"
    },
    {
      name: "Mr. Nishanth Singh",
      role: "Co-Founder",
      desc: "Technical Director",
      image: "/Nishanth-Singh.webp"
    },
    {
      name: "Mr. P. Midhun Chakravarthy",
      role: "Founding Member",
      desc: "Core Initiative Lead",
      image: "/Midhun-Chakravarthy.jpeg"
    },
    {
      name: "Dr. Swapna Srinath",
      role: "Chief Clinical Advisor",
      desc: "Clinical Excellence",
      image: "/Dr_Swapna-Srinath.webp"
    },
    {
      name: "Dr. Charulata Chatterjee",
      role: "Chief Scientific Advisor",
      desc: "Research & Innovation",
      image: "/Dr_Charulata-Chatterjee.webp"
    },
    {
      name: "Mr. T. Suresh Kumar",
      role: "Advisor – Embryology",
      desc: "Senior Embryologist",
      image: "/Suresh-Kumar.webp"
    },
     
  ].map((member, index) => (
    <div
      key={index}
      className="bg-white p-6 border border-slate-200 hover:border-[#0D9488]/50 transition-colors group text-center"
    >
      <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden transition-all duration-500 relative">
        {member.image ? (
           <img 
             src={member.image || ""} 
             alt={member.name || ""} 
             className="w-full h-full object-cover" 
           />
        ) : (
           <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-300">
             <Users size={24} />
           </div>
        )}
      </div>
      <h4 className="font-serif text-lg text-[#0F172A] mb-1">{member.name || ""}</h4>
      <p className="text-[#0D9488] text-[10px] font-bold uppercase tracking-widest mb-2">
        {member.role || ""}
      </p>
      <p className="text-slate-500 text-sm font-light">{member.desc || ""}</p>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* =========================================
          6. FOOTER CTA: Membership
      ========================================= */}
       

    </main>
  );
}