import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-pottery-600 hover:text-pottery-800 mb-8">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-pottery-800 mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-pottery max-w-none space-y-8 text-pottery-700">
        <p className="text-lg text-pottery-600">
          Meenakshi Pottery ("we", "us", or "our") operates joshig.in. This page describes how we collect,
          use, and protect your personal information when you visit or make a purchase from our website.
        </p>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Information We Collect</h2>
          <p>When you place an order or create an account, we collect:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Name, email address, and phone number</li>
            <li>Billing and shipping address</li>
            <li>Payment information (processed securely — we do not store card details)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to customer service requests</li>
            <li>To improve our website and product offerings</li>
            <li>To send promotional emails (only if you opt in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Data Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your data with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Shipping carriers to deliver your order</li>
            <li>Payment processors to securely handle transactions</li>
            <li>Service providers who assist in operating our website (under confidentiality agreements)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Cookies</h2>
          <p>
            Our website uses cookies to improve your browsing experience, remember your cart, and understand
            how visitors use our site. You can disable cookies in your browser settings, though some features
            may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal data. Our website uses
            SSL encryption (HTTPS) for all transactions. However, no method of transmission over the internet
            is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:gaurav@joshig.in" className="text-pottery-600 underline hover:text-pottery-800">
              gaurav@joshig.in
            </a>.
          </p>
        </section>

        <section className="bg-pottery-50 p-6 rounded-lg">
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Contact Us</h2>
          <ul className="space-y-1">
            <li><strong>Email:</strong>{' '}
              <a href="mailto:gaurav@joshig.in" className="text-pottery-600 underline hover:text-pottery-800">
                gaurav@joshig.in
              </a>
            </li>
            <li><strong>Phone:</strong> +91 8826230460</li>
            <li><strong>Address:</strong> 104 Sapphire, Nyati Empire Society, Kharadi, Pune, Maharashtra, India 411014</li>
          </ul>
        </section>

        <p className="text-sm text-pottery-500 pt-4 border-t border-pottery-200">
          This policy was last updated on March 29, 2026.
        </p>
      </div>
    </div>
  );
}
