import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from configs import AGENT_CONFIGS


def analysis_agent_node(state):
    # Fallback
    if not os.environ.get("OPENAI_API_KEY"):
        state["final_answer"] = "Data analysis complete. (Dummy analysis text)"
        return state

    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        prompt = AGENT_CONFIGS["analysis_agent"]["system_prompt"]

        question = state.get("question", "")
        data = state.get("query_result", [])

        messages = [
            SystemMessage(content=prompt),
            HumanMessage(
                content=f"User Question: {question}\n\nDatabase Result: {json.dumps(data)}"
            ),
        ]

        response = llm.invoke(messages)
        state["final_answer"] = response.content.strip()
    except Exception as e:
        print(f"Analysis Agent Error: {e}")
        state["final_answer"] = "Error analyzing data."

    return state
