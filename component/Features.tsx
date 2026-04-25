"use client"

import { AlertTriangle, Route, Hotel } from "lucide-react"
import { motion } from "framer-motion"

const featureCards = [
  {
    icon: AlertTriangle,
    iconClass: "text-orange-500",
    title: "Safety Alerts",
    description:
      "Real-time alerts for weather, road conditions, and environmental risks.",
  },
  {
    icon: Route,
    iconClass: "text-blue-500",
    title: "AI Route Analysis",
    description:
      "Intelligent route suggestions based on safety and real-time conditions.",
  },
  {
    icon: Hotel,
    iconClass: "text-emerald-600",
    title: "Safe Hotel Booking",
    description:
      "Book accommodations evaluated using AI-based safety insights.",
  },
]

export default function Features() {
  return (
    <section className="relative py-20 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,197,94,0.08),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(59,130,246,0.08),transparent_40%)]" />
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Why SmartTravel?
          </h2>
          <p className="mt-3 text-gray-600">
            AI-powered safety features for smarter travel decisions.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.12, duration: 0.55 }}
              whileHover={{ y: -8 }}
              className="rounded-xl border border-slate-200 bg-white/95 p-6 text-center shadow-sm transition"
            >
              <div className="flex justify-center mb-4">
                <card.icon className={`h-8 w-8 ${card.iconClass}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}
