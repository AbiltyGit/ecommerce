package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByCorporateUserId(Long corporateUserId);
}
