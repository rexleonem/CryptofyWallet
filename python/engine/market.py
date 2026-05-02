import os
import httpx

CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1'
CMC_API_KEY = os.environ.get('CMC_API_KEY', '08eeeeac-0281-4611-b43f-9b1c39b809f7')

async def get_prices(symbols: list[str]) -> dict:
    """
    Fetch prices for a list of symbols from CoinMarketCap.
    Symbols should be like ['BTC', 'ETH']
    """
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
        
        # Transform CMC response into a simpler format for the app
        # Format: { 'BTC': { 'price': 50000, 'percent_change_24h': 2.5 } }
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
