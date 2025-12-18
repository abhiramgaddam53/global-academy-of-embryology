"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  Award, 
  UserCircle 
} from "lucide-react";

export default function UserNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Webinars", href: "/dashboard/webinars", icon: Video },
    { name: "Certificates", href: "/dashboard/certificates", icon: Award },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <>
      {/* =======================================
          DESKTOP VIEW (Top Pill Bar)
          Hidden on mobile (md:flex)
      ======================================== */}
      <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
        {links.map((link) => {
          const isActive = link.href === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#1B3A5B] text-white shadow-md shadow-[#1B3A5B]/20" 
                  : "text-slate-500 hover:text-[#1B3A5B] hover:bg-slate-50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[#27B19B]" : "text-slate-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>


      {/* =======================================
          MOBILE VIEW (Fixed Bottom Tab Bar)
          Visible only on mobile (md:hidden)
      ======================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => {
            const isActive = link.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-[#1B3A5B]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className={`relative p-1 rounded-xl transition-all ${isActive ? "bg-[#1B3A5B]/10" : "bg-transparent"}`}>
                   <Icon size={22} className={isActive ? "text-[#1B3A5B]" : "currentColor"} />
                   {/* Optional: Active Dot Indicator */}
                   {isActive && (
                     <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27B19B] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#27B19B]"></span>
                     </span>
                   )}
                </div>
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}