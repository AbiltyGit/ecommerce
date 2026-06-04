package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "(:query IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:role IS NULL OR u.role = :role)")
    Page<User> findByFilters(String query, UserRole role, Pageable pageable);
}
