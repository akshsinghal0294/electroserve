package com.electroserve.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.electroserve.model.Cart;
import com.electroserve.model.Product;
import com.electroserve.model.User;
import com.electroserve.repository.CartRepository;
import com.electroserve.repository.ProductRepository;
import com.electroserve.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart addToCart(
            Long userId,
            Long productId,
            Integer quantity) {

        Cart cart = cartRepository
                .findByUserIdAndProductId(userId, productId)
                .orElse(null);

        if (cart != null) {
            cart.setQuantity(cart.getQuantity() + quantity);
            return cartRepository.save(cart);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart newCart = new Cart();
        newCart.setUser(user);
        newCart.setProduct(product);
        newCart.setQuantity(quantity);

        return cartRepository.save(newCart);
    }

    public Cart updateQuantity(Long cartId, Integer quantity) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    public Double getCartTotal(Long userId) {

        return cartRepository.findByUserId(userId)
                .stream()
                .mapToDouble(item ->
                        item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }
}