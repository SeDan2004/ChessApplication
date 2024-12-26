package com.example.chessapplication.modules.responses;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class UserNotExistResponse extends ExceptionResponse {
    public UserNotExistResponse(String msg, HttpStatus status, LocalDateTime date) {
        super(msg, status, date);
    }
}
