export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              SmartTravel
            </h3>
            <p className="text-sm">
              AI-powered smart travel and safety platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>Features</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Email: manusha@smarttravel.lk</li>
              <li>Phone: +94 76 733 20 59</li>
              <li>Sri Lanka</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          © 2026 SmartTravel. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
