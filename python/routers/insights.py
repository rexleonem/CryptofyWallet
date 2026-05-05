from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(tags=["AI Insights"])

class TokenInput(BaseModel):
    symbol: str
    value: float

class PortfolioInput(BaseModel):
    walletAddress: str
    totalValue: float
    tokens: List[TokenInput]

@router.post("/analyze/portfolio")
async def analyze_portfolio(data: PortfolioInput, db: Session = Depends(get_db)):
    total_val = data.totalValue
    insights = []
    risk_score = 0
    
    # 1. Concentration Analysis
    eth_val = sum(t.value for t in data.tokens if t.symbol == 'ETH')
    eth_pct = (eth_val / total_val * 100) if total_val > 0 else 0
    
    if eth_pct > 60:
        risk_score += 40
        insights.append({
            "type": "risk",
            "title": "High ETH Concentration",
            "message": f"{eth_pct:.1f}% of your portfolio is in ETH. Highly concentrated portfolios are more volatile.",
            "severity": "warning"
        })
        
    # 2. Diversification Opportunity
    stable_val = sum(t.value for t in data.tokens if t.symbol in ['USDT', 'USDC', 'DAI'])
    stable_pct = (stable_val / total_val * 100) if total_val > 0 else 0
    
    if stable_pct < 10:
        risk_score += 20
        insights.append({
            "type": "opportunity",
            "title": "Diversification Opportunity",
            "message": "Adding stablecoins could help reduce volatility during market downturns.",
            "severity": "positive"
        })
    else:
        insights.append({
            "type": "behavior",
            "title": "Healthy Stability",
            "message": f"Your {stable_pct:.1f}% stablecoin allocation provides a good safety net.",
            "severity": "green"
        })

    # 3. Overall Risk Level
    risk_level = "low"
    if risk_score > 50:
        risk_level = "high"
    elif risk_score > 25:
        risk_level = "medium"
        
    analysis_result = {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "insights": insights
    }

    # Save to database
    db_analysis = models.AIAnalysis(
        wallet_address=data.walletAddress,
        analysis_type="portfolio_risk",
        result=analysis_result,
        risk_score=float(risk_score)
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    return analysis_result
