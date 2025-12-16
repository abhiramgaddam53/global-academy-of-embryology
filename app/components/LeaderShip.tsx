"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const leaders = [
  {
    id: 1,
    name: "Mr. B. Siddesh",
    role: "Co-Founder",
    quote: "Our mission goes beyond education; it is about creating a lineage of ethical, skilled embryologists who will redefine global standards.",
    initial: "S"
  },
  {
    id: 2,
    name: "Mr. Balu",
    role: "Co-Founder",
    quote: "We are bridging the critical gap between theoretical knowledge and clinical reality, ensuring every student is lab-ready from day one.",
    initial: "B"
  },
  {
    id: 3,
    name: "Mr. Nishanth Singh",
    role: "Co-Founder",
    quote: "Technology in IVF is evolving rapidly. GAE stands at the forefront, integrating AI and innovation into our core curriculum.",
    initial: "N"
  },
  {
    id: 4,
    name: "Mr. P. Midhun Chakravarthy",
    role: "Founding Member",
    quote: "Collaboration is the key to scientific advancement. We are building a fraternity that supports each other across borders.",
    initial: "M"
  },
  {
    id:5,
    name: "Mr. Abhiram",
    role: "Co-Founder",
    quote: "Our mission goes beyond education; it is about creating a lineage of ethical, skilled embryologists who will redefine global standards.",
    initial: "S"
  },{
    id: 6,
    name: "Mr.Bhanu",
    role: "Co-Chairman",
    quote: "Our mission goes beyond education; it is about creating a lineage of ethical, skilled embryologists who will redefine global standards.",
    initial: "S"
  },
];

export default function Leadership() {
  const [index, setIndex] = useState(0);

  // Calculate the circular index
  const activeIndex = (index + leaders.length) % leaders.length;

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIndex((prev) => prev - 1);
  };

  // Helper to determine the visual position of a card relative to the active one
  const getPosition = (cardIndex: number) => {
    const offset = (cardIndex - activeIndex + leaders.length) % leaders.length;
    
    // Logic for 4 items:
    // 0 = Center
    // 1 = Right
    // 2 = Back (Hidden)
    // 3 (or N-1) = Left
    
    if (offset === 0) return "center";
    if (offset === 1) return "right";
    if (offset === leaders.length - 1) return "left";
    return "back";
  };

  // Animation variants
  const variants = {
    center: {
      x: "0%",
      scale: 1,
      zIndex: 10,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      boxShadow: "0px 20px 50px rgba(0,0,0,0.1)",
    },
    left: {
      x: "-60%",
      scale: 0.85,
      zIndex: 5,
      opacity: 0.6,
      rotate: -6,
      filter: "blur(2px)",
      boxShadow: "none",
    },
    right: {
      x: "60%",
      scale: 0.85,
      zIndex: 5,
      opacity: 0.6,
      rotate: 6,
      filter: "blur(2px)",
      boxShadow: "none",
    },
    back: {
      x: "0%", // Hides behind center
      scale: 0.7,
      zIndex: 1,
      opacity: 0, // Fully invisible while swapping sides
      rotate: 0,
      filter: "blur(10px)",
      boxShadow: "none",
    },
  };

  return (
    <section className="py-12 bg-[#F8FAFC] border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] mb-4">
            Leadership Perspectives
          </h2>
          <p className="text-slate-500 font-light text-lg">
            Swipe to hear from our founders.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-4xl mx-auto h-[420px] md:h-[380px] flex items-center justify-center">
          {leaders.map((leader, i) => {
            const position = getPosition(i);
            
            return (
              <motion.div
                key={leader.id}
                initial={false}
                animate={position}
                variants={variants}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 1,
                }}
                className="absolute w-[85%] md:w-[500px] h-auto bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between cursor-grab active:cursor-grabbing origin-bottom"
                // Drag Logic
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50) handleNext();
                  if (swipe > 50) handlePrev();
                }}
              >
                 {/* Quote Icon */}
                 <Quote className="absolute top-6 right-8 text-[#27B19B] opacity-10 w-16 h-16 rotate-180" />

                 <div className="relative z-10">
                    <blockquote className="text-[#0F172A] font-serif italic text-lg md:text-xl leading-relaxed mb-6">
                      "{leader.quote}"
                    </blockquote>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                        <span className="font-serif text-lg font-bold">{leader.initial}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-base">{leader.name}</h4>
                        <p className="text-[#0D9488] text-[10px] font-bold uppercase tracking-widest">{leader.role}</p>
                      </div>
                    </div>
                 </div>

                 {/* Click area for side cards */}
                 {position !== "center" && (
                   <div 
                    className="absolute inset-0 z-20 cursor-pointer" 
                    onClick={() => {
                      if (position === "left") handlePrev();
                      if (position === "right") handleNext();
                    }}
                   />
                 )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all shadow-sm active:scale-95 z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all shadow-sm active:scale-95 z-20"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </section>
  );
}