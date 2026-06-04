package com.example.ecommercebackend.service.impl;

import com.example.ecommercebackend.dto.request.ChatRequest;
import com.example.ecommercebackend.dto.response.ChatResponse;
import com.example.ecommercebackend.service.ChatService;
import com.example.ecommercebackend.service.QueryExecutionService;
import com.example.ecommercebackend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service implementation for orchestrating the AI Chatbot Text2SQL flow.
 * Handles communication with the Python LangGraph FastAPI server.
 */
@Service
public class ChatServiceImpl implements ChatService {

    private final QueryExecutionService queryExecutionService;
    private final RestTemplate restTemplate;

    @Value("${ai.chatbot.url:http://localhost:8000}")
    private String chatbotBaseUrl;

    public ChatServiceImpl(QueryExecutionService queryExecutionService, RestTemplate restTemplate) {
        this.queryExecutionService = queryExecutionService;
        this.restTemplate = restTemplate;
    }

    /**
     * Processes a user question by sending it to the AI, executing the generated SQL safely,
     * and sending the results back to the AI for natural language analysis and visualization.
     *
     * @param request The chat request containing the user's natural language question
     * @return ChatResponse containing the AI's answer, raw data, and visualization code
     */
    @Override
    @SuppressWarnings("unchecked")
    public ChatResponse askQuestion(ChatRequest request) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = userDetails.getUser().getId();
            String role = userDetails.getUser().getRole().name();

            // 1. Ask for SQL
            Map<String, Object> askPayload = new HashMap<>();
            askPayload.put("question", request.getQuestion());
            askPayload.put("user_id", userId);
            askPayload.put("role", role);
            askPayload.put("chat_history", request.getChatHistory());

            System.out.println("DEBUG (Java): Sending to /ask...");
            Map<String, Object> askResponse;
            try {
                askResponse = restTemplate.postForObject(chatbotBaseUrl + "/ask", askPayload, Map.class);
                System.out.println("DEBUG (Java): Received from /ask: " + (askResponse != null ? askResponse.keySet() : "null"));
            } catch (Exception e) {
                System.out.println("DEBUG (Java): Error in /ask: " + e.getMessage());
                return createFallbackResponse("Failed to connect to Python AI Ask Endpoint (/ask): " + e.getMessage());
            }

            if (askResponse == null) return createFallbackResponse("Received null response from Python AI Ask Endpoint.");

            String sqlQuery = (String) askResponse.get("sql_query");
            String answer = (String) askResponse.get("answer");
            
            if (sqlQuery == null || sqlQuery.trim().isEmpty()) {
                System.out.println("DEBUG (Java): No SQL generated, returning fallback.");
                return createFallbackResponse(answer);
            }

            List<Map<String, Object>> data = null;

            // 2. Execute SQL with Retry via Error Agent
            try {
                System.out.println("DEBUG (Java): Executing SQL: " + sqlQuery);
                data = queryExecutionService.executeReadOnlyQuery(sqlQuery, userId, role);
                System.out.println("DEBUG (Java): Data fetched, row count: " + (data != null ? data.size() : "null"));
            } catch (Exception e) {
                System.out.println("DEBUG (Java): SQL Failed: " + e.getMessage());
                Map<String, Object> fixPayload = new HashMap<>();
                fixPayload.put("bad_sql", sqlQuery);
                fixPayload.put("error", e.getMessage());

                try {
                    System.out.println("DEBUG (Java): Sending to /fix_sql...");
                    Map<String, Object> fixResponse = restTemplate.postForObject(chatbotBaseUrl + "/fix_sql", fixPayload, Map.class);
                    if (fixResponse != null && fixResponse.get("sql_query") != null) {
                        sqlQuery = (String) fixResponse.get("sql_query");
                        System.out.println("DEBUG (Java): Fixed SQL: " + sqlQuery);
                        data = queryExecutionService.executeReadOnlyQuery(sqlQuery, userId, role);
                    } else {
                        return createFallbackResponse("Database execution failed and AI Error Agent was unable to fix the SQL syntax: " + e.getMessage());
                    }
                } catch (Exception ex) {
                    System.out.println("DEBUG (Java): /fix_sql failed: " + ex.getMessage());
                    return createFallbackResponse("Database execution failed again after AI retry attempt: " + ex.getMessage() + " (Original error: " + e.getMessage() + ")");
                }
            }

            // 3. Analyze Data
            Map<String, Object> analyzePayload = new HashMap<>();
            analyzePayload.put("question", request.getQuestion());
            analyzePayload.put("data", data);

            String visualizationCode = null;

            try {
                System.out.println("DEBUG (Java): Sending to /analyze...");
                Map<String, Object> analyzeResponse = restTemplate.postForObject(chatbotBaseUrl + "/analyze", analyzePayload, Map.class);
                System.out.println("DEBUG (Java): Received from /analyze: " + (analyzeResponse != null ? analyzeResponse.keySet() : "null"));
                if (analyzeResponse != null) {
                    answer = (String) analyzeResponse.get("answer");
                    visualizationCode = (String) analyzeResponse.get("visualization_code");
                }
            } catch (Exception e) {
                System.out.println("DEBUG (Java): Error in /analyze: " + e.getMessage());
                answer = "Data retrieved successfully, but Python Analysis Endpoint (/analyze) failed: " + e.getMessage();
            }

            System.out.println("DEBUG (Java): Returning Final Response to Frontend.");
            ChatResponse finalResponse = new ChatResponse(answer, data);
            finalResponse.setVisualizationCode(visualizationCode);
            return finalResponse;
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR in ChatServiceImpl.askQuestion: " + e.getMessage());
            e.printStackTrace();
            return createFallbackResponse("A critical internal error occurred: " + e.getMessage());
        }
    }

    private ChatResponse createFallbackResponse(String answer) {
        return new ChatResponse(answer, null);
    }
}
