package com.electroserve.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.electroserve.model.Cart;
import com.electroserve.model.Order;
import com.electroserve.model.OrderItem;
import com.electroserve.model.OrderStatus;
import com.electroserve.model.PaymentStatus;
import com.electroserve.model.Product;
import com.electroserve.repository.CartRepository;
import com.electroserve.repository.OrderItemRepository;
import com.electroserve.repository.OrderRepository;
import com.electroserve.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Order placeOrder(Long userId, String address) {

        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item ->
                        item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = new Order();

        order.setUser(cartItems.get(0).getUser());
        order.setTotalAmount(totalAmount);
        order.setAddress(address);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        for (Cart cartItem : cartItems) {

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());

            orderItemRepository.save(orderItem);

            Product product = cartItem.getProduct();

            product.setStockQuantity(
                    product.getStockQuantity() - cartItem.getQuantity());

            productRepository.save(product);
        }

        cartRepository.deleteByUserId(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long id, String status) {

        Order order = getOrderById(id);

        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}