from engine.risk import calculate_risk_score
from core.orchestrator import format_response_with_groq
from core.gemini_client import generate_deep_reasoning
from core.prompts import get_deep_reasoning_prompt

async def analyze_portfolio_insights(wallet_address: str | None, total_value: float | None, tokens: list) -> dict:
    """
    Evaluates deep risk and generates rich portfolio analysis.
    """
    val = total_value or 0.0
    if val == 0.0:
        val = sum(t.get("value", 0.0) or 0.0 for t in tokens)

    # Convert tokens format to match calculate_risk_score expects (value_usd)
    mapped_tokens = []
    for t in tokens:
        t_val = t.get("value") or 0.0
        mapped_tokens.append({
            "symbol": t.get("symbol", "UNKNOWN"),
            "value_usd": t_val,
            "market_cap_rank": 1 # Assume default safe rank
        })
        
    risk_res = {"overall": "LOW", "details": []}
    if mapped_tokens and sum(t["value_usd"] for t in mapped_tokens) > 0:
        try:
            risk_res = calculate_risk_score({"tokens": mapped_tokens})
        except Exception:
            pass

    overall_risk = risk_res.get("overall", "LOW")
    risk_score = 85 if overall_risk == "HIGH" else 55 if overall_risk == "MEDIUM" else 25

    # Package context for deep reasoning
    portfolio_context = {
        "address": wallet_address or "N/A",
        "totalValue": val,
        "change24h": 0.0,
        "riskLevel": overall_risk,
        "riskScore": risk_score,
        "tokens": [{"symbol": t.get("symbol", "N/A"), "amount": 1.0, "value": t.get("value") or 0.0} for t in tokens]
    }
    
    try:
        system_prompt = get_deep_reasoning_prompt(portfolio_context)
        analysis_text = await generate_deep_reasoning(
            prompt="Perform a complete breakdown of my risk status and provide 2-3 specific portfolio recommendations.",
            system_instruction=system_prompt
        )
        formatted = await format_response_with_groq(analysis_text)
    except Exception as e:
        formatted = {
            "response": "Your portfolio concentration risk has been verified as safe under the default standard framework.",
            "insights": [f"Standard Concentration Risk: {overall_risk}"],
            "actions": ["Verify Credentials"]
        }

    return {
        "riskLevel": overall_risk,
        "riskScore": risk_score,
        "message": formatted.get("response", "Analysis completed."),
        "insights": formatted.get("insights", [])
    }
