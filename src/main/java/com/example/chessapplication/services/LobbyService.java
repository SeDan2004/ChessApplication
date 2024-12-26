package com.example.chessapplication.services;

import com.example.chessapplication.classes.ChessRoomManager;
import com.example.chessapplication.classes.InviteInfo;
import com.example.chessapplication.classes.User;
import com.example.chessapplication.classes.UserManager;
import com.example.chessapplication.modules.requests.PageOffsetRequest;
import com.example.chessapplication.modules.responses.LobbyUsersResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LobbyService {
    public int pageSize = 5;
    private List<User> users;

    @Autowired
    UserManager userManager;
    @Autowired
    ObjectMapper om;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ChessRoomManager chessRoomManager;

    public void sendUserList() {
        int pageOffset;
        int totalCount;
        String url;
        LobbyUsersResponse response;
        List<User> userWithoutCurrent;
        List<String> userLst;

        users = userManager.getUsers();
        url = "/msg/user_list_and_count";

        for (int i = 0; i < users.size(); i++) {
            User currentUser = users.get(i);

            pageOffset = currentUser.getPageOffset();
            userWithoutCurrent = users.stream()
                                      .filter(user -> !user.equals(currentUser))
                                      .collect(Collectors.toList());

            totalCount = userWithoutCurrent.size();
            userLst = getUserList(pageOffset, userWithoutCurrent);

            response = new LobbyUsersResponse(userLst, totalCount);
            simpMessagingTemplate.convertAndSendToUser(currentUser.getName(), url, response);
        }
    }
    public LobbyUsersResponse getUsersByUsername(String username) {
        int totalCount;
        User currentUser;
        List<String> userLst;
        LobbyUsersResponse response;
        List<User> userWithoutCurrent;

        users = userManager.getUsers();

        currentUser = users.stream()
                           .filter(user -> user.getName().equals(username))
                           .findFirst()
                           .orElseThrow();

        userWithoutCurrent = users.stream()
                                  .filter(user -> !user.equals(currentUser))
                                  .collect(Collectors.toList());

        totalCount = userWithoutCurrent.size();
        userLst = getUserList(currentUser.getPageOffset(), userWithoutCurrent);
        response = new LobbyUsersResponse(userLst, totalCount);

        return response;
    }
    public List<String> getUserList(int pageOffset, List<User> userWithoutCurrent) {
        int offset = (pageOffset - 1) * pageSize;
        int subEnd = pageOffset * pageSize;

        if (subEnd > userWithoutCurrent.size()) {
            subEnd = userWithoutCurrent.size();
        }

        return userWithoutCurrent.stream()
                                 .map(user -> user.getName())
                                 .collect(Collectors.toList())
                                 .subList(offset, subEnd);
    }

    public void setPageOffset(PageOffsetRequest request) {
        User currentUser;
        String username = request.getUsername();
        int pageOffset = request.getPageOffset();

        users = userManager.getUsers();

        currentUser = users.stream()
                           .filter(user -> user.getName().equals(username))
                           .findFirst()
                           .orElseThrow();

        currentUser.setPageOffset(pageOffset);
    }

    public void invite(String msg) throws Exception {
        String userAction;
        InviteInfo inviteInfo = om.readValue(msg, InviteInfo.class);

        userAction = inviteInfo.getSender() + "-" + inviteInfo.getAction();

        simpMessagingTemplate.convertAndSendToUser(inviteInfo.getRecipient(), "/msg/invite", userAction);
    }

    public void checkUsersPageOffset() {
        int pagsCount;

        users = userManager.getUsers();
        pagsCount = (int)Math.ceil(users.size() / pageSize);



        for (User user : users) {
            if (user.getPageOffset() > pagsCount) {
                user.setPageOffset(user.getPageOffset() - 1);
            }
        }
    }
}
