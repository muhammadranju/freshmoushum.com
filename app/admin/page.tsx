"use client";

import { fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Loader2,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FaWhatsapp } from "react-icons/fa";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, analyticsRes] = await Promise.all([
          fetchAPI("/order"),
          fetchAPI("/order/analytics"),
        ]);

        const orders = ordersRes.data.result || [];
        const analyticsData = analyticsRes.data || [];

        const totalSales = orders
          .filter((o: any) => o.status !== "Cancelled")
          .reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);

        const pendingOrders = orders.filter(
          (o: any) => o.status === "Pending",
        ).length;

        const deliveredOrders = orders.filter(
          (o: any) => o.status === "Delivered",
        ).length;

        setAnalytics(analyticsData);
        setData({
          stats: [
            {
              label: "Total Orders",
              value: orders.length.toString(),
              icon: ShoppingBag,
              color: "text-blue-600",
              bg: "bg-blue-100",
              trend: "All Time",
            },
            {
              label: "Delivered Orders",
              value: deliveredOrders.toString(),
              icon: ShoppingBag,
              color: "text-purple-600",
              bg: "bg-purple-100",
              trend: "Success",
            },
            {
              label: "Total Sales",
              value: `৳ ${totalSales.toLocaleString()}`,
              icon: TrendingUp,
              color: "text-green-600",
              bg: "bg-green-100",
              trend: "Revenue",
            },
            {
              label: "Pending Orders",
              value: pendingOrders.toString(),
              icon: Clock,
              color: "text-orange-600",
              bg: "bg-orange-100",
              trend: "To Process",
            },
          ],
          recentOrders: orders.slice(0, 5),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Confirmed":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500">
        <p className="font-bold mb-4 text-red-500">
          ডাটা লোড করতে সমস্যা হয়েছে।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            স্বাগতম, এডমিন!
          </h1>
          <p className="text-slate-500 font-medium">
            আজকের ব্যবসার একনজর আপডেট দেখে নিন।
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-600">
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {data.stats.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-lg text-slate-400">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-tight">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              অর্ডার এনালাইটিক্স
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              গত ৭ দিনের সেলস পারফরম্যান্স
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Orders
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="_id"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{ fontWeight: 800, marginBottom: "4px" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{ r: 6, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">
              সাম্প্রতিক অর্ডার
            </h2>
            <Link
              href="/admin/orders"
              className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              সব দেখুন <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5 font-bold text-slate-900 text-sm">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {order.packageName}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase px-3 py-1.5 rounded-full",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <Link
                        href="/admin/orders"
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">হোয়াটসঅ্যাপ কানেক্ট</h3>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">
                অর্ডার কনফার্মেশনের জন্য সরাসরি কাস্টমারকে মেসেজ পাঠান এক
                ক্লিকেই।
              </p>
              <button className="bg-white text-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2">
                <FaWhatsapp size={18} />
                মেসেজ পাঠান
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform duration-500">
              <FaWhatsapp size={120} fill="currentColor" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              বিকেলের কাজ
            </h3>
            <div className="space-y-4">
              {[
                { t: "নতুন ২০টি অর্ডার প্রসেস করুন", d: "৫টি আম, ১৫টি লিচু" },
                {
                  t: "ডেলিভারি পার্টনারের সাথে যোগাযোগ",
                  d: "আজকের কুরিয়ার সংগ্রহ",
                },
                { t: "পেমেন্ট আপডেট করুন", d: "বকেয়া কালেকশন" },
              ].map((todo, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 mt-1 flex-shrink-0 group-hover:border-primary transition-colors" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{todo.t}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{todo.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CN helper
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
