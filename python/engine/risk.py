def calculate_risk_score(portfolio: dict) -> dict:
    tokens = portfolio['tokens']
    total_value = sum(t['value_usd'] for t in tokens)
    scores = []

    for token in tokens:
        allocation = token['value_usd'] / total_value

        # Concentration risk (>50% in one asset)
        if allocation > 0.5:
            scores.append({'risk': 'HIGH', 'reason': f"{token['symbol']} is {allocation:.0%} of portfolio"})

        # Meme coin / low-cap risk
        if token.get('market_cap_rank', 999) > 200:
            scores.append({'risk': 'MEDIUM', 'reason': f"{token['symbol']} is a low-cap asset"})

    overall = 'HIGH' if any(s['risk'] == 'HIGH' for s in scores) else 'MEDIUM' if scores else 'LOW'

    return {'overall': overall, 'details': scores}
