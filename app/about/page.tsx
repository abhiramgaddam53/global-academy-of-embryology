"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  label: string;
  target: number;
  suffix?: string;
};

const stats: Stat[] = [
  { label: "Years of Experience", target: 12, suffix: "+" },
  { label: "Active Members", target: 6200, suffix: "+" },
  { label: "Countries Reached", target: 48 },
  { label: "Workshops & Webinars", target: 320, suffix: "+" },
];

function PillarCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="pillar-card bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // HERO – on mount
      gsap.from(".hero-section", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });

      // WHY GAE – left
      gsap.from(".why-gae", {
        x: -60,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".why-gae",
          start: "top 80%",
          once: true,
        },
      });

      // WHAT DRIVES – right
      gsap.from(".drives-gae", {
        x: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".drives-gae",
          start: "top 80%",
          once: true,
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
            duration: 1.8,
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
 
      // FOUNDER – fade up
      gsap.from(".founder-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".founder-section",
          start: "top 80%",
          once: true,
        },
      });

      // ADVISORY – stagger
      gsap.from(".advisory-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".advisory-section",
          start: "top 80%",
          once: true,
        },
      });

      // FINAL CTA
      gsap.from(".cta-section", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          once: true,
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="  text-[#1B3A5B] min-h-screen pt-24"
    >
      {/* HERO */}
      <section className="relative overflow-hidden hero-section">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Global Academy of Embryology
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Transforming Knowledge into Life — empowering embryologists,
            clinicians, and scientists through education, innovation, and global
            collaboration.
          </p>
        </div>
      </section>

      {/* WHY GAE + WHAT DRIVES */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* WHY GAE */}
          <div className="why-gae">
            <h2 className="text-3xl font-bold mb-4">Why GAE Was Established</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The field of embryology is the backbone of assisted reproductive
              technology (ART). Despite its critical role, embryologists often
              lacked a unified platform in India and globally to share
              knowledge, learn, and grow together.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Global Academy of Embryology (GAE) was born with the vision{" "}
              <span className="font-semibold text-[#27B19B]">
                “Transforming Knowledge into Life.”
              </span>{" "}
              The goal is to bring embryologists, clinicians, and scientists
              under one roof to exchange scientific insights, encourage
              continuous learning, and improve patient outcomes.
            </p>
          </div>

          {/* WHAT DRIVES GAE */}
          <div className="drives-gae bg-white rounded-2xl shadow-lg p-8 border">
            <h3 className="text-2xl font-semibold mb-4">What Drives GAE</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• A unified global learning ecosystem for embryology</li>
              <li>• Scientific excellence with strong ethical responsibility</li>
              <li>• Continuous professional growth and structured mentorship</li>
              <li>• Collaboration between labs, clinicians, and researchers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* VISION / MISSION */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-[#27B19B] to-[#1B3A5B] text-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="leading-relaxed text-lg">
              To be a global knowledge-sharing hub where embryology expertise is
              nurtured, strengthened, and advanced for the betterment of
              reproductive medicine and patient care worldwide.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <ul className="space-y-3 text-gray-700 leading-relaxed">
              <li>
                • Promote high-quality education, training, and research in
                embryology.
              </li>
              <li>• Bridge the gap between theory and hands-on practice.</li>
              <li>
                • Inspire young embryologists to grow with scientific spirit and
                integrity.
              </li>
              <li>
                • Provide guidance on the latest ART practices, ethics, and
                legal frameworks.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border bg-gray-50 shadow-sm"
              >
                <div className="text-2xl font-bold text-[#1B3A5B]">
                  <span className="stat-number" data-target={s.target}>
                    0
                  </span>
                  {s.suffix && <span>{s.suffix}</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS OF GAE */}
      <section className="bg-gray-50 pillars-section">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">The Pillars of GAE</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Education, innovation, quality, and collaboration — the core
              pillars shaping our contribution to embryology and ART.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PillarCard
              title="Education & Training"
              text="Webinars, workshops, case discussions, and interactive learning sessions for continuous professional development."
            />
            <PillarCard
              title="Innovation & Research"
              text="Encouraging embryologists to adopt cutting-edge tools, technologies, and evidence-based research."
            />
            <PillarCard
              title="Quality & Standards"
              text="Supporting labs and professionals in maintaining best practices in andrology, embryology, and ART compliance."
            />
            <PillarCard
              title="Collaboration & Networking"
              text="Connecting embryologists, clinicians, researchers, and ART professionals across the globe."
            />
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder-section">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Founder</h2>
            <p className="text-gray-600 mt-2">
              Visionary leadership that initiated the GAE journey.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="founder-card flex flex-col md:flex-row items-center gap-6 bg-white border rounded-2xl p-6 shadow-sm">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/founder.webp"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Dr. Lenin Babu</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Founder & Director, Global Academy of Embryology
                </p>
                <p className="text-gray-700 leading-relaxed">
                  [Short founder bio placeholder — 1–2 lines highlighting
                  experience in embryology / ART and the vision behind
                  establishing GAE.]
                </p>
                <div className="mt-4 flex gap-3">
                  <a className="text-sm underline text-[#1B3A5B]" href="#">
                    View detailed profile
                  </a>
                  <a className="text-sm underline text-[#27B19B]" href="#">
                    Contact / Connect
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVISORY BOARD */}
      <section className="bg-gray-50 advisory-section">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Advisory Board</h2>
            <p className="text-gray-600 mt-2">
              A distinguished panel guiding our scientific and academic
              direction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="advisory-card bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4">
                  <img
                    src="/founder.webp"
                    alt={`Advisor ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">Advisor Name {i + 1}</h4>
                <div className="text-sm text-gray-500 mb-2">
                  Role / Institution
                </div>
                <p className="text-sm text-gray-600">
                  Placeholder for advisor expertise or specialization in
                  embryology / ART.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join us in shaping the future of embryology
          </h2>
          <p className="text-gray-600 mb-8">
            Become a member, participate in our webinars and workshops, or
            collaborate on research to advance ART and improve patient care.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/register"
              className="px-6 py-3 rounded-full bg-[#27B19B] text-white font-medium"
            >
              Get involved
            </a>
            <a
              href="/webinars"
              className="px-6 py-3 rounded-full border border-gray-300 text-[#1B3A5B]"
            >
              View upcoming events
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
