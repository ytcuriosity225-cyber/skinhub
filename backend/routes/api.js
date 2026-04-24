const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Get All Products
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Product by Slug
router.get('/products/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// 3. Search Products
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    // Text search using Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Create Order
router.post('/orders', async (req, res) => {
  const { user_id, items, shipping_details, total_amount } = req.body;
  try {
    // Start transaction (manual in JS for Supabase)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id,
        total_amount,
        shipping_name: shipping_details.name,
        shipping_phone: shipping_details.phone,
        shipping_address: shipping_details.address,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      qty: item.quantity,
      price_each: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Post Review
router.post('/reviews', async (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id, product_id, rating, comment })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. AI Recommendation (Proxy to Python service)
router.post('/ai/recommend', async (req, res) => {
  try {
    // Use NEXT_PUBLIC_AI_ENGINE_URL for deployment flexibility
    const aiUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || process.env.PYTHON_AI_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiUrl}/recommend`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'AI Recommendation service unavailable' });
  }
});

// 7. AI Chat with Gemini
router.post('/ai/chat', async (req, res) => {
  const { message, context } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    const prompt = `
      You are SkinHub AI, an expert skincare consultant.
      User Question: ${message}
      
      Skincare context/Products available:
      ${JSON.stringify(context)}
      
      Guidelines:
      - Suggest specific products from the context.
      - Mention key ingredients.
      - Advise based on user concern.
      - MANDATORY SAFETY DISCLAIMER: "Always perform a patch test before using new products. Consult a dermatologist for chronic skin conditions."
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: 'AI Chat failed', details: error.message });
  }
});

module.exports = router;
