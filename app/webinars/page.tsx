"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, PlayCircle, Mic } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import WebinarCard, { Webinar } from "../components/WebinarCard";

// Mock Data
const featuredWebinar: Webinar = {
  id: "web-feat",
  title: "The Future of Embryo Selection: AI & Non-Invasive Testing",
  date: "Oct 30, 2025",
  time: "11:00 AM GMT",
  speaker: "Dr. Sarah Johnson",
  description:
    "Join us for an exclusive deep dive into the latest non-invasive preimplantation genetic testing (niPGT) technologies and how AI is reshaping embryo selection criteria.",
};

const upcomingWebinars: Webinar[] = [
  {
    id: "web-001",
    title: "Advanced Vitrification Techniques in ART",
    date: "Nov 05, 2025",
    time: "10:00 AM GMT",
    speaker: "Dr. Lenin Babu",
  },
  {
    id: "web-002",
    title: "Troubleshooting in the IVF Lab",
    date: "Nov 12, 2025",
    time: "2:00 PM GMT",
    speaker: "Dr. Ananya Reddy",
  },
  {
    id: "web-003",
    title: "Male Infertility: Sperm Selection Methods",
    date: "Nov 19, 2025",
    time: "11:00 AM GMT",
    speaker: "Dr. Ahmed Khan",
  },
  {
    id: "web-004",
    title: "Quality Control & KPI Management",
    date: "Nov 26, 2025",
    time: "3:00 PM GMT",
    speaker: "Dr. Emily Chen",
  },
];

const pastWebinars = [
  {
    id: "past-001",
    title: "Basics of Semen Analysis",
    date: "Sep 15, 2025",
    speaker: "Dr. Lenin Babu",
    thumbnail: "https://placehold.co/400x250/e2e8f0/1B3A5B?text=Semen+Analysis",
  },
  {
    id: "past-002",
    title: "Oocyte Retrieval Best Practices",
    date: "Aug 20, 2025",
    speaker: "Dr. Ananya Reddy",
    thumbnail:
      "https://placehold.co/400x250/e2e8f0/1B3A5B?text=Oocyte+Retrieval",
  },
  {
    id: "past-003",
    title: "Cryopreservation Fundamentals",
    date: "Jul 10, 2025",
    speaker: "Dr. Sarah Johnson",
    thumbnail:
      "https://placehold.co/400x250/e2e8f0/1B3A5B?text=Cryopreservation",
  },
];

export default function WebinarsPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. Page Header */}
      <section className="relative h-[300px] w-full bg-[#1B3A5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://placehold.co/1920x600/1B3A5B/FFFFFF?text=Webinars+Banner"
            alt="Webinars Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Knowledge Hub & Events
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay ahead with expert-led sessions on the latest in ART.
          </p>
        </div>
      </section>

      {/* 2. Featured Webinar (Hero) */}
      <section className="py-12 max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="md:w-1/2 relative min-h-[300px] bg-[#1B3A5B]">
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <PlayCircle className="w-32 h-32" />
            </div>
            <Image
              src="https://placehold.co/800x600/1B3A5B/FFFFFF?text=Featured+Event"
              alt="Featured Webinar"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold mb-4 w-fit uppercase tracking-wider">
              Next Live Event
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A5B] mb-4">
              {featuredWebinar.title}
            </h2>
            <p className="text-gray-600 mb-6">{featuredWebinar.description}</p>

            <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                <span>{featuredWebinar.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-500" />
                <span>{featuredWebinar.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                <span>{featuredWebinar.speaker}</span>
              </div>
            </div>

            <Link
              href={`/webinars?register=${featuredWebinar.id}`}
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Register for Free
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Schedule */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Upcoming Schedule"
            subtitle="Mark your calendars for these insightful sessions."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Past Webinars (Archive) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Past Webinars"
            subtitle="Watch recordings of our previous sessions."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {pastWebinars.map((webinar) => (
              <div
                key={webinar.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-2">
                    {webinar.date}
                  </div>
                  <h3 className="text-lg font-bold text-[#1B3A5B] mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {webinar.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    By {webinar.speaker}
                  </p>
                  <Link
                    href="/login" // Restricted access as per requirement
                    className="text-teal-600 font-semibold text-sm hover:underline"
                  >
                    Login to Watch &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Speaker Call */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#1B3A5B] to-[#2c5a8a] rounded-2xl p-10 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 p-6 rounded-full">
            <Mic className="w-12 h-12 text-teal-300" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              Want to present a topic?
            </h2>
            <p className="text-blue-100">
              We welcome experts to share their knowledge with our global
              community.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-white text-[#1B3A5B] font-bold py-3 px-8 rounded-full hover:bg-teal-50 transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
