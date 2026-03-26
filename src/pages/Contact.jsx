export default function Contact() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-pottery-800 mb-8">Get in Touch</h1>
        
        <div className="space-y-6 mb-8">
          <p className="text-lg text-pottery-700">
            We'd love to hear from you! Whether you have questions about our products, want to place a custom order, 
            or just want to say hello, feel free to reach out.
          </p>

          <div className="bg-pottery-50 p-6 rounded-lg">
            <h3 className="font-semibold text-pottery-800 mb-4">Contact Information</h3>
            <div className="space-y-2 text-pottery-700">
              <p><strong>Email:</strong> contact@potterystore.com</p>
              <p><strong>Phone:</strong> +1 (512) 555-0178</p>
              <p><strong>Address:</strong> 247 Artisan Way, Arts District, Austin, TX 78701, USA</p>
            </div>
          </div>

          <div className="bg-pottery-50 p-6 rounded-lg">
            <h3 className="font-semibold text-pottery-800 mb-4">Studio Hours</h3>
            <div className="space-y-1 text-pottery-700">
              <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
              <p>Saturday: 11:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-pottery-600 mb-4">Follow us on social media for updates and behind-the-scenes content!</p>
        </div>
      </div>
    </div>
  );
}
