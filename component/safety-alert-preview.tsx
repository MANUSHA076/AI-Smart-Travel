"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

const alerts = [
  {
    title: "Flood Alert",
    subtitle: "Southern Province - Next 24 hours",
    iconClass: "text-orange-500",
  },
  {
    title: "Landslide Risk",
    subtitle: "Central Highlands - High Risk",
    iconClass: "text-red-500",
  },
]

export default function SafetyAlertPreview() {
  return (
    <section className="relative py-20 bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.08),transparent_35%)]" />
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            ⚠ Safety Alerts
          </h2>
          <p className="text-gray-600 mt-2">
            Live preview of current travel risks in Sri Lanka.
          </p>
        </motion.div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              whileHover={{ scale: 1.015 }}
              className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <AlertTriangle className={`mt-1 h-6 w-6 ${alert.iconClass}`} />
              <div>
                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-sm text-gray-600">{alert.subtitle}</p>
              </div>
            </motion.div>
          ))}

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-8"
        >
          <button className="text-sm font-medium text-blue-600 hover:underline">
            View all safety alerts -
          </button>
        </motion.div>

      </div>
    </section>
  )
}
