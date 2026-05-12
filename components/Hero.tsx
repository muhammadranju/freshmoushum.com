"use client";

import { getCMSByKey } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getCMSByKey("hero_content");
        if (data.data) {
          setHeroData(data.data.value);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  if (loading) {
    return <div className="h-[600px] bg-slate-50 animate-pulse" />;
  }

  const defaultContent = {
    tagline: "এখনই সিজনাল অফার চলছে!",
    title: "মৌসুমের সেরা ও টাটকা স্বাদ এখন আপনার ঘরে",
    description:
      "রাজশাহীর বিষমুক্ত ফ্রেশ আম, লিচু ও প্রিমিয়াম মৌসুমি পণ্য সরাসরি বাগান থেকে সংগ্রহ করে আমরা পৌঁছে দিচ্ছি আপনার দোরগোড়ায়।",
    mainImage: "/fresh_mangoes_hero.png",
    sideImage: "/fresh_lychees_hero.png",
    whatsapp: "8801799301290",
  };

  const content = {
    ...defaultContent,
    ...(heroData || {}),
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

  // Double check images are valid strings and trim whitespace
  const mainImage = isValidUrl(content.mainImage)
    ? content.mainImage.trim()
    : defaultContent.mainImage;
  const sideImage = isValidUrl(content.sideImage)
    ? content.sideImage.trim()
    : defaultContent.sideImage;

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-nature-100/50 -z-10 rounded-l-[100px] transform translate-x-20 hidden md:block" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-nature-100 text-primary rounded-full text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {content.tagline}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            {content.title}
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#packages" className="btn-primary group">
              অর্ডার করুন
              <ShoppingBag
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
            </Link>
            <a
              href={`https://wa.me/${content.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group"
            >
              হোয়াটসঅ্যাপে যোগাযোগ
              <FaWhatsapp size={20} className="text-[#25D366]" />
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                ৫০০০+ খুশি গ্রাহক
              </p>
              <div className="flex text-accent-yellow">{"★".repeat(5)}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src={mainImage}
              alt="Fresh Mangoes"
              width={600}
              height={500}
              style={{ width: "100%", height: "100%" }}
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-32 h-32 md:w-48 md:h-48 z-20 rounded-3xl overflow-hidden shadow-xl border-4 border-white hidden sm:block"
          >
            <Image
              src={sideImage}
              alt="Lychees"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-nature-100 max-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary">
                <ArrowRight size={20} />
              </div>
              <span className="font-bold text-slate-900">দ্রুত ডেলিভারি</span>
            </div>
            <p className="text-xs text-slate-500">
              ২৪-৪৮ ঘণ্টার মধ্যে সারা দেশে হোম ডেলিভারি
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
