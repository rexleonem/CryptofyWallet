from core.orchestrator import orchestrate_chat

async def get_chat_response(message: str, context: dict) -> dict:
    """
    Main entry point for handling chat responses in the service layer.
    """
    return await orchestrate_chat(message, context)
