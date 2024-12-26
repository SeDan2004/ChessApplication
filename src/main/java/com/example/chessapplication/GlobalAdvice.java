package com.example.chessapplication;

import com.example.chessapplication.modules.exceptions.IncorrectCodeWordException;
import com.example.chessapplication.modules.exceptions.UserExistException;
import com.example.chessapplication.modules.exceptions.UserNotExistException;
import com.example.chessapplication.modules.requests.IncorrectCodeWordResponse;
import com.example.chessapplication.modules.responses.UserExistsResponse;
import com.example.chessapplication.modules.responses.UserNotExistResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalAdvice {
    private String msg;
    private HttpStatus status;
    private LocalDateTime date;

    @ExceptionHandler(UserExistException.class)
    public ResponseEntity<UserExistsResponse> userExistException(Exception ex) {
        msg = ex.getMessage();
        status = HttpStatus.BAD_REQUEST;
        date = LocalDateTime.now();
        UserExistsResponse response = new UserExistsResponse(msg, status, date);

        return new ResponseEntity(response, status);
    }

    @ExceptionHandler(UserNotExistException.class)
    public ResponseEntity<UserNotExistResponse> userNotExistException(Exception ex) {
        msg = ex.getMessage();
        status = HttpStatus.NOT_FOUND;
        date = LocalDateTime.now();
        UserNotExistResponse response = new UserNotExistResponse(msg, status, date);

        return new ResponseEntity(response, status);
    }

    @ExceptionHandler(IncorrectCodeWordException.class)
    public ResponseEntity<IncorrectCodeWordResponse> incorrectCodeWordException(Exception ex) {
        msg = ex.getMessage();
        status = HttpStatus.BAD_REQUEST;
        date = LocalDateTime.now();
        IncorrectCodeWordResponse response = new IncorrectCodeWordResponse(msg, status, date);

        return new ResponseEntity(response, status);
    }
}
