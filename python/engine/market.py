import httpx

COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

async def get_prices(coin_ids: list[str]) -> dict:
    ids = ','.join(coin_ids)
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{COINGECKO_BASE}/simple/price",
            params={'ids': ids, 'vs_currencies': 'usd', 'include_24hr_change': 'true'}
        )
        return res.json()
