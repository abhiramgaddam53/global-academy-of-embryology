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
  Loader2
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // <--- Added loading state
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch current user
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setUser(data.user);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false); // <--- Stop loading
      }
    }
    loadUser();

    return () => { isMounted = false; };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
    window.location.href = "/login"; 
  }

  // Click Outside Handler
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
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const isLoggedIn = !!user;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex-shrink-0 relative w-40 h-12 md:w-48 md:h-14 transition-opacity hover:opacity-90">
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

          {/* --- DESKTOP ACTIONS (With Loading Skeleton) --- */}
          <div className="hidden md:flex items-center gap-4 min-w-[140px] justify-end">
            
            {loading ? (
              // SKELETON LOADER (Shows while checking auth)
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
              </div>
            ) : isLoggedIn ? (
              // LOGGED IN STATE
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B3A5B] to-[#2a527c] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                    {userInitial}
                  </div>
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
              // LOGGED OUT STATE
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
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 py-6 space-y-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  pathname === link.href ? "text-[#27B19B]" : "text-[#1B3A5B]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            {loading ? (
              // MOBILE LOADING SKELETON
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#27B19B] text-white flex items-center justify-center font-bold shadow-sm">
                    {userInitial}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1B3A5B]">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100">
                    <User size={16} /> Profile
                  </Link>
                </div>

                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 bg-red-50 text-sm font-medium hover:bg-red-100 transition-colors">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full text-center px-6 py-3 rounded-xl border border-slate-200 text-[#1B3A5B] font-medium hover:bg-slate-50 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full text-center px-6 py-3 rounded-xl bg-[#1B3A5B] text-white font-medium hover:bg-[#152e4a] transition-colors shadow-lg shadow-[#1B3A5B]/20">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}