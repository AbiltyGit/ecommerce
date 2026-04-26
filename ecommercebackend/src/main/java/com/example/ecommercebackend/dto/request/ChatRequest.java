package com.example.ecommercebackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class ChatRequest {
    
    @NotBlank(message = "Question cannot be empty")
    private String question;
    
    private List<Map<String, String>> chatHistory;

    public ChatRequest() {
    }

    public ChatRequest(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<Map<String, String>> getChatHistory() {
        return chatHistory;
    }

    public void setChatHistory(List<Map<String, String>> chatHistory) {
        this.chatHistory = chatHistory;
    }
}
