package com.electroserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    List<Product> findByBrand(String brand);
}