import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Faculty } from "../faculty/data";

interface FacultyCardProps {
  faculty: Faculty;
}

export default function FacultyCard({ faculty }: FacultyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-64 w-full bg-gray-200">
        {/* Placeholder for image if not available or while loading */}
        <Image
          src={faculty.image || "/placeholder-doctor.jpg"}
          alt={faculty.name}
          fill
          className="object-cover object-top"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1B3A5B] mb-1">
          {faculty.name}
        </h3>
        <p className="text-teal-600 font-medium text-sm mb-2">
          {faculty.designation}
        </p>
        <p className="text-gray-500 text-xs mb-4">{faculty.education}</p>

        <div className="mt-auto">
          <Link
            href={`/faculty/${faculty.slug}`}
            className="text-[#1B3A5B] font-semibold text-sm hover:text-teal-600 flex items-center gap-1 transition-colors"
          >
            View Profile &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
