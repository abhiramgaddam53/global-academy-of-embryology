import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  Image as ImageIcon, 
  FileBadge, 
  LogOut 
} from "lucide-react";
import AdminNavLinks from "./AdminNavLinks"; // We'll make this small client component for active states

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromToken();

  if (!user || user.role !== "admin") {
    redirect("/login"); // Cleaner redirect than showing a div
  }

  return (
    <div className="min-h-screen mt-19 bg-slate-50 text-slate-900 font-sans">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1B3A5B] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg text-[#1B3A5B] tracking-tight">
              Admin Portal
            </span>
          </div>

          {/* Navigation (Client Component for active states) */}
          <AdminNavLinks />

          {/* User Profile / Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Administrator</span>
            </div>
            
            {/* Logout Button (Server Action or Client Handler needed here) */}
             <form action="/api/auth/logout" method="POST">
                <button 
                  type="submit"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" 
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
             </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}