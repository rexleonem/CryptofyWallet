import os
from google import genai
from google.genai import types

# Setup Gemini using the provided API key or environment variable
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyAYrNNIbJ0TF3SPjakZypVZLdQnKcxVU5o")
client = genai.Client(api_key=GEMINI_API_KEY)

def format_portfolio(portfolio: dict) -> str:
    tokens = portfolio.get('tokens', [])
    if not tokens:
        return "Empty portfolio"
    
    lines = []
    for t in tokens:
        lines.append(f"- {t['symbol']}: {t.get('balance', 0)} (Value: ${t.get('value_usd', 0):.2f})")
    return "\n".join(lines)

def build_system_prompt(portfolio: dict, risk: dict) -> str:
    return f"""You are Cryptofy AI, a personal crypto portfolio advisor.

The user's current portfolio:
{format_portfolio(portfolio)}

Risk assessment: {risk['overall']}
Risk details: {', '.join(r['reason'] for r in risk['details'])}

Rules:
- Never tell the user to buy or sell a specific asset
- Always explain your reasoning
- Flag high-risk situations clearly
- Be concise and human. Not robotic.
"""

async def chat(user_message: str, portfolio: dict, risk: dict) -> str:
    system_instruction = build_system_prompt(portfolio, risk)
    
    response = await client.aio.models.generate_content(
        model='gemini-1.5-pro',
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.4,
            max_output_tokens=600,
        )
    )
    return response.text

async def get_p2p_price_suggestion(asset: str, market_price: float) -> float:
    # A simple logic for now: suggest a price with a small spread (0.5% to 1.5%)
    # depending on asset volatility (hardcoded for demo)
    volatility_map = {
        "BTC": 0.008,
        "ETH": 0.012,
        "USDT": 0.001,
        "BNB": 0.015
    }
    
    spread = volatility_map.get(asset, 0.01)
    suggested_price = market_price * (1 + spread)
    return round(suggested_price, 2)

async def analyze_trade_risk(user_id: str, amount: float, reputation: float) -> float:
    # Basic risk model:
    # - High amount + low reputation = high risk
    # - New users (demo logic) = medium risk
    
    base_risk = 0.2
    amount_factor = min(amount / 10000, 0.5) # Risk increases with amount up to $10k
    reputation_factor = (1 - reputation) * 0.3
    
    risk_score = base_risk + amount_factor + reputation_factor
    return min(risk_score, 1.0)
