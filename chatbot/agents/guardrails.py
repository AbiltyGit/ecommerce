import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import json
import sys

# Add parent dir to path so configs can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from configs import AGENT_CONFIGS, MODEL_NAME


def guardrails_node(state):
    # Provide a dummy fallback if no API key is present for testing
    if not os.environ.get("OPENAI_API_KEY"):
        state["is_in_scope"] = True
        return state

    try:
        llm = ChatOpenAI(model=MODEL_NAME, temperature=0)
        prompt = AGENT_CONFIGS["guardrails_agent"]["system_prompt"]

        question = state.get("question", "")

        messages = [
            SystemMessage(content=prompt)
        ]
        
        for msg in state.get("chat_history", []):
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            else:
                messages.append(SystemMessage(content=content))
                
        messages.append(HumanMessage(content=question))
        response = llm.invoke(messages)
        content = response.content

        # strip markdown json if present
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]

        parsed = json.loads(content)
        state["is_in_scope"] = parsed.get("is_in_scope", True)
        if not state["is_in_scope"] or parsed.get("message"):
            state["final_answer"] = parsed.get(
                "message", "I'm sorry, I can only help with e-commerce related queries."
            )
    except Exception as e:
        print(f"Guardrails Error: {e}")
        state["is_in_scope"] = True

    return state
