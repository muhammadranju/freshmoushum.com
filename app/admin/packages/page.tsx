"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Tag,
  Layers,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import { fetchAPI, getProducts } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "mango",
    weight: "",
    quantity: "",
    price: "",
    description: "",
    popular: false,
    stockStatus: "In Stock",
    image: "/fresh_mangoes_hero.png",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      const products = res.data.products || [];
      const sorted = [...products].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0),
      );
      setPackages(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const mangoPackages = useMemo(
    () => packages.filter((p) => p.category === "mango"),
    [packages],
  );
  const lycheePackages = useMemo(
    () => packages.filter((p) => p.category === "lychee"),
    [packages],
  );
  const otherPackages = useMemo(
    () =>
      packages.filter((p) => p.category !== "mango" && p.category !== "lychee"),
    [packages],
  );

  const handleDragEnd = async (event: DragEndEvent, category: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const categoryItems = packages.filter((p) => p.category === category);
      const oldIndex = categoryItems.findIndex((p) => p._id === active.id);
      const newIndex = categoryItems.findIndex((p) => p._id === over.id);

      const reorderedCategoryItems = arrayMove(
        categoryItems,
        oldIndex,
        newIndex,
      );

      // Reconstruct the full packages list with the new order for this category
      const newPackages = [...packages];
      let catIdx = 0;
      newPackages.forEach((p, i) => {
        if (p.category === category) {
          newPackages[i] = reorderedCategoryItems[catIdx++];
        }
      });

      // Update orderIndex based on the final array position
      const finalPackages = newPackages.map((pkg, index) => ({
        ...pkg,
        orderIndex: index,
      }));

      setPackages(finalPackages);

      // Sync with backend
      try {
        await fetchAPI("/product/reorder", {
          method: "PATCH",
          body: JSON.stringify(
            finalPackages.map((p) => ({
              id: p._id,
              orderIndex: p.orderIndex,
            })),
          ),
        });
      } catch (error) {
        console.error("Reorder failed:", error);
        loadPackages();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPackage
        ? `/product/${editingPackage._id}`
        : "/product";
      const method = editingPackage ? "PATCH" : "POST";

      const payload = {
        ...formData,
        price: Number(formData.price),
        orderIndex: editingPackage
          ? editingPackage.orderIndex
          : packages.length,
      };

      await fetchAPI(url, {
        method,
        body: JSON.stringify(payload),
      });

      setIsModalOpen(false);
      setEditingPackage(null);
      loadPackages();
    } catch (error) {
      alert("সমস্যা হয়েছে!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await fetchAPI(`/product/${id}`, { method: "DELETE" });
      loadPackages();
    } catch (error) {
      alert("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  const openEditModal = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      category: pkg.category,
      weight: pkg.weight,
      quantity: pkg.quantity || "",
      price: pkg.price.toString(),
      description: pkg.description,
      popular: pkg.popular,
      stockStatus: pkg.stockStatus,
      image: pkg.image,
    });
    setIsModalOpen(true);
  };

  function SortablePackageCard({ pkg }: { pkg: any }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: pkg._id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : 1,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 relative"
      >
        <div className="relative h-40">
          <img
            src={pkg.image || undefined}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span
              className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
                pkg.stockStatus === "In Stock"
                  ? "bg-white/90 text-green-600"
                  : pkg.stockStatus === "Low Stock"
                    ? "bg-white/90 text-orange-600"
                    : "bg-white/90 text-red-600"
              }`}
            >
              {pkg.stockStatus}
            </span>
            <div
              {...attributes}
              {...listeners}
              className="bg-white/90 p-1.5 rounded-full text-slate-400 cursor-grab active:cursor-grabbing hover:text-primary transition-colors shadow-sm"
            >
              <GripVertical size={14} />
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 truncate text-sm">
              {pkg.name}
            </h3>
            <span className="font-black text-primary text-sm">
              ৳{pkg.price}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Layers size={12} />{" "}
            {pkg.category === "mango" ? pkg.weight : pkg.quantity}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEditModal(pkg)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-colors border border-slate-100"
            >
              <Edit3 size={12} /> এডিট
            </button>
            <button
              onClick={() => handleDelete(pkg._id)}
              className="w-10 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const PackageSection = ({
    title,
    items,
    category,
  }: {
    title: string;
    items: any[];
    category: string;
  }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black text-slate-800">{title}</h2>
        <div className="h-px flex-grow bg-slate-100" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {items.length} প্যাকেজ
        </span>
      </div>

      {items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, category)}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext
            items={items.map((i) => i._id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((pkg) => (
                <SortablePackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[32px] text-slate-400 font-medium">
          এই ক্যাটাগরিতে কোনো প্যাকেজ নেই।
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            প্যাকেজ ম্যানেজমেন্ট
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            হ্যান্ডেল ধরে ড্র্যাগ করে আপনার পছন্দমতো সাজান।
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPackage(null);
            setFormData({
              name: "",
              category: "mango",
              weight: "",
              quantity: "",
              price: "",
              description: "",
              popular: false,
              stockStatus: "In Stock",
              image: "/fresh_mangoes_hero.png",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
        >
          <Plus size={18} />
          নতুন প্যাকেজ
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="space-y-16">
          <PackageSection
            title="আম প্যাকেজসমূহ"
            items={mangoPackages}
            category="mango"
          />
          <PackageSection
            title="লিচু প্যাকেজসমূহ"
            items={lycheePackages}
            category="lychee"
          />
          {otherPackages.length > 0 && (
            <PackageSection
              title="অন্যান্য পণ্য"
              items={otherPackages}
              category="other"
            />
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black">
                  {editingPackage ? "প্যাকেজ এডিট" : "নতুন প্যাকেজ যোগ"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      প্যাকেজের নাম
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      ক্যাটাগরি
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    >
                      <option value="mango">আম</option>
                      <option value="lychee">লিচু</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      ওজন
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      পরিমাণ (পিস)
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      মূল্য (৳)
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                    বর্ণনা
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      স্টক স্ট্যাটাস
                    </label>
                    <select
                      value={formData.stockStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      ইমেজ URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) =>
                      setFormData({ ...formData, popular: e.target.checked })
                    }
                    className="w-5 h-5 accent-primary"
                    id="popular"
                  />
                  <label
                    htmlFor="popular"
                    className="text-sm font-bold text-slate-700"
                  >
                    পপুলার প্যাকেজ হিসেবে দেখান
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/30 mt-4"
                >
                  {editingPackage ? "আপডেট করুন" : "যোগ করুন"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
