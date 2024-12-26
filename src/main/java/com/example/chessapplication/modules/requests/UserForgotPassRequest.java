package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class UserForgotPassRequest {
    private String login;
    private String password;
    private String newPassword;
    private String codeWord;
}
