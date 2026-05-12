"use client";

import { Check, Copy, Plus, Send, Trash2, Loader2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { getCMSByKey, fetchAPI } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: "", message: "" });
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  const [directMessage, setDirectMessage] = useState({ phone: "", message: "" });

  const loadTemplates = async () => {
    try {
      const res = await getCMSByKey("whatsapp_templates");
      if (res.data) {
        setTemplates(res.data.value || []);
      } else {
        // Default templates if none exist
        setTemplates([
          { id: 1, title: "অর্ডার নিশ্চিতকরণ", message: "সুপ্রভাত! আপনার 'ফ্রেশ মৌসুম' অর্ডারটি (#ID) আমরা পেয়েছি এবং নিশ্চিত করেছি। শীঘ্রই পণ্যটি আপনার ঠিকানায় পাঠানো হবে। ধন্যবাদ।" },
          { id: 2, title: "ডেলিভারি আপডেট", message: "আপনার অর্ডারটি আজ ডেলিভারির জন্য পাঠানো হয়েছে। কুরিয়ার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।" }
        ]);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSaveTemplates = async (updatedTemplates: any[]) => {
    setSaving(true);
    try {
      await fetchAPI("/cms", {
        method: "POST",
        body: JSON.stringify({
          key: "whatsapp_templates",
          value: updatedTemplates,
          description: "WhatsApp quick reply templates"
        })
      });
      setTemplates(updatedTemplates);
      toast("টেমপ্লেট সফলভাবে সেভ হয়েছে!", "success");
    } catch (error) {
      toast("সেভ করতে সমস্যা হয়েছে।", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (id: number | string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast("মেসেজ কপি করা হয়েছে!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addTemplate = () => {
    if (!newTemplate.title || !newTemplate.message) return;
    const updated = [...templates, { ...newTemplate, id: Date.now() }];
    handleSaveTemplates(updated);
    setNewTemplate({ title: "", message: "" });
    setIsModalOpen(false);
  };

  const deleteTemplate = (id: number | string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই টেমপ্লেটটি মুছে ফেলতে চান?")) return;
    const updated = templates.filter(t => t.id !== id);
    handleSaveTemplates(updated);
  };

  const handleSendDirect = () => {
    if (!directMessage.phone || !directMessage.message) {
      toast("নম্বর এবং মেসেজ উভয়ই প্রয়োজন", "error");
      return;
    }
    const cleanPhone = directMessage.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(directMessage.message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            হোয়াটসঅ্যাপ কুইক রিপ্লাই
          </h1>
          <p className="text-slate-500 font-medium">
            কাস্টমারদের দ্রুত রিপ্লাই দেওয়ার জন্য মেসেজ টেমপ্লেট ব্যবহার করুন।
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#25D366]/20 hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          নতুন টেমপ্লেট
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AnimatePresence>
            {templates.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{t.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(t.id, t.message)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-lg transition-all"
                    >
                      {copiedId === t.id ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                    <button 
                      onClick={() => deleteTemplate(t.id)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                  {t.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {templates.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] text-slate-400">
               কোনো টেমপ্লেট নেই। নতুন যোগ করুন।
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-[40px] p-10 text-white relative h-fit sticky top-28 border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center">
              <FaWhatsapp size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">ডিরেক্ট মেসেজ</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Manual Send
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                মোবাইল নম্বর
              </label>
              <input
                type="text"
                placeholder="০১৭XXXXXXXX"
                value={directMessage.phone}
                onChange={(e) => setDirectMessage({...directMessage, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#25D366] transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                মেসেজ
              </label>
              <textarea
                rows={4}
                placeholder="আপনার মেসেজ এখানে লিখুন..."
                value={directMessage.message}
                onChange={(e) => setDirectMessage({...directMessage, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#25D366] transition-all resize-none"
              />
            </div>
            <button 
              onClick={handleSendDirect}
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
            >
              মেসেজ পাঠান
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for new template */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black">নতুন টেমপ্লেট</h3>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                      <X size={24} />
                   </button>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">টেমপ্লেট টাইটেল</label>
                      <input 
                        type="text" 
                        value={newTemplate.title}
                        onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-primary"
                        placeholder="যেমন: অর্ডার নিশ্চিতকরণ"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">মেসেজ কন্টেন্ট</label>
                      <textarea 
                        rows={4}
                        value={newTemplate.message}
                        onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-primary resize-none"
                        placeholder="আপনার মেসেজ এখানে লিখুন..."
                      />
                   </div>
                   <button 
                     onClick={addTemplate}
                     disabled={saving}
                     className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-secondary transition-all"
                   >
                     {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                     টেমপ্লেট সেভ করুন
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
