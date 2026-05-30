from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from services import chat_service

router = APIRouter()

class ChatContext(BaseModel):
    totalValue: float
    change24h: float
    riskLevel: str | None = None
    riskScore: int | None = None
    topAsset: str | None = None
    tokens: List[Dict[str, Any]]

class ChatInput(BaseModel):
    message: str
    context: ChatContext

@router.post("/chat/respond")
async def chat_respond(data: ChatInput):
    """
    Main endpoint for portfolio-aware and real-time wallet Q&A.
    """
    # Expose context as dict for the service layer
    context_dict = data.context.dict()
    response_data = await chat_service.get_chat_response(data.message, context_dict)
    return response_data
