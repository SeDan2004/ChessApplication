package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class FigureColorAndOpponentRequest {
    private int roomId;
    private String username;
}
