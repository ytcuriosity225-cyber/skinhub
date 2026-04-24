'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, SlidersHorizontal, User } from 'lucide-react';

export default function Navbar({ onFilterClick, searchQuery, setSearchQuery }) {
  return (
    <nav className="sticky top-0 z-50 glass h-20 flex items-center px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-['Outfit'] tracking-tight flex items-center gap-2">
          <span className="bg-black text-white px-2 py-0.5 rounded-lg">Skin</span>
          <span className="text-black">Hub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products, brands, concerns..."
            className="w-full bg-slate-100/50 border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onFilterClick}
            className="flex md:hidden items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>
          
          <button className="relative text-slate-600 hover:text-black transition-colors group">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </button>
          
          <button className="text-slate-600 hover:text-black transition-colors hidden sm:block">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
