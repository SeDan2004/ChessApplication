package com.example.chessapplication.modules.requests;

import com.example.chessapplication.modules.exceptions.IncorrectCodeWordException;
import com.example.chessapplication.modules.responses.ExceptionResponse;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class IncorrectCodeWordResponse extends ExceptionResponse {
    public IncorrectCodeWordResponse(String msg, HttpStatus status, LocalDateTime date) {
        super(msg, status, date);
    }
}
