from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from services import insight_service
import models

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
    """
    Analyzes portfolio tokens allocation, concentration risk, and writes results to historical table.
    """
    tokens_list = [t.dict() for t in data.tokens]
    
    res = await insight_service.analyze_portfolio_insights(
        wallet_address=data.walletAddress,
        total_value=data.totalValue,
        tokens=tokens_list
    )
    
    # Optional Database Persistence
    try:
        analysis_record = models.AIAnalysis(
            wallet_address=data.walletAddress or "UNKNOWN",
            user_id="anonymous",
            analysis_type="portfolio_risk",
            result=res,
            risk_score=float(res.get("riskScore", 0.0))
        )
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)
    except Exception as db_err:
        # Fallback to ignore DB saving errors to ensure API resilience
        db.rollback()
        
    return res
