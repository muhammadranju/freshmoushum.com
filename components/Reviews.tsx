"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { getReviews } from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerSlide);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (reviews.length > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [reviews, activeIndex, itemsPerSlide]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading) return null;
  if (reviews.length === 0) return null;

  const visibleReviews = reviews.slice(
    activeIndex * itemsPerSlide,
    activeIndex * itemsPerSlide + itemsPerSlide
  );

  return (
    <section id="reviews" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
          >
            গ্রাহক সন্তুষ্টি
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            আমাদের গ্রাহকদের <span className="text-primary">মতামত</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="relative">
          <div className="overflow-hidden py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${itemsPerSlide}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleReviews.map((rev, idx) => (
                  <div
                    key={rev._id || idx}
                    className="bg-cream/30 p-8 rounded-[40px] border border-nature-100 shadow-sm relative flex flex-col h-full"
                  >
                    <div className="absolute top-6 right-6 text-primary/10">
                      <Quote size={48} fill="currentColor" />
                    </div>

                    <div className="relative z-10 flex-grow">
                      <div className="flex text-accent-yellow mb-6">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      <p className="text-slate-700 mb-8 leading-relaxed italic font-medium">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-nature-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white flex-shrink-0">
                        <img
                          src={
                            rev.image ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              rev.name
                            )}`
                          }
                          alt={rev.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          {rev.name}
                        </h4>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                          {rev.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="hidden lg:flex justify-between items-center absolute top-1/2 -translate-y-1/2 -left-16 -right-16 pointer-events-none">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all border border-slate-100 pointer-events-auto"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all border border-slate-100 pointer-events-auto"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex lg:hidden justify-center gap-6 mt-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === activeIndex ? "w-8 bg-primary" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
