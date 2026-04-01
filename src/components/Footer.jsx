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
              <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#1A1F71"/><text x="18" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">VISA</text></svg>
              <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#252525"/><circle cx="14" cy="12" r="7" fill="#EB001B"/><circle cx="22" cy="12" r="7" fill="#F79E1B"/><path d="M18 6.8a7 7 0 010 10.4 7 7 0 000-10.4z" fill="#FF5F00"/></svg>
              <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#016FD0"/><text x="18" y="15" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">AMEX</text></svg>
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
