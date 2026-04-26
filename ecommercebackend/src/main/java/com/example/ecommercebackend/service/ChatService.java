package com.example.ecommercebackend.service;

import com.example.ecommercebackend.dto.request.ChatRequest;
import com.example.ecommercebackend.dto.response.ChatResponse;

public interface ChatService {
    ChatResponse askQuestion(ChatRequest request);
}
