"use client";

import React, { useState, useEffect } from "react";
import { Save, Globe, Phone, Share2, Search, Loader2, ShieldCheck } from "lucide-react";
import { getCMSByKey, fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    general: {
      siteName: "Fresh MouShum",
      siteTagline: "ফ্রেশ ফলমূলের বিশ্বস্ত ঠিকানা",
      logoUrl: "/fresh_moushum_logo.png",
      faviconUrl: "/favicon.ico",
    },
    contact: {
      phone: "০১৭XXXXXXXX",
      whatsapp: "০১৭XXXXXXXX",
      email: "info@freshmoushum.com",
      address: "ঢাকা, বাংলাদেশ",
    },
    seo: {
      metaTitle: "Fresh MouShum - ফ্রেশ ফলমূলের বিশ্বস্ত ঠিকানা",
      metaDescription: "সরাসরি বাগান থেকে ফ্রেশ ফলমূল পৌঁছে দিচ্ছি আপনার দোরগোড়ায়। আম, লিচুসহ সব ধরণের সিজনাল ফল অর্ডার করুন।",
      keywords: "fresh fruits, mango, litchi, organic fruits, bangladesh, fresh food",
      ogImage: "/og-image.png",
    },
    social: {
      facebook: "https://facebook.com/freshmoushum",
      instagram: "https://instagram.com/freshmoushum",
      youtube: "https://youtube.com/freshmoushum",
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getCMSByKey("website_settings");
        if (res.data) {
          setSettings(res.data.value);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchAPI("/cms", {
        method: "POST",
        body: JSON.stringify({
          key: "website_settings",
          value: settings,
          description: "Global website settings (SEO, Contact, Social)"
        })
      });
      toast("সেটিংস সফলভাবে সেভ হয়েছে!", "success");
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
          <h1 className="text-3xl font-black text-slate-900 mb-2">সেটিংস</h1>
          <p className="text-slate-500 font-medium">ওয়েবসাইটের নাম, এসইও এবং কন্টাক্ট ইনফো ম্যানেজ করুন।</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          সব সেভ করুন
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
          {[
            { id: "general", label: "General", icon: Globe },
            { id: "contact", label: "Contact", icon: Phone },
            { id: "seo", label: "SEO Settings", icon: Search },
            { id: "social", label: "Social Links", icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8 max-w-2xl"
          >
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Site Name</label>
                  <input 
                    type="text" 
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, siteName: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Tagline</label>
                  <input 
                    type="text" 
                    value={settings.general.siteTagline}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, siteTagline: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Logo URL</label>
                    <input 
                      type="text" 
                      value={settings.general.logoUrl}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, logoUrl: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Favicon URL</label>
                    <input 
                      type="text" 
                      value={settings.general.faviconUrl}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, faviconUrl: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Phone Number</label>
                    <input 
                      type="text" 
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={settings.contact.whatsapp}
                      onChange={(e) => setSettings({...settings, contact: {...settings.contact, whatsapp: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Support Email</label>
                  <input 
                    type="email" 
                    value={settings.contact.email}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Office Address</label>
                  <textarea 
                    rows={3}
                    value={settings.contact.address}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Meta Title</label>
                  <input 
                    type="text" 
                    value={settings.seo.metaTitle}
                    onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Meta Description</label>
                  <textarea 
                    rows={4}
                    value={settings.seo.metaDescription}
                    onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaDescription: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 focus:border-primary outline-none resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Keywords (comma separated)</label>
                  <input 
                    type="text" 
                    value={settings.seo.keywords}
                    onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Social Share Image (OG Image URL)</label>
                  <input 
                    type="text" 
                    value={settings.seo.ogImage}
                    onChange={(e) => setSettings({...settings, seo: {...settings.seo, ogImage: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                    placeholder="https://example.com/share-image.png"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Recommended size: 1200x630 pixels. This image appears when you share the link.</p>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Facebook Page URL</label>
                  <input 
                    type="text" 
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({...settings, social: {...settings.social, facebook: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Instagram URL</label>
                  <input 
                    type="text" 
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({...settings, social: {...settings.social, instagram: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">YouTube Channel URL</label>
                  <input 
                    type="text" 
                    value={settings.social.youtube}
                    onChange={(e) => setSettings({...settings, social: {...settings.social, youtube: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
