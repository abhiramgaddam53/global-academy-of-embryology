"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import SectionTitle from "../components/SectionTitle";
import { Target, Eye, BookOpen, Award, Building2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  label: string;
  target: number;
  suffix?: string;
};

const stats: Stat[] = [
  { label: "Years of Experience", target: 15, suffix: "+" },
  { label: "Students Trained", target: 500, suffix: "+" },
  { label: "Publications", target: 25, suffix: "+" },
  { label: "Partner Clinics", target: 12, suffix: "+" },
];

const timeline = [
  {
    year: "2010",
    title: "Inception",
    desc: "GAE was founded with a vision to standardize embryology training.",
  },
  {
    year: "2015",
    title: "Global Expansion",
    desc: "Started accepting international students and partnered with overseas clinics.",
  },
  {
    year: "2018",
    title: "Research Wing",
    desc: "Established a dedicated research facility for advanced ART studies.",
  },
  {
    year: "2023",
    title: "Digital Learning",
    desc: "Launched online webinar series reaching 50+ countries.",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // HERO – on mount
      gsap.from(".hero-section", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      });

      // MISSION & VISION
      gsap.from(".mission-card", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 80%",
        },
      });

      // STATS – count up
      const statElems = gsap.utils.toArray<HTMLElement>(".stat-number");
      statElems.forEach((elem) => {
        const target = Number(elem.dataset.target ?? "0");
        const obj = { value: 0 };

        gsap.fromTo(
          obj,
          { value: 0 },
          {
            value: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              once: true,
            },
            onUpdate: () => {
              elem.innerText = Math.floor(obj.value).toLocaleString();
            },
            onComplete: () => {
              elem.innerText = target.toLocaleString();
            },
          }
        );
      });

      // TIMELINE
      gsap.from(".timeline-item", {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 75%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-slate-50 min-h-screen">
      {/* 1. Page Header */}
      <section className="hero-section relative h-[400px] w-full bg-[#1B3A5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://placehold.co/1920x600/1B3A5B/FFFFFF?text=About+Us+Banner"
            alt="About Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Nurturing the next generation of clinical embryologists with
            excellence and ethics.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="mission-section py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="mission-card bg-white p-10 rounded-2xl shadow-lg border-t-4 border-teal-500">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 text-teal-600">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B3A5B] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide world-class, hands-on training in clinical embryology,
              bridging the gap between academic knowledge and practical
              application, and to foster a community of ethical and skilled
              professionals.
            </p>
          </div>
          <div className="mission-card bg-white p-10 rounded-2xl shadow-lg border-t-4 border-[#1B3A5B]">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-[#1B3A5B]">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B3A5B] mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To be the global leader in reproductive medicine education,
              driving innovation and excellence in ART laboratories worldwide
              through continuous research and development.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The GAE Advantage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://placehold.co/800x800/teal/white?text=Training+Lab"
                alt="Training Methodology"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <SectionTitle
                title="The GAE Advantage"
                alignment="left"
                subtitle="Why we are different."
              />
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1B3A5B] mb-2">
                      Comprehensive Curriculum
                    </h4>
                    <p className="text-gray-600">
                      Our syllabus covers everything from basic gamete biology
                      to advanced micromanipulation and AI-based embryo
                      selection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1B3A5B] mb-2">
                      Hands-on Focus
                    </h4>
                    <p className="text-gray-600">
                      We believe in learning by doing. Students get individual
                      workstations and ample time to practice techniques.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1B3A5B] mb-2">
                      State-of-the-Art Facilities
                    </h4>
                    <p className="text-gray-600">
                      Train on the latest incubators, micromanipulators, and
                      laser systems used in top IVF clinics globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Counter */}
      <section className="py-20 bg-[#1B3A5B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                  <span className="stat-number" data-target={stat.target}>
                    0
                  </span>
                  {stat.suffix}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Our Journey (Timeline) */}
      <section className="timeline-section py-20 max-w-4xl mx-auto px-4">
        <SectionTitle
          title="Our Journey"
          subtitle="Milestones that define our legacy."
        />

        <div className="relative border-l-4 border-teal-200 ml-4 md:ml-0 space-y-12 mt-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="timeline-item relative pl-8 md:pl-0">
              <div className="md:flex items-center justify-between group">
                <div className="hidden md:block w-5/12 text-right pr-8">
                  <h3 className="text-xl font-bold text-[#1B3A5B]">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>

                <div className="absolute left-[-10px] md:left-1/2 md:-ml-3 w-6 h-6 bg-teal-500 rounded-full border-4 border-white shadow-md z-10 group-hover:scale-125 transition-transform" />

                <div className="md:w-5/12 pl-0 md:pl-8">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold mb-2 md:mb-0">
                    {item.year}
                  </span>
                  <div className="md:hidden mt-2">
                    <h3 className="text-xl font-bold text-[#1B3A5B]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Affiliations & Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionTitle
            title="Our Partners"
            subtitle="Collaborating with the best in the industry."
          />

          <div className="flex flex-wrap justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-32 h-16 relative">
                <Image
                  src={`https://placehold.co/200x100/e2e8f0/1B3A5B?text=Partner+${i}`}
                  alt={`Partner ${i}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
