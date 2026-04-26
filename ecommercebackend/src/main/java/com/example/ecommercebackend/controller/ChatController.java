package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.dto.request.ChatRequest;
import com.example.ecommercebackend.dto.response.ChatResponse;
import com.example.ecommercebackend.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatResponse> askQuestion(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.askQuestion(request);
        return ResponseEntity.ok(response);
    }
}
