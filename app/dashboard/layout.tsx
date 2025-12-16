import UserNavLinks from "./UserNavLinks"; // Adjust path

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mt-20 bg-[#F8FAFC]">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="font-serif text-xl font-bold text-[#0F172A]">
            Student<span className="text-[#27B19B]">Portal</span>
          </div>

          {/* THE NAV COMPONENT */}
          <UserNavLinks />

          {/* User / Sign Out (Optional right side) */}
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

    </div>
  );
}