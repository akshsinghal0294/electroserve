package com.electroserve.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.electroserve.model.BookingStatus;
import com.electroserve.model.ServiceBooking;
import com.electroserve.model.User;
import com.electroserve.repository.ServiceBookingRepository;
import com.electroserve.repository.UserRepository;

@Service
public class ServiceBookingService {

    private final ServiceBookingRepository serviceBookingRepository;
    private final UserRepository userRepository;

    public ServiceBookingService(
            ServiceBookingRepository serviceBookingRepository,
            UserRepository userRepository) {

        this.serviceBookingRepository = serviceBookingRepository;
        this.userRepository = userRepository;
    }

    public ServiceBooking bookService(
            Long userId,
            ServiceBooking booking) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        booking.setUser(user);
        booking.setStatus(BookingStatus.PENDING);

        return serviceBookingRepository.save(booking);
    }

    public List<ServiceBooking> getBookingsByUser(Long userId) {
        return serviceBookingRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public ServiceBooking getBookingById(Long id) {
        return serviceBookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    public ServiceBooking updateBookingStatus(
            Long id,
            String status) {

        ServiceBooking booking = getBookingById(id);

        booking.setStatus(
                BookingStatus.valueOf(status.toUpperCase()));

        return serviceBookingRepository.save(booking);
    }

    public List<ServiceBooking> getAllBookings() {
        return serviceBookingRepository.findAll();
    }

    public List<String> getAvailableTimeSlots(LocalDate date) {

        List<String> allSlots = Arrays.asList(
                "9AM-11AM",
                "11AM-1PM",
                "2PM-4PM",
                "4PM-6PM");

        List<String> availableSlots =
                new ArrayList<>(allSlots);

        for (String slot : allSlots) {

            List<ServiceBooking> bookings =
                    serviceBookingRepository
                            .findByAppointmentDateAndTimeSlot(
                                    date,
                                    slot);

            if (!bookings.isEmpty()) {
                availableSlots.remove(slot);
            }
        }

        return availableSlots;
    }
}