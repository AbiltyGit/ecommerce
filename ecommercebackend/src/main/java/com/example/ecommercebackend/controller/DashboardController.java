package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.service.QueryExecutionService;
import com.example.ecommercebackend.repository.StoreRepository;
import com.example.ecommercebackend.model.Store;
import com.example.ecommercebackend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final QueryExecutionService queryExecutionService;
    private final StoreRepository storeRepository;

    public DashboardController(QueryExecutionService queryExecutionService, StoreRepository storeRepository) {
        this.queryExecutionService = queryExecutionService;
        this.storeRepository = storeRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORPORATE')")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> stats = new HashMap<>();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
        Long storeId = null;

        Long userId = null;
        String role = "ADMIN";
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) principal).getUser().getId();
            role = ((CustomUserDetails) principal).getUser().getRole().name();
        }

        if (!isAdmin && userId != null) {
            List<Store> stores = storeRepository.findByCorporateUserId(userId);
            if (!stores.isEmpty()) {
                storeId = stores.get(0).getId();
            }
        }

        // Validate date formats strictly to prevent SQL Injection
        if (startDate != null && !startDate.isEmpty()) {
            if (!startDate.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                return ResponseEntity.badRequest().build();
            }
        }
        if (endDate != null && !endDate.isEmpty()) {
            if (!endDate.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                return ResponseEntity.badRequest().build();
            }
        }

        String dateFilter = "";
        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            dateFilter = " created_at BETWEEN '" + startDate + "' AND '" + endDate + "' ";
        }
        
        String orderDateFilter = "";
        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            orderDateFilter = " order_date BETWEEN '" + startDate + "' AND '" + endDate + "' ";
        }

        try {
            // Helper for store filtering
            String storeWhere = (storeId != null) ? " WHERE store_id = " + storeId : "";
            String storeAnd = (storeId != null) ? " AND store_id = " + storeId : "";

            // KPI: Total Products
            try {
                List<Map<String, Object>> prodCount = queryExecutionService.executeReadOnlyQuery(
                    "SELECT COUNT(*) AS total FROM products" + storeWhere, userId, role
                );
                stats.put("totalProducts", prodCount.isEmpty() ? 0 : prodCount.get(0).get("total"));
            } catch (Exception e) { stats.put("totalProducts", 0); System.err.println("Error products count: " + e.getMessage()); }

            // KPI: Total Reviews
            try {
                String revQuery = (storeId != null) 
                    ? "SELECT COUNT(*) AS total FROM reviews r JOIN products p ON r.product_id = p.id WHERE p.store_id = " + storeId 
                    : "SELECT COUNT(*) AS total FROM reviews";
                if (!dateFilter.isEmpty()) {
                    revQuery += (storeId != null) ? " AND r." + dateFilter : " WHERE " + dateFilter;
                }
                List<Map<String, Object>> revCount = queryExecutionService.executeReadOnlyQuery(revQuery, userId, role);
                stats.put("totalReviews", revCount.isEmpty() ? 0 : revCount.get(0).get("total"));
            } catch (Exception e) { stats.put("totalReviews", 0); System.err.println("Error reviews count: " + e.getMessage()); }

            // KPI: Total Users
            try {
                List<Map<String, Object>> userCount = queryExecutionService.executeReadOnlyQuery("SELECT COUNT(*) AS total FROM users", userId, role);
                stats.put("totalUsers", userCount.isEmpty() ? 0 : userCount.get(0).get("total"));
            } catch (Exception e) { stats.put("totalUsers", 0); }

            // KPI: Average Rating
            try {
                String avgQuery = (storeId != null)
                    ? "SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS avg FROM reviews r JOIN products p ON r.product_id = p.id WHERE p.store_id = " + storeId
                    : "SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS avg FROM reviews";
                if (!dateFilter.isEmpty()) {
                    avgQuery += (storeId != null) ? " AND r." + dateFilter : " WHERE " + dateFilter;
                }
                List<Map<String, Object>> avgRating = queryExecutionService.executeReadOnlyQuery(avgQuery, userId, role);
                stats.put("averageRating", avgRating.isEmpty() ? 0 : avgRating.get(0).get("avg"));
            } catch (Exception e) { stats.put("averageRating", 0); System.err.println("Error avg rating: " + e.getMessage()); }

            // Chart 1: Top 10 Products by Review Count
            try {
                String topProdQuery = "SELECT p.name, COUNT(r.id) AS review_count FROM products p " +
                                      "LEFT JOIN reviews r ON p.id = r.product_id ";
                String topProdWhere = (storeId != null) ? " WHERE p.store_id = " + storeId : "";
                if (!dateFilter.isEmpty()) {
                    topProdWhere += (topProdWhere.isEmpty() ? " WHERE " : " AND ") + "r." + dateFilter;
                }
                topProdQuery += topProdWhere + " GROUP BY p.name ORDER BY review_count DESC LIMIT 10";
                stats.put("topProductsByReviews", queryExecutionService.executeReadOnlyQuery(topProdQuery, userId, role));
            } catch (Exception e) { stats.put("topProductsByReviews", List.of()); System.err.println("Error top products: " + e.getMessage()); }

            // KPI: Total Revenue
            try {
                String revSumQuery = (storeId != null)
                    ? "SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS total FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE p.store_id = " + storeId
                    : "SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders";
                if (!orderDateFilter.isEmpty()) {
                    revSumQuery += (storeId != null) ? " AND o." + orderDateFilter : " WHERE " + orderDateFilter;
                }
                List<Map<String, Object>> revenue = queryExecutionService.executeReadOnlyQuery(revSumQuery, userId, role);
                stats.put("totalRevenue", revenue.isEmpty() ? 0 : (revenue.get(0).get("total") == null ? 0 : revenue.get(0).get("total")));
            } catch (Exception e) { stats.put("totalRevenue", 0); System.err.println("Error revenue: " + e.getMessage()); }

            // Alert: Low Stock Products
            try {
                stats.put("lowStockAlerts", queryExecutionService.executeReadOnlyQuery(
                    "SELECT name, stock_quantity FROM products WHERE stock_quantity < 10 " + storeAnd + " ORDER BY stock_quantity ASC LIMIT 10", userId, role
                ));
            } catch (Exception e) { stats.put("lowStockAlerts", List.of()); }

            // Chart 4: Store Comparison
            if (isAdmin) {
                try {
                    stats.put("storeComparison", queryExecutionService.executeReadOnlyQuery(
                        "SELECT s.name AS store_name, COUNT(DISTINCT p.id) AS product_count, COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS avg_rating " +
                        "FROM stores s LEFT JOIN products p ON s.id = p.store_id LEFT JOIN reviews r ON p.id = r.product_id " +
                        "GROUP BY s.name ORDER BY product_count DESC LIMIT 10", userId, role
                    ));
                } catch (Exception e) { stats.put("storeComparison", List.of()); }
            }
            
            // Chart 5: Customer Segmentation
            try {
                stats.put("customerSegmentation", queryExecutionService.executeReadOnlyQuery(
                    "SELECT membership_type, COUNT(*) AS user_count, ROUND(AVG(satisfaction_level)::numeric, 2) AS avg_satisfaction " +
                    "FROM customer_profiles GROUP BY membership_type ORDER BY user_count DESC", userId, role
                ));
            } catch (Exception e) { stats.put("customerSegmentation", List.of()); }

            // NEW Chart: Rating Distribution
            try {
                stats.put("ratingDistribution", queryExecutionService.executeReadOnlyQuery(
                    "SELECT rating, COUNT(*) AS count FROM reviews " + 
                    (storeId != null ? "WHERE product_id IN (SELECT id FROM products WHERE store_id = " + storeId + ") " : "") +
                    "GROUP BY rating ORDER BY rating ASC", userId, role
                ));
            } catch (Exception e) { stats.put("ratingDistribution", List.of()); }

            // NEW Chart: Products by Category
            try {
                stats.put("topCategories", queryExecutionService.executeReadOnlyQuery(
                    "SELECT c.name AS category, COUNT(p.id) AS product_count " +
                    "FROM categories c LEFT JOIN products p ON c.id = p.category_id " +
                    (storeId != null ? "WHERE p.store_id = " + storeId : "") +
                    " GROUP BY c.name ORDER BY product_count DESC LIMIT 10", userId, role
                ));
            } catch (Exception e) { stats.put("topCategories", List.of()); }

        } catch (Exception e) {
            stats.put("error", "General dashboard failure: " + e.getMessage());
            e.printStackTrace();
        }

        return ResponseEntity.ok(stats);
    }
}
