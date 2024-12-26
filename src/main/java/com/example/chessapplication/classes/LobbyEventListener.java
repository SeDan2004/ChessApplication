package com.example.chessapplication.classes;

import com.example.chessapplication.services.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class LobbyEventListener {
    @Autowired
    UserManager userManager;
    @Autowired
    LobbyService lobbyService;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @EventListener
    public void connect(SessionConnectedEvent event) {
        User user = (User) event.getUser();

        if ("/lobby_users".equals(user.getEndpoint())) {
            userManager.add(event.getUser());
            lobbyService.sendUserList();
        }
    }

    @EventListener
    public void disconnect(SessionDisconnectEvent event) {
        User user = (User) event.getUser();

        if ("/lobby_users".equals(user.getEndpoint())) {
            userManager.remove(event.getUser());

            if (userManager.getUsersSize() > lobbyService.pageSize) {
                lobbyService.checkUsersPageOffset();
            }

            lobbyService.sendUserList();
        }
    }
}
