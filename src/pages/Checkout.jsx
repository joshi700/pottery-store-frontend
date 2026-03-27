import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { paymentAPI } from '../utils/api';
import { MapPin, CreditCard, ChevronLeft, Check, Loader2, ShoppingBag } from 'lucide-react';

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
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: shipping, 2: billing, 3: review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Addresses
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [billingAddress, setBillingAddress] = useState(EMPTY_ADDRESS);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Google Pay state
  const [gpayReady, setGpayReady] = useState(false);
  const [gpayConfig, setGpayConfig] = useState(null);
  const paymentsClientRef = useRef(null);
  const gpayButtonRef = useRef(null);

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = cartTotal + shippingCost;

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
    }
  }, []);

  // Initialize Google Pay
  useEffect(() => {
    const initGooglePay = async () => {
      try {
        // Fetch Google Pay config from backend
        const configRes = await paymentAPI.getConfig();
        const config = configRes.data.googlePay;
        setGpayConfig(config);

        // Wait for Google Pay SDK to load
        if (!window.google?.payments?.api?.PaymentsClient) {
          // SDK not loaded yet, retry after a delay
          const retryInterval = setInterval(() => {
            if (window.google?.payments?.api?.PaymentsClient) {
              clearInterval(retryInterval);
              setupGooglePay(config);
            }
          }, 500);
          // Clean up after 10 seconds
          setTimeout(() => clearInterval(retryInterval), 10000);
          return;
        }

        setupGooglePay(config);
      } catch (err) {
        console.error('Failed to initialize Google Pay:', err);
      }
    };

    const setupGooglePay = async (config) => {
      const client = new window.google.payments.api.PaymentsClient({
        environment: config.environment || 'TEST',
      });
      paymentsClientRef.current = client;

      const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: config.allowedAuthMethods || ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: config.allowedCardNetworks || ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
          },
        }],
      };

      try {
        const response = await client.isReadyToPay(isReadyToPayRequest);
        if (response.result) {
          setGpayReady(true);
        }
      } catch (err) {
        console.error('Google Pay isReadyToPay error:', err);
      }
    };

    initGooglePay();
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

      // Step 1: Create order in backend
      const response = await paymentAPI.createOrder({
        amount: orderTotal,
        orderData,
      });

      const { order, googlePay: gpConfig } = response.data;

      // Step 2: Launch Google Pay payment sheet
      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: gpConfig?.allowedAuthMethods || gpayConfig?.allowedAuthMethods || ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: gpConfig?.allowedCardNetworks || gpayConfig?.allowedCardNetworks || ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: gpConfig?.gateway || 'mpgs',
              gatewayMerchantId: gpConfig?.gatewayMerchantId || gpayConfig?.gatewayMerchantId,
            },
          },
        }],
        merchantInfo: {
          merchantId: 'BCR2DN4T7654321', // Google Pay test merchant ID
          merchantName: gpConfig?.merchantName || 'Meenakshi Pottery',
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: orderTotal.toFixed(2),
          currencyCode: 'USD',
          countryCode: 'US',
        },
      };

      const client = paymentsClientRef.current;
      if (!client) {
        throw new Error('Google Pay not initialized');
      }

      const paymentData = await client.loadPaymentData(paymentDataRequest);
      console.log('Google Pay payment data received:', paymentData);

      // Step 3: Send Google Pay token to backend for MPGS processing
      const processResponse = await paymentAPI.processGooglePay({
        orderId: order.orderId,
        paymentData,
      });

      if (processResponse.data.success) {
        // Payment successful — clear cart and navigate to success page
        clearCart();
        navigate(`/order-success?orderId=${order.orderId}&orderNumber=${order.orderNumber}`);
      } else {
        setError(processResponse.data.message || 'Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Order/payment failed:', err);

      // Google Pay cancellation
      if (err.statusCode === 'CANCELED') {
        setError('Payment cancelled. You can try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to process payment. Please try again.');
      }
    } finally {
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

              <AddressForm address={shippingAddress} onChange={setShippingAddress} />

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

              <AddressForm address={billingAddress} onChange={setBillingAddress} />

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

              {/* Payment Section */}
              <div className="border-t border-pottery-200 pt-6 mb-6">
                <h3 className="font-semibold text-pottery-800 mb-3">Payment Method</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="26" viewBox="0 0 40 26">
                    <rect width="40" height="26" rx="4" fill="#fff" stroke="#ddd"/>
                    <text x="20" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4285F4">G</text>
                    <text x="20" y="16" textAnchor="middle" fontSize="8" fontWeight="bold">
                      <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335"> Pay</tspan>
                    </text>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-pottery-800">Google Pay</p>
                    <p className="text-xs text-pottery-600">Powered by Mastercard Gateway</p>
                  </div>
                  {gpayReady && (
                    <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Ready</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(billingSameAsShipping ? 1 : 2)}
                  className="btn btn-secondary flex items-center gap-2">
                  <ChevronLeft size={18} /> Edit Address
                </button>
                <button onClick={handlePlaceOrder} disabled={loading || !gpayReady}
                  className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: loading ? undefined : '#000', borderColor: loading ? undefined : '#000' }}>
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : !gpayReady ? (
                    <><Loader2 size={18} className="animate-spin" /> Loading Google Pay...</>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                      </svg>
                      Pay ${orderTotal.toLocaleString()}
                    </>
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
