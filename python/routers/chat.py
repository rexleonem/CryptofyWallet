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
    return {
        "response": "AI service unavailable",
        "insights": [],
        "actions": []
    }
