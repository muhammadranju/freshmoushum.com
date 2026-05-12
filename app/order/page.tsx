"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, ShoppingBag, Send } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder } from "@/lib/api";

function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPackage = searchParams.get("package") || "সিলেক্ট করুন";
  const selectedPrice = Number(searchParams.get("price")) || 0;
  const selectedWeight = searchParams.get("weight") || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    package: selectedPackage,
    quantity: 1,
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = selectedPrice * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createOrder({
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        packageName: formData.package,
        quantity: formData.quantity,
        totalPrice: totalPrice,
        note: formData.note,
      });
      setIsSuccess(true);
    } catch (error) {
      alert("অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white rounded-[40px] shadow-xl border border-nature-100 p-8"
      >
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          অর্ডার সফল হয়েছে!
        </h2>
        <p className="text-slate-600 mb-10 max-w-md mx-auto">
          আপনার অর্ডারটি আমরা পেয়েছি। কিছুক্ষণের মধ্যেই আমাদের একজন প্রতিনিধি
          আপনাকে কল করে অর্ডারটি নিশ্চিত করবেন।
        </p>
        <Link href="/" className="btn-primary w-full max-w-xs mx-auto">
          হোমপেজে ফিরে যান
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-xl border border-nature-100 overflow-hidden">
      <div className="bg-primary p-8 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ShoppingBag size={24} />
          আপনার তথ্য দিন
        </h2>
        <p className="opacity-80 text-sm mt-2 font-medium">
          নিচের ফরমটি পূরণ করে অর্ডারটি নিশ্চিত করুন
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {selectedPackage !== "সিলেক্ট করুন" && (
          <div className="p-4 bg-nature-50 rounded-2xl border border-nature-100 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  নির্বাচিত প্যাকেজ
                </p>
                <h4 className="text-lg font-bold text-slate-900">
                  {selectedPackage} {selectedWeight && `(${selectedWeight})`}
                </h4>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  মোট দাম
                </p>
                <p className="text-xl font-black text-primary">
                  ৳ {totalPrice}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            গ্রাহকের পূর্ণ নাম
          </label>
          <input
            required
            type="text"
            placeholder="আপনার নাম লিখুন"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            মোবাইল নম্বর
          </label>
          <input
            required
            type="tel"
            placeholder="০১৭XXXXXXXX"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              প্যাকেজ
            </label>
            <input
              readOnly
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border border-slate-100 outline-none text-slate-500 font-medium"
              value={formData.package}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              পরিমাণ (প্যাক)
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            গ্রাহকের পূর্ণ ঠিকানা
          </label>
          <textarea
            required
            rows={3}
            placeholder="গ্রাম/রোড, ইউনিয়ন/থানা, জেলা"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            অতিরিক্ত নোট (ঐচ্ছিক)
          </label>
          <input
            type="text"
            placeholder="কিছু বলার থাকলে এখানে লিখুন"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/30 mt-4"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              প্রসেসিং হচ্ছে...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              অর্ডার নিশ্চিত করুন
              <Send size={20} />
            </span>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 font-medium">
          * কোনো পেমেন্ট গেটওয়ের প্রয়োজন নেই। ক্যাশ অন ডেলিভারি প্রযোজ্য।
        </p>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  const currentYear = new Date().getFullYear();
  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} />
          হোমপেজে ফিরে যান
        </Link>

        <Suspense
          fallback={
            <div className="w-full h-96 bg-white rounded-[40px] animate-pulse flex items-center justify-center">
              <div className="text-slate-300 font-bold">লোডিং...</div>
            </div>
          }
        >
          <OrderForm />
        </Suspense>

        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>© {currentYear} ফ্রেশ মৌসুম - প্রিমিয়াম অর্গানিক ফুড</p>
        </div>
      </div>
    </main>
  );
}
