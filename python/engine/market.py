import os
import httpx

CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1'
CMC_API_KEY = os.environ.get('CMC_API_KEY')

async def get_prices(symbols: list[str]) -> dict:
    if not CMC_API_KEY:
        return {}

    url = f"{CMC_BASE_URL}/cryptocurrency/quotes/latest"
    parameters = {
        'symbol': ','.join(symbols),
        'convert': 'USD'
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=parameters)
        data = response.json()
        
        prices = {}
        if 'data' in data:
            for symbol in symbols:
                if symbol in data['data']:
                    quote = data['data'][symbol]['quote']['USD']
                    prices[symbol] = {
                        'price': quote['price'],
                        'percent_change_24h': quote['percent_change_24h']
                    }
        return prices
