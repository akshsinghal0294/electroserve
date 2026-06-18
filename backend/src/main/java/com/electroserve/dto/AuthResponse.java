package com.electroserve.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

 
    private String token;
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String role;
}