package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.service.QueryExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final QueryExecutionService queryExecutionService;

    public DashboardController(QueryExecutionService queryExecutionService) {
        this.queryExecutionService = queryExecutionService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            // KPI: Total Products
            List<Map<String, Object>> prodCount = queryExecutionService.executeReadOnlyQuery(
                "SELECT COUNT(*) AS total FROM products"
            );
            stats.put("totalProducts", prodCount.get(0).get("total"));

            // KPI: Total Reviews
            List<Map<String, Object>> revCount = queryExecutionService.executeReadOnlyQuery(
                "SELECT COUNT(*) AS total FROM reviews"
            );
            stats.put("totalReviews", revCount.get(0).get("total"));

            // KPI: Total Users
            List<Map<String, Object>> userCount = queryExecutionService.executeReadOnlyQuery(
                "SELECT COUNT(*) AS total FROM users"
            );
            stats.put("totalUsers", userCount.get(0).get("total"));

            // KPI: Average Rating
            List<Map<String, Object>> avgRating = queryExecutionService.executeReadOnlyQuery(
                "SELECT ROUND(AVG(rating)::numeric, 2) AS avg FROM reviews"
            );
            stats.put("averageRating", avgRating.get(0).get("avg"));

            // Chart 1: Top 10 Products by Review Count
            List<Map<String, Object>> topProducts = queryExecutionService.executeReadOnlyQuery(
                "SELECT p.name, COUNT(r.id) AS review_count FROM products p " +
                "LEFT JOIN reviews r ON p.id = r.product_id " +
                "GROUP BY p.name ORDER BY review_count DESC LIMIT 10"
            );
            stats.put("topProductsByReviews", topProducts);

            // Chart 2: Rating Distribution (1-5 stars)
            List<Map<String, Object>> ratingDist = queryExecutionService.executeReadOnlyQuery(
                "SELECT rating, COUNT(*) AS count FROM reviews GROUP BY rating ORDER BY rating"
            );
            stats.put("ratingDistribution", ratingDist);

            // Chart 3: Top 5 Categories by Product Count
            List<Map<String, Object>> topCats = queryExecutionService.executeReadOnlyQuery(
                "SELECT c.name AS category, COUNT(p.id) AS product_count FROM categories c " +
                "LEFT JOIN products p ON c.id = p.category_id " +
                "GROUP BY c.name ORDER BY product_count DESC LIMIT 5"
            );
            stats.put("topCategories", topCats);

            // KPI: Total Revenue
            List<Map<String, Object>> revenue = queryExecutionService.executeReadOnlyQuery(
                "SELECT SUM(total_amount) AS total FROM orders"
            );
            stats.put("totalRevenue", revenue.get(0).get("total"));

            // Alert: Low Stock Products
            List<Map<String, Object>> lowStock = queryExecutionService.executeReadOnlyQuery(
                "SELECT name, stock_quantity FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity ASC LIMIT 10"
            );
            stats.put("lowStockAlerts", lowStock);

        } catch (Exception e) {
            stats.put("error", "Failed to fetch some stats: " + e.getMessage());
        }

        return ResponseEntity.ok(stats);
    }
}
