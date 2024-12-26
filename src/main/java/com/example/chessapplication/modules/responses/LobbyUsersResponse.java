package com.example.chessapplication.modules.responses;

import com.example.chessapplication.classes.User;
import lombok.Data;

import java.util.List;

@Data
public class LobbyUsersResponse {
    private List<String> users;
    private int totalCount;

    public LobbyUsersResponse(List<String> users, int totalCount) {
        this.users = users;
        this.totalCount = totalCount;
    }
}
