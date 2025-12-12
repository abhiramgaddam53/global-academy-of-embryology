 
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const isLoggedIn = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileButtonRef = useRef<HTMLButtonElement | null>(null);

  // Fetch current user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
  }

  // Close dropdown and mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }

      if (menuOpen) {
        const clickedInsideMenu =
          mobileMenuRef.current &&
          mobileMenuRef.current.contains(target);

        const clickedHamburger =
          mobileButtonRef.current &&
          mobileButtonRef.current.contains(target);

        if (!clickedInsideMenu && !clickedHamburger) {
          setMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Institute logo"
            width={300}
            height={100}
            priority
            className="h-12 w-auto md:h-14 object-contain"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10 font-medium ml-20">
          {["Home", "About", "Faculty", "Webinars", "Gallery"].map((item) => (
            <Link
              key={item}
              href={`/${item === "Home" ? "" : item.toLowerCase()}`}
              className="relative text-[#1B3A5B] transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#27B19B] after:w-0 after:transition-all hover:after:w-full"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* DESKTOP AUTH / PROFILE */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#27B19B] text-white flex items-center justify-center font-bold shadow border border-emerald-100 hover:shadow-md transition"
              >
                {userInitial}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-2 text-sm">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-[#1B3A5B] text-[#1B3A5B] hover:bg-[#1B3A5B] hover:text-white transition text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-[#27B19B] text-white hover:opacity-90 transition text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          ref={mobileButtonRef}
          className="md:hidden text-2xl text-[#1B3A5B]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          type="button"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 px-6 py-6"
        >
          <div className="flex flex-col gap-5 font-medium text-[#1B3A5B]">
            {["Home", "About", "Faculty", "Webinars", "Gallery"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* MOBILE PROFILE / AUTH */}
            <div className="pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#27B19B] text-white flex items-center justify-center font-semibold">
                      {userInitial}
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-[#1B3A5B]">
                        {user?.name}
                      </span>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="text-xs text-gray-500 underline"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                  <button
                    className="text-xs text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full border border-[#1B3A5B]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full bg-[#27B19B] text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
