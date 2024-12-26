package com.example.chessapplication.modules.requests;

import lombok.Data;

@Data
public class PageOffsetRequest {
    private String username;
    private int pageOffset;
}