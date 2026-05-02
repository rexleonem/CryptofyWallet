from fastapi import APIRouter
from pydantic import BaseModel
from engine.risk import calculate_risk_score

router = APIRouter()

class InsightsRequest(BaseModel):
    portfolio: dict

@router.post("/insights/risk")
async def get_risk(req: InsightsRequest):
    risk = calculate_risk_score(req.portfolio)
    return {"risk": risk}
