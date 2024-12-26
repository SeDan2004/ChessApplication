package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class UserIndInRoomRequest {
    private String username;
    private int roomId;
}