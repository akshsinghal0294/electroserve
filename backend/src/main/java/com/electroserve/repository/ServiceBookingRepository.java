package com.electroserve.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.ServiceBooking;

public interface ServiceBookingRepository
        extends JpaRepository<ServiceBooking, Long> {

    List<ServiceBooking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ServiceBooking> findByAppointmentDateAndTimeSlot(
            LocalDate date,
            String timeSlot);
}