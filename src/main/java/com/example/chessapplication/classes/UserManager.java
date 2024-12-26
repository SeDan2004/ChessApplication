package com.example.chessapplication.classes;

import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserManager {
    private final List<User> users = new ArrayList<User>();

    public void add(Principal user) {
        users.add((User)user);
    }

    public void remove(Principal user) {
        users.remove((User)user);
    }

    public List<User> getUsers() {
        return users;
    }
    public int getUsersSize() {
        return users.size();
    }
}
