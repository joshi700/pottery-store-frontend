import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-pottery-600 hover:text-pottery-800 mb-8">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-pottery-800 mb-8">
        Terms & Conditions
      </h1>

      <div className="prose prose-pottery max-w-none space-y-8 text-pottery-700">
        <p className="text-lg text-pottery-600">
          By accessing or purchasing from joshig.in, you agree to be bound by the following terms and conditions.
          Please read them carefully before placing an order.
        </p>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">1. About Us</h2>
          <p>
            This website is operated by Meenakshi Pottery, located at 104 Sapphire, Nyati Empire Society,
            Kharadi, Pune, Maharashtra, India 411014. By using this site, you are engaging with our business
            and agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">2. Products</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All products are handcrafted and may have slight variations in colour, size, and texture — this is a natural characteristic of handmade goods, not a defect.</li>
            <li>Product images are representative; actual pieces may differ slightly.</li>
            <li>We reserve the right to limit quantities or discontinue products at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">3. Pricing & Payment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
            <li>We accept payments via the methods listed at checkout. Payment must be completed before an order is processed.</li>
            <li>We reserve the right to correct pricing errors and will notify you before processing a corrected order.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">4. Orders & Cancellations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders can be cancelled within 24 hours of placement by contacting us at gaurav@joshig.in.</li>
            <li>Once an order has been shipped, it cannot be cancelled — please refer to our Return Policy.</li>
            <li>We reserve the right to cancel orders due to stock unavailability, payment issues, or suspected fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">5. Returns & Refunds</h2>
          <p>
            Please refer to our{' '}
            <Link to="/return-policy" className="text-pottery-600 underline hover:text-pottery-800">
              Return & Refund Policy
            </Link>{' '}
            for full details on returns, exchanges, and refunds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">6. Intellectual Property</h2>
          <p>
            All content on this website — including images, text, logos, and product designs — is the property
            of Meenakshi Pottery and may not be reproduced, distributed, or used without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">7. Limitation of Liability</h2>
          <p>
            Meenakshi Pottery shall not be liable for any indirect, incidental, or consequential damages arising
            from the use of our products or website. Our liability is limited to the value of the order placed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction
            of the courts in Pune, Maharashtra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Changes will be posted on this page with
            an updated date. Continued use of the website after changes constitutes acceptance of the new terms.
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
          These terms were last updated on March 29, 2026.
        </p>
      </div>
    </div>
  );
}
