"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import FacultyCard from "@/app/components/FacultyCard";
import { Loader2, Users } from "lucide-react";
import Image from "next/image";

// Define the type based on your API response
export interface FacultyMember {
  _id: string; // MongoDB ID
  slug: string; // Ensure your API returns this or generate it
  name: string;
  designation: string;
  specialization: string;
  experience: string;
  image: string;
  education: string;
  bio: string;
  achievements: string[];
  email: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("/api/faculty");
        const json = await res.json();
        
        if (json.success) {
          // Map API data to ensure it matches the FacultyCard props structure if needed
          // Assuming API returns array in json.data or json.faculty
          const data = Array.isArray(json.data) ? json.data : (json.faculty || []);
          
          // Generate slug if missing (temporary fix, ideally API sends it)
          const processedData = data.map((member: any) => ({
            ...member,
            id: member._id,
            slug: member.slug || member.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          }));
          
          setFaculty(processedData);
        }
      } catch (err) {
        console.error("Failed to fetch faculty", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculty();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[#020617]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
             src="/hero-bg.webp" 
             alt="Faculty Background" 
             fill
             className="object-cover opacity-40 mix-blend-overlay"
             unoptimized
          />
          <div className="absolute inset-0  bg-gradient-to-t from-[#18417f] via-[#0f3162]  to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-xs font-bold mb-6 animate-fade-in">
             World-Class Expertise
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            Our <span className="italic font-light text-slate-400">Faculty.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Meet the pioneers, researchers, and clinical specialists shaping the global standards of embryology education.
          </p>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 -mt-24 relative z-20">
          
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-xl">
              <Loader2 className="animate-spin text-[#0D9488] mb-4" size={40} />
              <p className="text-slate-500 font-serif italic">Loading faculty profiles...</p>
            </div>
          ) : faculty.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((member) => (
                <div key={member._id} className="h-full">
                   {/* Using the consistent FacultyCard component */}
                   <FacultyCard faculty={member} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-serif text-[#0F172A] mb-2">No Faculty Found</h3>
              <p className="text-slate-500 font-light">Our list of experts is currently being updated.</p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}