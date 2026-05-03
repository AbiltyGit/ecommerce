import os
import sys

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from agents.guardrails import guardrails_node

print("Starting Guardrails API Test...")

# Test 1: No API Key (Fallback Mode)
if "OPENAI_API_KEY" in os.environ:
    del os.environ["OPENAI_API_KEY"]

state_no_key = {
    "question": "Show me total revenue",
    "chat_history": []
}
result_no_key = guardrails_node(state_no_key)
print(f"Test 1 (No API Key) result: {result_no_key.get('is_in_scope')}")
assert result_no_key.get("is_in_scope") is True, "Fallback should set is_in_scope to True"

# Test 2: With Mock API Key (Exception Mode)
os.environ["OPENAI_API_KEY"] = "mock_key_for_testing"
state_mock_key = {
    "question": "Who won the world cup in 2022?",
    "chat_history": []
}
result_mock_key = guardrails_node(state_mock_key)
print(f"Test 2 (Exception Mode) result: {result_mock_key.get('is_in_scope')}")
# Should fallback to True on exception
assert result_mock_key.get("is_in_scope") is True, "Exception fallback should set is_in_scope to True"

print("✅ Guardrails Node test completed successfully.")
