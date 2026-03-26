import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsCartOpen(false)} />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="p-4 border-b border-pottery-200 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-pottery-800">
            Shopping Cart ({cartCount})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-pottery-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-pottery-600 mb-4">Your cart is empty</p>
              <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="btn btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item._id} className="flex gap-4 p-4 bg-pottery-50 rounded-lg">
                  <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-pottery-800">{item.name}</h3>
                    <p className="text-pottery-600">${item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:bg-pottery-200 rounded">
                        <Minus size={16} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-1 hover:bg-pottery-200 rounded disabled:opacity-50">
                        <Plus size={16} />
                      </button>
                      <button onClick={() => removeFromCart(item._id)} className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-pottery-200">
            <div className="flex justify-between mb-4 text-lg font-semibold">
              <span>Total:</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full btn btn-primary">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
