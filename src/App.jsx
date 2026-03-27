import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import ReturnPolicy from './pages/ReturnPolicy';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Cart />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
