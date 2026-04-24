'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
// import { products } from '@/data/products';
import { 
  Star, 
  ChevronLeft, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  CheckCircle2,
  Info,
  Clock,
  Plus,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products (using first few for now)
        const relRes = await fetch(`${API_URL}/products`);
        const all = await relRes.json();
        setRelatedProducts(all.filter(p => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button onClick={() => router.push('/')} className="btn-primary">Back to Marketplace</button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 p-12 flex items-center justify-center"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square bg-slate-50 rounded-xl border-2 transition-all cursor-pointer ${i === 1 ? 'border-black' : 'border-transparent hover:border-slate-200'}`}>
                   <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-sm font-bold text-premium-gold uppercase tracking-widest block mb-2">{product.brand}</span>
              <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-800">{product.rating}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500 font-medium">128 Reviews</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-3xl font-bold text-black">PKR {product.price.toLocaleString()}</span>
              <p className="text-slate-400 text-sm mt-1">Inclusive of all taxes</p>
            </div>

            <div className="space-y-6 mb-10">
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Skin Type</span>
                    <span className="text-xs text-slate-500">{product.skinType.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Droplets className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Concern</span>
                    <span className="text-xs text-slate-500">{product.concern.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-full px-2 py-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="flex-1 btn-primary flex items-center justify-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <button className="w-full py-4 bg-slate-100 text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                <Zap className="w-5 h-5" />
                <span>Buy It Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5 text-premium-gold" />
              <h3 className="text-lg font-bold">Ingredients</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl italic">
              "{product.ingredients}"
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-premium-gold" />
              <h3 className="text-lg font-bold">Usage Instructions</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl">
              {product.usage}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-premium-gold" />
              <h3 className="text-lg font-bold">Skin Compatibility</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <ul className="space-y-3">
                {product.skinType.map(type => (
                  <li key={type} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Perfect for {type} skin
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold font-['Outfit']">Related Products</h2>
            <button className="text-sm font-bold underline hover:text-premium-gold transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
