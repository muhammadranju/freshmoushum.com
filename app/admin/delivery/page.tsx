"use client";

import React, { useEffect, useState } from "react";
import { Truck, MapPin, Package, Clock, ShieldCheck, ExternalLink, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { fetchAPI, getCMSByKey } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";

export default function DeliveryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    delivered: 0,
    avgDays: "২.৫ দিন",
  });
  const [deliveryData, setDeliveryData] = useState<any>({
    partners: [
      { id: 1, name: "Pathao", status: "Active", icon: "P" },
      { id: 2, name: "Steadfast", status: "Active", icon: "S" },
    ],
    policy: "আমরা সারা বাংলাদেশে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি নিশ্চিত করি।"
  });

  const loadData = async () => {
    try {
      // Fetch orders for stats
      const ordersRes = await fetchAPI("/order");
      const orders = ordersRes.data.result || [];
      const pending = orders.filter((o: any) => o.status === "Pending" || o.status === "Confirmed").length;
      const delivered = orders.filter((o: any) => o.status === "Delivered").length;
      
      setStats(prev => ({ ...prev, pending, delivered }));

      // Fetch delivery management data
      const cmsRes = await getCMSByKey("delivery_management");
      if (cmsRes.data) {
        setDeliveryData(cmsRes.data.value);
      }
    } catch (error) {
      console.error("Failed to load delivery data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchAPI("/cms", {
        method: "POST",
        body: JSON.stringify({
          key: "delivery_management",
          value: deliveryData,
          description: "Delivery partners and policy management"
        })
      });
      toast("ডেলিভারি সেটিংস সেভ হয়েছে!", "success");
    } catch (error) {
      toast("সেভ করতে সমস্যা হয়েছে।", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">ডেলিভারি ম্যানেজমেন্ট</h1>
          <p className="text-slate-500 font-medium">কুরিয়ার পার্টনার এবং ডেলিভারি স্ট্যাটাস ট্রাক করুন।</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          সেভ করুন
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Package size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{stats.pending.toLocaleString('bn-BD')}</h3>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">পেন্ডিং ডেলিভারি</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{stats.delivered.toLocaleString('bn-BD')}</h3>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">সফল ডেলিভারি</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
            <Clock size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{stats.avgDays}</h3>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">গড় সময়</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
               <h3 className="font-bold text-slate-900">কুরিয়ার পার্টনারসমূহ</h3>
               <button 
                  onClick={() => {
                     const name = prompt("কুরিয়ারের নাম:");
                     if(name) {
                        setDeliveryData({...deliveryData, partners: [...deliveryData.partners, { id: Date.now(), name, status: "Active", icon: name[0] }]});
                     }
                  }}
                  className="text-primary text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm"
               >
                  <Plus size={14} /> যোগ করুন
               </button>
            </div>
            <div className="divide-y divide-slate-50 flex-1 overflow-y-auto max-h-[400px]">
               {deliveryData.partners.map((partner: any) => (
               <div key={partner.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                        {partner.icon}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">{partner.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{partner.status}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <select 
                        value={partner.status}
                        onChange={(e) => {
                           const updated = deliveryData.partners.map((p: any) => p.id === partner.id ? {...p, status: e.target.value} : p);
                           setDeliveryData({...deliveryData, partners: updated});
                        }}
                        className="text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-slate-100 bg-white outline-none"
                     >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                     <button 
                        onClick={() => {
                           const updated = deliveryData.partners.filter((p: any) => p.id !== partner.id);
                           setDeliveryData({...deliveryData, partners: updated});
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg">ডেলিভারি পলিসি</h3>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Policy Content</label>
               <textarea 
                  rows={8}
                  value={deliveryData.policy}
                  onChange={(e) => setDeliveryData({...deliveryData, policy: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-600 focus:border-primary outline-none resize-none leading-relaxed"
                  placeholder="আপনার ডেলিভারি পলিসি এখানে লিখুন..."
               />
               <p className="text-[10px] text-slate-400 font-medium">এই তথ্যটি কাস্টমারদের ইনভয়েস অথবা হেল্প পেজে দেখানো যেতে পারে।</p>
            </div>
         </div>
      </div>
    </div>
  );
}
