"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "হোম", href: "#home" },
  { label: "প্যাকেজ", href: "#packages" },
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "মতামত", href: "#reviews" },
  { label: "যোগাযোগ", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
        isOpen ? "bg-white shadow-md" : (scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"),
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
            <Image
              src="/fresh_moushum_logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">
            ফ্রেশ মৌসুম
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-slate-700 hover:text-primary font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#packages" className="btn-primary py-2 px-6 text-sm">
            অর্ডার করুন
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link
            href="/#packages"
            className="p-2 bg-primary/10 text-primary rounded-full"
          >
            <ShoppingCart size={20} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 top-[64px] bg-white z-40 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col p-6 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-700 hover:text-primary border-b border-slate-100 pb-4"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#packages"
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full py-4 text-center mt-4"
          >
            অর্ডার করুন
          </Link>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="tel:+8801799301290"
              className="flex items-center gap-2 text-primary font-bold"
            >
              <Phone size={18} />
              +8801799301290
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
