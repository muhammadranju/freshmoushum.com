"use client";

import { fetchAPI } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import {
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Filter,
  Loader2,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    orderId: string;
    status: string;
    message: string;
  }>({
    show: false,
    orderId: "",
    status: "",
    message: "",
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const query = filterStatus !== "All" ? `?status=${filterStatus}` : "";
      const res = await fetchAPI(`/order${query}`);
      setOrders(res.data.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const triggerUpdateStatus = (id: string, status: string) => {
    let message = "";
    switch (status) {
      case "Confirmed":
        message = "আপনি কি এই অর্ডারটি কনফার্ম করতে চান?";
        break;
      case "Delivered":
        message = "অর্ডারটি কি ডেলিভারড হিসেবে মার্ক করতে চান?";
        break;
      case "Cancelled":
        message = "আপনি কি নিশ্চিতভাবে এই অর্ডারটি ক্যান্সেল করতে চান?";
        break;
      default:
        message = `আপনি কি স্ট্যাটাস পরিবর্তন করে ${status} করতে চান?`;
    }

    setConfirmModal({
      show: true,
      orderId: id,
      status: status,
      message: message,
    });
  };

  const executeUpdateStatus = async () => {
    const { orderId, status } = confirmModal;
    try {
      await fetchAPI(`/order/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadOrders();
      setSelectedOrder(null);
      setConfirmModal({ show: false, orderId: "", status: "", message: "" });
      toast(`অর্ডার স্ট্যাটাস ${status} করা হয়েছে!`, "success");
    } catch (error) {
      toast("আপডেট করতে সমস্যা হয়েছে।", "error");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Confirmed":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o._id.includes(searchTerm),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            অর্ডার ম্যানেজমেন্ট
          </h1>
          <p className="text-slate-500 font-medium">
            আপনার দোকানের সকল অর্ডার এখান থেকে নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by ID, name or phone..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent text-sm font-bold text-slate-600 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">সকল স্ট্যাটাস</option>
              <option value="Pending">পেন্ডিং</option>
              <option value="Confirmed">কনফার্মড</option>
              <option value="Delivered">ডেলিভারড</option>
              <option value="Cancelled">ক্যান্সেলড</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-slate-900 text-sm uppercase">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-slate-900">
                        {order.customerName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-1">
                        <Phone size={10} /> {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm text-slate-600 font-medium">
                        {order.packageName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">
                        Quantity: {order.quantity}
                      </p>
                    </td>
                    <td className="px-6 py-6 font-black text-slate-900 text-sm">
                      ৳ {order.totalPrice}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={`https://wa.me/${order.phone}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/5 rounded-lg transition-all"
                        >
                          <FaWhatsapp size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    অর্ডার ডিটেইলস
                  </h3>
                  <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                    ID: #{selectedOrder._id?.slice(-6)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                      কাস্টমার তথ্য
                    </h4>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-slate-600 flex items-center gap-2 mt-1">
                      <Phone size={14} /> {selectedOrder.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                      ডেলিভারি ঠিকানা
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      <MapPin size={14} className="inline mr-2" />{" "}
                      {selectedOrder.address}
                    </p>
                  </div>
                  {selectedOrder.note && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                        নোট
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {selectedOrder.note}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">
                      পণ্য এবং পরিমাণ
                    </h4>
                    <div className="p-4 bg-nature-50 rounded-2xl border border-nature-100">
                      <p className="font-bold text-slate-900">
                        {selectedOrder.packageName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 font-medium">
                          Quantity: {selectedOrder.quantity}
                        </span>
                        <span className="font-black text-primary">
                          ৳ {selectedOrder.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selectedOrder.status === "Pending" && (
                      <button
                        onClick={() =>
                          triggerUpdateStatus(selectedOrder._id, "Confirmed")
                        }
                        className="btn-primary py-3 text-sm"
                      >
                        অর্ডার কনফার্ম করুন
                      </button>
                    )}
                    {selectedOrder.status === "Confirmed" && (
                      <button
                        onClick={() =>
                          triggerUpdateStatus(selectedOrder._id, "Delivered")
                        }
                        className="btn-primary py-3 text-sm bg-green-500 hover:bg-green-600 shadow-green-500/20"
                      >
                        ডেলিভারড মার্ক করুন
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${selectedOrder.phone}`}
                      target="_blank"
                      className="w-full h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-all shadow-[#25D366]/20 font-bold text-sm"
                    >
                      <FaWhatsapp size={20} /> হোয়াটসঅ্যাপে মেসেজ
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Clock size={14} /> Order Date:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
                {selectedOrder.status !== "Cancelled" && (
                  <button
                    onClick={() =>
                      triggerUpdateStatus(selectedOrder._id, "Cancelled")
                    }
                    className="text-red-500 hover:underline"
                  >
                    ক্যান্সেল অর্ডার
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                আপনি কি নিশ্চিত?
              </h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setConfirmModal({ ...confirmModal, show: false })
                  }
                  className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  না, ফিরে যান
                </button>
                <button
                  onClick={executeUpdateStatus}
                  className="px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-secondary shadow-lg shadow-primary/20 transition-all"
                >
                  হ্যাঁ, নিশ্চিত করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
