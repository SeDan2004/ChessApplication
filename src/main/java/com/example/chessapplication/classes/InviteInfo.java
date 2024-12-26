package com.example.chessapplication.classes;

import lombok.Data;

@Data
public class InviteInfo {
    private String sender;
    private String recipient;
    private String action;
}