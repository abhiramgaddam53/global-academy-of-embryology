"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0F172A] selection:text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative pt-40 pb-20 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#1e293b] z-0" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <p className="text-[#2DD4BF] tracking-[0.2em] uppercase text-xs font-bold mb-6 animate-fade-in">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Contact the <span className="italic text-slate-400">Secretariat.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            For inquiries regarding admissions, partnerships, or general information, please reach out to us.
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* LEFT: Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif text-[#0F172A] mb-6">Contact Info</h2>
                <div className="w-16 h-1 bg-[#0D9488] mb-8" />
                {/* <p className="text-slate-600 text-lg leading-relaxed">
                  We operate globally with partner labs in multiple continents. Our central administration manages all academic and clinical inquiries.
                </p> */}
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-[#0D9488] shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#0F172A] mb-2">Visit Us</h3>
                    <p className="text-slate-500 font-light">
                       Komali Fertility Centre <br />
                      A Unit of Aster Ramesh Hospital <br />
                      Guntur - 522004  
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-[#0D9488] shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#0F172A] mb-2">Email Us</h3>
                    <p className="text-slate-500 font-light">lenin@globalacademyofembryology.org </p>
                    {/* <p className="text-slate-500 font-light">info@gae-edu.org</p> */}
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-[#0D9488] shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#0F172A] mb-2">Call Us</h3>
                    <p className="text-slate-500 font-light">+91 6302665757</p>
                    <p className="text-slate-400 text-sm mt-1">(Mon-Fri, 9am - 6pm IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="bg-white p-8 md:p-12 shadow-xl border-t-4 border-[#0D9488] relative">
              {status === "success" ? (
                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#0F172A] mb-2">Message Sent</h3>
                  <p className="text-slate-500">Thank you for contacting us. Our team will review your inquiry and respond shortly.</p>
                  <button onClick={() => setStatus("idle")} className="mt-8 text-[#0D9488] font-bold text-sm uppercase tracking-widest hover:underline">
                    Send Another Message
                  </button>
                </div>
              ) : null}

              <h3 className="text-2xl font-serif text-[#0F172A] mb-8">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border-b border-slate-200 bg-transparent py-2 focus:border-[#0D9488] outline-none transition-colors"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border-b border-slate-200 bg-transparent py-2 focus:border-[#0D9488] outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject</label>
                  <input 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full border-b border-slate-200 bg-transparent py-2 focus:border-[#0D9488] outline-none transition-colors"
                    placeholder="Admissions Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full border-b border-slate-200 bg-transparent py-2 focus:border-[#0D9488] outline-none transition-colors resize-none"
                    placeholder="How can we assist you?"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-[#0F172A] text-white py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#1E293B] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <><Loader2 className="animate-spin" size={16} /> Sending...</>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}