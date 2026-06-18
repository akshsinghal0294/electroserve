package com.electroserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    List<Review> findByUserId(Long userId);
}