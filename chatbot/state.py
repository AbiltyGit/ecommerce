"""
Defines the State structure for the LangGraph agents.
This TypedDict ensures type safety and predictable state transitions across all agent nodes.
"""

from typing import TypedDict, Optional, Any, List, Dict

class AgentState(TypedDict):
    question: str
    user_id: Optional[int]
    role: Optional[str]
    chat_history: Optional[List[Dict[str, str]]]
    sql_query: Optional[str]
    query_result: Optional[List[Dict[str, Any]]]
    error: Optional[str]
    bad_sql: Optional[str]
    final_answer: Optional[str]
    visualization_code: Optional[str]
    is_in_scope: bool
    iteration_count: int
