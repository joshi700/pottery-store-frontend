import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, authAPI } from '../utils/api';
import { MapPin, CreditCard, ChevronLeft, Plus, Check, Loader2, ShoppingBag } from 'lucide-react';

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
};

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia',
];

const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 150;

const AddressForm = ({ address, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-pottery-700 mb-1">Full Name *</label>
      <input type="text" className="input" value={address.fullName}
        onChange={e => onChange({ ...address, fullName: e.target.value })}
        placeholder="Full name" />
    </div>
    <div>
      <label className="block text-sm font-medium text-pottery-700 mb-1">Phone *</label>
      <input type="tel" className="input" value={address.phone}
        onChange={e => onChange({ ...address, phone: e.target.value })}
        placeholder="10-digit phone number" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-pottery-700 mb-1">Address Line 1 *</label>
      <input type="text" className="input" value={address.addressLine1}
        onChange={e => onChange({ ...address, addressLine1: e.target.value })}
        placeholder="Street address" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-pottery-700 mb-1">Address Line 2</label>
      <input type="text" className="input" value={address.addressLine2 || ''}
        onChange={e => onChange({ ...address, addressLine2: e.target.value })}
        placeholder="Apt, suite, unit (optional)" />
    </div>
    <div>
      <label className="block text-sm font-medium text-pottery-700 mb-1">City *</label>
      <input type="text" className="input" value={address.city}
        onChange={e => onChange({ ...address, city: e.target.value })}
        placeholder="City" />
    </div>
    <div>
      <label className="block text-sm font-medium text-pottery-700 mb-1">State *</label>
      <select className="input" value={address.state}
        onChange={e => onChange({ ...address, state: e.target.value })}>
        <option value="">Select state</option>
        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-pottery-700 mb-1">ZIP Code *</label>
      <input type="text" className="input" value={address.zipCode}
        onChange={e => onChange({ ...address, zipCode: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) })}
        placeholder="ZIP code" maxLength={10} />
    </div>
  </div>
);

const SavedAddressCard = ({ addr, selected, onSelect }) => (
  <button onClick={onSelect}
    className={`w-full text-left p-4 rounded-lg border-2 transition ${
      selected ? 'border-pottery-600 bg-pottery-50' : 'border-pottery-200 hover:border-pottery-400'}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold text-pottery-800">{addr.fullName}</p>
        <p className="text-sm text-pottery-600">{addr.phone}</p>
        <p className="text-sm text-pottery-600 mt-1">
          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
        </p>
        <p className="text-sm text-pottery-600">{addr.city}, {addr.state} {addr.zipCode}</p>
      </div>
      {selected && (
        <div className="bg-pottery-600 rounded-full p-1">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
  </button>
);

const AddressDisplay = ({ title, address }) => (
  <div className="bg-pottery-50 p-4 rounded-lg">
    <h4 className="font-semibold text-pottery-800 mb-2">{title}</h4>
    <p className="text-sm text-pottery-700">{address.fullName}</p>
    <p className="text-sm text-pottery-600">{address.phone}</p>
    <p className="text-sm text-pottery-600">
      {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}
    </p>
    <p className="text-sm text-pottery-600">{address.city}, {address.state} {address.zipCode}</p>
  </div>
);

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: shipping, 2: billing, 3: review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Addresses
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [billingAddress, setBillingAddress] = useState(EMPTY_ADDRESS);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);
  const [savedBillingAddresses, setSavedBillingAddresses] = useState([]);
  const [useNewShipping, setUseNewShipping] = useState(true);
  const [useNewBilling, setUseNewBilling] = useState(true);
  const [saveShippingAddress, setSaveShippingAddress] = useState(false);
  const [saveBillingAddress, setSaveBillingAddress] = useState(false);

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = cartTotal + shippingCost;

  // Load saved addresses on mount
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }

    const loadAddresses = async () => {
      try {
        const res = await authAPI.getMe();
        const userData = res.data.user;
        if (userData.shippingAddresses?.length > 0) {
          setSavedShippingAddresses(userData.shippingAddresses);
          setUseNewShipping(false);
          const defaultAddr = userData.shippingAddresses.find(a => a.isDefault) || userData.shippingAddresses[0];
          setShippingAddress(defaultAddr);
        } else {
          setShippingAddress(prev => ({
            ...prev,
            fullName: user?.name || '',
            phone: user?.phone || '',
          }));
        }
        if (userData.billingAddresses?.length > 0) {
          setSavedBillingAddresses(userData.billingAddresses);
          setUseNewBilling(false);
          const defaultAddr = userData.billingAddresses.find(a => a.isDefault) || userData.billingAddresses[0];
          setBillingAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };

    loadAddresses();
  }, []);

  const validateAddress = (address) => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!address[field]?.trim()) {
        const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `Please fill in ${label}`;
      }
    }
    if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      return 'Please enter a valid ZIP code (e.g., 78701 or 78701-1234)';
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid 10-digit phone number';
    }
    return null;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const err = validateAddress(shippingAddress);
      if (err) { setError(err); return; }
      setError('');
      if (billingSameAsShipping) {
        setBillingAddress({ ...shippingAddress });
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      const err = validateAddress(billingAddress);
      if (err) { setError(err); return; }
      setError('');
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Optionally save new addresses (don't fail checkout if this errors)
      try {
        if (saveShippingAddress && useNewShipping) {
          await authAPI.addShippingAddress(shippingAddress);
        }
        if (saveBillingAddress && useNewBilling && !billingSameAsShipping) {
          await authAPI.addBillingAddress(billingAddress);
        }
      } catch (addrErr) {
        console.warn('Failed to save address:', addrErr);
      }

      const finalBilling = billingSameAsShipping ? { ...shippingAddress } : billingAddress;

      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || '',
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: finalBilling,
        subtotal: cartTotal,
        shippingCost,
      };

      const response = await paymentAPI.createOrder({
        amount: orderTotal,
        orderData,
      });

      const { order, sessionId, gatewayUrl, apiVersion, merchantName } = response.data;

      // Store pending order info for after payment return
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        orderId: order.orderId,
        orderNumber: order.orderNumber,
      }));

      // Remove any existing Mastercard checkout script
      const existingScript = document.getElementById('mastercard-checkout-js');
      if (existingScript) existingScript.remove();

      // Load Mastercard Hosted Checkout script
      const script = document.createElement('script');
      script.src = `${gatewayUrl}/checkout/version/${apiVersion}/checkout.js`;
      script.id = 'mastercard-checkout-js';
      script.setAttribute('data-error', 'errorCallback');
      script.setAttribute('data-cancel', `${window.location.origin}/checkout`);

      script.onload = () => {
        // Wait for the script to fully initialize, then configure and show payment page
        setTimeout(() => {
          if (window.Checkout) {
            window.Checkout.configure({
              session: { id: sessionId },
              interaction: {
                merchant: {
                  name: merchantName || 'Meenakshi Pottery',
                },
              },
            });
            // Clear cart before redirect
            clearCart();
            // Show the hosted payment page (redirects to Mastercard)
            window.Checkout.showPaymentPage();
          } else {
            setError('Failed to load payment gateway. Please try again.');
            setLoading(false);
          }
        }, 500);
      };

      script.onerror = () => {
        setError('Failed to load payment gateway script. Please try again.');
        setLoading(false);
      };

      document.head.appendChild(script);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-pottery-400 mb-4" />
        <h2 className="text-2xl font-display font-bold text-pottery-800 mb-2">Your cart is empty</h2>
        <p className="text-pottery-600 mb-6">Add some pottery pieces before checking out.</p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Browse Shop</button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Shipping' },
          ...(!billingSameAsShipping ? [{ num: 2, label: 'Billing' }] : []),
          { num: 3, label: 'Review & Pay' },
        ].map((s, i, arr) => (
          <div key={s.num} className="flex items-center">
            {i > 0 && <div className={`w-12 h-0.5 ${step >= s.num ? 'bg-pottery-600' : 'bg-pottery-200'}`} />}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step > s.num ? 'bg-pottery-600 text-white' :
                step === s.num ? 'bg-pottery-600 text-white' : 'bg-pottery-200 text-pottery-600'
              }`}>
                {step > s.num ? <Check size={16} /> : s.num === 3 ? arr.length : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === s.num ? 'text-pottery-800' : 'text-pottery-500'}`}>
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form Area */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">{error}</div>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card p-6 fade-in">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-pottery-600" size={24} />
                <h2 className="text-xl font-display font-bold text-pottery-800">Shipping Address</h2>
              </div>

              {savedShippingAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-pottery-700 mb-3">Saved Addresses</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedShippingAddresses.map((addr, i) => (
                      <SavedAddressCard key={addr._id || i} addr={addr}
                        selected={!useNewShipping && shippingAddress._id === addr._id}
                        onSelect={() => { setUseNewShipping(false); setShippingAddress(addr); }} />
                    ))}
                  </div>
                  <button onClick={() => {
                    setUseNewShipping(true);
                    setShippingAddress({ ...EMPTY_ADDRESS, fullName: user?.name || '', phone: user?.phone || '' });
                  }}
                    className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                      useNewShipping ? 'text-pottery-600' : 'text-pottery-500 hover:text-pottery-600'}`}>
                    <Plus size={16} /> Add new address
                  </button>
                </div>
              )}

              {(useNewShipping || savedShippingAddresses.length === 0) && (
                <>
                  <AddressForm address={shippingAddress} onChange={setShippingAddress} />
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input type="checkbox" checked={saveShippingAddress}
                      onChange={e => setSaveShippingAddress(e.target.checked)}
                      className="rounded border-pottery-300 text-pottery-600 focus:ring-pottery-500" />
                    <span className="text-sm text-pottery-700">Save this address for future orders</span>
                  </label>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-pottery-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={billingSameAsShipping}
                    onChange={e => setBillingSameAsShipping(e.target.checked)}
                    className="rounded border-pottery-300 text-pottery-600 focus:ring-pottery-500" />
                  <span className="text-sm text-pottery-700 font-medium">Billing address same as shipping</span>
                </label>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => navigate('/shop')} className="btn btn-secondary flex items-center gap-2">
                  <ChevronLeft size={18} /> Continue Shopping
                </button>
                <button onClick={handleNextStep} className="btn btn-primary">
                  {billingSameAsShipping ? 'Review Order' : 'Next: Billing'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Billing */}
          {step === 2 && (
            <div className="card p-6 fade-in">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-pottery-600" size={24} />
                <h2 className="text-xl font-display font-bold text-pottery-800">Billing Address</h2>
              </div>

              {savedBillingAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-pottery-700 mb-3">Saved Billing Addresses</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedBillingAddresses.map((addr, i) => (
                      <SavedAddressCard key={addr._id || i} addr={addr}
                        selected={!useNewBilling && billingAddress._id === addr._id}
                        onSelect={() => { setUseNewBilling(false); setBillingAddress(addr); }} />
                    ))}
                  </div>
                  <button onClick={() => { setUseNewBilling(true); setBillingAddress(EMPTY_ADDRESS); }}
                    className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                      useNewBilling ? 'text-pottery-600' : 'text-pottery-500 hover:text-pottery-600'}`}>
                    <Plus size={16} /> Add new address
                  </button>
                </div>
              )}

              {(useNewBilling || savedBillingAddresses.length === 0) && (
                <>
                  <AddressForm address={billingAddress} onChange={setBillingAddress} />
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input type="checkbox" checked={saveBillingAddress}
                      onChange={e => setSaveBillingAddress(e.target.checked)}
                      className="rounded border-pottery-300 text-pottery-600 focus:ring-pottery-500" />
                    <span className="text-sm text-pottery-700">Save this billing address</span>
                  </label>
                </>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn btn-secondary flex items-center gap-2">
                  <ChevronLeft size={18} /> Back to Shipping
                </button>
                <button onClick={handleNextStep} className="btn btn-primary">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {step === 3 && (
            <div className="card p-6 fade-in">
              <h2 className="text-xl font-display font-bold text-pottery-800 mb-6">Review Your Order</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <AddressDisplay title="Shipping Address" address={shippingAddress} />
                <AddressDisplay title="Billing Address"
                  address={billingSameAsShipping ? shippingAddress : billingAddress} />
              </div>

              <h3 className="font-semibold text-pottery-800 mb-3">Items ({cart.length})</h3>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-4 p-3 bg-pottery-50 rounded-lg">
                    <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-pottery-800">{item.name}</p>
                      <p className="text-sm text-pottery-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-pottery-800">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(billingSameAsShipping ? 1 : 2)}
                  className="btn btn-secondary flex items-center gap-2">
                  <ChevronLeft size={18} /> Edit Address
                </button>
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="btn btn-primary flex items-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={18} /> Pay ${orderTotal.toLocaleString()}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-display font-bold text-pottery-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-pottery-700">
                    {item.name} <span className="text-pottery-500">x{item.quantity}</span>
                  </span>
                  <span className="text-pottery-800 font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-pottery-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-pottery-600">Subtotal</span>
                <span className="text-pottery-800">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pottery-600">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-pottery-800'}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-pottery-500">
                  Free shipping on orders above ${FREE_SHIPPING_THRESHOLD.toLocaleString()}
                </p>
              )}
              <div className="border-t border-pottery-200 pt-2 flex justify-between text-lg font-bold">
                <span className="text-pottery-800">Total</span>
                <span className="text-pottery-800">${orderTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
