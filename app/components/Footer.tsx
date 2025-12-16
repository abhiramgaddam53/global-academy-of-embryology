"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-xl font-serif text-white tracking-wide">
              Global Academy <br />
              <span className="text-[#27B19B] italic">of Embryology</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Setting the gold standard in clinical embryology education and research since 2024.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#27B19B] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#27B19B] transition-colors">About Us</Link></li>
              <li><Link href="/faculty" className="hover:text-[#27B19B] transition-colors">Faculty</Link></li>
              <li><Link href="/gallery" className="hover:text-[#27B19B] transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/webinars" className="hover:text-[#27B19B] transition-colors">Webinars</Link></li>
              <li><Link href="/contact" className="hover:text-[#27B19B] transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-[#27B19B] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#27B19B] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
             <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Connect</h4>
             <div className="flex gap-4">
                <SocialLink href="#" icon={<Linkedin size={18} />} />
                <SocialLink href="#" icon={<Twitter size={18} />} />
                <SocialLink href="#" icon={<Instagram size={18} />} />
                <SocialLink href="mailto:info@gae.edu" icon={<Mail size={18} />} />
             </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Global Academy of Embryology. All rights reserved.</p>
          <p>Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 bg-slate-800 rounded-full hover:bg-[#27B19B] hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}