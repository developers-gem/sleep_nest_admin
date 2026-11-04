import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

const SIZE_PRESETS = {
  mattress: [
    { size: 'Single (72" x 36")', price: '9999', originalPrice: '12999' },
    { size: 'Queen (78" x 60")', price: '14999', originalPrice: '18999' },
    { size: 'King (78" x 72")', price: '18999', originalPrice: '24999' },
  ],
  pillow: [
    { size: 'Standard (18" x 27")', price: '1499', originalPrice: '1999' },
    { size: 'Queen (20" x 30")', price: '1999', originalPrice: '2599' },
    { size: 'King (20" x 36")', price: '2499', originalPrice: '3299' },
  ],
  bedding: [
    { size: 'Single Bed (60" x 90")', price: '2999', originalPrice: '3999' },
    { size: 'Double / Queen (90" x 100")', price: '4499', originalPrice: '5999' },
    { size: 'King (108" x 108")', price: '5999', originalPrice: '7999' },
  ],
  accessories: [
    { size: 'Standard Size', price: '999', originalPrice: '1499' },
  ],
};

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
    isBestSeller: false,
    isNewArrival: true,
  });

  const [sizeVariants, setSizeVariants] = useState(SIZE_PRESETS.mattress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name || '',
        brand: productToEdit.brand || 'SleepNest',
        category: productToEdit.category || 'mattress',
        price: productToEdit.price !== undefined ? String(productToEdit.price) : '',
        originalPrice: productToEdit.originalPrice !== undefined ? String(productToEdit.originalPrice) : '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 20,
        material: productToEdit.material || '',
        description: productToEdit.description || '',
        image: productToEdit.image || '',
        imagesText: (productToEdit.images || []).join('\n'),
        isBestSeller: Boolean(productToEdit.isBestSeller),
        isNewArrival: Boolean(productToEdit.isNewArrival),
      });

      // Load sizeVariants if present
      if (Array.isArray(productToEdit.sizeVariants) && productToEdit.sizeVariants.length > 0) {
        setSizeVariants(
          productToEdit.sizeVariants.map(v => ({
            size: v.size || '',
            price: v.price !== undefined ? String(v.price) : '',
            originalPrice: v.originalPrice !== undefined ? String(v.originalPrice) : '',
          }))
        );
      } else if (Array.isArray(productToEdit.sizes) && productToEdit.sizes.length > 0) {
        setSizeVariants(
          productToEdit.sizes.map(s => ({
            size: s,
            price: productToEdit.price !== undefined ? String(productToEdit.price) : '',
            originalPrice: productToEdit.originalPrice !== undefined ? String(productToEdit.originalPrice) : '',
          }))
        );
      }
    }
  }, [productToEdit]);

  // Update a specific size variant field
  const handleVariantChange = (index, field, value) => {
    const updated = [...sizeVariants];
    updated[index] = { ...updated[index], [field]: value };
    setSizeVariants(updated);

    // If changing price of the first variant and form.price is empty or matched, sync base price
    if (index === 0 && field === 'price') {
      setForm(prev => ({ ...prev, price: value }));
    }
    if (index === 0 && field === 'originalPrice') {
      setForm(prev => ({ ...prev, originalPrice: value }));
    }
  };

  const handleAddVariant = () => {
    setSizeVariants([
      ...sizeVariants,
      { size: '', price: form.price || '', originalPrice: form.originalPrice || '' },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (sizeVariants.length <= 1) return;
    const updated = sizeVariants.filter((_, i) => i !== index);
    setSizeVariants(updated);
  };

  const handleLoadPreset = (cat) => {
    const preset = SIZE_PRESETS[cat] || SIZE_PRESETS.mattress;
    setSizeVariants(preset);
    if (preset.length > 0) {
      setForm(prev => ({
        ...prev,
        price: preset[0].price,
        originalPrice: preset[0].originalPrice,
      }));
    }
  };

  const handleCategoryChange = (newCat) => {
    setForm(prev => ({ ...prev, category: newCat }));
    if (!isEditing) {
      handleLoadPreset(newCat);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }

    // Validate size variants
    const validVariants = sizeVariants
      .filter(v => v.size && v.size.trim().length > 0)
      .map(v => ({
        size: v.size.trim(),
        price: Number(v.price) || 0,
        originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
      }));

    if (validVariants.length === 0) {
      setError('At least one size variant with a name and price is required');
      return;
    }

    const hasInvalidPrice = validVariants.some(v => v.price <= 0);
    if (hasInvalidPrice) {
      setError('Every size variant must have a valid selling price greater than 0');
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

      // Determine lowest base price
      const minPrice = Math.min(...validVariants.map(v => v.price));
      const firstVariant = validVariants[0];

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim() || 'SleepNest',
        category: form.category.toLowerCase(),
        price: Number(form.price) > 0 ? Number(form.price) : minPrice,
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : (firstVariant.originalPrice || undefined),
        discountPrice: Number(form.price) > 0 ? Number(form.price) : minPrice,
        stock: Number(form.stock) || 0,
        inStock: Number(form.stock) > 0,
        material: form.material.trim(),
        description: form.description.trim(),
        image: form.image.trim() || (images[0] || ''),
        images: images,
        sizes: validVariants.map(v => v.size),
        sizeVariants: validVariants,
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
              Configure product specifications, size-specific pricing, inventory stock and image URLs.
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
            <span>Product saved successfully with size-based pricing! Returning to catalog...</span>
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

          {/* 2. Category & Base/Starting Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                Base / Starting Price (₹) <span className="text-red-500">*</span>
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
                Base MRP / Original (₹)
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

          {/* 3. SIZE-SPECIFIC PRICING MANAGER (KEY FEATURE) */}
          <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Size Variants & Pricing</span>
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500">
                  Define custom selling prices and MRPs for each size option.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadPreset(form.category)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Load {form.category} presets
                </button>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Size</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {sizeVariants.map((variant, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col sm:flex-row gap-2.5 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs"
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Size Name / Dimensions
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. King (78x72)"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="w-full sm:w-40">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="18999"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="w-full sm:w-40">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      MRP / Original (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="24999"
                      value={variant.originalPrice}
                      onChange={(e) => handleVariantChange(idx, 'originalPrice', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-0 sm:pt-4 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={sizeVariants.length <= 1}
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title="Remove Size"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Image URL & Live Preview */}
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

          {/* 5. Material & Additional Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Additional Image URLs (one per line)
              </label>
              <textarea
                rows="2"
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                value={form.imagesText}
                onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              ></textarea>
            </div>
          </div>

          {/* 6. Description */}
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

          {/* 7. Switches / Badges */}
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
