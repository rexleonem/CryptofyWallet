import openai

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
    client = openai.AsyncOpenAI()
    response = await client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {'role': 'system', 'content': build_system_prompt(portfolio, risk)},
            {'role': 'user', 'content': user_message}
        ],
        temperature=0.4,
        max_tokens=600
    )
    return response.choices[0].message.content
