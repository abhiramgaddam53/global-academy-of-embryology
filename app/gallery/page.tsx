"use client";

import React from "react";
import Image from "next/image";
import { Play, Instagram } from "lucide-react";
import SectionTitle from "../components/SectionTitle";

// Mock Data
const labPhotos = [
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Lab+Training+1",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Microscope+Work",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Student+Group",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Lab+Equipment",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Hands-on+Session",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Certification+Day",
];

const conferencePhotos = [
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Conference+2024",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Keynote+Speech",
  "https://placehold.co/600x400/e2e8f0/1B3A5B?text=Networking+Event",
];

const videos = [
  {
    id: "vid-1",
    title: "ICSI Workshop Highlights",
    thumbnail: "https://placehold.co/600x340/1B3A5B/FFFFFF?text=ICSI+Workshop",
  },
  {
    id: "vid-2",
    title: "Student Testimonials 2024",
    thumbnail: "https://placehold.co/600x340/1B3A5B/FFFFFF?text=Testimonials",
  },
];

export default function GalleryPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. Page Header */}
      <section className="relative h-[300px] w-full bg-[#1B3A5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://placehold.co/1920x600/1B3A5B/FFFFFF?text=Gallery+Banner"
            alt="Gallery Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Life at GAE</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A glimpse into our world of learning, innovation, and community.
          </p>
        </div>
      </section>

      {/* 2. Training & Labs */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <SectionTitle
          title="Training & Labs"
          subtitle="Hands-on experience in our state-of-the-art facilities."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labPhotos.map((src, idx) => (
            <div
              key={idx}
              className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <Image
                src={src}
                alt={`Lab Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Conferences & Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Conferences & Events"
            subtitle="Connecting with the global scientific community."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {conferencePhotos.map((src, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <Image
                  src={src}
                  alt={`Conference Photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Video Highlights */}
      <section className="py-20 bg-[#1B3A5B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Video Highlights
            </h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mb-4" />
            <p className="text-blue-200">
              Watch our students and faculty in action.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white/10 rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
              >
                <div className="relative h-[300px] w-full">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Instagram Feed (Optional Placeholder) */}
      <section className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-8 text-[#1B3A5B]">
          <Instagram className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Follow Us on Instagram</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden group"
            >
              <Image
                src={`https://placehold.co/400x400/e2e8f0/1B3A5B?text=Insta+Post+${i}`}
                alt={`Instagram Post ${i}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a href="#" className="text-teal-600 font-semibold hover:underline">
            @GlobalAcademyEmbryology
          </a>
        </div>
      </section>
    </main>
  );
}
