import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pottery-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-pottery-800 mb-4">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg ${
                    selectedImage === idx ? 'ring-2 ring-pottery-600' : ''
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-pottery-800 mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-pottery-700">
                ₹{product.price.toLocaleString()}
              </span>
              {product.isAvailable ? (
                <span className="text-green-600 font-semibold">In Stock ({product.quantity} available)</span>
              ) : (
                <span className="text-red-600 font-semibold">Sold Out</span>
              )}
            </div>

            <p className="text-pottery-700 mb-6 leading-relaxed">{product.description}</p>

            {product.story && (
              <div className="bg-pottery-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-pottery-800 mb-2">Artist's Note</h3>
                <p className="text-pottery-700">{product.story}</p>
              </div>
            )}

            {product.dimensions && (
              <div className="mb-6">
                <h3 className="font-semibold text-pottery-800 mb-2">Dimensions</h3>
                <div className="flex gap-4 text-sm text-pottery-700">
                  {product.dimensions.height && <span>Height: {product.dimensions.height}</span>}
                  {product.dimensions.width && <span>Width: {product.dimensions.width}</span>}
                  {product.dimensions.weight && <span>Weight: {product.dimensions.weight}</span>}
                </div>
              </div>
            )}

            {product.materials && product.materials.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-pottery-800 mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, idx) => (
                    <span key={idx} className="bg-pottery-100 px-3 py-1 rounded-full text-sm text-pottery-700">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.careInstructions && (
              <div className="mb-6">
                <h3 className="font-semibold text-pottery-800 mb-2">Care Instructions</h3>
                <p className="text-sm text-pottery-700">{product.careInstructions}</p>
              </div>
            )}

            <div className="flex gap-4">
              {product.isAvailable && (
                <>
                  <button onClick={handleAddToCart} className="flex-1 btn btn-outline flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 btn btn-primary">
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
