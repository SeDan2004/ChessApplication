package com.example.chessapplication.classes;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import static com.example.chessapplication.classes.Generator.generateFigureColor;

@Component
public class ChessRoomManager {
    private List<ChessRoom> rooms = new ArrayList();
    public int getRoomsSize() {
        return rooms.size();
    }
    public void checkRoomsBeforeAddUser(User user) {
        ChessRoom room;

        if (rooms.size() == 0) {
            user.setFigureColor(generateFigureColor());
            room = createRoom(rooms.size() + 1);
            room.addUser(user);
        } else {
            room = getRoomByInd(rooms.size() - 1);

            if (room.getUserRoomSize() != 2) {
                user.setFigureColor(room.getUserByInd(0));
                room.addUser(user);
            } else {
                user.setFigureColor(generateFigureColor());
                room = createRoom(rooms.size() + 1);
                room.addUser(user);
            }
        }
    }

    public ChessRoom createRoom(int id) {
        ChessRoom room = new ChessRoom(id);
        rooms.add(room);
        return room;
    }
    public ChessRoom getRoomByInd(int ind) {
        return rooms.get(ind);
    }
    public ChessRoom getRoomById(int id) {
        return rooms.stream()
                    .filter(room -> room.getId() == id)
                    .findFirst()
                    .get();
    }
    public ChessRoom getRoomByUser(User user) {
        return rooms.stream()
                    .filter(room -> room.getUsers().contains(user))
                    .findFirst()
                    .get();
    }
    public List<ChessRoom> getRooms() {
        return rooms;
    }
    public void removeRoom(ChessRoom room) {
        rooms.remove(room);
    }
}
