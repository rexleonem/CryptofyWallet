from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

class ChatContext(BaseModel):
    totalValue: float
    change24h: float
    riskLevel: str
    riskScore: int
    topAsset: str
    tokens: List[Dict[str, Any]]

class ChatInput(BaseModel):
    message: str
    context: ChatContext

@router.post("/chat/respond")
async def chat_respond(data: ChatInput):
    msg = data.message.lower()
    ctx = data.context
    
    # AI Reasoning Logic (Simulated for this stage, ready for LLM integration)
    response = ""
    insights = []
    actions = []
    
    if "why" in msg and "down" in msg:
        response = f"Your portfolio is down {abs(ctx.change24h)}% today, primarily driven by market movement in {ctx.topAsset}."
        insights = [
            f"{ctx.topAsset} dominates your portfolio ({ctx.riskScore}% risk impact)",
            "Market-wide volatility affecting high-exposure assets"
        ]
        actions = ["Monitor price trends", "Consider stablecoin hedging"]
        
    elif "should i sell" in msg or "exposed" in msg:
        response = f"Your {ctx.topAsset} exposure is currently {ctx.riskScore}%, which places you in a {ctx.riskLevel} risk category."
        insights = [
            f"High concentration in {ctx.topAsset} increases volatility",
            "Diversification could reduce overall portfolio risk"
        ]
        actions = ["Diversify into BTC or stables", "Hold through current cycle"]
        
    else:
        response = f"I've analyzed your ${ctx.totalValue:,.2f} portfolio. You are currently in a {ctx.riskLevel} risk state."
        insights = [
            f"Top holding: {ctx.topAsset}",
            f"24h Performance: {ctx.change24h}%"
        ]
        actions = ["View detailed breakdown", "Check risk report"]

    return {
        "response": response,
        "insights": insights,
        "actions": actions,
        "confidence": 0.95
    }
