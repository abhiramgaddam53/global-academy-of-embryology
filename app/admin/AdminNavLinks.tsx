"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Video, Image as ImageIcon, FileBadge, Mail } from "lucide-react";

export default function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/admin", icon: LayoutDashboard }, // Shortened name for mobile
    { name: "Webinars", href: "/admin/webinars", icon: Video },
    { name: "Faculty", href: "/admin/faculty", icon: Users },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Certs", href: "/admin/certificates", icon: FileBadge }, // Shortened name
    { name: "Inbox", href: "/admin/contact", icon: Mail }, // Shortened name
  ];

  return (
    <>
      {/* =======================================
          DESKTOP VIEW (Top Pill Bar)
          Hidden on mobile (md:flex)
      ======================================== */}
      <nav className="hidden md:flex items-center space-x-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#1B3A5B] shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#27B19B]" : "text-slate-400"} />
              {/* Revert to full names for Desktop if needed, or keep short */}
              {link.name === "Home" ? "Dashboard" : link.name === "Certs" ? "Certificates" : link.name === "Inbox" ? "Messages" : link.name}
            </Link>
          );
        })}
      </nav>

      {/* =======================================
          MOBILE VIEW (Fixed Bottom Bar)
          Visible only on mobile (md:hidden)
      ======================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe safe-area-inset-bottom">
        <div className="grid grid-cols-6 h-16 items-center px-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-[#1B3A5B]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? "bg-[#1B3A5B]/10" : "bg-transparent"}`}>
                  <Icon size={20} className={isActive ? "text-[#1B3A5B]" : "currentColor"} />
                </div>
                {/* Extremely small text to fit 6 items */}
                <span className="text-[9px] font-semibold truncate w-full text-center px-0.5">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}