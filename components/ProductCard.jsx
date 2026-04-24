'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="premium-card flex flex-col h-full group"
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full p-6 transition-transform duration-700 group-hover:scale-110"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-slate-800">{product.rating}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`} className="hover:text-black transition-colors">
          <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-snug h-10 mb-3">
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.skinType.slice(0, 1).map((type) => (
            <span key={type} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
              {type}
            </span>
          ))}
          {product.concern.slice(0, 1).map((c) => (
            <span key={c} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Price</span>
            <span className="text-lg font-bold text-black">PKR {product.price.toLocaleString()}</span>
          </div>
          
          <Link 
            href={`/product/${product.slug}`}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center transition-all group-hover:w-32 overflow-hidden relative"
          >
            <ArrowRight className="w-4 h-4 shrink-0 absolute left-3" />
            <span className="ml-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-semibold pr-4">
              View Product
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
