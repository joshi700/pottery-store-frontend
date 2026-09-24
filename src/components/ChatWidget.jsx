import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { chatAPI } from '../utils/api';

const STORAGE_KEY = 'chatHistory';
const MAX_CHARS = 1000;

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm the Meenakshi Pottery assistant. I can help you find a piece, answer questions about shipping and returns, or add things to your cart.",
};

const SUGGESTIONS = [
  'Gift ideas under $50',
  'Show me your vases',
  'How long does shipping take?',
  "What's your return policy?",
];

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

function ProductCards({ products, onAdd }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mt-2 -mx-1 px-1">
      {products.map(p => (
        <div key={p.id} className="w-36 shrink-0 bg-white border border-pottery-200 rounded-lg overflow-hidden">
          <Link to={`/product/${p.id}`}>
            <img src={p.image} alt={p.name} className="w-full h-24 object-cover" loading="lazy" />
          </Link>
          <div className="p-2">
            <Link to={`/product/${p.id}`} className="block text-xs font-semibold text-pottery-800 leading-tight line-clamp-2 hover:underline">
              {p.name}
            </Link>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-pottery-700">${p.price.toLocaleString()}</span>
              {p.in_stock ? (
                <button
                  onClick={() => onAdd(p)}
                  className="p-1.5 bg-pottery-600 text-white rounded hover:bg-pottery-700"
                  aria-label={`Add ${p.name} to cart`}
                >
                  <ShoppingCart size={14} />
                </button>
              ) : (
                <span className="text-xs text-pottery-500">Sold out</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const { cart, addToCart, updateQuantity, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch { /* storage unavailable — history just won't survive reloads */ }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (location.pathname.startsWith('/admin')) return null;

  // addToCart opens the cart drawer, which would cover the chat — keep it closed
  const addWithoutDrawer = (product, quantity) => {
    addToCart(product, quantity);
    setIsCartOpen(false);
  };

  const applyActions = (actions = []) => {
    for (const action of actions) {
      if (action.type === 'add_to_cart') addWithoutDrawer(action.product, action.quantity);
      else if (action.type === 'set_quantity') updateQuantity(action.product_id, action.quantity);
      else if (action.type === 'navigate') navigate(action.path);
    }
  };

  const addFromCard = (p) => {
    addWithoutDrawer({ _id: p.id, name: p.name, price: p.price, images: [p.image], quantity: p.stock, isAvailable: true }, 1);
    setMessages(prev => [...prev, { role: 'notice', content: `Added ${p.name} to your cart.` }]);
  };

  const send = async (text) => {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || busy) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setBusy(true);

    try {
      const { data } = await chatAPI.send({
        messages: next.filter(m => m.role === 'user' || m.role === 'assistant').map(({ role, content }) => ({ role, content })),
        cart: cart.map(item => ({ product_id: item._id, quantity: item.quantity })),
        page: location.pathname,
      });
      applyActions(data.actions);
      setMessages(prev => {
        const updated = [...prev];
        if (data.redacted) {
          // Don't keep the card number in stored history
          updated[updated.length - 1] = { role: 'user', content: '[card number removed]' };
          updated.push({ role: 'notice', content: 'For your security, card numbers are removed from chat. Please pay on the checkout page with Google Pay.' });
        }
        const hasCartAction = data.actions?.some(a => a.type !== 'navigate');
        // After a cart change the search results are old news — show the cart link instead
        updated.push({ role: 'assistant', content: data.reply, products: hasCartAction ? [] : data.products, showCartLink: hasCartAction });
        return updated;
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Sorry, I couldn\'t reach the assistant. Please try again.';
      setMessages(prev => [...prev, { role: 'error', content: message }]);
    } finally {
      setBusy(false);
    }
  };

  const onlyWelcome = messages.length === 1;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-pottery-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-pottery-700 transition"
          aria-label="Open shopping assistant"
        >
          <MessageCircle size={22} />
          <span className="hidden sm:inline font-medium">Ask us</span>
        </button>
      )}

      {open && (
        <div
          className="fixed z-40 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-96 h-[85vh] sm:h-[600px] max-h-screen bg-white sm:rounded-2xl shadow-2xl flex flex-col border border-pottery-200"
          role="dialog"
          aria-label="Shopping assistant"
          onKeyDown={e => e.key === 'Escape' && setOpen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-pottery-600 text-white sm:rounded-t-2xl">
            <div>
              <h2 className="font-display font-semibold">Meenakshi Pottery</h2>
              <p className="text-xs text-pottery-100">AI shopping assistant · may make mistakes</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-pottery-700" aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-pottery-50" aria-live="polite">
            {messages.map((m, i) => {
              if (m.role === 'notice' || m.role === 'error') {
                return (
                  <p key={i} className={`text-xs text-center px-3 py-1.5 rounded ${m.role === 'error' ? 'bg-red-50 text-red-700' : 'bg-pottery-100 text-pottery-700'}`}>
                    {m.content}
                  </p>
                );
              }
              const mine = m.role === 'user';
              return (
                <div key={i} className={mine ? 'flex justify-end' : ''}>
                  <div className={`max-w-[85%] ${mine ? '' : 'w-full'}`}>
                    <div className={`inline-block px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${mine ? 'bg-pottery-600 text-white rounded-br-sm' : 'bg-white text-pottery-900 border border-pottery-200 rounded-bl-sm'}`}>
                      {m.content}
                    </div>
                    {m.products?.length > 0 && <ProductCards products={m.products} onAdd={addFromCard} />}
                    {m.showCartLink && (
                      <button onClick={() => setIsCartOpen(true)} className="mt-1 text-xs text-pottery-700 underline hover:text-pottery-900">
                        View cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {busy && (
              <div className="flex items-center gap-2 text-pottery-500 text-sm">
                <Loader2 size={16} className="animate-spin" /> Thinking...
              </div>
            )}
          </div>

          {onlyWelcome && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-pottery-300 text-pottery-700 hover:bg-pottery-100">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={e => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 p-3 border-t border-pottery-200"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Ask about pottery, shipping..."
              className="flex-1 px-3 py-2 rounded-full border border-pottery-200 text-sm focus:outline-none focus:ring-2 focus:ring-pottery-500"
              aria-label="Message"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="p-2 rounded-full bg-pottery-600 text-white hover:bg-pottery-700 disabled:opacity-50"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
