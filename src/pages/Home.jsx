import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getAll({ featured: 'true', available: 'true' });
        setFeaturedProducts(response.data.products.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <section className="bg-pottery-100 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-pottery-800 mb-6">
            Handcrafted Pottery
          </h1>
          <p className="text-xl text-pottery-700 mb-8 max-w-2xl mx-auto">
            Discover unique, handmade ceramic pieces crafted with love and attention to detail. Each piece tells a story.
          </p>
          <Link to="/shop" className="btn btn-primary inline-flex items-center space-x-2">
            <span>Shop Collection</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-pottery-800 mb-4">
              Featured Pieces
            </h2>
            <p className="text-pottery-600">
              Handpicked pieces from our latest collection
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pottery-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="bg-pottery-100 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-display font-bold text-pottery-800 mb-2">Handmade</h3>
              <p className="text-pottery-700">Every piece is crafted by hand with care</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-pottery-800 mb-2">Unique</h3>
              <p className="text-pottery-700">No two pieces are exactly alike</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-pottery-800 mb-2">Quality</h3>
              <p className="text-pottery-700">Made with premium materials to last</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-pottery-200">
        <div className="container-custom text-center">
          <p className="text-pottery-600 mb-3 text-sm font-medium uppercase tracking-wide">Shop with confidence</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-pottery-600">
            <Link to="/return-policy" className="hover:text-pottery-800 underline">30-Day Return Policy</Link>
            <span className="text-pottery-300">|</span>
            <span>Secure Checkout</span>
            <span className="text-pottery-300">|</span>
            <Link to="/contact" className="hover:text-pottery-800 underline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
