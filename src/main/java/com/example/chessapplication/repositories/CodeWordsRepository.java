package com.example.chessapplication.repositories;

import ChessApplication.tables.pojos.JCodeWords;
import com.example.chessapplication.modules.requests.UserRegRequest;
import com.github.mustachejava.Code;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import static ChessApplication.Tables.CODE_WORDS;

@Repository
public class CodeWordsRepository {
    @Autowired
    DSLContext dsl;

    public void add(Long idUser, String codeWord) {
        dsl.insertInto(CODE_WORDS)
                .columns(CODE_WORDS.ID_USER, CODE_WORDS.CODE_WORD)
                .values(idUser.intValue(), codeWord)
                .execute();
    }

    public boolean checkCodeWord(Long idUser, String codeWord) {
        return dsl.fetchExists(CODE_WORDS,
                CODE_WORDS.ID_USER.eq(idUser.intValue()).and(
                    CODE_WORDS.CODE_WORD.eq(codeWord)
                ));
    }
}
