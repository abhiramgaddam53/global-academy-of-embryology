 
// app/components/FacultyCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Use 'any' if you want to avoid strict type imports, 
// or import the interface from your page file if preferred.
interface FacultyProps {
  slug: string;
  name: string;
  designation: string;
  specialization: string;
  education: string;
  bio:string;
  image: string;
}

export default function FacultyCard({ faculty }: { faculty: FacultyProps }) {
  return (
    <div className="group bg-white border border-slate-200 hover:border-[#0D9488]/50 transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-xl">
      
      {/* Image Section */}
      <div className="relative h-80 w-full bg-slate-100 overflow-hidden">
        <Image
          src={faculty.image || "/placeholder-doctor.jpg"}
          alt={faculty.name}
          fill
          className="object-cover object-top transition-all duration-700 group-hover:scale-105 md:grayscale md:group-hover:grayscale-0"
          unoptimized
        />
        <div className="absolute inset-0 bg-[#0F172A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow relative">
        
        {/* Designation Tag */}
        <div className="mb-4">
          <span className="inline-block text-[10px] font-bold text-[#0D9488] uppercase tracking-widest border border-[#0D9488]/20 px-2.5 py-1 bg-[#0D9488]/5">
             {faculty.designation}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-2xl font-serif text-[#0F172A] mb-2 group-hover:text-[#0D9488] transition-colors leading-tight">
          {faculty.name}
        </h3>

        {/* Specialization */}
        <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-4">
          {faculty.specialization}
        </p>
        
        {/* Education */}
        <p className="text-slate-400 text-md font-light mb-6 line-clamp-2 border-t border-slate-100 pt-4 mt-auto">
          {faculty.bio }
        </p>

        {/* Action */}
        <div className="mt-auto pt-4">
          <Link
            href={`/faculty/${faculty.slug}`}
            className="group/link inline-flex items-center text-[#0F172A] font-bold text-xs uppercase tracking-widest hover:text-[#0D9488] transition-colors"
          >
            Full Profile 
            <ArrowRight size={14} className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}