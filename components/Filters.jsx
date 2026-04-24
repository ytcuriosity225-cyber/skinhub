'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function Filters({ 
  selectedBrand, setSelectedBrand,
  selectedCategory, setSelectedCategory,
  selectedSkinType, setSelectedSkinType,
  selectedConcern, setSelectedConcern,
  priceRange, setPriceRange,
  brands, categories, skinTypes, concerns,
  onClose
}) {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-xl font-bold">Filters</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Brand Filter */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedBrand === brand 
                  ? 'bg-black text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Category</h3>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black"
              />
              <span className={`text-sm transition-colors ${selectedCategory === cat ? 'font-bold' : 'text-slate-600 group-hover:text-black'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Skin Type Filter */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Skin Type</h3>
        <div className="flex flex-col gap-2">
          {skinTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSkinType === type}
                onChange={() => setSelectedSkinType(selectedSkinType === type ? null : type)}
                className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black"
              />
              <span className={`text-sm transition-colors ${selectedSkinType === type ? 'font-bold' : 'text-slate-600 group-hover:text-black'}`}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Concern Filter */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Concern</h3>
        <div className="flex flex-wrap gap-2">
          {concerns.map(concern => (
            <button
              key={concern}
              onClick={() => setSelectedConcern(selectedConcern === concern ? null : concern)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                selectedConcern === concern 
                  ? 'bg-slate-900 border-slate-900 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Price Range</h3>
        <input 
          type="range" 
          min="0" 
          max="10000" 
          step="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
          <span>PKR 0</span>
          <span>PKR {priceRange[1].toLocaleString()}</span>
        </div>
      </section>

      <button 
        onClick={() => {
          setSelectedBrand(null);
          setSelectedCategory(null);
          setSelectedSkinType(null);
          setSelectedConcern(null);
          setPriceRange([0, 10000]);
        }}
        className="mt-4 text-xs font-bold text-red-500 underline text-left"
      >
        Reset All Filters
      </button>
    </div>
  );
}
