def should_route_to_gemini(intent_type: str, complexity: str) -> bool:
    """
    Decide whether to route to Gemini (deep reasoning path) or keep it on Groq (speed path).
    """
    # portfolio_insight and risk_analysis require deep reasoning and financial analysis
    if intent_type in ["portfolio_insight", "risk_analysis"]:
        return True
    
    # High complexity requests regardless of category get escalated to Gemini
    if complexity == "high":
        return True
        
    return False
