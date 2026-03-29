import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-pottery-600 hover:text-pottery-800 mb-8">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-pottery-800 mb-8">
        Shipping Policy
      </h1>

      <div className="prose prose-pottery max-w-none space-y-8 text-pottery-700">
        <p className="text-lg text-pottery-600">
          At Meenakshi Pottery, we take great care in packaging and shipping every handcrafted piece safely to your door.
        </p>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Processing Time</h2>
          <p>
            All orders are processed within <strong>2–3 business days</strong> of payment confirmation.
            Since each piece is handcrafted, some items may require additional preparation time — this will be noted
            on the product page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Domestic Shipping (India)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard Delivery: <strong>5–8 business days</strong></li>
            <li>Expedited Delivery: <strong>2–4 business days</strong> (where available)</li>
            <li>Free standard shipping on orders above ₹1,500</li>
            <li>Shipping charges for orders below ₹1,500 will be calculated at checkout</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Packaging</h2>
          <p>
            Pottery is fragile. Every order is carefully wrapped with bubble wrap, foam padding, and packed in a
            double-walled corrugated box to ensure it arrives safely. We take full responsibility for damage during transit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Order Tracking</h2>
          <p>
            Once your order is shipped, you will receive an email with your tracking number and a link to track
            your shipment. You can also view your order status by logging into your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Damaged in Transit</h2>
          <p>
            If your item arrives damaged, please contact us at{' '}
            <a href="mailto:gaurav@joshig.in" className="text-pottery-600 underline hover:text-pottery-800">
              gaurav@joshig.in
            </a>{' '}
            within <strong>7 days of delivery</strong> with photos of the damage. We will arrange a free replacement
            or full refund, including all shipping costs.
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
