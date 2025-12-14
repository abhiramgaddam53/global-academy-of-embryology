"use client";

import { Users, Video, FileBadge, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,240", change: "+12%", icon: Users, color: "bg-blue-500" },
  { label: "Active Webinars", value: "8", change: "2 New", icon: Video, color: "bg-emerald-500" },
  { label: "Certificates Issued", value: "3,450", change: "+180", icon: FileBadge, color: "bg-amber-500" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/30`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <TrendingUp size={12} /> {stat.change}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-96">
            <h3 className="font-bold text-slate-900 mb-4">Recent Registrations</h3>
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Users size={48} className="mb-2 opacity-20" />
                <p>Chart or List goes here</p>
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-96">
            <h3 className="font-bold text-slate-900 mb-4">Upcoming Webinars</h3>
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Video size={48} className="mb-2 opacity-20" />
                <p>List goes here</p>
            </div>
        </div>
      </div>
    </div>
  );
}