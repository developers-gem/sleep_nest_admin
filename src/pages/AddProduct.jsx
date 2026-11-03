import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  X, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AddProduct({ productToEdit, onSave, onCancel }) {
  const isEditing = Boolean(productToEdit);

  const [form, setForm] = useState({
    name: '',
    brand: 'SleepNest',
    category: 'mattress',
    price: '',
    originalPrice: '',
    stock: 20,
    material: '',
    description: '',
    image: '',
    imagesText: '',
    sizesText: 'King (78x72), Queen (78x60), Single (78x36)',
    isBestSeller: false,
    isNewArrival: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name || '',
        brand: productToEdit.brand || 'SleepNest',
        category: productToEdit.category || 'mattress',
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 20,
        material: productToEdit.material || '',
        description: productToEdit.description || '',
        image: productToEdit.image || '',
        imagesText: (productToEdit.images || []).join('\n'),
        sizesText: (productToEdit.sizes || []).join(', '),
        isBestSeller: Boolean(productToEdit.isBestSeller),
        isNewArrival: Boolean(productToEdit.isNewArrival),
      });
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError('Please provide a valid price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Split images
      const images = form.imagesText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      // If primary image provided, ensure it's in images array
      if (form.image.trim() && !images.includes(form.image.trim())) {
        images.unshift(form.image.trim());
      }

      // Split sizes
      const sizes = form.sizesText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim() || 'SleepNest',
        category: form.category.toLowerCase(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discountPrice: form.originalPrice ? Number(form.price) : undefined,
        stock: Number(form.stock) || 0,
        inStock: Number(form.stock) > 0,
        material: form.material.trim(),
        description: form.description.trim(),
        image: form.image.trim() || (images[0] || ''),
        images: images,
        sizes: sizes,
        isBestSeller: form.isBestSeller,
        isNewArrival: form.isNewArrival,
      };

      await onSave(payload, productToEdit?._id);
      setSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleImages = {
    mattress: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    pillow: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    bedding: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    accessories: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">
          {isEditing ? `Editing ID: ${productToEdit._id}` : 'Create Mode'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Product Details' : 'Add New Product to SleepNest'}
            </h2>
            <p className="text-xs text-slate-500">
              Fill in product specifications, pricing, inventory stock and image URLs.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>Product saved successfully! Returning to catalog...</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 1. Name & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SleepNest Ortho Memory Foam Mattress"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Brand
              </label>
              <input
                type="text"
                placeholder="SleepNest"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 2. Category & Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 capitalize font-medium"
              >
                <option value="mattress">Mattress</option>
                <option value="pillow">Pillow</option>
                <option value="bedding">Bedding</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="14999"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                MRP / Original Price (₹)
              </label>
              <input
                type="number"
                placeholder="19999"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Warehouse Stock
              </label>
              <input
                type="number"
                placeholder="25"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* 3. Image URL & Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Primary Image URL
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, image: sampleImages[form.category] || sampleImages.mattress })}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
              >
                Use High-Res Sample Image
              </button>
            </div>
            <div className="flex gap-4 items-start">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
                />
              </div>
              {form.image && (
                <div className="w-16 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Sizes & Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                placeholder="King (78x72), Queen (78x60), Single (78x36)"
                value={form.sizesText}
                onChange={(e) => setForm({ ...form, sizesText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Material & Composition
              </label>
              <input
                type="text"
                placeholder="e.g. Natural Latex + Orthopedic High Resilience Foam"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 5. Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product Description
            </label>
            <textarea
              rows="3"
              placeholder="Detailed description of features, benefits, warranty and comfort level..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* 6. Switches / Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-slate-700">Mark as Best Seller</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-slate-700">Mark as New Arrival</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Database...' : isEditing ? 'Update Product' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

