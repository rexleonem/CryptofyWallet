import os
from google import genai
from google.genai import types

def get_gemini_client():
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        return None
    try:
        return genai.Client(api_key=gemini_api_key)
    except Exception:
        return None

async def generate_deep_reasoning(
    prompt: str, 
    system_instruction: str = None, 
    model: str = "gemini-1.5-pro",
    temperature: float = 0.4
) -> str:
    """
    Call Gemini using the async client for deep reasoning and financial analysis,
    with robust model fallback to gemini-1.5-flash if pro is unavailable or errors out.
    """
    client = get_gemini_client()
    if not client:
        return "Gemini AI Core is currently unavailable (missing or invalid API key)."

    models_to_try = [model, "gemini-1.5-flash", "gemini-2.5-flash"]
    
    # Ensure no duplicates
    ordered_models = []
    for m in models_to_try:
        if m not in ordered_models:
            ordered_models.append(m)

    last_error = None
    for attempt_model in ordered_models:
        try:
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=1000
            )
            if system_instruction:
                config.system_instruction = system_instruction

            response = await client.aio.models.generate_content(
                model=attempt_model,
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            last_error = e
            # Log or continue to fallback models
            continue

    return f"Gemini deep reasoning failed. Last error: {str(last_error)}"
