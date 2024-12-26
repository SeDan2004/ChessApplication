package com.example.chessapplication.modules.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class UserExistException extends Exception {
    public UserExistException(String msg) {
        super(msg);
    }
}

