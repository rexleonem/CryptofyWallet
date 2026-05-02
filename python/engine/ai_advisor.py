import os
import google.generativeai as genai

# Setup Gemini using the provided API key or environment variable
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyAYrNNIbJ0TF3SPjakZypVZLdQnKcxVU5o")
genai.configure(api_key=GEMINI_API_KEY)

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
    
    # We use gemini-1.5-pro or gemini-1.5-flash
    model = genai.GenerativeModel(
        model_name='gemini-1.5-pro',
        system_instruction=system_instruction
    )
    
    response = await model.generate_content_async(
        user_message,
        generation_config=genai.types.GenerationConfig(
            temperature=0.4,
            max_output_tokens=600,
        )
    )
    return response.text
