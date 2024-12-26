package com.example.chessapplication.classes;

import java.util.ArrayList;
import java.util.List;

public class ChessRoom {
    private int id;
    private final List<User> users = new ArrayList(2);

    public ChessRoom(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
    public int getUserRoomSize() {
        return users.size();
    }
    public List<User> getUsers() {
        return users;
    }
    public User getUserByInd(int ind) {
        return users.get(ind);
    }
    public User getUserByUsername(String username) {
        return users.stream()
                    .filter(user -> user.getName().equals(username))
                    .findFirst().get();
    }
    public void addUser(User user) {
        users.add(user);
    }
    public void removeUser(User user) {
        users.remove(user);
    }
}