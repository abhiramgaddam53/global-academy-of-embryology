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
    { name: "My Webinars", href: "/dashboard/webinars", icon: Video },
    { name: "Certificates", href: "/dashboard/certificates", icon: Award },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
      {links.map((link) => {
        // Logic to keep "Overview" active only on exact match, others on sub-paths
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
                ? "bg-[#1B3A5B] text-white shadow-md shadow-[#1B3A5B]/20" // Dark Navy Active
                : "text-slate-500 hover:text-[#1B3A5B] hover:bg-slate-50"
            }`}
          >
            <Icon size={18} className={isActive ? "text-[#27B19B]" : "text-slate-400"} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}