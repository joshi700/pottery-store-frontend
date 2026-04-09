import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found - Meenakshi Pottery';
  }, []);

  return (
    <div className="container-custom py-20 text-center">
      <h1 className="text-6xl font-display font-bold text-pottery-800 mb-4">404</h1>
      <h2 className="text-2xl font-display text-pottery-700 mb-6">Page Not Found</h2>
      <p className="text-pottery-600 mb-8 max-w-md mx-auto">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/shop" className="btn btn-outline">Browse Shop</Link>
      </div>
    </div>
  );
}
