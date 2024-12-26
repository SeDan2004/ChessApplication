package com.example.chessapplication.classes;

import lombok.Data;

@Data
public class ChessFigureMoveInfo {
    private String username;
    private String currentPosition;
    private String newPosition;
}