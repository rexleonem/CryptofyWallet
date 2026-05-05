from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from database import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    wallet_address = Column(String, index=True)
    analysis_type = Column(String)  # e.g., "portfolio_risk", "market_prediction"
    result = Column(JSON)
    risk_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MarketInsight(Base):
    __tablename__ = "market_insights"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    insight_text = Column(String)
    sentiment_score = Column(Float)
    confidence_level = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
