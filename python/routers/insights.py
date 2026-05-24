from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(tags=["AI Insights"])

class TokenInput(BaseModel):
    symbol: str
    value: float | None = None

class PortfolioInput(BaseModel):
    walletAddress: str | None = None
    totalValue: float | None = None
    tokens: List[TokenInput] = []

@router.post("/analyze/portfolio")
async def analyze_portfolio(data: PortfolioInput, db: Session = Depends(get_db)):
    return {
        "message": "AI service unavailable",
        "insights": []
    }
