package com.example.chessapplication.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import java.util.ArrayList;
import java.util.Map;

public class UserInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            if (accessor.getHeader(SimpMessageHeaderAccessor.NATIVE_HEADERS) instanceof Map nativeHeaders) {
                String username = "";
                String endpoint = "";

                if (nativeHeaders.get("username") instanceof ArrayList lst) {
                    username = ((ArrayList<String>) lst).get(0);
                }

                if (nativeHeaders.get("endpoint") instanceof ArrayList lst) {
                    endpoint = ((ArrayList<String>) lst).get(0);
                }

                accessor.setUser(new User(username, endpoint));
            }
        }

        return message;
    }
}