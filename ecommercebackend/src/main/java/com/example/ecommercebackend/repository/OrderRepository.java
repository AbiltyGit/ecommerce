package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i JOIN i.product p JOIN p.store s WHERE s.corporateUser.id = :corporateUserId")
    List<Order> findOrdersByCorporateUserId(@Param("corporateUserId") Long corporateUserId);
}
