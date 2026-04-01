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
          We currently ship to the United States.
        </p>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Order Processing</h2>
          <p>
            All orders are processed within <strong>1–2 business days</strong> of payment confirmation.
            Since each piece is handcrafted, some items may require additional preparation time — this will be noted
            on the product page. You will receive a confirmation email once your order is placed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Shipping to the United States</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard Delivery: <strong>7–14 business days</strong></li>
            <li>Expedited Delivery: <strong>4–7 business days</strong> (where available)</li>
            <li>Free standard shipping on all orders above <strong>$50</strong></li>
            <li>Flat rate shipping of <strong>$5.99</strong> for orders under $50</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Shipping Partners</h2>
          <p>
            We ship through trusted international carriers including <strong>DHL</strong>, <strong>FedEx</strong>,
            and <strong>USPS</strong>. The carrier will be assigned based on your location and order size.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Packaging</h2>
          <p>
            Pottery is fragile. Every order is carefully wrapped with bubble wrap, foam padding, and packed in a
            double-walled corrugated box to ensure it arrives safely. We take full responsibility for any damage
            that occurs during transit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Order Tracking</h2>
          <p>
            Once your order is shipped, you will receive an email with your <strong>tracking number</strong> and
            a link to track your shipment in real time. You can also view your order status by logging into your
            account on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Customs & Duties</h2>
          <p>
            International shipments may be subject to import duties and taxes, which are the responsibility of the
            buyer. Meenakshi Pottery is not responsible for any customs delays or additional charges imposed by
            your country's customs authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Damaged in Transit</h2>
          <p>
            If your item arrives damaged, please contact us at{' '}
            <a href="mailto:gaurav@meenapottery.com" className="text-pottery-600 underline hover:text-pottery-800">
              gaurav@meenapottery.com
            </a>{' '}
            within <strong>7 days of delivery</strong> with photos of the damage. We will arrange a free replacement
            or full refund, including all shipping costs.
          </p>
        </section>

        <section className="bg-pottery-50 p-6 rounded-lg">
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Contact Us</h2>
          <p className="mb-3">For any shipping-related queries:</p>
          <ul className="space-y-1">
            <li><strong>Email:</strong>{' '}
              <a href="mailto:gaurav@meenapottery.com" className="text-pottery-600 underline hover:text-pottery-800">
                gaurav@meenapottery.com
              </a>
            </li>
            <li><strong>Phone:</strong> +91 8826230460</li>
            <li><strong>Response time:</strong> Within 24–48 hours</li>
          </ul>
        </section>

        <p className="text-sm text-pottery-500 pt-4 border-t border-pottery-200">
          This policy was last updated on April 1, 2026.
        </p>
      </div>
    </div>
  );
}
