import os
from google import genai
from google.genai import types

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

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
    if client is None:
        return "AI service unavailable"

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
    return market_price

async def analyze_trade_risk(user_id: str, amount: float, reputation: float) -> float:
    return 0.0
