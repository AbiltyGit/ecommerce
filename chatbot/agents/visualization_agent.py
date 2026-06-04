import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from configs import AGENT_CONFIGS, MODEL_NAME


def visualization_agent_node(state):
    # Fallback
    if not os.environ.get("OPENAI_API_KEY"):
        state["visualization_code"] = ""
        return state

    data = state.get("query_result", [])
    if not data or len(data) < 2:
        state["visualization_code"] = ""
        return state

    try:
        llm = ChatOpenAI(model=MODEL_NAME, temperature=0)
        prompt = AGENT_CONFIGS["visualization_agent"]["system_prompt"]

        messages = [
            SystemMessage(content=prompt),
            HumanMessage(content=f"Data to visualize: {json.dumps(data)}"),
        ]

        response = llm.invoke(messages)
        code = response.content.strip()

        if code.startswith("```json"):
            code = code[7:-3].strip()
        elif code.startswith("```"):
            code = code[3:-3].strip()

        state["visualization_code"] = code
    except Exception as e:
        print(f"Visualization Agent Error: {e}")
        state["visualization_code"] = ""

    return state
