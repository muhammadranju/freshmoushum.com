"use client";

import React from "react";
import { motion } from "framer-motion";
import { PackageSearch, ClipboardList, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: <PackageSearch size={32} />,
    title: "প্যাকেজ নির্বাচন করুন",
    desc: "আপনার পছন্দের আম বা লিচু প্যাকটি বেছে নিন।"
  },
  {
    icon: <ClipboardList size={32} />,
    title: "তথ্য দিন",
    desc: "আপনার নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।"
  },
  {
    icon: <CheckCircle2 size={32} />,
    title: "অর্ডার নিশ্চিত করুন",
    desc: "আমরা কল করে আপনার অর্ডারটি কনফার্ম করে নেব।"
  }
];

export default function OrderProcess() {
  return (
    <section className="py-24 bg-nature-50 border-y border-nature-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">কিভাবে অর্ডার করবেন?</h2>
          <div className="bg-primary/10 text-primary px-6 py-2 rounded-full inline-block font-bold text-sm">
            খুবই সহজ ৩টি ধাপে!
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-nature-200 -z-10 hidden md:block" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-nature-100 text-center flex flex-col items-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                {step.icon}
              </div>
              <div className="w-8 h-8 bg-nature-100 text-primary rounded-full flex items-center justify-center font-bold text-sm mb-4">
                ০{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 bg-white inline-block px-8 py-4 rounded-2xl border border-dashed border-primary/30">
            <span className="font-bold text-primary italic">মনে রাখবেন:</span> অনলাইন পেমেন্টের ঝামেলা নেই। অর্ডারের পর সরাসরি যোগাযোগ করা হবে এবং ক্যাশ অন ডেলিভারি দেওয়া হবে।
          </p>
        </div>
      </div>
    </section>
  );
}
