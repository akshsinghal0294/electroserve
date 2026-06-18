package com.electroserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
}