"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Video, Image as ImageIcon, FileBadge, Mail } from "lucide-react";

export default function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Webinars", href: "/admin/webinars", icon: Video },
    { name: "Faculty", href: "/admin/faculty", icon: Users },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Certificates", href: "/admin/certificates", icon: FileBadge },
    { name: "Messages", href: "/admin/contact", icon: Mail },  
  ];

  return (
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
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}