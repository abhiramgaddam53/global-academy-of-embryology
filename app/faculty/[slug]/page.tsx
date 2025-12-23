 

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  Mail, 
  Building2, 
  Clock 
} from "lucide-react";
import { connectToDB } from "@/lib/mongodb";
import Faculty from "@/app/models/Faculty";

// Helper to ensure consistent slug generation
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// 1. Generate Static Params 
export async function generateStaticParams() {
  await connectToDB();
  const facultyMembers = await Faculty.find({}).select("name slug").lean();
  
  return facultyMembers.map((member: any) => ({
    slug: member.slug || generateSlug(member.name),
  }));
}

// 2. Main Page Component
export default async function FacultyProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectToDB();
  
  // Strategy: 
  // 1. Try finding by exact slug match first
  let doctor = await Faculty.findOne({ slug }).lean();

  // 2. If not found, fetch ALL and find the one whose generated slug matches
  if (!doctor) {
    const allFaculty = await Faculty.find({}).lean();
    const found = allFaculty.find((doc: any) => 
      (doc.slug === slug) || (generateSlug(doc.name) === slug)
    );
    // ✅ FIX: Convert 'undefined' to 'null' to match Mongoose type
    doctor = found || null; 
  }

  if (!doctor) return notFound();

  return (
    <main className="bg-white min-h-screen font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 bg-[#020617] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <Image 
             src="/hero-bg.webp" 
             alt="Background" 
             fill
             className="object-cover opacity-20 mix-blend-overlay"
             unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* Breadcrumb / Back */}
          <div className="mb-12 flex items-center justify-between">
            <Link 
              href="/faculty"
              className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Faculty
            </Link>
          </div>

          <div className="grid md:grid-cols-[auto,1fr] gap-10 md:gap-16 items-end">
            
            {/* PROFILE IMAGE */}
            <div className="relative w-full max-w-[280px] aspect-[4/5] bg-slate-800 shadow-2xl border border-slate-700/50">
              <div className="absolute inset-0 bg-slate-800 animate-pulse" />
              <Image
                src={doctor.image || "/founder.webp"}
                alt={doctor.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {/* Decorative Corner */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 border-r-2 border-b-2 border-[#0D9488]" />
            </div>

            {/* HEADER INFO */}
            <div className="pb-2">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold text-[#0D9488] uppercase tracking-[0.2em] bg-[#0D9488]/10 border border-[#0D9488]/20">
                Faculty Profile
              </span>
              
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
                {doctor.name}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 font-light mb-8">
                {doctor.designation}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border border-white/10">
                   <Clock size={16} className="text-[#0D9488]" />
                   <span>{doctor.experience || "N/A"} Experience</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border border-white/10">
                   <Building2 size={16} className="text-[#0D9488]" />
                   <span>{doctor.specialization}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="container mx-auto px-6 py-20 relative z-20">
        <div className="grid lg:grid-cols-[1fr,360px] gap-16">
          
          {/* LEFT COLUMN: Bio & Details */}
          <div className="space-y-16">
            
            {/* Biography */}
            <div className="prose prose-lg max-w-none text-slate-600">
              <h2 className="text-2xl font-serif text-[#0F172A] mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                Biography
              </h2>
              <p className="whitespace-pre-line leading-relaxed font-light text-lg">
                {doctor.bio}
              </p>
            </div>

            {/* Education */}
            <div>
               <h2 className="text-2xl font-serif text-[#0F172A] mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                <GraduationCap className="text-[#0D9488]" strokeWidth={1.5} />
                Education & Credentials
              </h2>
              <div className="bg-[#F8FAFC] border-l-4 border-[#0D9488] p-6">
                <p className="text-lg text-slate-800 font-medium">{doctor.education}</p>
              </div>
            </div>

            {/* Achievements */}
            {doctor.achievements && doctor.achievements.length > 0 && (
              <div>
                 <h2 className="text-2xl font-serif text-[#0F172A] mb-8 flex items-center gap-3 border-b border-slate-200 pb-4">
                  <Award className="text-[#0D9488]" strokeWidth={1.5} />
                  Key Achievements
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {doctor.achievements.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 border border-slate-100 bg-white hover:border-[#0D9488]/30 transition-colors shadow-sm">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: Contact & Quick Info */}
          <aside className="space-y-8">
            
            {/* Contact Card */}
            <div className="bg-[#0F172A] text-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <h3 className="text-xl font-serif mb-6 relative z-10">Contact Information</h3>
               
               <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Email Address</p>
                    <a href={`mailto:${doctor.email}`} className="flex items-center gap-3 text-lg hover:text-[#2DD4BF] transition-colors break-all">
                       <Mail size={18} />
                       {doctor.email}
                    </a>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10">
                    <Link href="/contact" className="block w-full py-3 bg-[#0D9488] text-center text-xs font-bold uppercase tracking-widest hover:bg-[#14B8A6] transition-colors">
                       Request Appointment
                    </Link>
                 </div>
               </div>
            </div>

            {/* Additional Metadata Card */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#0F172A] mb-6">Profile Details</h3>
               <dl className="space-y-5 text-sm">
                  <div>
                     <dt className="text-slate-400 mb-1">Department</dt>
                     <dd className="font-medium text-slate-900">Clinical Embryology</dd>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div>
                     <dt className="text-slate-400 mb-1">Designation</dt>
                     <dd className="font-medium text-slate-900">{doctor.designation}</dd>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div>
                     <dt className="text-slate-400 mb-1">Status</dt>
                     <dd className="inline-flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Faculty
                     </dd>
                  </div>
               </dl>
            </div>

          </aside>

        </div>
      </section>
    </main>
  );
}