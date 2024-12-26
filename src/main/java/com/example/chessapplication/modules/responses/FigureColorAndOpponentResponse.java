package com.example.chessapplication.modules.responses;

import lombok.Data;

@Data
public class FigureColorAndOpponentResponse {
    private String opponent;
    private String figureColor;

    public FigureColorAndOpponentResponse(String opponent, String figureColor) {
        this.opponent = opponent;
        this.figureColor = figureColor;
    }
}
