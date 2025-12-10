"use client"; 
import Link from "next/link";
import Image from "next/image"; 
import { faculty } from "./data"; 

export default function FacultyPage() {
   
  return (
    <main
       
      className="bg-white text-[#0F172A] min-h-screen pt-24"
    >
      {/* HEADER */}
      <section className="bg-blue-50    text-[#1B3A5B]">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center hero-content">
          <p className="text-xs uppercase tracking-[0.25em] text-[#1B3A5B]/80 mb-3">
            Faculty • Embryology & ART
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold mb-4">
            Our Faculty
          </h1>
          <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-600">
            Meet our team of experienced doctors and clinical embryologists
            who are shaping the future of reproductive medicine and assisted
            reproductive technology.
          </p>
        </div>
      </section>

      {/* FACULTY GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-6 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {faculty.length} faculty members</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((doc) => (
            <Link
              key={doc.id}
              href={`/faculty/${doc.slug}`}
              className="faculty-card group bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#27B19B]/70 transition duration-200 flex flex-col cursor-pointer"
            >
              {/* IMAGE */}
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 rounded-full bg-[#27B19B]/10 blur-xl group-hover:blur-2xl transition" />
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-200 border border-white shadow-sm">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* TEXT */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 text-slate-900">
                  {doc.name}
                </h3>

                <p className="text-xs uppercase tracking-wide text-[#27B19B] mb-1">
                  {doc.designation}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  {doc.specialization}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Experience: {doc.experience}
                </p>

                {/* Tags / highlights */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white border text-[11px] text-slate-600">
                    Clinical Embryologist
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border text-[11px] text-slate-600">
                    ART Specialist
                  </span>
                </div>

                <div className="mt-auto">
                  <span className="inline-flex items-center justify-center gap-1 text-xs font-medium rounded-full px-4 py-2 bg-[#27B19B] text-white group-hover:bg-[#1ea08b] transition">
                    View Full Profile
                    <span className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
