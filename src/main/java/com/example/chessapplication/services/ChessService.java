package com.example.chessapplication.services;

import com.example.chessapplication.classes.ChessFigureMoveInfo;
import com.example.chessapplication.classes.ChessRoom;
import com.example.chessapplication.classes.ChessRoomManager;
import com.example.chessapplication.classes.User;
import com.example.chessapplication.modules.requests.FigureColorAndOpponentRequest;
import com.example.chessapplication.modules.requests.UserIndInRoomRequest;
import com.example.chessapplication.modules.responses.FigureColorAndOpponentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChessService {
    @Autowired
    private ChessRoomManager chessRoomManager;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ObjectMapper om;

    public Integer getIdRoomByUsername(String username) {
        return chessRoomManager.getRooms()
                .stream()
                .filter(room -> {
                    return room.getUsers()
                               .stream()
                               .anyMatch(user -> user.getName().equals(username));

                }).findFirst()
                  .get()
                  .getId();
    }

    public FigureColorAndOpponentResponse getFigureColorAndOpponent(FigureColorAndOpponentRequest request) {
        ChessRoom room = chessRoomManager.getRoomById(request.getRoomId());
        String figureColor;
        String opponent;

        figureColor = room.getUserByUsername(request.getUsername())
                          .getFigureColor()
                          .getColor();

        opponent = room.getUsers()
                       .stream()
                       .filter(user -> !user.getName().equals(request.getUsername()))
                       .findFirst()
                       .get()
                       .getName();

        return new FigureColorAndOpponentResponse(opponent, figureColor);
    }

    public Integer getUserIndInRoom(UserIndInRoomRequest request) {
        ChessRoom room = chessRoomManager.getRoomById(request.getRoomId());
        User user = room.getUserByUsername(request.getUsername());
        return room.getUsers().indexOf(user);
    }

    public void chessFigureMove(ChessFigureMoveInfo chessFigureMoveInfo) throws Exception{
        String username = chessFigureMoveInfo.getUsername();
        int idRoom = getIdRoomByUsername(username);
        ChessRoom room = chessRoomManager.getRoomById(idRoom);
        User otherUser;
        String destination = "/msg/move_chess_figure";

        otherUser = room.getUsers()
                        .stream()
                        .filter((user) -> !user.getName().equals(username))
                        .findFirst()
                        .get();

        System.out.println(otherUser.getName());

        simpMessagingTemplate.convertAndSendToUser(otherUser.getName(), destination, om.writeValueAsString(chessFigureMoveInfo));
    }
}
