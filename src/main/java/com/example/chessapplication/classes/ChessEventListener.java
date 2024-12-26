package com.example.chessapplication.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class ChessEventListener {
    @Autowired
    ChessRoomManager chessRoomManager;

    @EventListener
    public void connect(SessionConnectEvent event) {
        User user = (User) event.getUser();
        
        if ("/chess_room".equals(user.getEndpoint())) {
            chessRoomManager.checkRoomsBeforeAddUser(user);
        }
    }

    @EventListener
    public void disconnect(SessionDisconnectEvent event) {
        User user = (User) event.getUser();

        if ("/chess_room".equals(user.getEndpoint())) {
            ChessRoom room = chessRoomManager.getRoomByUser(user);
            room.removeUser(user);

            if (room.getUserRoomSize() == 0) {
                chessRoomManager.removeRoom(room);
            }
        }
    }
}