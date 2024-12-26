package com.example.chessapplication.modules.responses;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class UserExistsResponse extends ExceptionResponse {
    public UserExistsResponse(String msg, HttpStatus status, LocalDateTime date) {
        super(msg, status, date);
    }
}
