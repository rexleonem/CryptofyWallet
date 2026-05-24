from engine.market import get_prices
from engine.risk import calculate_risk_score

async def get_portfolio_snapshot(address: str, tokens: list[dict]) -> dict:
    return {
        "address": address,
        "tokens": tokens,
        "total_usd": None
    }
