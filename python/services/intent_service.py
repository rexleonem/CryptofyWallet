from core.orchestrator import classify_user_intent

async def classify_intent(message: str) -> dict:
    """
    Classify the message intent using Groq model classification path.
    """
    return await classify_user_intent(message)
