import { useState, useEffect } from 'react';
import { productsAPI, adminProductsAPI } from '../../utils/api';
import {
  Plus, Edit3, Trash2, Loader2, Package, X, Save, Star, Search
} from 'lucide-react';

const CATEGORIES = ['plates', 'cups', 'vases', 'jewelry', 'flowers', 'wall-art', 'planters', 'decorative', 'other'];

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  images: [''],
  category: 'bowls',
  quantity: 1,
  dimensions: { height: '', width: '', weight: '' },
  materials: [''],
  careInstructions: '',
  story: '',
  isFeatured: false,
  tags: [''],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory) params.category = filterCategory;
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filterCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      images: product.images?.length > 0 ? product.images : [''],
      category: product.category || 'bowls',
      quantity: product.quantity ?? 1,
      dimensions: product.dimensions || { height: '', width: '', weight: '' },
      materials: product.materials?.length > 0 ? product.materials : [''],
      careInstructions: product.careInstructions || '',
      story: product.story || '',
      isFeatured: product.isFeatured || false,
      tags: product.tags?.length > 0 ? product.tags : [''],
    });
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price) {
      setError('Name, description, and price are required');
      return;
    }
    if (parseFloat(form.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity) || 0,
        images: form.images.filter(img => img.trim()),
        materials: form.materials.filter(m => m.trim()),
        tags: form.tags.filter(t => t.trim()),
      };

      if (editingProduct) {
        await adminProductsAPI.update(editingProduct._id, data);
      } else {
        await adminProductsAPI.create(data);
      }

      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await adminProductsAPI.delete(productId);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const updateArrayField = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-display font-bold text-pottery-800">Manage Products</h1>
        <button onClick={openCreateForm} className="btn btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pottery-400" />
            <input type="text" className="input pl-9 text-sm" placeholder="Search products..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-secondary text-sm">Search</button>
        </form>
        <select className="input max-w-[180px] text-sm" value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 size={48} className="mx-auto text-pottery-600 animate-spin mb-4" />
          <p className="text-pottery-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={48} className="mx-auto text-pottery-400 mb-4" />
          <p className="text-pottery-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="card fade-in">
              <div className="relative">
                <img src={product.images?.[0] || 'https://via.placeholder.com/300'}
                  alt={product.name} className="w-full h-48 object-cover" />
                {product.isFeatured && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Star size={12} /> Featured
                  </span>
                )}
                <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                  product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Sold Out'}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-pottery-800 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-pottery-500 capitalize">{product.category}</p>
                  </div>
                  <p className="font-bold text-pottery-800">${product.price?.toLocaleString()}</p>
                </div>
                <p className="text-sm text-pottery-600 line-clamp-2 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEditForm(product)}
                    className="flex-1 btn btn-secondary text-sm py-2 flex items-center justify-center gap-1">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(product._id)}
                    className="btn text-sm py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {deleteConfirm === product._id && (
                <div className="p-4 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-700 mb-2">Delete this product?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(product._id)}
                      className="btn text-xs py-1.5 px-3 bg-red-600 text-white hover:bg-red-700">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="btn text-xs py-1.5 px-3 bg-white text-pottery-700 hover:bg-pottery-100">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-pottery-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-pottery-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Product Name *</label>
                  <input type="text" className="input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g., Handmade Ceramic Bowl" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Description *</label>
                  <textarea className="input min-h-[100px]" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe this piece..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pottery-700 mb-1">Price ($) *</label>
                    <input type="number" className="input" value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="1500" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pottery-700 mb-1">Quantity</label>
                    <input type="number" className="input" value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                      placeholder="1" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pottery-700 mb-1">Category</label>
                    <select className="input" value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Image URLs</label>
                  {form.images.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="url" className="input flex-1 text-sm" value={img}
                        onChange={e => updateArrayField('images', i, e.target.value)}
                        placeholder="https://images.unsplash.com/..." />
                      {form.images.length > 1 && (
                        <button onClick={() => removeArrayItem('images', i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('images')}
                    className="text-sm text-pottery-600 hover:text-pottery-800 flex items-center gap-1">
                    <Plus size={14} /> Add image
                  </button>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Dimensions</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" className="input text-sm" placeholder="Height" value={form.dimensions.height}
                      onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, height: e.target.value } }))} />
                    <input type="text" className="input text-sm" placeholder="Width" value={form.dimensions.width}
                      onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, width: e.target.value } }))} />
                    <input type="text" className="input text-sm" placeholder="Weight" value={form.dimensions.weight}
                      onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, weight: e.target.value } }))} />
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Materials</label>
                  {form.materials.map((mat, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" className="input flex-1 text-sm" value={mat}
                        onChange={e => updateArrayField('materials', i, e.target.value)}
                        placeholder="e.g., Stoneware clay" />
                      {form.materials.length > 1 && (
                        <button onClick={() => removeArrayItem('materials', i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('materials')}
                    className="text-sm text-pottery-600 hover:text-pottery-800 flex items-center gap-1">
                    <Plus size={14} /> Add material
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Care Instructions</label>
                  <textarea className="input min-h-[80px] text-sm" value={form.careInstructions}
                    onChange={e => setForm(f => ({ ...f, careInstructions: e.target.value }))}
                    placeholder="Handwash recommended..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Artist's Story</label>
                  <textarea className="input min-h-[80px] text-sm" value={form.story}
                    onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                    placeholder="The inspiration behind this piece..." />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-pottery-700 mb-1">Tags</label>
                  {form.tags.map((tag, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" className="input flex-1 text-sm" value={tag}
                        onChange={e => updateArrayField('tags', i, e.target.value)}
                        placeholder="e.g., rustic" />
                      {form.tags.length > 1 && (
                        <button onClick={() => removeArrayItem('tags', i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('tags')}
                    className="text-sm text-pottery-600 hover:text-pottery-800 flex items-center gap-1">
                    <Plus size={14} /> Add tag
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="rounded border-pottery-300 text-pottery-600 focus:ring-pottery-500" />
                  <span className="text-sm text-pottery-700 font-medium flex items-center gap-1">
                    <Star size={14} /> Featured Product
                  </span>
                </label>

                <div className="flex gap-3 pt-4 border-t border-pottery-200">
                  <button onClick={handleSave} disabled={saving}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50">
                    {saving ? (
                      <><Loader2 size={18} className="animate-spin" /> Saving...</>
                    ) : (
                      <><Save size={18} /> {editingProduct ? 'Update Product' : 'Create Product'}</>
                    )}
                  </button>
                  <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
