package com.example.chessapplication.modules.responses;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class ExceptionResponse {
    private String msg;
    private HttpStatus status;
    private LocalDateTime date;

    public ExceptionResponse(String msg, HttpStatus status, LocalDateTime date) {
        this.msg = msg;
        this.status = status;
        this.date = date;
    }
}
