const supabase = require('./backend/lib/supabase');
const fs = require('fs');

// Path to your existing products data
// If it's a JS file, we can require it
const { products } = require('./app/data/products');

async function seed() {
  console.log('🌱 Seeding products into Supabase...');

  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert({
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        price_pkr: product.price,
        category: product.category,
        skin_types: product.skinType,
        concerns: product.concern,
        ingredients: product.ingredients ? product.ingredients.split(',').map(i => i.trim()) : [],
        description: product.description,
        usage: product.usage,
        rating: product.rating,
        image_url: product.image,
        stock: 50 // Default stock
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error seeding ${product.name}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${product.name}`);
    }
  }

  console.log('✨ Seeding complete!');
}

seed();
