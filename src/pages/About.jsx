export default function About() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-display font-bold text-pottery-800 mb-8">About Meenakshi Pottery</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-pottery-700 leading-relaxed mb-6">
            Welcome to Meenakshi Pottery — a small, passionate studio based in Pune, India, where every piece is shaped
            by hand and fired with care. We bring the ancient craft of pottery into modern homes, blending traditional
            techniques with contemporary design.
          </p>

          <h2 className="text-2xl font-display font-bold text-pottery-800 mb-4 mt-8">Our Story</h2>
          <p className="text-pottery-700 leading-relaxed mb-6">
            Meenakshi Pottery was born out of a deep love for clay and craftsmanship. What began as a personal pursuit
            in a small home studio in Kharadi, Pune, has grown into a thriving business creating unique handcrafted
            ceramic pieces for homes across India. Each item we make carries the warmth of human hands and the soul
            of the artisan who made it.
          </p>

          <h2 className="text-2xl font-display font-bold text-pottery-800 mb-4 mt-8">Our Process</h2>
          <p className="text-pottery-700 leading-relaxed mb-6">
            Every piece is thrown on the potter's wheel or hand-built using traditional techniques. We use high-quality
            clay and glazes, ensuring each creation is both beautiful and functional. After shaping, pieces are
            bisque-fired, glazed, and then fired again to achieve their final finish — a process that can take several
            days from start to finish.
          </p>

          <h2 className="text-2xl font-display font-bold text-pottery-800 mb-4 mt-8">Why Handmade?</h2>
          <p className="text-pottery-700 leading-relaxed mb-6">
            Handmade pottery carries the mark of human touch — slight variations, unique textures, and warmth that
            only comes from pieces crafted with intention. When you choose Meenakshi Pottery, you're not just buying
            a product; you're investing in art that will grace your home for years to come.
          </p>

          <div className="bg-pottery-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-display font-bold text-pottery-800 mb-3">Our Studio</h2>
            <ul className="space-y-1 text-pottery-700">
              <li><strong>Location:</strong> 104 Sapphire, Nyati Empire Society, Kharadi, Pune, Maharashtra, India 411014</li>
              <li><strong>Email:</strong> gaurav@joshig.in</li>
              <li><strong>Phone:</strong> +91 8826230460</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
