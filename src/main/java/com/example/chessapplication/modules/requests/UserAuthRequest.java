package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class UserAuthRequest {
    private String login;
    private String password;
}
