package com.example.chessapplication.controllers;

import com.example.chessapplication.classes.ChessFigureMoveInfo;
import com.example.chessapplication.modules.requests.FigureColorAndOpponentRequest;
import com.example.chessapplication.modules.requests.UserIndInRoomRequest;
import com.example.chessapplication.modules.responses.FigureColorAndOpponentResponse;
import com.example.chessapplication.services.ChessService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chess")
public class ChessController {
    @Autowired
    private ChessService chessService;
    @Autowired
    HttpServletRequest request;
    HttpSession session;

    @GetMapping("/username")
    public ResponseEntity<String> username() {
        String username;

        session = request.getSession();
        username = (String) session.getAttribute("username");
        return new ResponseEntity(username, HttpStatus.OK);
    }

    @GetMapping("/roomId/{username}")
    public ResponseEntity<Integer> roomIdByUsername(@PathVariable String username) {
        return new ResponseEntity(chessService.getIdRoomByUsername(username), HttpStatus.OK);
    }

    @PostMapping("/figure_color_and_opponent")
    public ResponseEntity<FigureColorAndOpponentResponse> figureColorAndOpponent(
            @RequestBody FigureColorAndOpponentRequest request
            ) {

        return new ResponseEntity(chessService.getFigureColorAndOpponent(request), HttpStatus.OK);
    }

    @PostMapping("/user_ind_in_room")
    public ResponseEntity<Integer> userIndInRoom(@RequestBody UserIndInRoomRequest request) {
        return new ResponseEntity(chessService.getUserIndInRoom(request), HttpStatus.OK);
    }

    @MessageMapping("/move_chess_figure")
    public void moveChessFigure(@RequestBody ChessFigureMoveInfo chessFigureMoveInfo) throws Exception{
        chessService.chessFigureMove(chessFigureMoveInfo);
    }
}
