package com.electroserve.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.electroserve.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}