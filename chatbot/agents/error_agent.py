import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from configs import AGENT_CONFIGS


def error_agent_node(state):
    # Fallback
    if not os.environ.get("OPENAI_API_KEY"):
        state["sql_query"] = "SELECT * FROM product LIMIT 1"
        return state

    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        prompt = AGENT_CONFIGS["error_agent"]["system_prompt"]

        bad_sql = state.get("bad_sql", "")
        error_msg = state.get("error", "")

        messages = [
            SystemMessage(content=prompt),
            HumanMessage(content=f"Bad SQL: {bad_sql}\nError Message: {error_msg}"),
        ]

        response = llm.invoke(messages)
        sql_query = response.content.strip()

        if sql_query.startswith("```sql"):
            sql_query = sql_query[6:-3].strip()
        elif sql_query.startswith("```"):
            sql_query = sql_query[3:-3].strip()

        state["sql_query"] = sql_query
    except Exception as e:
        print(f"Error Agent Error: {e}")
        state["sql_query"] = state.get("bad_sql", "")

    return state
