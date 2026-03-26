import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-pottery-600 hover:text-pottery-800 mb-8">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-pottery-800 mb-8">
        Return & Refund Policy
      </h1>

      <div className="prose prose-pottery max-w-none space-y-8 text-pottery-700">
        <p className="text-lg text-pottery-600">
          At Meenakshi Pottery, every piece is handcrafted with care. We want you to be completely
          satisfied with your purchase. If for any reason you are not happy, we offer a straightforward
          return and refund policy.
        </p>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">30-Day Return Window</h2>
          <p>
            You may return most items within <strong>30 days</strong> of delivery for a full refund or
            exchange. Items must be unused, in their original packaging, and in the same condition you
            received them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items must be returned within 30 days of the delivery date.</li>
            <li>Products must be unused, undamaged, and in their original packaging.</li>
            <li>Custom or personalized orders are non-returnable unless they arrive damaged or defective.</li>
            <li>Sale or clearance items are final sale and cannot be returned.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Damaged or Defective Items</h2>
          <p>
            Since pottery is fragile, we take extra care in packaging every order. However, if your item
            arrives damaged or defective, please contact us within <strong>7 days</strong> of delivery
            with photos of the damage. We will arrange a free replacement or full refund, including
            shipping costs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Email us at{' '}
              <a href="mailto:returns@joshig.in" className="text-pottery-600 underline hover:text-pottery-800">
                returns@joshig.in
              </a>{' '}
              with your order number and reason for return.
            </li>
            <li>Our team will respond within 1-2 business days with return instructions and a shipping label.</li>
            <li>Pack the item securely in its original packaging and ship it back to us.</li>
            <li>Once we receive and inspect the item, we will process your refund.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Refund Processing</h2>
          <p>
            Refunds are processed within <strong>5-7 business days</strong> after we receive and
            inspect the returned item. The refund will be issued to your original payment method.
            Please note that your bank or credit card company may take an additional 5-10 business
            days to post the refund to your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Shipping Costs</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>For defective or damaged items, we cover all return shipping costs.</li>
            <li>For all other returns, the customer is responsible for return shipping costs.</li>
            <li>Original shipping charges are non-refundable unless the return is due to our error.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Exchanges</h2>
          <p>
            If you would like to exchange an item for a different piece, please initiate a return
            and place a new order for the desired item. This ensures the fastest processing time.
          </p>
        </section>

        <section className="bg-pottery-50 p-6 rounded-lg">
          <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Contact Us</h2>
          <p>
            If you have any questions about our return policy, please don't hesitate to reach out:
          </p>
          <ul className="mt-3 space-y-1">
            <li><strong>Email:</strong>{' '}
              <a href="mailto:returns@joshig.in" className="text-pottery-600 underline hover:text-pottery-800">
                returns@joshig.in
              </a>
            </li>
            <li><strong>Phone:</strong> +1 (512) 555-0178</li>
            <li><strong>Address:</strong> 247 Artisan Way, Arts District, Austin, TX 78701, USA</li>
          </ul>
        </section>

        <p className="text-sm text-pottery-500 pt-4 border-t border-pottery-200">
          This policy was last updated on March 26, 2026.
        </p>
      </div>
    </div>
  );
}
