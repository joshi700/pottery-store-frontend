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
      if (response.data.product) {
        document.title = `${response.data.product.name} - Meenakshi Pottery`;
      }
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

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "url": `https://meenapottery.com/product/${product._id}`,
    "brand": {
      "@type": "Brand",
      "name": "Meenakshi Pottery"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Meenakshi Pottery",
      "url": "https://meenapottery.com"
    },
    ...(product.materials && product.materials.length > 0 && { "material": product.materials.join(", ") }),
    ...(product.dimensions && {
      "width": product.dimensions.width,
      "height": product.dimensions.height,
      "weight": product.dimensions.weight
    }),
    "category": product.category || "Handcrafted Pottery",
    "offers": {
      "@type": "Offer",
      "url": `https://meenapottery.com/product/${product._id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Meenakshi Pottery"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": product.price >= 50 ? "0" : "5.99",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 7, "maxValue": 14, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/ReturnShippingFees"
      }
    }
  } : null;

  const breadcrumbSchema = product ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://meenapottery.com/" },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://meenapottery.com/shop" },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://meenapottery.com/product/${product._id}` }
    ]
  } : null;

  return (
    <div className="py-8">
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
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
                ${product.price.toLocaleString()}
              </span>
              {product.isAvailable ? (
                <span className="text-green-600 font-semibold">In Stock ({product.quantity} available)</span>
              ) : (
                <span className="text-red-600 font-semibold">Sold Out</span>
              )}
            </div>

            <p className="text-pottery-700 mb-6 leading-relaxed">{product.description}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="font-semibold">Dispatch:</span> Within 1–2 business days
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="font-semibold">Delivery:</span> 7–14 business days to the US
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="font-semibold">Shipping:</span> Free on orders above $50
                </div>
              </div>
            </div>

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
