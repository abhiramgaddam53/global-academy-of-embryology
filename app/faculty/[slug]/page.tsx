// import { notFound } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { faculty } from "../data"; // Adjusted import path based on context

// // Generates static paths for all faculty members at build time
// export async function generateStaticParams() {
//   return faculty.map((member) => ({
//     slug: member.slug,
//   }));
// }

// export default async function FacultyProfile({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const doctor = faculty.find((d) => d.slug === slug);

//   if (!doctor) return notFound();

//   return (
//     <main className="bg-slate-50 text-slate-900 min-h-screen pt-24">
//       {/* TOP HERO PROFILE */}
//       <section className="bg-gradient-to-r from-[#336594] to-[#7edacc] text-white">
//         <div className="max-w-6xl mx-auto px-6 py-10">
//           {/* Breadcrumb + back */}
//           <div className="mb-6 flex items-center justify-between text-xs md:text-sm">
//             <div className="flex items-center gap-2 text-white/70">
//               <Link href="/" className="hover:text-white transition-colors">
//                 Home
//               </Link>
//               <span>/</span>
//               <Link href="/faculty" className="hover:text-white transition-colors">
//                 Faculty
//               </Link>
//               <span>/</span>
//               <span className="text-white font-medium">{doctor.name}</span>
//             </div>
//             <Link
//               href="/faculty"
//               className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
//             >
//               ← Back to faculty
//             </Link>
//           </div>

//           <div className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center">
//             {/* PHOTO */}
//             <div className="flex justify-center md:justify-start">
//               <div className="relative w-40 h-40 md:w-52 md:h-52 group">
//                 <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all duration-500" />
//                 <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#27B19B] shadow-2xl shadow-black/20 bg-slate-900">
//                   <Image
//                     src={doctor.image}
//                     alt={doctor.name}
//                     fill
//                     className="object-cover object-top"
//                     priority
//                     sizes="(max-width: 768px) 160px, 208px"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* BASIC INFO */}
//             <div className="space-y-4 text-center md:text-left">
//               <div>
//                 <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#A5F3FC] mb-2">
//                   Faculty • Embryology
//                 </p>
//                 <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
//                   {doctor.name}
//                 </h1>
//                 <p className="text-lg md:text-xl text-sky-50 font-medium">
//                   {doctor.designation}
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//                 <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-sm border border-white/10">
//                   <span className="w-2 h-2 rounded-full bg-[#27B19B] mr-2 animate-pulse" />
//                   {doctor.experience} Exp
//                 </span>
//                 <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-sm border border-white/10">
//                   {doctor.specialization}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* BODY */}
//       <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr,320px] gap-10">
//         {/* LEFT COLUMN */}
//         <div className="space-y-8">
//           {/* ABOUT */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//             <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <svg className="w-5 h-5 text-[#336594]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               Biography
//             </h2>
//             <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
//               {doctor.bio}
//             </p>
//           </div>

//           {/* EDUCATION */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//             <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <svg className="w-5 h-5 text-[#336594]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//               </svg>
//               Education
//             </h2>
//             <p className="text-slate-600 leading-relaxed font-medium">
//               {doctor.education}
//             </p>
//           </div>

//           {/* ACHIEVEMENTS */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//             <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <svg className="w-5 h-5 text-[#336594]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Key Contributions & Achievements
//             </h2>
//             <ul className="space-y-3">
//               {doctor.achievements.map((item, i) => (
//                 <li key={i} className="flex items-start gap-3 text-slate-600">
//                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#27B19B] flex-shrink-0" />
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* RIGHT SIDEBAR */}
//         <aside className="space-y-6">
//           {/* CONTACT CARD */}
//           <div className="rounded-2xl bg-[#336594] text-white p-6 shadow-lg relative overflow-hidden">
//             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
//             <h3 className="text-lg font-bold mb-4 relative z-10">Get in Touch</h3>
//             <div className="space-y-1 relative z-10">
//               <p className="text-xs uppercase tracking-wide text-sky-200">
//                 Email Address
//               </p>
//               <a href={`mailto:${doctor.email}`} className="text-lg font-medium hover:text-sky-200 transition-colors break-all">
//                 {doctor.email}
//               </a>
//             </div>
//           </div>

//           {/* QUICK SUMMARY */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
//               Details
//             </h3>
//             <dl className="space-y-4 text-sm">
//               <div>
//                 <dt className="text-slate-500 mb-1">Specialization</dt>
//                 <dd className="font-semibold text-slate-900">{doctor.specialization}</dd>
//               </div>
//               <div className="h-px bg-slate-100" />
//               <div>
//                 <dt className="text-slate-500 mb-1">Designation</dt>
//                 <dd className="font-semibold text-slate-900">{doctor.designation}</dd>
//               </div>
//               <div className="h-px bg-slate-100" />
//               <div>
//                 <dt className="text-slate-500 mb-1">Experience</dt>
//                 <dd className="font-semibold text-slate-900">{doctor.experience}</dd>
//               </div>
//             </dl>
//           </div>

//           <Link
//             href="/faculty"
//             className="flex items-center justify-center w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-4 rounded-xl transition-all"
//           >
//             ← View All Faculty
//           </Link>
//         </aside>
//       </section>
//     </main>
//   );
// }
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
// Generates paths for ALL faculty by converting their names to slugs on the fly
export async function generateStaticParams() {
  await connectToDB();
  const facultyMembers = await Faculty.find({}).select("name slug").lean();
  
  return facultyMembers.map((member: any) => ({
    // Use saved slug OR generate one from name
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
  // (This handles cases where 'slug' field is missing in DB)
  if (!doctor) {
    const allFaculty = await Faculty.find({}).lean();
    doctor = allFaculty.find((doc: any) => 
      (doc.slug === slug) || (generateSlug(doc.name) === slug)
    );
  }

  if (!doctor) return notFound();

  return (
    <main className="bg-white min-h-screen font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 bg-gradient- from-[#1a3052]   overflow-hidden">
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