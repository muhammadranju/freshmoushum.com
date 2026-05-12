"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Loader2,
  X,
  MapPin,
  MessageSquare,
  User,
} from "lucide-react";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  fetchAPI,
} from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    comment: "",
    rating: 5,
    image: "",
  });

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviews();
      setReviews(res.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview(editingReview._id, formData);
      } else {
        await createReview(formData);
      }
      setIsModalOpen(false);
      setEditingReview(null);
      setFormData({
        name: "",
        location: "",
        comment: "",
        rating: 5,
        image: "",
      });
      fetchAllReviews();
    } catch (error) {
      alert("সমস্যা হয়েছে!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await deleteReview(id);
      fetchAllReviews();
    } catch (error) {
      alert("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  const openEditModal = (review: any) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      location: review.location,
      comment: review.comment,
      rating: review.rating,
      image: review.image || "",
    });
    setIsModalOpen(true);
  };

  const filteredReviews = reviews.filter(
    (rev) =>
      rev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            কাস্টমার রিভিউ
          </h1>
          <p className="text-slate-500 font-medium">
            গ্রাহকদের মতামত ম্যানেজ করুন এবং ওয়েবসাইটে প্রদর্শন করুন।
          </p>
        </div>
        <button
          onClick={() => {
            setEditingReview(null);
            setFormData({
              name: "",
              location: "",
              comment: "",
              rating: 5,
              image: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all w-fit"
        >
          <Plus size={18} />
          নতুন রিভিউ যোগ করুন
        </button>
      </div>

      <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
        <Search className="text-slate-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="নাম বা এলাকা দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-slate-700 font-medium"
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 border-slate-50">
                    <img
                      src={
                        rev.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.name)}`
                      }
                      alt={rev.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900">{rev.name}</h3>
                      <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {rev.location}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-2xl italic">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-3 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                কোনো রিভিউ পাওয়া যায়নি
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900">
                {editingReview ? "রিভিউ এডিট করুন" : "নতুন রিভিউ যোগ করুন"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                    <User size={14} /> গ্রাহকের নাম
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all"
                    placeholder="যেমন: আরিফ রহমান"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                    <MapPin size={14} /> এলাকা/শহর
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all"
                    placeholder="যেমন: ঢাকা"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                    <MessageSquare size={14} /> মন্তব্য
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all resize-none"
                    placeholder="গ্রাহকের মন্তব্য এখানে লিখুন..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                      <Star size={14} /> রেটিং (১-৫)
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all appearance-none"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} স্টার
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      ইমেজ URL (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-secondary transition-all"
              >
                {editingReview ? "আপডেট করুন" : "সেভ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
