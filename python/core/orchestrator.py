import json
import logging
from core import groq_client, gemini_client, router, prompts
from engine.market import get_prices

logger = logging.getLogger("cryptofy.orchestrator")

async def classify_user_intent(message: str) -> dict:
    """
    Call Groq to classify the user's intent.
    """
    messages = prompts.get_intent_classification_prompt() + [
        {"role": "user", "content": message}
    ]
    try:
        response_format = {"type": "json_object"}
        intent_json = await groq_client.chat_completion(
            messages=messages,
            response_format=response_format,
            temperature=0.1
        )
        # Verify result contains 'type' and 'complexity'
        if isinstance(intent_json, dict) and "type" in intent_json:
            return intent_json
        
        # Parse text if it returned a flat structure
        content = intent_json.get("content", "")
        parsed = json.loads(content)
        if "type" in parsed:
            return parsed
    except Exception as e:
        logger.error(f"Intent classification failed: {e}")
    
    # Graceful fallback
    return {"type": "general_qa", "complexity": "low"}

async def format_response_with_groq(raw_content: str) -> dict:
    """
    Take raw text responses from Gemini or other paths and format them into strict JSON.
    """
    messages = [
        {"role": "system", "content": prompts.get_formatting_prompt()},
        {"role": "user", "content": f"Please format this content:\n\n{raw_content}"}
    ]
    try:
        formatted = await groq_client.chat_completion(
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.2
        )
        if isinstance(formatted, dict) and "response" in formatted:
            return formatted
        
        # Try to parse string payload
        content = formatted.get("content", "")
        parsed = json.loads(content)
        if "response" in parsed:
            return parsed
    except Exception as e:
        logger.error(f"Groq formatter failed: {e}")
        
    # Standard UI fallback structure if formatting fails
    return {
        "response": raw_content[:400] + ("..." if len(raw_content) > 400 else ""),
        "insights": ["AI analysis successfully generated."],
        "actions": ["Check Portfolio Details"]
    }

async def orchestrate_chat(user_message: str, context: dict) -> dict:
    """
    Orchestrate user chat: Classify -> Route -> Execute -> Format.
    """
    # 1. Intent Classification (Groq)
    intent_info = await classify_user_intent(user_message)
    intent_type = intent_info.get("type", "general_qa")
    complexity = intent_info.get("complexity", "low")
    
    logger.info(f"Classified intent: {intent_type} (complexity: {complexity})")
    
    # 2. Routing Decision
    use_gemini = router.should_route_to_gemini(intent_type, complexity)
    
    # 3. Execution
    if use_gemini:
        logger.info("Routing to Gemini deep thinking pathway...")
        
        # Retrieve recent price change context for active tokens in portfolio
        market_details = ""
        try:
            symbols = [t["symbol"] for t in context.get("tokens", []) if "symbol" in t]
            if symbols:
                prices = await get_prices(symbols)
                market_details = "Recent Market Quotes:\n" + "\n".join([
                    f"- {sym}: ${prices[sym]['price']:,.4f} ({prices[sym]['percent_change_24h']:+.2f}% 24h)"
                    for sym in prices if sym in prices
                ])
        except Exception as e:
            logger.warning(f"Failed to fetch market quotes for Gemini context: {e}")

        system_instruction = prompts.get_deep_reasoning_prompt(context, market_data=market_details)
        gemini_raw_output = await gemini_client.generate_deep_reasoning(
            prompt=user_message,
            system_instruction=system_instruction,
            temperature=0.4
        )
        
        # Format the Gemini result using Groq
        return await format_response_with_groq(gemini_raw_output)
        
    else:
        logger.info("Routing to Groq ultra-low latency pathway...")
        
        if intent_type == "simple_wallet":
            sys_prompt = prompts.get_simple_wallet_prompt(context)
        elif intent_type == "transaction":
            sys_prompt = prompts.get_transaction_flow_prompt(context)
        else:
            # General low-complexity QA path
            sys_prompt = (
                "You are Cryptofy AI, a personal crypto assistant. "
                "Respond directly and concisely to the user in a friendly, conversational manner. "
                f"User portfolio value is ${context.get('totalValue', 0.0):,.2f}."
            )
            
        messages = [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_message}
        ]
        
        try:
            groq_raw_resp = await groq_client.chat_completion(
                messages=messages,
                temperature=0.4
            )
            raw_text = groq_raw_resp.get("content", "AI service is currently processing.")
            
            # Run the formatting layer to match the front-end expectations
            return await format_response_with_groq(raw_text)
        except Exception as e:
            logger.error(f"Groq speed execution failed: {e}")
            return {
                "response": "Apologies, I am experiencing temporary connectivity challenges. Please try again shortly.",
                "insights": ["API Service offline."],
                "actions": ["Retry Question"]
            }
