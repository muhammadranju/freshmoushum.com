"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getCMSByKey } from "@/lib/api";

export default function AboutUs() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await getCMSByKey("about_content");
        if (res.data) setAboutData(res.data.value);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAbout();
  }, []);

  const defaultContent = {
    title: "বাগান থেকে সরাসরি আপনার পরিবারের হাতে",
    description:
      "ফ্রেশ মৌসুম একটি স্বপ্ন, যা শুরু হয়েছে নিরাপদ ও টাটকা খাদ্য মানুষের কাছে পৌঁছে দেওয়ার লক্ষ্য নিয়ে। আমরা রাজশাহীর বিভিন্ন বাগানের মালিকদের সাথে সরাসরি যুক্ত হয়ে সেরা মানের ফলগুলো আপনার জন্য নির্বাচন করি। আমাদের প্রতিটি পণ্য কঠোর গুণগত মান নিয়ন্ত্রণ প্রক্রিয়ার মধ্য দিয়ে যায়। আমরা বিশ্বাস করি, প্রকৃতি আমাদের যা দিয়েছে তা বিশুদ্ধভাবে উপভোগ করার অধিকার সবার আছে।",
    imageUrl: "/fresh_mangoes_hero.png",
    videoUrl: "",
  };

  const content = {
    ...defaultContent,
    ...(aboutData || {}),
  };

  // Helper to validate image URL
  const isValidUrl = (url: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith("/") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    );
  };

  // Ensure image is a valid string and trim whitespace
  const sectionImage = isValidUrl(content.imageUrl)
    ? content.imageUrl.trim()
    : defaultContent.imageUrl;

  return (
    <section id="about" className="py-24 overflow-hidden bg-white/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl aspect-square md:aspect-auto md:h-[600px]">
              <Image
                src={sectionImage}
                alt="Our Farm"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-primary text-white p-10 rounded-[40px] shadow-2xl z-20 hidden md:block">
              <div className="text-4xl font-black mb-1">১০+</div>
              <div className="text-sm opacity-80 uppercase tracking-widest">
                বছরের অভিজ্ঞতা
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-nature-100 rounded-full -z-10 blur-3xl opacity-50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
              {content.title}
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>{content.description}</p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="text-primary font-black text-2xl mb-1">
                    ৫০০+
                  </h4>
                  <p className="text-sm text-slate-500 font-bold uppercase">
                    নিজস্ব বাগান পার্টনার
                  </p>
                </div>
                <div>
                  <h4 className="text-primary font-black text-2xl mb-1">
                    ১০০%
                  </h4>
                  <p className="text-sm text-slate-500 font-bold uppercase">
                    ফরমালিন মুক্ত
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
