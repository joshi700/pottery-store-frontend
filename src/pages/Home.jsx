import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    document.title = 'Meenakshi Pottery - Handcrafted Ceramics | Shop Handmade Pottery Online';
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, availableOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (availableOnly) params.available = 'true';
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'plates', 'cups', 'vases', 'jewelry', 'flowers', 'wall-art', 'planters', 'decorative', 'other'];

  return (
    <div>
      <section className="bg-pottery-100 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-pottery-800 mb-6">
            Handcrafted Pottery
          </h1>
          <p className="text-xl text-pottery-700 max-w-2xl mx-auto">
            Discover unique, handmade ceramic pieces crafted with love and attention to detail. Each piece tells a story.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-pottery-600" />
              <span className="font-semibold">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === 'all' ? '' : cat)}
                  className={`px-4 py-2 rounded-lg capitalize transition ${
                    (cat === 'all' && !category) || category === cat
                      ? 'bg-pottery-600 text-white'
                      : 'bg-pottery-100 text-pottery-800 hover:bg-pottery-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 ml-auto">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Available only</span>
            </label>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pottery-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-pottery-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
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

      <section className="py-10 bg-pottery-50 border-t border-pottery-200">
        <div className="container-custom text-center">
          <p className="text-pottery-700 mb-3 text-sm font-semibold uppercase tracking-wide">Shop with confidence</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-pottery-600">
            <Link to="/return-policy" className="hover:text-pottery-800 underline">30-Day Return Policy</Link>
            <span className="text-pottery-300">|</span>
            <Link to="/shipping-policy" className="hover:text-pottery-800 underline">Free Shipping on $50+</Link>
            <span className="text-pottery-300">|</span>
            <span>Secure Checkout (SSL)</span>
            <span className="text-pottery-300">|</span>
            <Link to="/contact" className="hover:text-pottery-800 underline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
