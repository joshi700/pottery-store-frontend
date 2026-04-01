export default function Contact() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-pottery-800 mb-8">Get in Touch</h1>

        <div className="space-y-6 mb-8">
          <p className="text-lg text-pottery-700">
            We'd love to hear from you! Whether you have questions about our products, want to place a custom order,
            or need help with an existing order, feel free to reach out.
          </p>

          <div className="bg-pottery-50 p-6 rounded-lg">
            <h3 className="font-semibold text-pottery-800 mb-4">Customer Support</h3>
            <div className="space-y-3 text-pottery-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:gaurav@meenapottery.com" className="text-pottery-600 underline hover:text-pottery-800">
                  gaurav@meenapottery.com
                </a>
              </p>
              <p><strong>Phone:</strong> +91 8826230460</p>
              <p><strong>Address:</strong> 104 Sapphire, Nyati Empire Society, Kharadi, Pune, Maharashtra, India 411014</p>
              <p className="text-sm text-pottery-500 mt-2">
                Response time: Within 24–48 hours on business days.
              </p>
            </div>
          </div>

          <div className="bg-pottery-50 p-6 rounded-lg">
            <h3 className="font-semibold text-pottery-800 mb-4">Business Hours (IST)</h3>
            <div className="space-y-1 text-pottery-700">
              <p>Monday – Friday: 10:00 AM – 6:00 PM</p>
              <p>Saturday: 11:00 AM – 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-pottery-50 p-6 rounded-lg">
            <h3 className="font-semibold text-pottery-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-pottery-700 text-sm">
              <li>For returns and refunds, see our <a href="/return-policy" className="text-pottery-600 underline hover:text-pottery-800">Return & Refund Policy</a></li>
              <li>For shipping queries, see our <a href="/shipping-policy" className="text-pottery-600 underline hover:text-pottery-800">Shipping Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
