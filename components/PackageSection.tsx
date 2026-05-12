"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/api";

export default function PackageSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const mangoPackages = products.filter((p) => p.category === "mango");
  const lycheePackages = products.filter((p) => p.category === "lychee");

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
          >
            আমাদের অফার
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
          >
            সেরা আমের <span className="text-primary">প্যাকেজসমূহ</span>
          </motion.h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mangoPackages.length > 0 ? (
            mangoPackages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative card-premium flex flex-col group ${
                  pkg.popular ? "ring-4 ring-primary/20 scale-105 z-10" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                    সবচেয়ে জনপ্রিয়
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 text-primary">
                    {/* <span className="text-sm font-bold">৳</span> */}
                    <span className="text-4xl font-black">৳{pkg.price}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 bg-nature-100 rounded-full flex items-center justify-center text-primary">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span>
                      পরিমাণ: <b>{pkg.weight}</b>
                    </span>
                  </div>
                  {pkg.quantity && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-6 h-6 bg-nature-100 rounded-full flex items-center justify-center text-primary">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span>
                        আনুমানিক: <b>{pkg.quantity}</b>
                      </span>
                    </div>
                  )}
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <Link
                  href={`/order?package=${encodeURIComponent(pkg.name)}&price=${pkg.price}&weight=${encodeURIComponent(pkg.weight)}`}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-secondary"
                      : "bg-nature-100 text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  <ShoppingCart size={20} />
                  অর্ডার করুন
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">
              কোনো প্যাকেজ পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* Lychee Section */}
        {lycheePackages.length > 0 && (
          <div className="mt-32">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4"
              >
                বিশেষ অফার
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
              >
                টাটকা রাজশাহীর <span className="text-red-600">লিচু</span>
              </motion.h2>
              <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {lycheePackages.map((pkg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative card-premium flex flex-col group ${
                    pkg.popular ? "ring-4 ring-red-600/20 scale-105 z-10" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                      সবচেয়ে জনপ্রিয়
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1 text-red-600">
                      <span className="text-4xl font-black">৳{pkg.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-base">
                        পরিমাণ: <b>{pkg.weight}</b>
                      </span>
                    </div>
                    {pkg.quantity && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-base">
                          আনুমানিক: <b>{pkg.quantity}</b>
                        </span>
                      </div>
                    )}
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <Link
                    href={`/order?package=${encodeURIComponent(
                      pkg.name,
                    )}&price=${pkg.price}&weight=${encodeURIComponent(
                      pkg.weight,
                    )}`}
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-red-600 text-white shadow-xl shadow-red-600/30 hover:bg-red-700"
                        : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    <ShoppingCart size={20} />
                    অর্ডার করুন
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
