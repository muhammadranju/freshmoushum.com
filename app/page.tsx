import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PackageSection from "@/components/PackageSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutUs from "@/components/AboutUs";
import Reviews from "@/components/Reviews";
import OrderProcess from "@/components/OrderProcess";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PackageSection />
      <WhyChooseUs />
      <AboutUs />
      <Reviews />
      <OrderProcess />
      <VideoSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
