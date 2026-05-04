package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // Eager loading ile tek seferde sepeti, kullanıcıyı, ürünleri ve öğeleri çekiyoruz.
    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    Optional<Cart> findByUserId(Long userId);
}