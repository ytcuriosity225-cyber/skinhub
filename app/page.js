'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
// Removed local import: import { products } from '@/data/products';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/_/backend/api';
import { ChevronDown, LayoutGrid, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived data for filters
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))], []);
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], []);
  const skinTypes = useMemo(() => {
    const types = new Set();
    products.forEach(p => p.skinType.forEach(t => types.add(t)));
    return [...types];
  }, []);
  const concerns = useMemo(() => {
    const cSet = new Set();
    products.forEach(p => p.concern.forEach(c => cSet.add(c)));
    return [...cSet];
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.concern.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSkinType = !selectedSkinType || product.skinType.includes(selectedSkinType);
      const matchesConcern = !selectedConcern || product.concern.includes(selectedConcern);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesCategory && matchesSkinType && matchesConcern && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedBrand, selectedCategory, selectedSkinType, selectedConcern, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar 
        onFilterClick={() => setIsFilterOpen(true)} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-['Outfit'] tracking-tight mb-2">Marketplace</h1>
            <p className="text-slate-500 font-medium">Discover {filteredProducts.length} premium skincare solutions curated for you.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-sm hover:bg-slate-100 transition-all">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span>Sort: {sortBy.replace('-', ' ')}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-premium border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <button onClick={() => setSortBy('popular')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors">Most Popular</button>
                <button onClick={() => setSortBy('newest')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors">Newest</button>
                <button onClick={() => setSortBy('price-low')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors">Price: Low to High</button>
                <button onClick={() => setSortBy('price-high')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors">Price: High to Low</button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex gap-12">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-32 h-fit max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
            <Filters 
              brands={brands}
              categories={categories}
              skinTypes={skinTypes}
              concerns={concerns}
              selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              selectedSkinType={selectedSkinType} setSelectedSkinType={setSelectedSkinType}
              selectedConcern={selectedConcern} setSelectedConcern={setSelectedConcern}
              priceRange={priceRange} setPriceRange={setPriceRange}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-3xl text-red-500">
                <h3 className="text-xl font-bold">Error loading products</h3>
                <p>{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <LayoutGrid className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand(null);
                    setSelectedCategory(null);
                    setSelectedSkinType(null);
                    setSelectedConcern(null);
                    setPriceRange([0, 10000]);
                  }}
                  className="mt-6 btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[70] p-6 shadow-2xl overflow-y-auto"
            >
              <Filters 
                onClose={() => setIsFilterOpen(false)}
                brands={brands}
                categories={categories}
                skinTypes={skinTypes}
                concerns={concerns}
                selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                selectedSkinType={selectedSkinType} setSelectedSkinType={setSelectedSkinType}
                selectedConcern={selectedConcern} setSelectedConcern={setSelectedConcern}
                priceRange={priceRange} setPriceRange={setPriceRange}
              />
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full mt-6 btn-primary"
              >
                Show {filteredProducts.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
