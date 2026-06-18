package com.electroserve.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private boolean success;
    private String message;
    private Object data;

    public ApiResponse(String message, Object data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(String message) {
        this.success = false;
        this.message = message;
        this.data = null;
    }
}