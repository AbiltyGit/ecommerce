"""
FastAPI entry point for the Ecommerce AI Agentic Bridge.
This module hosts the endpoints that Java Spring Boot calls to interact with the LangGraph agents.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from graph import ask_app, analyze_app, error_app
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Ecommerce AI Agentic Bridge")


class AskRequest(BaseModel):
    """Payload for requesting a Text2SQL generation."""
    question: str
    user_id: int
    role: str
    chat_history: Optional[List[Dict[str, str]]] = []

class AnalyzeRequest(BaseModel):
    """Payload for analyzing the raw data returned from the database."""
    question: str
    data: List[Dict[str, Any]]


class FixSqlRequest(BaseModel):
    """Payload for requesting a fix to a failed SQL query."""
    bad_sql: str
    error: str


@app.post("/ask")
async def ask_question(request: AskRequest):
    """
    Endpoint to process a user's question and generate a valid SQL query via the Ask Workflow.
    """
    try:
        initial_state = {
            "question": request.question,
            "user_id": request.user_id,
            "role": request.role,
            "chat_history": request.chat_history,
            "is_in_scope": True,
            "iteration_count": 0,
        }
        result = ask_app.invoke(initial_state)
        return {
            "sql_query": result.get("sql_query"),
            "answer": result.get("final_answer", "Processing completed."),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ask Agent Error: {str(e)}")


@app.post("/analyze")
async def analyze_data(request: AnalyzeRequest):
    """
    Endpoint to analyze raw database results and optionally generate a visualization code.
    """
    try:
        initial_state = {"question": request.question, "query_result": request.data}
        result = analyze_app.invoke(initial_state)
        return {
            "answer": result.get("final_answer", "Analysis completed."),
            "visualization_code": result.get("visualization_code", ""),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analyze Agent Error: {str(e)}")


@app.post("/fix_sql")
async def fix_sql(request: FixSqlRequest):
    """
    Endpoint to fix a broken SQL query using the Error Agent.
    """
    try:
        initial_state = {"bad_sql": request.bad_sql, "error": request.error}
        result = error_app.invoke(initial_state)
        return {"sql_query": result.get("sql_query")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Agent Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
