"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { faculty } from "./data";
import SectionTitle from "../components/SectionTitle";
import FacultyCard from "../components/FacultyCard";
import CallToAction from "../components/CallToAction";
import { GraduationCap, Award, BookOpen } from "lucide-react";

// Mock Visiting Professors
const visitingProfessors = [
  {
    id: "vp-1",
    name: "Dr. Emily Chen",
    designation: "Visiting Professor, USA",
    specialization: "Genetic Screening",
    image: "https://placehold.co/400x400/e2e8f0/1B3A5B?text=Dr.+Emily",
  },
  {
    id: "vp-2",
    name: "Dr. Ahmed Khan",
    designation: "Guest Lecturer, UAE",
    specialization: "Male Infertility",
    image: "https://placehold.co/400x400/e2e8f0/1B3A5B?text=Dr.+Ahmed",
  },
  {
    id: "vp-3",
    name: "Dr. Sofia Rossi",
    designation: "Research Fellow, Italy",
    specialization: "Oocyte Biology",
    image: "https://placehold.co/400x400/e2e8f0/1B3A5B?text=Dr.+Sofia",
  },
];

export default function FacultyPage() {
  const founder = faculty.find((f) => f.slug === "dr-lenin-babu") || faculty[0];
  const otherFaculty = faculty.filter((f) => f.slug !== "dr-lenin-babu");

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. Page Header */}
      <section className="relative h-[300px] w-full bg-[#1B3A5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://placehold.co/1920x600/1B3A5B/FFFFFF?text=Faculty+Banner"
            alt="Faculty Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Mentors
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Learn from the pioneers of Clinical Embryology.
          </p>
        </div>
      </section>

      {/* 2. Dean/Founder Spotlight */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2">
            <div className="relative h-[400px] md:h-auto bg-gray-200">
              <Image
                src={founder.image || "/founder.webp"}
                alt={founder.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold mb-4 w-fit">
                Founder & Director
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B] mb-2">
                {founder.name}
              </h2>
              <p className="text-xl text-teal-600 mb-6">
                {founder.designation}
              </p>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {founder.bio}
              </p>

              <div className="space-y-3 mb-8">
                {founder.achievements.slice(0, 3).map((achievement, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <Award className="w-5 h-5 text-teal-500" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/faculty/${founder.slug}`}
                className="inline-block bg-[#1B3A5B] hover:bg-[#2c5a8a] text-white font-semibold py-3 px-8 rounded-lg transition-colors w-fit"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Faculty Directory (Grid) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Our Expert Faculty"
            subtitle="Dedicated professionals committed to your success."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {otherFaculty.map((f) => (
              <FacultyCard key={f.id} faculty={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Visiting Professors */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Visiting Professors"
            subtitle="Global experts who contribute to our curriculum."
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {visitingProfessors.map((vp) => (
              <div
                key={vp.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100"
              >
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 relative border-4 border-teal-50">
                  <Image
                    src={vp.image}
                    alt={vp.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#1B3A5B] mb-1">
                  {vp.name}
                </h3>
                <p className="text-teal-600 font-medium text-sm mb-2">
                  {vp.designation}
                </p>
                <p className="text-gray-500 text-sm">{vp.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Join Our Faculty CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-[#1B3A5B] rounded-2xl p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Join Our Faculty</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Are you an experienced embryologist passionate about teaching? We
              are always looking for dedicated mentors to join our team.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#1B3A5B] font-bold py-3 px-8 rounded-full hover:bg-teal-50 transition-colors"
            >
              Apply Now
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
    </main>
  );
}
