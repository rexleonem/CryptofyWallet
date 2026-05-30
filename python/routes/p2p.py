from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from engine.ai_advisor import get_p2p_price_suggestion, analyze_trade_risk

router = APIRouter(tags=["P2P Intelligence"])

class PriceSuggestionRequest(BaseModel):
    asset: str
    market_price: float

class TradeRiskRequest(BaseModel):
    user_id: str
    trade_amount: float
    user_reputation: float

@router.post("/suggest-price")
async def suggest_price(request: PriceSuggestionRequest):
    val = await get_p2p_price_suggestion(request.asset, request.market_price)
    return {"suggested_price": val}

@router.post("/analyze-risk")
async def analyze_risk(request: TradeRiskRequest):
    val = await analyze_trade_risk(request.user_id, request.trade_amount, request.user_reputation)
    return {"risk_score": val}
