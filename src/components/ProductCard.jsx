import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="card group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold">Sold Out</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-pottery-800 mb-1">
          {product.name}
        </h3>
        <p className="text-pottery-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-pottery-700">
            ${product.price.toLocaleString()}
          </span>
          
          {product.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-pottery-600 text-white rounded-lg hover:bg-pottery-700 transition"
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
