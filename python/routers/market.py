from fastapi import APIRouter, Query
from typing import List, Optional
from engine.market import get_prices

router = APIRouter(tags=["Market Data"])

@router.get("/market/prices")
async def fetch_prices(symbols: str = Query("BTC,ETH,SOL,BNB,USDT", description="Comma separated list of symbols")):
    symbol_list = [s.strip().upper() for s in symbols.split(",")]
    prices = await get_prices(symbol_list)
    return {
        "status": "success",
        "data": prices
    }

@router.get("/market/trending")
async def get_trending_assets():
    # Mock trending for now, could be integrated with CMC global metrics
    return {
        "trending": ["SOL", "PEPE", "WIF"],
        "top_gainer": {"symbol": "SOL", "change": 12.5}
    }
