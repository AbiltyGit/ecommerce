package com.example.ecommercebackend.dto.response;

import java.util.List;
import java.util.Map;

public class ChatResponse {
    
    private String answer;
    private List<Map<String, Object>> data;
    private String visualizationCode;

    public ChatResponse() {
    }

    public ChatResponse(String answer, List<Map<String, Object>> data) {
        this.answer = answer;
        this.data = data;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public String getVisualizationCode() {
        return visualizationCode;
    }

    public void setVisualizationCode(String visualizationCode) {
        this.visualizationCode = visualizationCode;
    }
}
