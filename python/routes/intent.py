from fastapi import APIRouter
from pydantic import BaseModel
from services import intent_service

router = APIRouter(tags=["AI Intent"])

class IntentRequest(BaseModel):
    message: str

@router.post("/intent/classify")
async def get_intent(request: IntentRequest):
    """
    Utility endpoint to test Groq real-time intent classification.
    """
    res = await intent_service.classify_intent(request.message)
    return res
