import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-pottery-800 text-pottery-100 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">Meenakshi Pottery</h3>
            <p className="text-pottery-300 text-sm leading-relaxed">
              Handcrafted ceramic pieces made with love in Pune, India. Every piece tells a story.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.instagram.com/mahe_by_meenakshi_/" target="_blank" rel="noopener noreferrer" className="text-pottery-300 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/meenakshi-mirajgaoker-a16ab413/" target="_blank" rel="noopener noreferrer" className="text-pottery-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/return-policy" className="text-pottery-300 hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-pottery-300 hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-pottery-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-pottery-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-pottery-300">
              <li>
                <a href="mailto:gaurav@meenapottery.com" className="hover:text-white transition-colors">
                  gaurav@meenapottery.com
                </a>
              </li>
              <li>+91 8826230460</li>
              <li>104 Sapphire, Nyati Empire Society,<br />Kharadi, Pune, Maharashtra 411014</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-pottery-700 mt-10 pt-6 text-center text-sm text-pottery-400 space-y-4">
          <div className="flex justify-center items-center gap-4 text-pottery-300">
            <span className="text-xs uppercase tracking-wide">We Accept</span>
            <div className="flex gap-3">
              <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#5A31F4"/><text x="18" y="14" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif">G Pay</text></svg>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} Meenakshi Pottery. All rights reserved.</p>
          <p>Operated by Gaurav Joshi · Pune, Maharashtra, India</p>
          <p className="text-xs text-pottery-500">
            Meenakshi Pottery is an independent brand and is not affiliated with any other similarly named businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
