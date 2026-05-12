"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Youtube, Loader2 } from "lucide-react";
import { getCMSByKey } from "@/lib/api";

export default function VideoSection() {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getCMSByKey("youtube_video");
        if (res.data) {
          setVideoData(res.data.value);
        }
      } catch (error) {
        console.error("Failed to fetch video content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  const getYoutubeId = (input: string) => {
    if (!input) return null;
    
    // Check if it's an iframe code
    if (input.includes("<iframe")) {
      const srcMatch = input.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        input = srcMatch[1];
      }
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoData?.embedCode ? getYoutubeId(videoData.embedCode) : null;

  if (loading) return null;
  if (!videoId && !videoData?.title) return null;

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-red-600 font-bold tracking-widest uppercase text-sm mb-4"
          >
            <Youtube size={20} />
            আমাদের বাগান সরাসরি দেখুন
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
          >
            {videoData?.title || "আমাদের ফলের বাগান সরাসরি দেখুন"}
          </motion.h2>
          <div className="w-20 h-1.5 bg-red-600 rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />

          <div className="relative aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title="Garden Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <p className="text-slate-400 font-bold">ভিডিও পাওয়া যায়নি</p>
              </div>
            )}
          </div>

          {/* Premium Badge */}
          <div className="absolute -bottom-6 -left-6 md:left-12 bg-white px-6 py-4 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 hidden sm:flex">
             <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                <Play size={24} fill="currentColor" />
             </div>
             <div>
                <p className="text-sm font-black text-slate-900">সরাসরি রাজশাহী থেকে</p>
                <p className="text-xs text-slate-400 font-bold">বিষমুক্ত ফলের নিশ্চয়তা</p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
