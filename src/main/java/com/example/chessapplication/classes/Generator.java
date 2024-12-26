package com.example.chessapplication.classes;

import java.util.Random;

public class Generator {
    public static FigureColor generateFigureColor() {
        Random rand = new Random();
        int value = rand.nextInt(1, 3);

        if (value == 1) {
            return FigureColor.BLACK;
        } else {
            return FigureColor.WHITE;
        }
    }
}
