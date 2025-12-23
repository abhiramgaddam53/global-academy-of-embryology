 
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // Tracks page changes
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // 1. Fetch User (Runs on mount AND when path changes)
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        // ✅ FIX: added { cache: "no-store" } to prevent caching old "logged out" states
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setUser(data.user);
        }
      } catch (err) {
        console.error("Navbar Auth Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUser();

    return () => { isMounted = false; };
  }, [pathname]); // ✅ FIX: Added pathname here so it refreshes after redirecting

  // 2. Handle Logout
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);
      window.location.href = "/login"; 
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  // 3. Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (menuOpen && mobileMenuRef.current && mobileButtonRef.current) {
        if (!mobileMenuRef.current.contains(target) && !mobileButtonRef.current.contains(target)) {
          setMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty" },
    { name: "Webinars", href: "/webinars" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href:"/contact"},
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const isLoggedIn = !!user;

  // 4. Helper Component: Profile Avatar
  const ProfileAvatar = ({ size = 36, fontSize = "text-sm" }: { size?: number, fontSize?: string }) => {
    if (user?.image) {
      return (
        <div 
          className="relative rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 bg-slate-100"
          style={{ width: size, height: size }}
        >
          <Image 
            src={user.image} 
            alt="Profile" 
            fill 
            className="object-cover" 
          />
        </div>
      );
    }
    return (
      <div 
        className={`rounded-full bg-gradient-to-br from-[#1B3A5B] to-[#2a527c] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white shrink-0 ${fontSize}`}
        style={{ width: size, height: size }}
      >
        {userInitial}
      </div>
    );
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex-shrink-0 relative w-36 h-10 md:w-48 md:h-14 transition-opacity hover:opacity-90">
            <Image
              src="/logo.webp"
              alt="Institute logo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative py-1 group ${
                    isActive ? "text-[#1B3A5B]" : "text-slate-600 hover:text-[#1B3A5B]"
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#27B19B] transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </div>

          {/* --- DESKTOP ACTIONS --- */}
          <div className="hidden md:flex items-center gap-4 min-w-[140px] justify-end">
            
            {loading ? (
              // 🔄 SKELETON
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
              </div>
            ) : isLoggedIn ? (
              // ✅ LOGGED IN
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all focus:outline-none"
                >
                  <ProfileAvatar size={36} />
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-bold text-[#1B3A5B] truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-2">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1B3A5B]">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1B3A5B]">
                        <Settings size={16} /> Profile Settings
                      </Link>
                    </div>

                    <div className="py-2 border-t border-slate-50">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ❌ LOGGED OUT
              <div className="flex items-center gap-3 animate-in fade-in duration-300">
                <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-[#1B3A5B] transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="px-6 py-2.5 rounded-full bg-[#1B3A5B] text-white text-sm font-medium hover:bg-[#152e4a] transition-all shadow-lg shadow-[#1B3A5B]/20 hover:shadow-xl hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center">
            <button
              ref={mobileButtonRef}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${menuOpen ? "max-h-[600px] opacity-100 shadow-xl" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Mobile User Header */}
          {loading ? (
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4 animate-pulse">
                   <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                   <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                   </div>
                </div>
             </div>
          ) : isLoggedIn ? (
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <ProfileAvatar size={52} fontSize="text-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1B3A5B] text-lg truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
               </div>
               <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-[#1B3A5B] text-sm font-medium shadow-sm active:scale-95 transition-all"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-[#1B3A5B] text-sm font-medium shadow-sm active:scale-95 transition-all"
                  >
                    <User size={18} /> Profile
                  </Link>
               </div>
            </div>
          ) : (
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
               <p className="text-sm text-slate-500 font-medium text-center mb-2">Welcome to Global Academy</p>
               <div className="grid grid-cols-2 gap-3">
                 <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-xl border border-slate-200 bg-white text-[#1B3A5B] font-bold shadow-sm active:bg-slate-50">
                    Sign In
                 </Link>
                 <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-xl bg-[#1B3A5B] text-white font-bold shadow-lg shadow-[#1B3A5B]/20 active:bg-[#152e4a]">
                    Register
                 </Link>
               </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === link.href 
                    ? "bg-[#27B19B]/10 text-[#27B19B]" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#1B3A5B]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Sign Out */}
          {isLoggedIn && (
             <div className="p-4 border-t border-slate-100">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-600 bg-red-50 font-semibold active:bg-red-100 transition-colors"
                >
                  <LogOut size={18} /> Sign Out
                </button>
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}