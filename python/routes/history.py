from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models

router = APIRouter(tags=["AI History"])

@router.get("/history/analyses/{wallet_address}")
async def get_analysis_history(wallet_address: str, limit: int = Query(10, le=100), db: Session = Depends(get_db)):
    analyses = db.query(models.AIAnalysis).filter(
        models.AIAnalysis.wallet_address == wallet_address
    ).order_by(models.AIAnalysis.created_at.desc()).limit(limit).all()
    
    return analyses

@router.get("/history/market-insights")
async def get_recent_insights(limit: int = Query(5, le=50), db: Session = Depends(get_db)):
    insights = db.query(models.MarketInsight).order_by(
        models.MarketInsight.timestamp.desc()
    ).limit(limit).all()
    
    return insights
