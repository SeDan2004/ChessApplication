package com.example.chessapplication.controllers;

import com.example.chessapplication.classes.InviteInfo;
import com.example.chessapplication.modules.requests.PageOffsetRequest;
import com.example.chessapplication.modules.responses.LobbyUsersResponse;
import com.example.chessapplication.services.LobbyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    @Autowired
    HttpServletRequest request;
    @Autowired
    LobbyService lobbyService;

    HttpSession session;

    @GetMapping("/username")
    public ResponseEntity<String> username() {
        session = request.getSession();
        String username = (String) session.getAttribute("username");
        return new ResponseEntity(username, HttpStatus.OK);
    }

    @GetMapping("/list/{user}")
    public ResponseEntity<LobbyUsersResponse> usersByUsername(@PathVariable("user") String username) {
        return new ResponseEntity(lobbyService.getUsersByUsername(username), HttpStatus.OK);
    }

    @PostMapping("/page_offset")
    public void pageOffset(@RequestBody PageOffsetRequest request) {
        lobbyService.setPageOffset(request);
    }

    @MessageMapping("/invite")
    public void invite(String msg) throws Exception {
        lobbyService.invite(msg);
    }
}
