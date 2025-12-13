"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Microscope,
  Award,
  Globe,
  Users,
  ArrowRight,
  Mail,
  CheckCircle,
} from "lucide-react";
import SectionTitle from "./components/SectionTitle";
import FacultyCard from "./components/FacultyCard";
import WebinarCard, { Webinar } from "./components/WebinarCard";
import CallToAction from "./components/CallToAction";
import AnimatedLogoLoader from "./components/AnimatedLogoLoader";
import { faculty } from "./faculty/data";

// Mock Data for Home Page
const upcomingWebinars: Webinar[] = [
  {
    id: "web-001",
    title: "Advanced Vitrification Techniques in ART",
    date: "Oct 24, 2025",
    time: "10:00 AM GMT",
    speaker: "Dr. Lenin Babu",
    description:
      "Master the art of cryopreservation with our expert-led session.",
  },
  {
    id: "web-002",
    title: "AI in Embryo Selection: The Future is Here",
    date: "Nov 05, 2025",
    time: "2:00 PM GMT",
    speaker: "Dr. Ananya Reddy",
    description:
      "Explore how Artificial Intelligence is revolutionizing IVF success rates.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Junior Embryologist, UK",
    text: "The hands-on training at GAE was a game-changer for my career. The faculty is incredibly knowledgeable and supportive.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Lab Director, India",
    text: "GAE's certification is recognized globally. It gave me the credibility I needed to start my own IVF lab.",
  },
  {
    id: 3,
    name: "Maria Gonzalez",
    role: "Clinical Embryologist, Spain",
    text: "I loved the mix of theoretical knowledge and practical application. Highly recommended for anyone in the field.",
  },
];

export default function Home() {
  // Get top 3 faculty members
  const featuredFaculty = faculty.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] w-full bg-[#1B3A5B] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://placehold.co/1920x1080/1B3A5B/FFFFFF?text=Laboratory+Background"
            alt="Lab Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A5B]/90 to-[#1B3A5B]/40" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
            Excellence in{" "}
            <span className="text-teal-400">Clinical Embryology</span> Training
            & Research
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            Join the Global Academy of Embryology to master advanced ART
            techniques through world-class hands-on training and expert
            mentorship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Join the Academy
            </Link>
            <Link
              href="/webinars"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold py-3 px-8 rounded-full transition-all"
            >
              Upcoming Webinars
            </Link>
          </div>
        </div>
      </section>

      {/* 2. About GAE Snippet */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle
              title="Who We Are"
              alignment="left"
              subtitle="Pioneering the future of reproductive medicine education."
            />
            <p className="text-gray-600 mb-6 leading-relaxed">
              The Global Academy of Embryology (GAE) is a premier institution
              dedicated to providing state-of-the-art training in Assisted
              Reproductive Technology (ART). We bridge the gap between
              theoretical knowledge and practical skills, empowering the next
              generation of embryologists.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              With a curriculum designed by world-renowned experts and labs
              equipped with cutting-edge technology, we ensure our students are
              industry-ready from day one.
            </p>
            <Link
              href="/about"
              className="text-[#1B3A5B] font-semibold hover:text-teal-600 flex items-center gap-2 transition-colors"
            >
              Read More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex justify-center items-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-80">
            {/* Using the existing AnimatedLogoLoader or a placeholder if it fails visually in this context */}
            <div className="w-full h-full flex items-center justify-center">
              <AnimatedLogoLoader />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why GAE (Value Props) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Why Choose GAE?"
            subtitle="We offer more than just a certificate; we offer a career transformation."
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Microscope className="w-10 h-10 text-teal-500" />,
                title: "Hands-on Training",
                desc: "Get extensive practical experience with the latest micromanipulation and cryopreservation equipment.",
              },
              {
                icon: <Users className="w-10 h-10 text-teal-500" />,
                title: "Expert Faculty",
                desc: "Learn directly from senior clinical embryologists and reproductive medicine specialists.",
              },
              {
                icon: <Award className="w-10 h-10 text-teal-500" />,
                title: "Global Certification",
                desc: "Our courses are recognized internationally, opening doors to opportunities worldwide.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-slate-50 hover:bg-[#1B3A5B] hover:text-white group transition-all duration-300 cursor-default"
              >
                <div className="mb-4 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1B3A5B] group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Visionaries (Faculty Teaser) */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <SectionTitle title="Meet Our Mentors" alignment="left" />
          <Link
            href="/faculty"
            className="hidden md:flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 mb-10"
          >
            View All Faculty <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredFaculty.map((f) => (
            <FacultyCard key={f.id} faculty={f} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/faculty"
            className="text-teal-600 font-semibold hover:text-teal-700"
          >
            View All Faculty &rarr;
          </Link>
        </div>
      </section>

      {/* 5. Upcoming Webinars */}
      <section className="py-20 bg-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Upcoming Webinars"
            subtitle="Stay updated with the latest advancements in embryology."
          />

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {upcomingWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/webinars"
              className="inline-block border-2 border-[#1B3A5B] text-[#1B3A5B] font-semibold py-2 px-6 rounded-full hover:bg-[#1B3A5B] hover:text-white transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Director's Message */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 relative min-h-[300px]">
            <Image
              src="https://placehold.co/600x800/1B3A5B/FFFFFF?text=Director"
              alt="Director"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-2/3 p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#1B3A5B]">
                Director's Message
              </h3>
              <div className="w-16 h-1 bg-teal-500 mt-2 rounded-full" />
            </div>
            <blockquote className="text-lg text-gray-600 italic mb-6">
              "At GAE, we believe that every embryologist holds the potential to
              create miracles. Our mission is to nurture that potential with the
              right knowledge, ethics, and skills."
            </blockquote>
            <div>
              <p className="font-bold text-[#1B3A5B]">Dr. Lenin Babu</p>
              <p className="text-sm text-gray-500">Founder & Director, GAE</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 bg-[#1B3A5B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Alumni Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-blue-100 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-blue-300">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-teal-50 p-10 rounded-3xl border border-teal-100">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-[#1B3A5B] mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Subscribe to our newsletter to receive updates on upcoming webinars,
            new courses, and industry news.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              className="bg-[#1B3A5B] hover:bg-[#2c5a8a] text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
