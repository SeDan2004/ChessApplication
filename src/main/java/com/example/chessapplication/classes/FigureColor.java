package com.example.chessapplication.classes;

public enum FigureColor {
    WHITE("white"),
    BLACK("black");

    private String color;
    public String getColor() {
        return color;
    }
    FigureColor(String color) {
        this.color = color;
    }
}