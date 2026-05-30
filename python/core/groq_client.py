import os
import httpx
import json

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

async def chat_completion(
    messages: list, 
    model: str = "llama-3.3-70b-versatile", 
    response_format: dict = None, 
    temperature: float = 0.2, 
    max_tokens: int = 1000
) -> dict:
    """
    Call Groq API using AsyncGroq client if available, or direct httpx requests as fallback.
    """
    api_key = os.environ.get("GROQ_API_KEY") or GROQ_API_KEY
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured in environment variables.")

    # Try using Groq SDK first
    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=api_key)
        
        kwargs = {
            "messages": messages,
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        if response_format:
            kwargs["response_format"] = response_format
            
        chat_completion_resp = await client.chat.completions.create(**kwargs)
        content = chat_completion_resp.choices[0].message.content
        
        # If response format is json, try to parse it
        if response_format and response_format.get("type") == "json_object":
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                pass
        return {"content": content}
    except Exception as e:
        # Fallback to direct HTTP request using httpx
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "messages": messages,
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        if response_format:
            payload["response_format"] = response_format

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload
            )
            if response.status_code != 200:
                raise RuntimeError(f"Groq API error: {response.status_code} - {response.text}")
            
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            if response_format and response_format.get("type") == "json_object":
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    pass
            return {"content": content}
