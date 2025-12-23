"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Updated data structure with images and longer messages
const leaders = [
  {
    id: 1,
    name: "Mr. V.Hemanth",
    role: "Associate Founder",
    image: "/Dr_V-Hemanth.webp",
    title: "Message from the Associate Founder",
    message: [
      "Dear colleagues and friends,",
      "It gives me immense pride to introduce the Global Academy of Embryology (GAE), a unique initiative aimed at connecting embryologists across the globe. GAE is designed as a collaborative academic platform to share knowledge, encourage innovation, and promote excellence in reproductive science.",
      "I invite you to join us on this journey—take part in our educational programs, interact with experienced professionals, and contribute to advancing the field of embryology through collective learning and growth.",
      "Together, let us advance science and strengthen the foundation of life."
    ]
  },
  {
    id: 2,
    name: "Mr. Fyzullah Syed",
    role: "Associate Founder",
    image: "/Fyzullah-Syed.webp",
    title: "Message from the Associate Founder",
    message: [
      "The Global Academy of Embryology (GAE) is born from a shared vision to elevate embryology through knowledge, ethics, and collaboration. Created by practicing embryologists, GAE is a non-profit academic platform dedicated to real laboratory learning, scientific integrity, and continuous professional growth.",
      "By fostering open dialogue, practical education, and mentorship, GAE aims to bridge learning with real-world embryology practice and support the next generation of professionals.",
      "Welcome to GAE—where learning is shared, standards are strengthened, and the future of embryology is shaped together.",

    ]
  },
  {
    id: 3,
    name: "Mr. B.Siddesh ",
    role: "Co-Founder",
    image: "/B-Siddesh.webp",
    title: "Message from the Co-Founder",
    message: [
      "A platform dedicated to sharing knowledge and promoting growth in the field of embryology",

     "This refers to the Global Academy of Embryology, an online space where professionals, researchers, and experts in embryology can come together to share their knowledge, experiences, and best practices. The platform aims to foster collaboration, innovation, and learning, ultimately contributing to the advancement of embryology." ,
      
      "Through this, we aim to share our expertise and experiences",
      
      "The organization/individual is committed to sharing their expertise, research, and experiences in embryology, making it accessible to others in the field. This may include sharing case studies, research papers, techniques, and protocols, as well as lessons learned from their own experiences.",
      
      "And invite you to join us in this journey of learning and growth",
      
      "The invitation is open to embryologists, researchers, and anyone interested in the field to participate, engage, and learn from others. The platform encourages collaboration, discussion, and knowledge-sharing, creating a community that supports the growth and development of embryology professionals.",
      
      "In essence, the statement highlights the organization's commitment to advancing embryology through knowledge sharing, collaboration, and community building.",
    ]
  },
  {
    id: 4,
    name: "Mr. Balu",
    role: "Co-Founder",
    image: "/Dr-Balu.webp",
    title: "Message from the Co-Founder",
    message: [
      "Dear colleagues and friends,",
      "It is with great pride and enthusiasm that we introduce the Global Academy of Embryology (GAE)—a visionary initiative dedicated to bringing embryologists together from across the globe. GAE is envisioned as a collaborative platform to share knowledge, exchange innovations, and advance excellence in reproductive science. ",
      "I invite you to be a part of this journey—explore our academic resources, engage with experienced professionals, and contribute to shaping the future of embryology through collective learning and growth.",
      "Together, let us strengthen the science that creates life."
    ]
  },
  {
    id: 5,
    name: "Mr. Nishanth Singh",
    role: "Co-Founder",
    image: "/Nishanth-Singh.webp",
    title: "Message from the Co-Founder",
    message: [
      "It is a privilege to serve as a Founding Member of the Global Academy of Embryology—a platform envisioned to strengthen embryology education through structured, ethical, and clinically relevant learning pathways. Embryology lies at the core of Assisted Reproductive Technology (ART), where precision, responsibility, and scientific integrity directly influence patient outcomes.",

      "Historically, embryology training has depended heavily on on-the-job exposure and mentorship, which, while invaluable, often results in variability in learning and laboratory practices. In today’s rapidly evolving ART landscape, there is a clear need for standardized academic frameworks that bridge theoretical knowledge with real-world laboratory application.",


      "The Global Academy of Embryology seeks to address this gap by delivering evidence-based curricula, expert-led programs, case-based discussions, and timely updates on ethical and regulatory aspects of ART. Our mission is to empower embryologists at every career stage—from trainees to seasoned professionals—by fostering confidence, competence, and consistency in laboratory practice.",

      "I am proud to be part of this transformative academic movement and extend an invitation to the global embryology community to join us in advancing excellence in embryology worldwide." ,
    ]
  },
  {
    id: 6,
    name: "Mr. P. Midhun Chakravarthy ",
    role: "Founding Member",
    image: "/Midhun-Chakravarthy.jpeg",
    title: "Message from the Founding Member",
    message: [
      "It is a privilege to be a Founder Member of the Global Academy of Embryology, a platform created with the vision of strengthening embryology education through structured, ethical, and clinically relevant learning. Embryology lies at the heart of Assisted Reproductive Technology, where precision, responsibility, and scientific integrity directly influence patient outcomes.",
      "Over the years, embryology training has relied heavily on workplace exposure and mentorship. While invaluable, this approach often leads to variability in learning and laboratory practices. In today’s rapidly advancing ART landscape, there is a clear need for standardized academic guidance that bridges theoretical knowledge with real-world laboratory application.",
      "The Global Academy of Embryology aims to fulfill this need by providing evidence-based education, expert-led programs, case-based discussions, and updates on ethical and legal aspects of ART. This initiative seeks to support embryologists at every stage of their professional journey, fostering confidence, competence, and consistency in laboratory practice.",
      "I am proud to be part of this academic movement and invite the embryology community to learn, collaborate, and contribute toward advancing excellence in embryology worldwide.",
      
    ]
  },
  {
    id: 7,
    name: "Mr.Arun T K ",
    role: "Founding Member",
    image: "/Arun-T-K.jpeg",
    title: "Message from the Founding Member",
    message: [
      "The Global Academy of Embryology is created as a dedicated space for embryology professionals to connect, learn, and grow together. Our mission is to promote the exchange of knowledge, innovative ideas, and best practices that drive the field forward.",

      "We warmly welcome all embryologists, researchers, and enthusiasts to join us in building a vibrant community focused on continuous learning and collaboration.",
      
      "Together, let’s advance embryology for a better future.",
    ]
  },
  {
    id: 8,
    name: "Dr. Swapna Srinath",
    role: "Chief Clinical Advisor",
    image: "/Dr_Swapna-Srinath.webp",
    title: "Message from the Chief Clinical Advisor",
    message: [
      "At the Global Academy of Embryology, clinical practice and embryology education work hand in hand. While embryologists drive laboratory excellence, clinicians contribute real-world insights from patient care, ensuring that laboratory science translates into meaningful clinical outcomes.",
      "Through teaching, mentorship, quality guidance, and collaborative research, clinician involvement at GAE strengthens evidence-based practice, ethical standards, and patient-centered embryology training. This integrated approach helps embryologists understand the clinical impact of their work and supports the delivery of responsible, outcome-driven ART care.",
      "Together, clinicians and embryologists advance the science and practice of reproductive medicine."
    ]
  },
  {
    id: 9,
    name: "Dr. Charulata Chatterjee",
    role: "Chief Scientific Advisor",
    image: "/Dr_Charulata-Chatterjee.webp",
    title: "Message from the Chief Scientific Advisor",
    message: [
      "Embryology is the foundation of assisted reproductive science,where precision,ethics,and continuous learning shape successful outcomes. At the Global Academy of Embryology ,our focus is to advance scientific excellence through education, innovation and evidence based practice. Together,we aim to nurture knowledge ,inspire young embryologist and uphold the highest standards in ART.",
       
    ]
  },
  {
    id: 10,
    name: "Mr. T. Suresh Kumar",
    role: "Advisor - Embryology",
    image: "/Suresh-Kumar.webp",
    title: "Message from the Advisor - Embryology ",
    message: [
      "It is a pleasure to be a member of the Global Embryologist Association. This platform offers an excellent opportunity for both experienced and upcoming embryologists to share knowledge and practical experiences.",
      "While many online learning platforms exist, this association stands out by providing access to pioneers in the field. Learning directly from experts and having queries clarified by them adds immense value.",
      "Overall, it serves as a strong platform for professional growth through shared experiences and expert guidance."
       
    ]
  },
 
  
];

export default function Leadership() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % leaders.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + leaders.length) % leaders.length);
  };

  const currentLeader = leaders[index];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F172A] mb-4">
            Leadership Perspectives
          </h2>
          <div className="h-1 w-20 bg-[#0D9488] mx-auto rounded-full"></div>
        </div>

        {/* Main Card Display */}
        <div className="max-w-6xl mx-auto relative">
          
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLeader.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col md:flex-row h-full"
              >
                
                {/* Image Section (Left) */}
                <div className="w-full md:w-2/5 lg:w-1/3 relative h-64 md:h-auto overflow-hidden bg-slate-200">
                  <img 
                    src={currentLeader.image} 
                    alt={currentLeader.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Overlay Gradient for text readability if needed, or purely decorative */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                  
                  {/* Mobile Name Overlay */}
                  <div className="absolute bottom-0 left-0 p-6 md:hidden text-white z-10">
                    <h3 className="font-serif text-2xl font-bold">{currentLeader.name}</h3>
                    <p className="text-[#2DD4BF] font-medium tracking-wide text-sm">{currentLeader.role}</p>
                  </div>
                </div>

                {/* Content Section (Right) */}
                <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                  <Quote className="absolute top-8 right-8 text-slate-100 w-24 h-24 rotate-180 -z-0" />
                  
                  <div className="relative z-10">
                    <h4 className="text-[#0D9488] font-bold uppercase tracking-wider text-xs mb-3">
                      {currentLeader.title}
                    </h4>
                    
                    <div className="space-y-4 mb-8">
                      {currentLeader.message.map((paragraph, idx) => (
                        <p key={idx} className="text-slate-600 font-serif text-lg leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Desktop Name Display */}
                    <div className="hidden md:block pt-6 border-t border-slate-100">
                      <h3 className="font-serif text-2xl font-bold text-[#0F172A]">{currentLeader.name}</h3>
                      <p className="text-[#0D9488] font-medium tracking-wide">{currentLeader.role}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls - Positioned outside/overlapping the card */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white text-slate-600 shadow-lg hover:bg-[#0F172A] hover:text-white transition-all z-20 border border-slate-100 group"
          >
            <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white text-slate-600 shadow-lg hover:bg-[#0F172A] hover:text-white transition-all z-20 border border-slate-100 group"
          >
            <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {leaders.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === i ? "w-8 bg-[#0D9488]" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}