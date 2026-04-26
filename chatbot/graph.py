from langgraph.graph import StateGraph, END
from state import AgentState
from agents.guardrails import guardrails_node
from agents.sql_agent import sql_agent_node
from agents.analysis_agent import analysis_agent_node
from agents.visualization_agent import visualization_agent_node
from agents.error_agent import error_agent_node

# 1. Ask Workflow
ask_workflow = StateGraph(AgentState)
ask_workflow.add_node("guardrails", guardrails_node)
ask_workflow.add_node("sql_agent", sql_agent_node)
ask_workflow.set_entry_point("guardrails")


def route_ask(state: AgentState):
    if not state.get("is_in_scope", True):
        return END
    return "sql_agent"


ask_workflow.add_conditional_edges(
    "guardrails", route_ask, {"sql_agent": "sql_agent", END: END}
)
ask_workflow.add_edge("sql_agent", END)
ask_app = ask_workflow.compile()

# 2. Analyze Workflow
analyze_workflow = StateGraph(AgentState)
analyze_workflow.add_node("analysis_agent", analysis_agent_node)
analyze_workflow.add_node("visualization_agent", visualization_agent_node)
analyze_workflow.set_entry_point("analysis_agent")
analyze_workflow.add_edge("analysis_agent", "visualization_agent")
analyze_workflow.add_edge("visualization_agent", END)
analyze_app = analyze_workflow.compile()

# 3. Error Workflow
error_workflow = StateGraph(AgentState)
error_workflow.add_node("error_agent", error_agent_node)
error_workflow.set_entry_point("error_agent")
error_workflow.add_edge("error_agent", END)
error_app = error_workflow.compile()
