from fastapi import APIRouter
from pydantic import BaseModel
from engine.ai_advisor import chat

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    portfolio: dict
    risk: dict

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    reply = await chat(req.message, req.portfolio, req.risk)
    return {"reply": reply}
