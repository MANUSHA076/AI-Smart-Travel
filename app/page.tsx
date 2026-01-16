
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import Features from "@/component/Features";
import Hero from "@/component/hero";
import Image from "next/image";
import SafetyAlertPreview from "@/component/safety-alert-preview";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <SafetyAlertPreview />
      <Footer />
    </main>
  );
}