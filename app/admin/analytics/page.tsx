"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch orders for total count
      const ordersRes = await fetchAPI("/order");
      const totalOrders = ordersRes.data.meta.total || 0;
      
      // Fetch analytics for last 7 days
      const analyticsRes = await fetchAPI("/order/analytics");
      const analytics = analyticsRes.data || [];
      setChartData(analytics);

      const totalRevenue = analytics.reduce((acc: number, curr: any) => acc + curr.revenue, 0);

      const newStats = [
        { 
          label: "মোট ভিজিটর", 
          value: "১২,৪৫০", // Fallback for now as we don't have visitor tracking yet
          change: "+১২%", 
          isUp: true, 
          icon: Users, 
          color: "blue" 
        },
        { 
          label: "মোট অর্ডার", 
          value: totalOrders.toLocaleString('bn-BD'), 
          change: "+১৮%", 
          isUp: true, 
          icon: ShoppingCart, 
          color: "green" 
        },
        { 
          label: "মোট রেভিনিউ", 
          value: "৳ " + totalRevenue.toLocaleString('bn-BD'), 
          change: "+৫%", 
          isUp: true, 
          icon: TrendingUp, 
          color: "purple" 
        },
      ];
      setStats(newStats);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">এনালিটিক্স</h1>
        <p className="text-slate-500 font-medium">আপনার ব্যবসার প্রবৃদ্ধি এবং কাস্টমার ডাটা বিশ্লেষণ করুন।</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-slate-100 rounded-full transition-all group-hover:scale-150`} />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center`}>
                <item.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${item.isUp ? "text-green-500" : "text-red-500"}`}>
                {item.change}
                {item.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{item.value}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
          {chartData.length > 0 ? (
            <div className="w-full h-full flex flex-col">
              <h4 className="font-bold text-slate-900 mb-6">গত ৭ দিনের বিক্রয় রিপোর্ট</h4>
              <div className="flex-1 flex items-end gap-3 px-4">
                {chartData.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all group-hover:bg-secondary"
                      style={{ height: `${Math.max((day.revenue / Math.max(...chartData.map(d => d.revenue || 1))) * 100, 10)}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 rotate-45 md:rotate-0 mt-2">{day._id.split('-')[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <BarChart3 size={48} className="text-slate-200 mb-4" />
              <h4 className="font-bold text-slate-900">বিক্রয় চার্ট</h4>
              <p className="text-sm text-slate-400 max-w-[200px] mt-2">সাপ্তাহিক এবং মাসিক বিক্রয়ের গ্রাফ এখানে দেখা যাবে।</p>
            </>
          )}
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-slate-200 mb-4" />
          <h4 className="font-bold text-slate-900">ট্রেন্ডিং পণ্য</h4>
          <p className="text-sm text-slate-400 max-w-[200px] mt-2">বর্তমানে জনপ্রিয় পণ্যের তালিকা এখানে দেখা যাবে।</p>
        </div>
      </div>
    </div>
  );
}
