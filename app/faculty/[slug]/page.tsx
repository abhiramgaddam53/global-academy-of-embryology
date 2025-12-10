 
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { faculty } from "../data";

export default async function FacultyProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } =await params;
  const doctor =  faculty.find((d) => d.slug === slug);

  if (!doctor) return notFound();

  return (
    <main className="bg-slate-50 text-[#0F172A] min-h-screen pt-24">
      {/* TOP HERO PROFILE */}
      <section className="bg-gradient-to-r from-[#336594] to-[#7edacc]   text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Breadcrumb + back */}
          <div className="mb-6 flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/faculty" className="hover:text-white">
                Faculty
              </Link>
              <span>/</span>
              <span className="text-white">{doctor.name}</span>
            </div>
            <Link
              href="/faculty"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium hover:bg-white/15"
            >
              ← Back to faculty
            </Link>
          </div>

          <div className="grid md:grid-cols-[0.9fr,1.6fr] gap-10 items-center">
            {/* PHOTO */}
            <div className="flex justify-center md:justify-start">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-[#27B19B] shadow-xl shadow-black/30 bg-slate-900">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="space-y-3">
              <p className="uppercase tracking-[0.2em] text-xs text-[#A5F3FC]">
                Faculty • Embryology
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold">
                {doctor.name}
              </h1>
              <p className="text-sm md:text-base text-sky-100/90">
                {doctor.designation}
              </p>
              <p className="text-sm md:text-base text-sky-100/75">
                Specialization in {doctor.specialization}
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs md:text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 mr-2" />
                  {doctor.experience}
                </span>
                {doctor.achievements.slice(0, 2).map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs md:text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.7fr,0.9fr] gap-10">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* ABOUT */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-7 md:p-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {doctor.bio}
            </p>
          </div>

          {/* EDUCATION */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-7 md:p-8">
            <h2 className="text-lg font-semibold mb-3">Education</h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              {doctor.education}
            </p>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-7 md:p-8">
            <h2 className="text-lg font-semibold mb-3">Key Contributions</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-sm md:text-base text-slate-700">
              {doctor.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-7">
          {/* CONTACT CARD */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1B3A5B] to-[#27B19B] text-white p-7 shadow-md">
            <h3 className="text-base font-semibold mb-3">Contact</h3>
            <p className="text-xs uppercase tracking-wide text-white/70 mb-1">
              Academic / Professional Queries
            </p>
            <p className="text-sm break-all">{doctor.email}</p>
          </div>

          {/* QUICK INFO */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
            <h3 className="text-base font-semibold mb-4">Profile Summary</h3>
            <dl className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Designation</dt>
                <dd className="font-medium text-right">
                  {doctor.designation}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Specialization</dt>
                <dd className="font-medium text-right">
                  {doctor.specialization}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Experience</dt>
                <dd className="font-medium text-right">
                  {doctor.experience}
                </dd>
              </div>
            </dl>
          </div>

          {/* TAGS / FOCUS AREAS */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
            <h3 className="text-base font-semibold mb-3">
              Focus Areas in Embryology
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-3 py-1">
                Clinical Embryology
              </span>
              <span className="rounded-full bg-sky-50 text-sky-700 text-xs px-3 py-1">
                Assisted Reproductive Technology
              </span>
              <span className="rounded-full bg-slate-50 text-slate-700 text-xs px-3 py-1">
                Lab Quality & Standards
              </span>
            </div>
          </div>

          {/* BACK BUTTON */}
          <div className="text-center">
            <Link
              href="/faculty"
              className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-[#27B19B] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#1ea08b] transition"
            >
              ← Back to Faculty
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
