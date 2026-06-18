package com.electroserve.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.electroserve.model.ServiceBooking;
import com.electroserve.service.ServiceBookingService;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceBookingController {

    private final ServiceBookingService serviceBookingService;

    public ServiceBookingController(
            ServiceBookingService serviceBookingService) {
        this.serviceBookingService = serviceBookingService;
    }

    @PostMapping("/book")
    public ResponseEntity<ServiceBooking> bookService(
            @RequestParam Long userId,
            @RequestBody ServiceBooking booking) {

        return ResponseEntity.ok(
                serviceBookingService.bookService(
                        userId,
                        booking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ServiceBooking>> getBookingsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                serviceBookingService.getBookingsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceBooking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                serviceBookingService.getBookingById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceBooking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                serviceBookingService.updateBookingStatus(
                        id,
                        status));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ServiceBooking>> getAllBookings() {

        return ResponseEntity.ok(
                serviceBookingService.getAllBookings());
    }

    @GetMapping("/slots")
    public ResponseEntity<List<String>> getAvailableTimeSlots(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                serviceBookingService.getAvailableTimeSlots(date));
    }
}