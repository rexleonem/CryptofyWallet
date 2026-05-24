from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from engine.ai_advisor import get_p2p_price_suggestion, analyze_trade_risk

router = APIRouter()

class PriceSuggestionRequest(BaseModel):
    asset: str
    market_price: float

class TradeRiskRequest(BaseModel):
    user_id: str
    trade_amount: float
    user_reputation: float

@router.post("/suggest-price")
async def suggest_price(request: PriceSuggestionRequest):
    return {"message": "AI service unavailable"}

@router.post("/analyze-risk")
async def analyze_risk(request: TradeRiskRequest):
    return {"message": "AI service unavailable"}
