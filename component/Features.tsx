import { AlertTriangle, Route, Hotel } from "lucide-react"

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Why SmartTravel?
          </h2>
          <p className="mt-3 text-gray-600">
            AI-powered safety features for smarter travel decisions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="rounded-xl border p-6 text-center hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Safety Alerts
            </h3>
            <p className="text-sm text-gray-600">
              Real-time alerts for weather, road conditions,
              and environmental risks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border p-6 text-center hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Route className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              AI Route Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Intelligent route suggestions based on
              safety and real-time conditions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border p-6 text-center hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Hotel className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Safe Hotel Booking
            </h3>
            <p className="text-sm text-gray-600">
              Book accommodations evaluated using
              AI-based safety insights.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
