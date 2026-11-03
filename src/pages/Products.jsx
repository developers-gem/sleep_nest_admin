import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Star,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function Products({ products, onAddClick, onEditClick, onDeleteClick }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'mattress', 'pillow', 'bedding', 'accessories'];

  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory;
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (product.material || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-sm text-slate-500">Manage mattresses, pillows, bedding and inventory prices.</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800">No Products Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No product matches "{search}". Try searching something else or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Stock</th>
                  <th className="py-3 px-5">Highlights</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(product => {
                  const isOutOfStock = (product.stock || 0) <= 0;
                  const isLowStock = !isOutOfStock && (product.stock || 0) <= 5;

                  return (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200'}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate max-w-xs">{product.name}</h4>
                            <p className="text-xs text-slate-400 truncate max-w-xs">{product.brand || 'SleepNest'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize border border-slate-200/60">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-slate-400 line-through">
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-5">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            Only {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            {product.stock} in stock
                          </span>
                        )}
                      </td>

                      {/* Badges / Highlights */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.isBestSeller && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Best Seller
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              New
                            </span>
                          )}
                          <div className="flex items-center text-xs font-semibold text-slate-700 gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{product.rating || '4.8'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditClick(product)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteClick(product._id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

