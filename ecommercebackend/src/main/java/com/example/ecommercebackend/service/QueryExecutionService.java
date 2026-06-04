package com.example.ecommercebackend.service;

import java.util.List;
import java.util.Map;

public interface QueryExecutionService {
    List<Map<String, Object>> executeReadOnlyQuery(String sql, Long currentUserId, String currentUserRole);
}
