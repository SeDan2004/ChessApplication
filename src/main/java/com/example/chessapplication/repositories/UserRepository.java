package com.example.chessapplication.repositories;

import com.example.chessapplication.modules.requests.UserForgotPassRequest;
import com.example.chessapplication.modules.requests.UserRegRequest;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import static ChessApplication.Tables.CODE_WORDS;
import static ChessApplication.Tables.USERS;

@Repository
public class UserRepository {
    @Autowired
    DSLContext dsl;

    public Long getIdByLoginAndPassword(String login, String password) {
        return dsl.select(USERS.ID)
                .from(USERS)
                .where(USERS.LOGIN.eq(login).and(USERS.PASSWORD.eq(password)))
                .fetchOneInto(Long.class);
    }

    public boolean checkUserInDb(String login, String password) {
        return dsl.fetchExists(USERS,
                USERS.LOGIN.eq(login)
                        .and(USERS.PASSWORD.eq(password)));
    }

    public Long add(String login, String password) {
        return dsl.insertInto(USERS)
                .columns(USERS.LOGIN, USERS.PASSWORD)
                .values(login, password)
                .returningResult(USERS.ID)
                .fetchOneInto(Long.class);
    }

    public void update(Long idUser, String newPassword) {
        dsl.update(USERS).set(USERS.PASSWORD, newPassword).execute();
    }
}
