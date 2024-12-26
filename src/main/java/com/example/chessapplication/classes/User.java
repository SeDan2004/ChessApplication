package com.example.chessapplication.classes;

import lombok.Data;

import java.security.Principal;

public class User implements Principal {
    private String name;
    private String endpoint;
    private int pageOffset = 1;
    private FigureColor color;

    public User(String name, String endpoint) {
        this.name = name;
        this.endpoint = endpoint;
    }

    @Override
    public String getName() {
        return name;
    }
    public String getEndpoint() {
        return endpoint;
    }
    public void setPageOffset(int pageOffset) {
        this.pageOffset = pageOffset;
    }

    public int getPageOffset() {
        return pageOffset;
    }
    public void setFigureColor(FigureColor color) {
        this.color = color;
    }
    public void setFigureColor(User otherUser) {
        FigureColor color = otherUser.getFigureColor();

        if (color.equals(FigureColor.BLACK)) {
            this.color = FigureColor.WHITE;
        }

        if (color.equals(FigureColor.WHITE)) {
            this.color = FigureColor.BLACK;
        }
    }
    public FigureColor getFigureColor() {
        return color;
    }
}