"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Route, Hotel } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const images = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg"
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const [prevImage, setPrevImage] = useState(0)

  // Image cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage)
      setCurrentImage((currentImage + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentImage])

  return (
    <section className="relative h-[85vh] flex items-center justify-center text-center overflow-hidden">
      {/* Background Images (stacked) */}
      {images.map((img, index) => {
        const isActive = index === currentImage
        const isPrev = index === prevImage
        return (
          <motion.div
            key={index}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={img}
              alt="Travel"
              fill
              className="object-cover"
              priority={isActive || isPrev} // pre-load active image
            />
          </motion.div>
        )
      })}

      {/* Glassy/Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-3xl space-y-6 text-white px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold">
          AI-Powered Smart Travel & Safety Platform
        </h1>

        {/* Description */}
        <p className="text-lg">
          Plan safer journeys with real-time alerts, AI-based route analysis,
          and safety-aware hotel recommendations.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="cursor-pointer hover:bg-emerald-300">
            Plan Safe Trip
          </Button>
          <Button size="lg" variant="outline" className="cursor-pointer text-black hover:bg-primary">
            View Safety Alerts
          </Button>
        </div>

        {/* Feature Icons */}
        <div className="mt-10 flex gap-10 justify-center">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
            <span>Safety Alerts</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Route className="h-6 w-6 text-blue-400" />
            <span>AI Routes</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Hotel className="h-6 w-6 text-green-400" />
            <span>Hotel Booking</span>
          </div>
        </div>
      </div>
    </section>
  )
}
