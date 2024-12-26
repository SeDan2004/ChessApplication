package com.example.chessapplication.controllers;

import com.example.chessapplication.modules.exceptions.IncorrectCodeWordException;
import com.example.chessapplication.modules.exceptions.UserExistException;
import com.example.chessapplication.modules.exceptions.UserNotExistException;
import com.example.chessapplication.modules.requests.UserAuthRequest;
import com.example.chessapplication.modules.requests.UserForgotPassRequest;
import com.example.chessapplication.modules.requests.UserRegRequest;
import com.example.chessapplication.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/reg")
    public ResponseEntity<Long> reg(@RequestBody UserRegRequest request)
            throws UserExistException {

        return new ResponseEntity(userService.reg(request), HttpStatus.OK);
    }

    @PostMapping("/auth")
    public ResponseEntity<Long> auth(@RequestBody UserAuthRequest request)
            throws UserNotExistException {

        return new ResponseEntity(userService.auth(request), HttpStatus.OK);
    }

    @PutMapping("/forgot_pass")
    public void forgotPass(@RequestBody UserForgotPassRequest request)
            throws UserNotExistException, IncorrectCodeWordException {

        userService.forgotPass(request);
    }
}
