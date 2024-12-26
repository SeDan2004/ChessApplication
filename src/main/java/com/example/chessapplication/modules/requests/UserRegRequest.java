package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class UserRegRequest {
    private String login;
    private String password;
    private String codeWord;
}