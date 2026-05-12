"use client";

import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Type, Layout, Send, Loader2, Star, CheckCircle2, Youtube } from "lucide-react";
import { getCMSByKey, fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function CMSPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [cmsData, setCmsData] = useState<any>({
    hero_content: {
      tagline: "সরাসরি বাগান থেকে ফ্রেশ ফল",
      title: "সেরা মানের ফ্রেশ ফলমূল পৌঁছে দিচ্ছি আপনার দোরগোড়ায়",
      description: "আমরা সরাসরি বাগান থেকে আম, লিচুসহ সব ধরণের সিজনাল ফল সংগ্রহ করি এবং আপনাদের কাছে পৌঁছে দেই।",
      mainImage: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
      sideImage: "https://images.unsplash.com/photo-1557800636-894a64c1696f",
      whatsapp: "০১৭XXXXXXXX"
    },
    about_content: {
      title: "আমাদের সম্পর্কে",
      description: "ফ্রেশ মৌসুমি ফলের এক নির্ভরযোগ্য নাম 'ফ্রেশ মৌচুম'। আমরা বিষমুক্ত এবং ফ্রেশ ফল সরাসরি বাগান থেকে সংগ্রহ করে থাকি।",
      imageUrl: "/fresh_mangoes_hero.png",
      videoUrl: ""
    },
    banners: {
      promoBanner: "",
      secondaryBanner: ""
    },
    youtube_video: {
      title: "আমাদের বাগান সরাসরি দেখুন",
      embedCode: ""
    }
  });

  useEffect(() => {
    const loadAllCMS = async () => {
      try {
        const keys = ["hero_content", "about_content", "banners", "youtube_video"];
        const results = await Promise.all(keys.map(key => getCMSByKey(key)));
        
        const newData = { ...cmsData };
        results.forEach((res, index) => {
          if (res.data) {
            newData[keys[index]] = res.data.value;
          }
        });
        setCmsData(newData);
      } catch (error) {
        console.error("Failed to load CMS:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllCMS();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      // Helper to trim strings recursively
      const trimStrings = (obj: any): any => {
        if (typeof obj === 'string') return obj.trim();
        if (Array.isArray(obj)) return obj.map(trimStrings);
        if (typeof obj === 'object' && obj !== null) {
          return Object.keys(obj).reduce((acc: any, k) => {
            acc[k] = trimStrings(obj[k]);
            return acc;
          }, {});
        }
        return obj;
      };

      const trimmedValue = trimStrings(cmsData[key]);

      await fetchAPI("/cms", {
        method: "POST",
        body: JSON.stringify({
          key,
          value: trimmedValue,
          description: `${key} management`
        })
      });
      toast("কন্টেন্ট সফলভাবে সেভ হয়েছে!", "success");
    } catch (error) {
      toast("সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">কন্টেন্ট ম্যানেজার</h1>
          <p className="text-slate-500 font-medium">ওয়েবসাইটের লেখা এবং ছবি এখান থেকে পরিবর্তন করুন।</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Tab Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
          {[
            { id: "hero", label: "Hero Section", icon: Layout },
            { id: "about", label: "About Us", icon: Type },
            { id: "banners", label: "Banners", icon: ImageIcon },
            { id: "video", label: "YouTube Video", icon: Youtube },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon === Youtube ? <Youtube size={18} /> : <tab.icon size={18} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-10">
          <div className="flex justify-between items-center mb-10">
             <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')} Editor</h2>
             <button 
                onClick={() => {
                  const keyMap: any = {
                    hero: "hero_content",
                    about: "about_content",
                    banners: "banners",
                    video: "youtube_video"
                  };
                  handleSave(keyMap[activeTab]);
                }}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/10 hover:bg-secondary transition-all disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                সেভ করুন
              </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 max-w-2xl"
          >
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Tagline</label>
                  <input 
                    type="text" 
                    value={cmsData.hero_content.tagline}
                    onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, tagline: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Headline</label>
                  <input 
                    type="text" 
                    value={cmsData.hero_content.title}
                    onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, title: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Subheadline</label>
                  <textarea 
                    rows={3}
                    value={cmsData.hero_content.description}
                    onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, description: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 focus:border-primary outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Main Image URL</label>
                    <input 
                      type="text" 
                      value={cmsData.hero_content.mainImage}
                      onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, mainImage: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Side Image URL</label>
                    <input 
                      type="text" 
                      value={cmsData.hero_content.sideImage}
                      onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, sideImage: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={cmsData.hero_content.whatsapp}
                    onChange={(e) => setCmsData({...cmsData, hero_content: {...cmsData.hero_content, whatsapp: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Section Title</label>
                  <input 
                    type="text" 
                    value={cmsData.about_content.title}
                    onChange={(e) => setCmsData({...cmsData, about_content: {...cmsData.about_content, title: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Description</label>
                  <textarea 
                    rows={6}
                    value={cmsData.about_content.description}
                    onChange={(e) => setCmsData({...cmsData, about_content: {...cmsData.about_content, description: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 focus:border-primary outline-none resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Section Image URL</label>
                  <input 
                    type="text" 
                    value={cmsData.about_content.imageUrl}
                    onChange={(e) => setCmsData({...cmsData, about_content: {...cmsData.about_content, imageUrl: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Video URL (Optional)</label>
                  <input 
                    type="text" 
                    value={cmsData.about_content.videoUrl}
                    onChange={(e) => setCmsData({...cmsData, about_content: {...cmsData.about_content, videoUrl: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "banners" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Promo Banner URL</label>
                  <input 
                    type="text" 
                    value={cmsData.banners.promoBanner}
                    onChange={(e) => setCmsData({...cmsData, banners: {...cmsData.banners, promoBanner: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Secondary Banner URL</label>
                  <input 
                    type="text" 
                    value={cmsData.banners.secondaryBanner}
                    onChange={(e) => setCmsData({...cmsData, banners: {...cmsData.banners, secondaryBanner: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "video" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Video Section Title</label>
                  <input 
                    type="text" 
                    value={cmsData.youtube_video.title}
                    onChange={(e) => setCmsData({...cmsData, youtube_video: {...cmsData.youtube_video, title: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">YouTube URL or Iframe Code</label>
                  <textarea 
                    rows={4}
                    placeholder="https://www.youtube.com/watch?v=... অথবা <iframe>...</iframe>"
                    value={cmsData.youtube_video.embedCode}
                    onChange={(e) => setCmsData({...cmsData, youtube_video: {...cmsData.youtube_video, embedCode: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 focus:border-primary outline-none resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">ইউটিউব ভিডিওর লিঙ্ক অথবা এমবেড কোড এখানে পেস্ট করুন। সিস্টেম অটোমেটিক আইডি খুঁজে নিবে।</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
