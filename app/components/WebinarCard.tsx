import React from "react";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";

export interface Webinar {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  image?: string;
  description?: string;
}

interface WebinarCardProps {
  webinar: Webinar;
}

export default function WebinarCard({ webinar }: WebinarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          <span>{webinar.date}</span>
          <span className="mx-1">•</span>
          <Clock className="w-4 h-4" />
          <span>{webinar.time}</span>
        </div>

        <h3 className="text-lg font-bold text-[#1B3A5B] mb-3 line-clamp-2">
          {webinar.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-6 mt-auto">
          <User className="w-4 h-4" />
          <span>{webinar.speaker}</span>
        </div>

        <Link
          href={`/webinars?register=${webinar.id}`}
          className="block w-full text-center bg-gray-50 hover:bg-[#1B3A5B] hover:text-white text-[#1B3A5B] font-semibold py-2 px-4 rounded-lg transition-colors border border-gray-200 hover:border-[#1B3A5B]"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}
