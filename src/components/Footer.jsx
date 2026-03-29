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
                <a href="mailto:gaurav@joshig.in" className="hover:text-white transition-colors">
                  gaurav@joshig.in
                </a>
              </li>
              <li>+91 8826230460</li>
              <li>104 Sapphire, Nyati Empire Society,<br />Kharadi, Pune, Maharashtra 411014</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-pottery-700 mt-10 pt-6 text-center text-sm text-pottery-400">
          &copy; {new Date().getFullYear()} Meenakshi Pottery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
