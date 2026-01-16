import { AlertTriangle } from "lucide-react"

export default function SafetyAlertPreview() {
  return (
    <section className="py-20 bg-gray-50 bg-opacity-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            ⚠ Safety Alerts
          </h2>
          <p className="text-gray-600 mt-2">
            Live preview of current travel risks in Sri Lanka.
          </p>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Alert 1 */}
          <div className="flex items-start gap-4 p-5 border rounded-lg bg-white">
            <AlertTriangle className="h-6 w-6 text-orange-500 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Flood Alert
              </h3>
              <p className="text-sm text-gray-600">
                Southern Province – Next 24 hours
              </p>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="flex items-start gap-4 p-5 border rounded-lg bg-white">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Landslide Risk
              </h3>
              <p className="text-sm text-gray-600">
                Central Highlands – High Risk
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-8">
          <button className="text-sm font-medium text-blue-600 hover:underline">
            View all safety alerts →
          </button>
        </div>

      </div>
    </section>
  )
}
