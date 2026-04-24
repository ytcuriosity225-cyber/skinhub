import os
import logging
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv

# Configure logging early so it is available during module import (e.g. dotenv fallbacks)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from supabase import create_client, Client
except Exception:
    create_client = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

# Load .env robustly (works inside Docker and when running from different cwd)
# Try find_dotenv first, then a few common locations as a fallback so Docker builds still pick it up
dotenv_path = find_dotenv(usecwd=True)
if dotenv_path:
    load_dotenv(dotenv_path)
else:
    # best-effort fallbacks: current working directory, parent, and /app (common Docker WORKDIR)
    tried = []
    for p in [".env", os.path.join(os.getcwd(), '.env'), os.path.join(os.getcwd(), '..', '.env'), '/app/.env']:
        tried.append(p)
        if os.path.exists(p):
            load_dotenv(p)
            logger.info(f"Loaded .env from fallback path: {p}")
            break
    else:
        # Last resort: call load_dotenv() to allow python-dotenv to search standard locations
        load_dotenv()
        logger.info(f"load_dotenv attempted fallbacks: {tried}")

# logger already configured at module import

app = FastAPI(title="Azzivone AI Engine")

# Allow CORS from any origin for now (restrict later to your Vercel domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase initialization (safe if keys are missing during build)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or create_client is None:
    logger.warning("Missing Key: SUPABASE_URL or SUPABASE_KEY (SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY) or supabase package not available. Supabase client not initialized.")
    supabase = None
else:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized")
    except Exception as e:
        logger.exception("Failed to initialize Supabase client")
        supabase = None

# Load embedding model (best-effort; may be heavy)
if SentenceTransformer is None:
    logger.warning("sentence-transformers package not available; embeddings disabled")
    embed_model = None
else:
    try:
        logger.info("Loading embedding model (sentence-transformers/all-mpnet-base-v2)")
        embed_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
        logger.info("Embedding model loaded")
    except Exception as e:
        logger.exception("Failed to load embedding model")
        embed_model = None


class RecommendRequest(BaseModel):
    skin_type: str
    concern: str
    budget: Optional[float] = None


class ChatRequest(BaseModel):
    message: str
    history: List = []


@app.get("/")
async def root():
    return {"status": "Azzivone AI Engine is Online", "brand": "Azzivone"}


@app.post("/embed-products")
async def embed_products():
    """Combine product details and generate vector embeddings for search.
    Requires Supabase and the embedding model to be available.
    """
    if supabase is None:
        raise HTTPException(status_code=503, detail="Supabase client not configured")
    if embed_model is None:
        raise HTTPException(status_code=503, detail="Embedding model not available")

    try:
        resp = supabase.table("products").select("*").execute()
        products = getattr(resp, 'data', None)

        if not products:
            return {"message": "No products found in database to embed."}

        for product in products:
            name = product.get('name', '')
            brand = product.get('brand', 'Azzivone')
            category = product.get('category', '')
            desc = product.get('description', '')
            concerns = " ".join(product.get('concerns', [])) if product.get('concerns') else ''

            content = f"{name} {brand} {category} {desc} {concerns}"
            embedding = embed_model.encode(content).tolist()

            supabase.table("product_vectors").upsert({
                "product_id": product.get("id"),
                "embedding": embedding,
                "content_text": content,
            }).execute()

        return {"message": f"Successfully processed {len(products)} products for Azzivone"}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Embedding Error")
        raise HTTPException(status_code=500, detail=f"Embedding Error: {str(e)}")


@app.post("/recommend")
async def recommend(req: RecommendRequest):
    """Recommend top products based on simple matching logic backed by Supabase data."""
    if supabase is None:
        raise HTTPException(status_code=503, detail="Supabase client not configured")

    try:
        resp = supabase.table("products").select("*").execute()
        products = getattr(resp, 'data', None)

        if not products:
            return {"message": "No products available."}

        ranked = []
        for p in products:
            score = 0
            product_skin_types = p.get('skin_types', []) or []
            product_concerns = p.get('concerns', []) or []

            if req.skin_type.lower() in [s.lower() for s in product_skin_types]:
                score += 5
            if req.concern.lower() in [c.lower() for c in product_concerns]:
                score += 3
            if req.budget and p.get('price_pkr', 0) <= req.budget:
                score += 2

            if score > 0:
                ranked.append({**p, "relevance_score": score})

        ranked.sort(key=lambda x: x['relevance_score'], reverse=True)
        return ranked[:5]
    except Exception as e:
        logger.exception("Recommendation error")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    # Use PORT env var if provided (Cloud Run sets PORT=8080)
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
