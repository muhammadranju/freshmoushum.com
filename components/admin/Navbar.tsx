"use client";

import React from "react";
import { Search, Bell, User, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminNavbar() {
  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search orders, customers..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Calendar size={16} />
          <span>{today}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors border-r border-slate-200 pr-6"
        >
          View Site
          <ExternalLink size={14} />
        </Link>

        <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-primary rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-none">Admin User</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-nature-100 rounded-xl flex items-center justify-center text-primary border border-nature-200 shadow-sm group-hover:shadow-md transition-all">
            <User size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}
