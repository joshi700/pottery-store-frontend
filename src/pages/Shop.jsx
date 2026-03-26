import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);

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

  const categories = ['all', 'bowls', 'plates', 'cups', 'vases', 'decorative', 'other'];

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-pottery-800 mb-8">Shop Our Collection</h1>

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
    </div>
  );
}
