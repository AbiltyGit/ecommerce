import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import sys

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from configs import AGENT_CONFIGS, MODEL_NAME


def sql_agent_node(state):
    # Dummy fallback if no API key is present
    if not os.environ.get("OPENAI_API_KEY"):
        state["sql_query"] = "SELECT * FROM product"
        state["final_answer"] = "Generated dummy SQL due to missing API Key."
        return state

    try:
        llm = ChatOpenAI(model=MODEL_NAME, temperature=0)
        prompt = AGENT_CONFIGS["sql_agent"]["system_prompt"]

        user_id = state.get("user_id", "UNKNOWN")
        role = state.get("role", "UNKNOWN")

        # Inject Context dynamically
        context_prompt = f"{prompt}\n\nCURRENT USER CONTEXT:\n- User ID: {user_id}\n- Role: {role}\n\nALWAYS apply the security rules based on this context."

        messages = [
            SystemMessage(content=context_prompt)
        ]
        
        for msg in state.get("chat_history", []):
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            else:
                messages.append(SystemMessage(content=content))
                
        messages.append(HumanMessage(content=state.get("question", "")))

        response = llm.invoke(messages)
        sql_query = response.content.strip()

        # Clean markdown if present
        if sql_query.startswith("```sql"):
            sql_query = sql_query[6:-3].strip()
        elif sql_query.startswith("```"):
            sql_query = sql_query[3:-3].strip()

        state["sql_query"] = sql_query
        state["final_answer"] = "Generated SQL successfully."
    except Exception as e:
        print(f"SQL Agent Error: {e}")
        state["sql_query"] = None
        state["final_answer"] = f"Failed to generate SQL: {str(e)}"

    return state
