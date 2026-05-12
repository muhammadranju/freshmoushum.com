"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Truck, ShieldCheck, Heart, Star } from "lucide-react";

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "টাটকা পণ্য",
    desc: "প্রতিদিন সরাসরি বাগান থেকে টাটকা ফল সংগ্রহ করা হয়।",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "শতভাগ নিরাপদ",
    desc: "কোনো ফরমালিন বা রাসায়নিক ছাড়াই বিষমুক্ত ফল সরবরাহ করি।",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "সারা দেশে ডেলিভারি",
    desc: "নিরাপদ প্যাকেজিংয়ে সারা দেশে দ্রুত হোম ডেলিভারি।",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "বিশ্বস্ত সেবা",
    desc: "গ্রাহকের সন্তুষ্টিই আমাদের প্রধান লক্ষ্য ও প্রাপ্তি।",
    color: "bg-red-100 text-red-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold mb-4"
            >
              কেন আমাদের বেছে নেবেন?
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight"
            >
              আমরা নিশ্চিত করি <br /><span className="text-primary">বিশুদ্ধ ও প্রাকৃতিক</span> স্বাদ
            </motion.h2>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              ফ্রেশ মৌসুম শুধু একটি ব্র্যান্ড নয়, এটি একটি বিশ্বাস। আমরা জানি আপনার ও আপনার পরিবারের জন্য নিরাপদ খাদ্যের গুরুত্ব কতটা। তাই আমরা কোনো মধ্যস্বত্বভোগী ছাড়াই সরাসরি বাগান থেকে ফল সংগ্রহ করি।
            </p>
            <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-sm border border-nature-100">
               <div className="w-14 h-14 bg-accent-yellow/20 rounded-full flex items-center justify-center text-accent-yellow">
                  <Star size={28} fill="currentColor" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900">৪.৯/৫ গড় রেটিং</h4>
                  <p className="text-sm text-slate-500">হাজারো গ্রাহকের আস্থার প্রতীক</p>
               </div>
            </div>
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-6 w-full">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-nature-100 group"
              >
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
