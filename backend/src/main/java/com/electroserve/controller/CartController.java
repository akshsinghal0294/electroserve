package com.electroserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.electroserve.dto.ApiResponse;
import com.electroserve.model.Cart;
import com.electroserve.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCartByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cartService.getCartByUser(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.addToCart(
                        userId,
                        productId,
                        quantity));
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        cartId,
                        quantity));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            @PathVariable Long cartId) {

        cartService.removeFromCart(cartId);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Cart item removed successfully",
                        null));
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<ApiResponse> clearCart(
            @PathVariable Long userId) {

        cartService.clearCart(userId);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Cart cleared successfully",
                        null));
    }

    @GetMapping("/total/{userId}")
    public ResponseEntity<Double> getCartTotal(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cartService.getCartTotal(userId));
    }
}